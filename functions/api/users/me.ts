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
        const { auth } = await import('../../../auth');
        const { getDb, setDb } = await import('../../../lib/db');
        const { user: userTable, userGroup } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        // D1 데이터베이스 설정
        setDb(context.env.DB);
        
        // 인증 확인
        const session = await auth();
        if (!session?.user?.id) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb();

        // 사용자 정보 조회
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
            .where(eq(userTable.id, session.user.id))
            .limit(1);

        if (users.length === 0) {
            return new Response(
                JSON.stringify({ error: '사용자를 찾을 수 없습니다' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const user = users[0];

        // 탈퇴한 사용자인 경우
        if (user.status === -1) {
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
    } catch (error) {
        console.error('Error fetching user info:', error);
        return new Response(
            JSON.stringify({ error: '사용자 정보 조회에 실패했습니다' }),
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
        const { auth } = await import('../../../auth');
        const { getDb, setDb } = await import('../../../lib/db');
        const { user: userTable, userGroup } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        // D1 데이터베이스 설정
        setDb(context.env.DB);
        
        // 인증 확인
        const session = await auth();
        if (!session?.user?.id) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb();

        // 생성한 모임 확인
        const createdGroups = await db
            .select()
            .from(userGroup)
            .where(eq(userGroup.creatorId, session.user.id));

        if (createdGroups.length > 0) {
            return new Response(
                JSON.stringify({
                    error: '생성한 모임이 있습니다',
                    message: '모임 관리자 권한을 다른 사용자에게 위임하거나 모임을 삭제한 후 탈퇴할 수 있습니다.',
                    createdGroupsCount: createdGroups.length,
                    groups: createdGroups.map(g => ({
                        id: g.id,
                        name: g.name,
                    })),
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 사용자 상태를 탈퇴(-1)로 변경 (Soft Delete)
        await db
            .update(userTable)
            .set({
                status: -1, // 탈퇴
                updatedAt: new Date(),
            })
            .where(eq(userTable.id, session.user.id));

        return new Response(
            JSON.stringify({
                success: true,
                message: '회원 탈퇴가 완료되었습니다.',
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error deleting user account:', error);
        return new Response(
            JSON.stringify({ error: '회원 탈퇴에 실패했습니다' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
