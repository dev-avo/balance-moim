import { NextRequest } from 'next/server';
import { handlers } from '@/auth';
import { setDb } from '@/lib/db';

export const runtime = 'edge';

// NextAuth handlers를 래핑하여 D1 데이터베이스 설정
function wrapHandler(handler: (req: NextRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    // Cloudflare Pages 환경: D1 데이터베이스 설정
    if((request as any).env?.DB) {
      setDb((request as any).env.DB);
    }
    return handler(request);
  };
}

export const GET = wrapHandler(handlers.GET);
export const POST = wrapHandler(handlers.POST);

