// 로그아웃 엔드포인트
// /api/auth/signout 경로를 처리합니다.

export const onRequest: PagesFunction = async (context) => {
    try {
        // 세션 쿠키 삭제
        const clearCookie = 'bm_session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0';
        const clearLegacyCookie = 'session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0';
        
        const headers = new Headers({
            'Content-Type': 'application/json',
        });
        headers.append('Set-Cookie', clearCookie);
        headers.append('Set-Cookie', clearLegacyCookie);
        
        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers,
            }
        );
    } catch(error) {
        console.error('로그아웃 처리 오류:', error);
        return new Response(
            JSON.stringify({ error: '로그아웃 처리 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
