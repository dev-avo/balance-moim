// 세션 확인 API
// GET /api/auth/session

import { getSession } from '../../../lib/auth/session';
import type { Env, User, ApiResponse } from '../../../lib/types';

interface SessionResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    googleName: string;
    customNickname: string | null;
    useNickname: boolean;
  } | null;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    // JWT 토큰 검증
    const session = await getSession(request, env.JWT_SECRET);
    
    if (!session) {
      return jsonResponse<SessionResponse>({
        success: true,
        data: { user: null },
      });
    }
    
    // DB에서 사용자 정보 조회
    const user = await env.DB
      .prepare(`
        SELECT id, email, display_name, custom_nickname, use_nickname, status
        FROM user
        WHERE id = ? AND status = 1
      `)
      .bind(session.userId)
      .first<User>();
    
    if (!user) {
      return jsonResponse<SessionResponse>({
        success: true,
        data: { user: null },
      });
    }
    
    // Google 계정명 (원본)
    const googleName = user.display_name || user.email.split('@')[0];
    
    // 표시 이름 결정 (익명 별명 사용 시 별명, 아니면 구글 계정명)
    const displayName = user.use_nickname && user.custom_nickname
      ? user.custom_nickname
      : googleName;
    
    return jsonResponse<SessionResponse>({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName,
          googleName,
          customNickname: user.custom_nickname || null,
          useNickname: user.use_nickname === 1,
        },
      },
    });
    
  } catch (error) {
    console.error('세션 확인 실패:', error);
    return jsonResponse<SessionResponse>(
      {
        success: false,
        error: '세션 확인 중 오류가 발생했습니다.',
      },
      500
    );
  }
};

// JSON 응답 헬퍼
function jsonResponse<T>(
  body: ApiResponse<T>,
  status: number = 200
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
