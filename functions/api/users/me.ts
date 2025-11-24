// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/users/me
export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 확인 및 설정
        if(!context.env.GOOGLE_CLIENT_ID || !context.env.GOOGLE_CLIENT_SECRET || !context.env.NEXTAUTH_SECRET || !context.env.NEXTAUTH_URL) {
            console.error('필수 환경 변수가 설정되지 않았습니다:', {
                hasGoogleClientId: !!context.env.GOOGLE_CLIENT_ID,
                hasGoogleClientSecret: !!context.env.GOOGLE_CLIENT_SECRET,
                hasNextAuthSecret: !!context.env.NEXTAUTH_SECRET,
                hasNextAuthUrl: !!context.env.NEXTAUTH_URL
            });
            return new Response(
                JSON.stringify({ error: '서버 설정 오류: 환경 변수가 설정되지 않았습니다.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // D1 데이터베이스 확인
        if(!context.env.DB) {
            console.error('D1 데이터베이스가 바인딩되지 않았습니다.');
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // 동적 import
        const { setDb, getDb } = await import('../../../lib/db');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        const { user: userTable, userGroup } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        // D1 데이터베이스 설정 (getCurrentUser가 auth()를 호출하고 auth()가 DB를 사용하므로 필수)
        setDb(context.env.DB);
        
        // Request 객체를 전달하여 auth 함수 호출
        const secret = context.env.NEXTAUTH_SECRET || '';
        const sessionUser = await getCurrentUser(context.request, secret);
        
        // 로그인하지 않은 상태는 정상적인 경우이므로 401 반환 (에러가 아님)
        if(!sessionUser || !sessionUser.id) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // DB에서 실제 사용자 정보 가져오기
        const db = getDb();
        const users = await db
            .select({
                id: userTable.id,
                googleId: userTable.googleId,
                email: userTable.email,
                displayName: userTable.displayName,
                customNickname: userTable.customNickname,
                useNickname: userTable.useNickname,
                status: userTable.status,
                createdAt: userTable.createdAt,
                updatedAt: userTable.updatedAt,
            })
            .from(userTable)
            .where(eq(userTable.id, sessionUser.id))
            .limit(1);

        if(users.length === 0) {
            return new Response(
                JSON.stringify({ error: '사용자를 찾을 수 없습니다' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = users[0];

        // 탈퇴한 사용자인 경우
        if(user.status === -1) {
            return new Response(
                JSON.stringify({ error: '탈퇴한 사용자입니다' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 생성한 모임 수 조회
        const createdGroups = await db
            .select()
            .from(userGroup)
            .where(eq(userGroup.creatorId, user.id));

        return new Response(
            JSON.stringify({
                user: {
                    ...user,
                    createdGroupsCount: createdGroups.length,
                },
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('사용자 정보 조회 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('에러 상세:', { errorMessage, errorStack });
        return new Response(
            JSON.stringify({ 
                error: '사용자 정보를 가져오는 중 오류가 발생했습니다.',
                details: errorMessage
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// DELETE /api/users/me
export const onRequestDelete: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../lib/db');
        const { user: userTable } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();

        const secret = context.env.NEXTAUTH_SECRET || '';
        const currentUser = await getCurrentUser(context.request, secret);
        
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 사용자 삭제 (soft delete)
        await db
            .update(userTable)
            .set({ status: 0 })
            .where(eq(userTable.id, currentUser.id));

        return new Response(
            JSON.stringify({ message: '회원 탈퇴가 완료되었습니다.' }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('회원 탈퇴 오류:', error);
        return new Response(
            JSON.stringify({ error: '회원 탈퇴 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
