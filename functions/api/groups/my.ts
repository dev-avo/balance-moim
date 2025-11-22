// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/groups/my
export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../lib/db');
        const { userGroup, groupMember, response } = await import('../../../lib/db/schema');
        const { eq, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();

        // 로그인 확인
        const currentUser = await getCurrentUser();
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 페이지네이션 파라미터 추출
        const url = new URL(context.request.url);
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
        const offset = (page - 1) * limit;

        // 전체 모임 수 조회
        const totalCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(groupMember)
            .where(eq(groupMember.userId, currentUser.id));
        
        const totalCount = Number(totalCountResult[0]?.count || 0);
        const totalPages = Math.ceil(totalCount / limit);

        // 사용자가 속한 모임 조회
        const myGroupMemberships = await db
            .select({
                groupId: groupMember.groupId,
                joinedAt: groupMember.joinedAt,
                groupName: userGroup.name,
                groupDescription: userGroup.description,
                creatorId: userGroup.creatorId,
                createdAt: userGroup.createdAt,
            })
            .from(groupMember)
            .innerJoin(userGroup, eq(groupMember.groupId, userGroup.id))
            .where(eq(groupMember.userId, currentUser.id))
            .orderBy(groupMember.joinedAt)
            .limit(limit)
            .offset(offset);

        // 각 모임의 통계 계산
        const groupsWithStats = await Promise.all(
            myGroupMemberships.map(async (membership) => {
                // 멤버 수 계산
                const memberCountResult = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(groupMember)
                    .where(eq(groupMember.groupId, membership.groupId));

                const memberCount = memberCountResult[0]?.count || 0;

                // 모임 멤버들의 총 응답 수 계산
                const responseCountResult = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(response)
                    .innerJoin(groupMember, eq(response.userId, groupMember.userId))
                    .where(eq(groupMember.groupId, membership.groupId));

                const responseCount = responseCountResult[0]?.count || 0;

                // 생성자 여부 확인
                const isCreator = membership.creatorId === currentUser.id;

                return {
                    id: membership.groupId,
                    name: membership.groupName,
                    description: membership.groupDescription,
                    memberCount,
                    responseCount,
                    isCreator,
                    joinedAt: membership.joinedAt,
                    createdAt: membership.createdAt,
                };
            })
        );

        return new Response(
            JSON.stringify({
                groups: groupsWithStats,
                pagination: {
                    total: totalCount,
                    page,
                    limit,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('내 모임 목록 조회 오류:', error);
        return new Response(
            JSON.stringify({ error: '모임 목록을 가져오는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
