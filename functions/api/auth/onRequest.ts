// NextAuth를 Cloudflare Pages Functions에서 사용하기 위한 래퍼
// 이 파일은 /api/auth/* 경로 중 더 구체적인 경로가 없는 경우에만 실행됩니다.
// Cloudflare Pages Functions는 더 구체적인 경로가 자동으로 우선순위가 높으므로,
// 이 함수가 실행되었다는 것은 더 구체적인 경로가 없다는 의미입니다.

export const onRequest: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수를 process.env에 설정 (NextAuth가 사용)
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // D1 데이터베이스 설정 (handlers import 전에 설정)
        const { setDb } = await import('../../../lib/db');
        if(context.env.DB) {
            setDb(context.env.DB);
        }
        
        // 동적 import로 NextAuth handlers 로드
        const authModule = await import('../../../auth');
        
        // handlers가 제대로 export되었는지 확인
        if(!authModule.handlers) {
            console.error('handlers가 제대로 export되지 않았습니다:', {
                hasHandlers: !!authModule.handlers,
                moduleKeys: Object.keys(authModule),
            });
            throw new Error('handlers가 없습니다');
        }
        
        const { handlers } = authModule;
        
        // 원본 요청 URL 유지 (NextAuth가 경로를 파싱할 수 있도록)
        const request = context.request;
        const url = new URL(request.url);
        const pathname = url.pathname;
        
        // /api/auth로 시작하는 경로인지 확인
        if(!pathname.startsWith('/api/auth')) {
            return new Response('Not found', { status: 404 });
        }
        
        // 더 구체적인 경로는 해당 Functions에서 처리해야 하므로
        // 이 함수가 실행되었다는 것은 더 구체적인 경로가 없다는 의미
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
