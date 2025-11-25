// 세션 관리 유틸리티
import { verifyJWT, type JWTPayload } from './jwt';

// 쿠키 이름
const SESSION_COOKIE_NAME = 'balance_session';

// 쿠키 옵션
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'Lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7일
};

/**
 * Request에서 세션 쿠키 추출 및 JWT 검증
 * @param request - HTTP Request 객체
 * @param jwtSecret - JWT 시크릿 키
 * @returns JWT 페이로드 또는 null
 */
export async function getSession(
  request: Request,
  jwtSecret: string
): Promise<JWTPayload | null> {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  // 쿠키 파싱
  const cookies = parseCookies(cookieHeader);
  const token = cookies[SESSION_COOKIE_NAME];
  
  if (!token) return null;

  // JWT 검증
  return await verifyJWT(token, jwtSecret);
}

/**
 * 세션 쿠키 설정 헤더 생성
 * @param token - JWT 토큰
 * @param isProduction - 프로덕션 환경 여부
 * @returns Set-Cookie 헤더 값
 */
export function createSessionCookie(
  token: string,
  isProduction: boolean = true
): string {
  const options = {
    ...COOKIE_OPTIONS,
    secure: isProduction, // 로컬 개발 시 false
  };

  return serializeCookie(SESSION_COOKIE_NAME, token, options);
}

/**
 * 세션 쿠키 삭제 헤더 생성
 * @returns Set-Cookie 헤더 값 (만료된 쿠키)
 */
export function clearSessionCookie(): string {
  return serializeCookie(SESSION_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
}

/**
 * Response에 세션 쿠키 설정
 * @param headers - Headers 객체
 * @param token - JWT 토큰
 * @param isProduction - 프로덕션 환경 여부
 */
export function setSessionCookieHeader(
  headers: Headers,
  token: string,
  isProduction: boolean = true
): void {
  headers.set('Set-Cookie', createSessionCookie(token, isProduction));
}

/**
 * Response에서 세션 쿠키 삭제
 * @param headers - Headers 객체
 */
export function clearSessionCookieHeader(headers: Headers): void {
  headers.set('Set-Cookie', clearSessionCookie());
}

// =====================================================
// 유틸리티 함수
// =====================================================

/**
 * 쿠키 문자열 파싱
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length > 0) {
      cookies[name] = rest.join('=');
    }
  });
  
  return cookies;
}

/**
 * 쿠키 직렬화
 */
function serializeCookie(
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
    path?: string;
    maxAge?: number;
  }
): string {
  let cookie = `${name}=${value}`;

  if (options.httpOnly) cookie += '; HttpOnly';
  if (options.secure) cookie += '; Secure';
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options.path) cookie += `; Path=${options.path}`;
  if (options.maxAge !== undefined) cookie += `; Max-Age=${options.maxAge}`;

  return cookie;
}
