/**
 * 세션 관리 유틸리티
 * Cloudflare Pages Functions 환경에 최적화
 */

/**
 * Request에서 세션 정보 가져오기
 */
export async function getCurrentUser(request: Request, secret: string): Promise<{ id: string; email: string; name: string } | null> {
    try {
        if(!request) {
            return null;
        }
        
        const cookies = request.headers.get('Cookie') || '';
        const sessionCookie = cookies.split(';').find(c => c.trim().startsWith('bm_session='));
        
        if(!sessionCookie) {
            return null;
        }
        
        const token = sessionCookie.substring(sessionCookie.indexOf('=') + 1);
        if(!token) {
            return null;
        }
        
        // JWT 토큰 검증
        const { verifyJWT } = await import('./jwt');
        const payload = await verifyJWT(token, secret);
        
        if(!payload) {
            return null;
        }
        
        return {
            id: payload.id,
            email: payload.email,
            name: payload.name,
        };
    } catch(error) {
        console.error('getCurrentUser 오류:', error);
        return null;
    }
}

/**
 * 로그인 여부 확인
 */
export async function isAuthenticated(request: Request, secret: string): Promise<boolean> {
    const user = await getCurrentUser(request, secret);
    return user !== null;
}
