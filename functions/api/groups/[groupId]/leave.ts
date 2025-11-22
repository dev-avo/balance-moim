// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// DELETE /api/groups/[groupId]/leave
export const onRequestDelete: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }, 'groupId'> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../../lib/db');
        const { userGroup, groupMember } = await import('../../../../lib/db/schema');
        const { eq, and } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../../lib/auth/session');
        
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

        // 생성자 확인 (생성자는 나갈 수 없음)
        if(existingGroup[0].creatorId === currentUser.id) {
            return new Response(
                JSON.stringify({ 
                    error: '모임 생성자는 나갈 수 없습니다. 모임을 삭제하거나 다른 멤버에게 관리자 권한을 위임해주세요.' 
                }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 멤버 확인
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
                JSON.stringify({ error: '이 모임의 멤버가 아닙니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 모임에서 나가기
        await db
            .delete(groupMember)
            .where(
                and(
                    eq(groupMember.groupId, groupId),
                    eq(groupMember.userId, currentUser.id)
                )
            );

        return new Response(
            JSON.stringify({ message: '모임에서 나갔습니다.' }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('모임 나가기 오류:', error);
        return new Response(
            JSON.stringify({ error: '모임에서 나가는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
