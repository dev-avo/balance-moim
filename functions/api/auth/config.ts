// 인증 설정 API
// GET /api/auth/config
// 프론트엔드에서 사용할 OAuth 클라이언트 ID 제공

import type { Env } from '../../../lib/types';

interface AuthConfig {
  googleClientId: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  
  const config: AuthConfig = {
    googleClientId: env.GOOGLE_CLIENT_ID || '',
  };
  
  return new Response(JSON.stringify({
    success: true,
    data: config,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

