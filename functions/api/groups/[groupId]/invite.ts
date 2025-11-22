// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// POST /api/groups/[groupId]/invite
export const onRequestPost: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }, 'groupId'> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../../lib/db');
        const { userGroup, groupMember, inviteLink } = await import('../../../../lib/db/schema');
        const { eq, and } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../../lib/auth/session');
        const { generateId } = await import('../../../../lib/utils');
        
        setDb(context.env.DB);
        const db = getDb();

        const groupId = context.params.groupId;

        // 로그인 확인
        const currentUser = await getCurrentUser();
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 모임 존재 확인
        const existingGroup = await db
            .select()
            .from(userGroup)
            .where(eq(userGroup.id, groupId))
            .limit(1);

        if(existingGroup.length === 0) {
            return new Response(
                JSON.stringify({ error: '모임을 찾을 수 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 모임 멤버 확인
        const membership = await db
            .select()
            .from(groupMember)
            .where(
                and(
                    eq(groupMember.groupId, groupId),
                    eq(groupMember.userId, currentUser.id)
                )
            )
            .limit(1);

        if(membership.length === 0) {
            return new Response(
                JSON.stringify({ error: '모임 멤버만 초대 링크를 생성할 수 있습니다.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 초대 링크 생성
        const inviteCode = generateId();
        const expiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));

        const newInviteLink = {
            id: inviteCode,
            groupId,
            createdBy: currentUser.id,
            expiresAt,
        };

        await db.insert(inviteLink).values(newInviteLink);

        // 초대 URL 생성
        const inviteUrl = `${context.env.NEXTAUTH_URL}/#invite/${inviteCode}`;

        return new Response(
            JSON.stringify({
                message: '초대 링크가 생성되었습니다.',
                inviteCode,
                inviteUrl,
                expiresAt: expiresAt ? Math.floor(expiresAt.getTime() / 1000) : null,
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('초대 링크 생성 오류:', error);
        return new Response(
            JSON.stringify({ error: '초대 링크를 생성하는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
