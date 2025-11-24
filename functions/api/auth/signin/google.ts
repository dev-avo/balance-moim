/// <reference types="@cloudflare/workers-types" />
// Google OAuth 로그인 엔드포인트
// /api/auth/signin/google 경로를 처리합니다.

export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        const clientId = context.env.GOOGLE_CLIENT_ID;
        const baseUrl = context.env.NEXTAUTH_URL || new URL(context.request.url).origin;
        
        if(!clientId) {
            return new Response(
                JSON.stringify({ error: 'Google Client ID가 설정되지 않았습니다.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // 콜백 URL 생성
        const callbackUrl = `${baseUrl}/api/auth/callback/google`;
        
        // OAuth state 생성 (CSRF 보호)
        // callback URL을 state에 포함시켜 콜백에서 사용
        const referer = context.request.headers.get('Referer') || '';
        const callbackPage = referer ? new URL(referer).pathname : '/home.html';
        const state = crypto.randomUUID();
        
        // state와 callback URL을 쿠키에 저장 (콜백에서 검증 및 리다이렉트)
        const stateCookie = `auth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`;
        const callbackCookie = `auth_callback_page=${callbackPage}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`;
        
        // Google OAuth 인증 URL 생성
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', callbackUrl);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'openid email profile');
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('prompt', 'consent');
        authUrl.searchParams.set('state', state);
        
        // Google OAuth 페이지로 리다이렉트
        const headers = new Headers();
        headers.set('Location', authUrl.toString());
        headers.append('Set-Cookie', stateCookie);
        headers.append('Set-Cookie', callbackCookie);
        
        return new Response(null, {
            status: 302,
            headers,
        });
    } catch(error) {
        console.error('Google 로그인 처리 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '로그인 처리 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
