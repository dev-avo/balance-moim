/// <reference types="@cloudflare/workers-types" />
// Google OAuth 콜백 엔드포인트
// /api/auth/callback/google 경로를 처리합니다.

export const onRequest: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        const url = new URL(context.request.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');
        
        // 에러 처리
        if(error) {
            console.error('Google OAuth 에러:', error);
            return Response.redirect(new URL('/auth/callback-error', url.origin).toString());
        }
        
        if(!code || !state) {
            return Response.redirect(new URL('/auth/callback-error', url.origin).toString());
        }
        
        // state 검증 (CSRF 보호)
        const cookies = context.request.headers.get('Cookie') || '';
        const stateCookie = cookies.split(';').find(c => c.trim().startsWith('auth_state='));
        const savedState = stateCookie ? stateCookie.split('=')[1] : null;
        
        if(state !== savedState) {
            console.error('State 검증 실패');
            return Response.redirect(new URL('/auth/callback-error', url.origin).toString());
        }
        
        // D1 데이터베이스 설정
        if(!context.env.DB) {
            throw new Error('데이터베이스 연결 오류');
        }
        
        let dbModule;
        try {
            dbModule = await import('../../../../lib/db');
        } catch(error1) {
            try {
                dbModule = await import('../../../../lib/db/index.js');
            } catch(error2) {
                console.error('DB 모듈 import 실패:', error1, error2);
                throw new Error('DB 모듈을 로드할 수 없습니다.');
            }
        }
        
        if(!dbModule || !dbModule.setDb) {
            throw new Error('setDb 함수를 찾을 수 없습니다.');
        }
        
        dbModule.setDb(context.env.DB);
        const db = dbModule.getDb();
        
        // Google OAuth 토큰 교환
        const clientId = context.env.GOOGLE_CLIENT_ID;
        const clientSecret = context.env.GOOGLE_CLIENT_SECRET;
        const baseUrl = context.env.NEXTAUTH_URL || url.origin;
        const callbackUrl = `${baseUrl}/api/auth/callback/google`;
        
        // Access Token 요청
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: callbackUrl,
            }),
        });
        
        if(!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error('토큰 교환 실패:', errorData);
            return Response.redirect(new URL('/auth/callback-error', url.origin).toString());
        }
        
        const tokenData = await tokenResponse.json() as { access_token: string };
        const accessToken = tokenData.access_token;
        
        // 사용자 정보 가져오기
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        
        if(!userInfoResponse.ok) {
            console.error('사용자 정보 가져오기 실패');
            return Response.redirect(new URL('/auth/callback-error', url.origin).toString());
        }
        
        const userInfo = await userInfoResponse.json() as { id: string; email: string; name?: string | null };
        const googleId = userInfo.id;
        const email = userInfo.email;
        const name = userInfo.name;
        
        // DB 스키마 import
        const { user: userTable } = await import('../../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        const { generateId } = await import('../../../../lib/utils');
        
        // 기존 사용자 조회 또는 생성
        const existingUsers = await db
            .select()
            .from(userTable)
            .where(eq(userTable.googleId, googleId))
            .limit(1);
        
        let userId: string;
        if(existingUsers.length === 0) {
            // 신규 사용자 생성
            userId = generateId();
            await db.insert(userTable).values({
                id: userId,
                googleId: googleId,
                email: email,
                displayName: name || null,
                customNickname: null,
                useNickname: false,
                status: 1,
            });
        } else {
            // 기존 사용자 정보 업데이트
            userId = existingUsers[0].id;
            await db
                .update(userTable)
                .set({
                    email: email,
                    displayName: name || null,
                })
                .where(eq(userTable.googleId, googleId));
        }
        
        // JWT 토큰 생성
        const { createJWT } = await import('../../../../lib/auth/jwt');
        const secret = context.env.NEXTAUTH_SECRET;
        const token = await createJWT({
            id: userId,
            email: email,
            name: name,
            googleId: googleId,
            exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30일
        }, secret);
        
        // 세션 쿠키 설정
        const encodedToken = encodeURIComponent(token);
        const sessionCookie = `bm_session=${encodedToken}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${30 * 24 * 60 * 60}`;
        const clearLegacySessionCookie = 'session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0';
        
        // state 및 callback 쿠키 삭제
        const clearStateCookie = 'auth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
        const clearCallbackCookie = 'auth_callback_page=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
        
        // 로그인 후 리다이렉트할 URL
        // 쿠키에서 저장된 callback 페이지 가져오기
        const callbackCookie = cookies.split(';').find(c => c.trim().startsWith('auth_callback_page='));
        let callbackPage = callbackCookie ? callbackCookie.split('=')[1] : '/home.html';
        
        // 쿼리 파라미터에 auth=success 추가하여 세션 캐시 초기화 트리거
        const redirectUrlObj = new URL(callbackPage, url.origin);
        redirectUrlObj.searchParams.set('auth', 'success');
        const redirectUrl = redirectUrlObj.toString();
        
        const headers = new Headers();
        headers.set('Location', redirectUrl);
        headers.append('Set-Cookie', sessionCookie);
        headers.append('Set-Cookie', clearStateCookie);
        headers.append('Set-Cookie', clearCallbackCookie);
        headers.append('Set-Cookie', clearLegacySessionCookie);
        
        return new Response(null, {
            status: 302,
            headers,
        });
    } catch(error) {
        console.error('Google 콜백 처리 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const url = new URL(context.request.url);
        return Response.redirect(new URL('/auth/callback-error', url.origin).toString());
    }
};
