// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/groups/[groupId]/similarity
export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }, 'groupId'> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../../lib/db');
        const { groupMember, response, user: userTable } = await import('../../../../lib/db/schema');
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
                JSON.stringify({ error: '모임 멤버만 조회할 수 있습니다.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 현재 사용자의 모든 응답 조회
        const myResponses = await db
            .select({
                questionId: response.questionId,
                selectedOption: response.selectedOption,
            })
            .from(response)
            .where(eq(response.userId, currentUser.id));

        if(myResponses.length === 0) {
            return new Response(
                JSON.stringify({
                    similarities: [],
                    message: '아직 응답한 질문이 없습니다.',
                }),
                { headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 모임의 다른 멤버들 조회 (활성 사용자만, 본인 제외)
        const otherMembers = await db
            .select({
                userId: groupMember.userId,
                userName: userTable.displayName,
                customNickname: userTable.customNickname,
                useNickname: userTable.useNickname,
            })
            .from(groupMember)
            .innerJoin(userTable, eq(groupMember.userId, userTable.id))
            .where(
                and(
                    eq(groupMember.groupId, groupId),
                    eq(userTable.status, 1)
                )
            );

        // 각 멤버와의 유사도 계산
        const similarities = [];
        const myResponseMap = new Map(
            myResponses.map(r => [r.questionId, r.selectedOption])
        );

        for(const member of otherMembers) {
            if(member.userId === currentUser.id) continue;

            // 해당 멤버의 응답 조회
            const memberResponses = await db
                .select({
                    questionId: response.questionId,
                    selectedOption: response.selectedOption,
                })
                .from(response)
                .where(eq(response.userId, member.userId));

            // 공통 질문 찾기
            let commonQuestions = 0;
            let matchedAnswers = 0;

            for(const memberResponse of memberResponses) {
                const myAnswer = myResponseMap.get(memberResponse.questionId);
                
                if(myAnswer !== undefined) {
                    commonQuestions++;
                    if(myAnswer === memberResponse.selectedOption) {
                        matchedAnswers++;
                    }
                }
            }

            // 최소 5개 공통 질문이 있어야 유사도 계산
            if(commonQuestions >= 5) {
                const matchPercentage = Math.round((matchedAnswers / commonQuestions) * 100 * 10) / 10;

                similarities.push({
                    userId: member.userId,
                    userName: member.useNickname ? member.customNickname : member.userName,
                    matchPercentage,
                    commonQuestions,
                    matchedAnswers,
                });
            }
        }

        // 일치율 높은 순으로 정렬
        similarities.sort((a, b) => b.matchPercentage - a.matchPercentage);

        return new Response(
            JSON.stringify({
                similarities,
                myResponsesCount: myResponses.length,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('취향 유사도 계산 오류:', error);
        return new Response(
            JSON.stringify({ error: '유사도를 계산하는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
