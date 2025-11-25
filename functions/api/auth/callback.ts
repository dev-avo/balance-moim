// Google OAuth 콜백 API
// GET /api/auth/callback?code=xxx

import { signJWT } from '../../../lib/auth/jwt';
import { createSessionCookie } from '../../../lib/auth/session';
import type { Env } from '../../../lib/types';

// Google OAuth 엔드포인트
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

// UUID 생성 함수
function generateId(): string {
  return crypto.randomUUID();
}

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 인증 코드 확인
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  
  // 에러 처리
  if (error) {
    console.error('OAuth 에러:', error);
    return redirectToFrontend(url.origin, false, 'OAuth 인증이 취소되었습니다.');
  }
  
  if (!code) {
    return redirectToFrontend(url.origin, false, '인증 코드가 없습니다.');
  }
  
  try {
    // 1. 인증 코드로 액세스 토큰 교환
    const redirectUri = `${url.origin}/api/auth/callback`;
    const tokenResponse = await exchangeCodeForToken(
      code,
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );
    
    // 2. 액세스 토큰으로 사용자 정보 조회
    const userInfo = await fetchUserInfo(tokenResponse.access_token);
    
    // 3. DB에 사용자 저장 (신규 생성 또는 기존 조회)
    const user = await upsertUser(env.DB, userInfo);
    
    // 4. JWT 토큰 생성
    const jwtToken = await signJWT(
      { userId: user.id, email: user.email },
      env.JWT_SECRET
    );
    
    // 5. 쿠키 설정 및 프론트엔드 리다이렉트
    const isProduction = !url.hostname.includes('localhost');
    const headers = new Headers();
    headers.set('Set-Cookie', createSessionCookie(jwtToken, isProduction));
    headers.set('Location', `${url.origin}/home.html`);
    
    return new Response(null, {
      status: 302,
      headers,
    });
    
  } catch (err) {
    console.error('OAuth 콜백 처리 실패:', err);
    return redirectToFrontend(
      url.origin,
      false,
      err instanceof Error ? err.message : '로그인 처리 중 오류가 발생했습니다.'
    );
  }
};

/**
 * 인증 코드를 액세스 토큰으로 교환
 */
async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<GoogleTokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('토큰 교환 실패:', error);
    throw new Error('Google 토큰 교환에 실패했습니다.');
  }
  
  return response.json();
}

/**
 * 액세스 토큰으로 Google 사용자 정보 조회
 */
async function fetchUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Google 사용자 정보 조회에 실패했습니다.');
  }
  
  return response.json();
}

/**
 * 사용자 생성 또는 업데이트
 */
async function upsertUser(
  db: D1Database,
  userInfo: GoogleUserInfo
): Promise<{ id: string; email: string }> {
  // 기존 사용자 확인
  const existingUser = await db
    .prepare('SELECT id, email, status FROM user WHERE google_id = ?')
    .bind(userInfo.id)
    .first<{ id: string; email: string; status: number }>();
  
  if (existingUser) {
    // 탈퇴한 사용자인 경우 재가입 처리
    if (existingUser.status === -1) {
      await db
        .prepare('UPDATE user SET status = 1, updated_at = unixepoch() WHERE id = ?')
        .bind(existingUser.id)
        .run();
    }
    return { id: existingUser.id, email: existingUser.email };
  }
  
  // 신규 사용자 생성
  const newUserId = generateId();
  await db
    .prepare(`
      INSERT INTO user (id, google_id, email, display_name, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, unixepoch(), unixepoch())
    `)
    .bind(newUserId, userInfo.id, userInfo.email, userInfo.name)
    .run();
  
  return { id: newUserId, email: userInfo.email };
}

/**
 * 프론트엔드로 리다이렉트 (에러 포함)
 */
function redirectToFrontend(
  origin: string,
  success: boolean,
  message?: string
): Response {
  const params = new URLSearchParams();
  params.set('success', String(success));
  if (message) params.set('message', message);
  
  return Response.redirect(
    `${origin}/index.html?${params.toString()}`,
    302
  );
}
