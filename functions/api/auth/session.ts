// NextAuth 세션 엔드포인트 (GET 요청)
// /api/auth/session 경로를 처리합니다.

export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수를 process.env에 설정
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
        if(!authModule.handlers || !authModule.handlers.GET) {
            console.error('handlers가 제대로 export되지 않았습니다:', {
                hasHandlers: !!authModule.handlers,
                handlersKeys: authModule.handlers ? Object.keys(authModule.handlers) : [],
                moduleKeys: Object.keys(authModule),
            });
            throw new Error('handlers.GET이 없습니다');
        }
        
        const { handlers } = authModule;
        
        // NextAuth handlers 호출 (GET 요청)
        const request = context.request;
        const response = await handlers.GET(request as any);
        
        return response;
    } catch(error) {
        console.error('세션 처리 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '세션 처리 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
