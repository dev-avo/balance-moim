// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/groups/join/[inviteCode]
export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
    try {
        const { getDb, setDb } = await import('../../../../lib/db');
        const { inviteLink, userGroup, groupMember } = await import('../../../../lib/db/schema');
        const { eq, sql } = await import('drizzle-orm');
        
        setDb(context.env.DB);
        const db = getDb();

        const inviteCode = context.params.inviteCode;

        // 초대 링크 조회
        const invite = await db
            .select({
                inviteId: inviteLink.id,
                groupId: inviteLink.groupId,
                expiresAt: inviteLink.expiresAt,
                groupName: userGroup.name,
                groupDescription: userGroup.description,
            })
            .from(inviteLink)
            .innerJoin(userGroup, eq(inviteLink.groupId, userGroup.id))
            .where(eq(inviteLink.id, inviteCode))
            .limit(1);

        if(invite.length === 0) {
            return new Response(
                JSON.stringify({ error: '초대 링크를 찾을 수 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 만료 여부 확인
        const now = new Date();
        const isExpired = invite[0].expiresAt ? invite[0].expiresAt < now : false;

        // 멤버 수 계산
        const memberCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(groupMember)
            .where(eq(groupMember.groupId, invite[0].groupId));

        const memberCount = Number(memberCountResult[0]?.count || 0);

        return new Response(
            JSON.stringify({
                groupId: invite[0].groupId,
                groupName: invite[0].groupName,
                groupDescription: invite[0].groupDescription,
                memberCount,
                expiresAt: invite[0].expiresAt ? Math.floor(invite[0].expiresAt.getTime() / 1000) : null,
                isExpired,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('초대 링크 정보 조회 오류:', error);
        return new Response(
            JSON.stringify({ error: '초대 링크 정보를 가져오는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// POST /api/groups/join/[inviteCode]
export const onRequestPost: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }, 'inviteCode'> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../../lib/db');
        const { inviteLink, groupMember } = await import('../../../../lib/db/schema');
        const { eq, and } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();

        const inviteCode = context.params.inviteCode;

        // 로그인 확인
        const currentUser = await getCurrentUser();
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 초대 링크 조회
        const invite = await db
            .select()
            .from(inviteLink)
            .where(eq(inviteLink.id, inviteCode))
            .limit(1);

        if(invite.length === 0) {
            return new Response(
                JSON.stringify({ error: '초대 링크를 찾을 수 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 초대 링크 만료 확인
        const now = new Date();
        if(invite[0].expiresAt && invite[0].expiresAt < now) {
            return new Response(
                JSON.stringify({ error: '초대 링크가 만료되었습니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 이미 모임 멤버인지 확인
        const existingMembership = await db
            .select()
            .from(groupMember)
            .where(
                and(
                    eq(groupMember.groupId, invite[0].groupId),
                    eq(groupMember.userId, currentUser.id)
                )
            )
            .limit(1);

        if(existingMembership.length > 0) {
            return new Response(
                JSON.stringify({ error: '이미 모임에 참여하고 있습니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 모임에 참여
        await db.insert(groupMember).values({
            groupId: invite[0].groupId,
            userId: currentUser.id,
        });

        return new Response(
            JSON.stringify({
                message: '모임에 참여했습니다.',
                groupId: invite[0].groupId,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('모임 참여 오류:', error);
        return new Response(
            JSON.stringify({ error: '모임 참여 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
