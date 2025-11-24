// NextAuth Google 콜백 엔드포인트
// /api/auth/callback/google 경로를 처리합니다.

export const onRequest: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수를 process.env에 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // D1 데이터베이스 설정 (handlers import 전에 설정)
        if(context.env.DB) {
            try {
                const dbModule = await import('../../../../../lib/db/index.js');
                dbModule.setDb(context.env.DB);
            } catch(error) {
                // .js 확장자 실패 시 .ts 시도
                try {
                    const dbModule = await import('../../../../../lib/db/index.ts');
                    dbModule.setDb(context.env.DB);
                } catch(error2) {
                    // 확장자 없이 시도
                    const dbModule = await import('../../../../../lib/db');
                    dbModule.setDb(context.env.DB);
                }
            }
        }
        
        // 동적 import로 NextAuth handlers 로드
        const authModule = await import('../../../../../auth');
        
        // handlers가 제대로 export되었는지 확인
        if(!authModule.handlers) {
            console.error('handlers가 제대로 export되지 않았습니다:', {
                hasHandlers: !!authModule.handlers,
                moduleKeys: Object.keys(authModule),
            });
            throw new Error('handlers가 없습니다');
        }
        
        const { handlers } = authModule;
        
        // NextAuth handlers 호출
        const request = context.request;
        const method = request.method;
        
        // URL에서 popup 파라미터 확인 (콜백 URL에 포함되어 있을 수 있음)
        const url = new URL(request.url);
        const isPopup = url.searchParams.get('popup') === 'true';
        
        // Referer 헤더에서도 popup 파라미터 확인 (signin 페이지에서 전달된 경우)
        const referer = request.headers.get('referer');
        let isPopupFromReferer = false;
        if(referer) {
            try {
                const refererUrl = new URL(referer);
                isPopupFromReferer = refererUrl.searchParams.get('popup') === 'true';
            } catch(e) {
                // referer 파싱 실패 시 무시
            }
        }
        
        const shouldUsePopup = isPopup || isPopupFromReferer;
        
        if(method === 'GET') {
            if(!handlers.GET) {
                throw new Error('handlers.GET이 없습니다');
            }
            const response = await handlers.GET(request as any);
            
            // 팝업 모드이고 성공한 경우 성공 페이지로 리다이렉트
            if(shouldUsePopup && (response.status === 302 || response.status === 307 || response.status === 308)) {
                // 리다이렉트 응답인 경우 성공 페이지로 변경
                return Response.redirect(new URL('/auth/callback-success', request.url).toString());
            }
            
            return response;
        } else if(method === 'POST') {
            if(!handlers.POST) {
                throw new Error('handlers.POST가 없습니다');
            }
            const response = await handlers.POST(request as any);
            
            // 팝업 모드이고 성공한 경우 성공 페이지로 리다이렉트
            if(shouldUsePopup && (response.status === 302 || response.status === 307 || response.status === 308)) {
                return Response.redirect(new URL('/auth/callback-success', request.url).toString());
            }
            
            return response;
        } else {
            return new Response('Method not allowed', { status: 405 });
        }
    } catch(error) {
        console.error('Google 콜백 처리 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '콜백 처리 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
