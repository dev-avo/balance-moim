// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/groups/[groupId]
export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }, 'groupId'> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../lib/db');
        const { userGroup, groupMember, user: userTable, response } = await import('../../../lib/db/schema');
        const { eq, and, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();

        const groupId = context.params.groupId;

        // 로그인 확인 (선택)
        const currentUser = await getCurrentUser();

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

        const group = existingGroup[0];

        // 현재 사용자의 멤버십 확인
        let isMember = false;
        if(currentUser) {
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

            isMember = membership.length > 0;
        }

        // 멤버 목록 가져오기
        const members = await db
            .select({
                id: userTable.id,
                displayName: userTable.displayName,
                customNickname: userTable.customNickname,
                useNickname: userTable.useNickname,
                status: userTable.status,
                joinedAt: groupMember.joinedAt,
            })
            .from(groupMember)
            .innerJoin(userTable, eq(groupMember.userId, userTable.id))
            .where(eq(groupMember.groupId, groupId))
            .orderBy(groupMember.joinedAt);

        // 통계 계산
        const memberCount = members.length;

        // 모임 멤버들의 총 응답 수
        const responseCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(response)
            .innerJoin(groupMember, eq(response.userId, groupMember.userId))
            .where(eq(groupMember.groupId, groupId));

        const responseCount = responseCountResult[0]?.count || 0;

        // 생성자 여부 확인
        const isCreator = currentUser ? group.creatorId === currentUser.id : false;

        return new Response(
            JSON.stringify({
                group: {
                    id: group.id,
                    name: group.name,
                    description: group.description,
                    creatorId: group.creatorId,
                    isCreator,
                    isMember,
                    memberCount,
                    responseCount,
                    createdAt: group.createdAt,
                },
                members: members.map((member) => ({
                    id: member.id,
                    name: member.useNickname ? member.customNickname : member.displayName,
                    status: member.status,
                    joinedAt: member.joinedAt,
                })),
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('모임 상세 조회 오류:', error);
        return new Response(
            JSON.stringify({ error: '모임 정보를 가져오는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// PATCH /api/groups/[groupId]
export const onRequestPatch: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }, 'groupId'> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { z } = await import('zod');
        const { getDb, setDb } = await import('../../../lib/db');
        const { userGroup } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        const { sanitizeObject } = await import('../../../lib/security/sanitize');
        const { groupNameSchema, groupDescriptionSchema } = await import('../../../lib/security/validation');
        const { checkCanModifyGroup } = await import('../../../lib/auth/permissions');
        
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

        // 권한 확인
        const permissionCheck = await checkCanModifyGroup(currentUser.id, groupId);
        if(!permissionCheck.allowed) {
            return new Response(
                JSON.stringify({ error: permissionCheck.reason || '권한이 없습니다.' }),
                { status: permissionCheck.reason?.includes('찾을 수 없습니다') ? 404 : 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 요청 본문 파싱, Sanitize 및 검증
        const body = await context.request.json();
        const sanitizedBody = sanitizeObject(body);
        
        const UpdateGroupSchema = z.object({
            name: groupNameSchema,
            description: groupDescriptionSchema,
        });
        
        const validation = UpdateGroupSchema.safeParse(sanitizedBody);
        if(!validation.success) {
            return new Response(
                JSON.stringify({ error: validation.error.issues[0].message }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { name, description } = validation.data;

        // 모임 정보 업데이트
        await db
            .update(userGroup)
            .set({
                name,
                description: description || null,
            })
            .where(eq(userGroup.id, groupId));

        return new Response(
            JSON.stringify({
                message: '모임 정보가 수정되었습니다.',
                group: {
                    id: groupId,
                    name,
                    description,
                },
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('모임 정보 수정 오류:', error);
        return new Response(
            JSON.stringify({ error: '모임 정보를 수정하는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
