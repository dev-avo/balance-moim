// 로그아웃 API
// POST /api/auth/signout

import { clearSessionCookie } from '../../../lib/auth/session';
import type { Env, ApiResponse } from '../../../lib/types';

export const onRequestPost: PagesFunction<Env> = async () => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Set-Cookie', clearSessionCookie());
  
  const response: ApiResponse = {
    success: true,
    data: { message: '로그아웃되었습니다.' },
  };
  
  return new Response(JSON.stringify(response), {
    status: 200,
    headers,
  });
};
