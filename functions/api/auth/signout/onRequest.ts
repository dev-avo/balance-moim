// NextAuth 로그아웃 엔드포인트
// /api/auth/signout 경로를 처리합니다.

export const onRequest: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수를 process.env에 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import로 NextAuth handlers 로드
        const { handlers } = await import('../../../../auth');
        const { setDb } = await import('../../../../lib/db');
        
        // D1 데이터베이스 설정
        if(context.env.DB) {
            setDb(context.env.DB);
        }
        
        // NextAuth handlers 호출 (POST 요청)
        const request = context.request;
        const response = await handlers.POST(request as any);
        return response;
    } catch(error) {
        console.error('로그아웃 처리 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '로그아웃 처리 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
