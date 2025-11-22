// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/users/me
export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { setDb } = await import('../../../lib/db');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        
        // D1 데이터베이스 설정 (getCurrentUser가 auth()를 호출하고 auth()가 DB를 사용하므로 필수)
        setDb(context.env.DB);
        
        const currentUser = await getCurrentUser();
        
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify(currentUser),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('사용자 정보 조회 오류:', error);
        return new Response(
            JSON.stringify({ error: '사용자 정보를 가져오는 중 오류가 발생했습니다.' }),
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

        const currentUser = await getCurrentUser();
        
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
