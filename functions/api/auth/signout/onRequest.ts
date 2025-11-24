// NextAuth 로그아웃 엔드포인트
// /api/auth/signout 경로를 처리합니다.

export const onRequest: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수를 process.env에 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // D1 데이터베이스 설정 (handlers import 전에 설정)
        // Cloudflare Pages Functions에서는 상대 경로가 Functions 파일 위치를 기준으로 해석됨
        if(context.env.DB) {
            let dbModule;
            try {
                // 먼저 확장자 없이 시도 (가장 일반적)
                dbModule = await import('../../../../lib/db');
            } catch(error1) {
                try {
                    // .js 확장자 시도
                    dbModule = await import('../../../../lib/db/index.js');
                } catch(error2) {
                    console.error('DB 모듈 import 실패:', error1, error2);
                    throw new Error('DB 모듈을 로드할 수 없습니다.');
                }
            }
            if(dbModule && dbModule.setDb) {
                dbModule.setDb(context.env.DB);
            } else {
                throw new Error('setDb 함수를 찾을 수 없습니다.');
            }
        }
        
        // 동적 import로 NextAuth handlers 로드
        const authModule = await import('../../../../auth');
        
        // handlers가 제대로 export되었는지 확인
        if(!authModule.handlers || !authModule.handlers.POST) {
            console.error('handlers가 제대로 export되지 않았습니다:', {
                hasHandlers: !!authModule.handlers,
                hasPOST: authModule.handlers ? !!authModule.handlers.POST : false,
                moduleKeys: Object.keys(authModule),
            });
            throw new Error('handlers.POST가 없습니다');
        }
        
        const { handlers } = authModule;
        
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
