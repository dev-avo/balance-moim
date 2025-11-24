// 세션 확인 엔드포인트
// /api/auth/session 경로를 처리합니다.

async function secretFingerprint(secret: string) {
    if(!secret) return 'empty';
    const data = new TextEncoder().encode(secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const bytes = Array.from(new Uint8Array(hashBuffer));
    return bytes.slice(0, 4).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        const cookies = context.request.headers.get('Cookie') || '';
        const sessionCookie = cookies.split(';').find(c => c.trim().startsWith('bm_session='));
        
        if(!sessionCookie) {
            return new Response(
                JSON.stringify({ user: null }),
                { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        
        let token = sessionCookie.substring(sessionCookie.indexOf('=') + 1);
        try {
            token = decodeURIComponent(token);
        } catch(error) {
            console.warn('[auth/session] Failed to decode bm_session cookie, clearing', error);
            const clearCookie = 'bm_session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0';
            return new Response(
                JSON.stringify({ user: null }),
                { 
                    status: 200,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Set-Cookie': clearCookie,
                    }
                }
            );
        }
        if(!token) {
            return new Response(
                JSON.stringify({ user: null }),
                { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        
        // JWT 토큰 검증
        const { verifyJWT } = await import('../../../lib/auth/jwt');
        const secret = context.env.NEXTAUTH_SECRET;
        if(!secret) {
            console.error('[auth/session] NEXTAUTH_SECRET is missing in environment');
        }
        
        console.log('[auth/session] verifying token', {
            tokenLength: token.length,
            hasSecret: !!secret,
            requestId: context.request.headers.get('cf-ray') || 'unknown',
            fingerprint: await secretFingerprint(secret || ''),
        });
        
        const payload = await verifyJWT(token, secret);
        
        if(!payload) {
            // 유효하지 않은 토큰 - 쿠키 삭제
            console.warn('[auth/session] verifyJWT returned null, clearing cookie', {
                requestId: context.request.headers.get('cf-ray') || 'unknown',
            });
            const clearCookie = 'bm_session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0';
            return new Response(
                JSON.stringify({ user: null }),
                { 
                    status: 200,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Set-Cookie': clearCookie,
                    }
                }
            );
        }
        
        // 세션 정보 반환
        return new Response(
            JSON.stringify({
                user: {
                    id: payload.id,
                    email: payload.email,
                    name: payload.name,
                }
            }),
            { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch(error) {
        console.error('세션 처리 오류:', error);
        return new Response(
            JSON.stringify({ user: null }),
            { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};
