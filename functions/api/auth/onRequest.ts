// NextAuth를 Cloudflare Pages Functions에서 사용하기 위한 래퍼
// Cloudflare Pages Functions는 catch-all 라우트를 지원하지 않으므로
// onRequest.ts를 사용하여 /api/auth/* 모든 요청을 처리합니다.

export const onRequest: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수를 process.env에 설정 (NextAuth가 사용)
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import로 NextAuth handlers 로드
        const { handlers } = await import('../../../auth');
        const { setDb } = await import('../../../lib/db');
        
        // D1 데이터베이스 설정
        if(context.env.DB) {
            setDb(context.env.DB);
        }
        
        // 원본 요청 URL 유지 (NextAuth가 경로를 파싱할 수 있도록)
        const request = context.request;
        const url = new URL(request.url);
        const pathname = url.pathname;
        
        // 더 구체적인 경로는 해당 Functions에서 처리해야 하므로
        // 이 함수는 /api/auth로 시작하지만 더 구체적인 경로가 아닌 경우에만 처리
        // Cloudflare Pages Functions는 더 구체적인 경로가 자동으로 우선순위가 높으므로
        // 여기서는 catch-all 역할만 수행
        const specificPaths = [
            '/api/auth/signin/google',
            '/api/auth/signout',
            '/api/auth/callback/google',
            '/api/auth/session'
        ];
        
        // 더 구체적인 경로는 해당 Functions에서 처리해야 하므로
        // 이 함수가 실행되었다는 것은 더 구체적인 경로가 없다는 의미
        // 하지만 안전을 위해 명시적으로 확인
        const isSpecificPath = specificPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
        
        // /api/auth로 시작하는 경로인지 확인
        if(!pathname.startsWith('/api/auth')) {
            return new Response('Not found', { status: 404 });
        }
        
        // 더 구체적인 경로가 있다면 해당 Functions에서 처리해야 하므로
        // 여기서는 처리하지 않음 (하지만 실제로는 더 구체적인 경로가 없을 때만 이 함수가 실행됨)
        // 따라서 모든 /api/auth/* 경로를 처리
        
        // NextAuth handlers 호출
        // NextAuth handlers는 Request 객체를 받아서 처리합니다
        const method = request.method;
        
        if(method === 'GET') {
            const response = await handlers.GET(request as any);
            return response;
        } else if(method === 'POST') {
            const response = await handlers.POST(request as any);
            return response;
        } else {
            return new Response('Method not allowed', { status: 405 });
        }
    } catch(error) {
        console.error('NextAuth handler 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '인증 처리 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
