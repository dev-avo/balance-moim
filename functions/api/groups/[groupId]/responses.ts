// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/groups/[groupId]/responses
export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }, 'groupId'> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../../lib/db');
        const { groupMember, response, question, questionTag, tag } = await import('../../../../lib/db/schema');
        const { eq, and, isNull, inArray, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();

        const groupId = context.params.groupId;
        const url = new URL(context.request.url);
        const tagFilter = url.searchParams.get('tag');

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

        // 모임의 모든 멤버 조회
        const members = await db
            .select({
                userId: groupMember.userId,
            })
            .from(groupMember)
            .where(eq(groupMember.groupId, groupId));

        const memberIds = members.map(m => m.userId);

        if(memberIds.length === 0) {
            return new Response(
                JSON.stringify({
                    questions: [],
                    totalMembers: 0,
                }),
                { headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 태그 필터 처리
        let filteredQuestionIds: string[] | null = null;
        if(tagFilter) {
            const tagData = await db
                .select({ id: tag.id })
                .from(tag)
                .where(eq(tag.name, tagFilter))
                .limit(1);

            if(tagData.length > 0) {
                const questionTagData = await db
                    .select({ questionId: questionTag.questionId })
                    .from(questionTag)
                    .where(eq(questionTag.tagId, tagData[0].id));

                filteredQuestionIds = questionTagData.map(qt => qt.questionId);
            } else {
                filteredQuestionIds = [];
            }
        }

        if(filteredQuestionIds !== null && filteredQuestionIds.length === 0) {
            return new Response(
                JSON.stringify({
                    questions: [],
                    totalMembers: memberIds.length,
                    tagFilter,
                }),
                { headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 모임 멤버들의 응답 조회
        const whereConditions = [inArray(response.userId, memberIds)];
        if(filteredQuestionIds !== null && filteredQuestionIds.length > 0) {
            whereConditions.push(inArray(response.questionId, filteredQuestionIds));
        }

        const responses = await db
            .select({
                questionId: response.questionId,
                selectedOption: response.selectedOption,
            })
            .from(response)
            .where(and(...whereConditions));

        // 질문별 응답 집계
        const questionStats = new Map<string, { A: number; B: number }>();
        for(const r of responses) {
            if(!questionStats.has(r.questionId)) {
                questionStats.set(r.questionId, { A: 0, B: 0 });
            }
            const stats = questionStats.get(r.questionId)!;
            if(r.selectedOption === 'A') {
                stats.A++;
            } else {
                stats.B++;
            }
        }

        if(questionStats.size === 0) {
            return new Response(
                JSON.stringify({
                    questions: [],
                    totalMembers: memberIds.length,
                    tagFilter,
                }),
                { headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 질문 정보 조회
        const questionIds = Array.from(questionStats.keys());
        const questions = await db
            .select({
                id: question.id,
                title: question.title,
                optionA: question.optionA,
                optionB: question.optionB,
            })
            .from(question)
            .where(
                and(
                    inArray(question.id, questionIds),
                    isNull(question.deletedAt)
                )
            );

        // 각 질문의 태그 조회
        const questionTagsData = await db
            .select({
                questionId: questionTag.questionId,
                tagName: tag.name,
            })
            .from(questionTag)
            .innerJoin(tag, eq(questionTag.tagId, tag.id))
            .where(inArray(questionTag.questionId, questionIds));

        const tagsByQuestion = new Map<string, string[]>();
        for(const qt of questionTagsData) {
            if(!tagsByQuestion.has(qt.questionId)) {
                tagsByQuestion.set(qt.questionId, []);
            }
            tagsByQuestion.get(qt.questionId)!.push(qt.tagName);
        }

        // 결과 생성
        const result = questions.map(q => {
            const stats = questionStats.get(q.id) || { A: 0, B: 0 };
            const total = stats.A + stats.B;
            const optionAPercentage = total > 0 ? Math.round((stats.A / total) * 100) : 0;
            const optionBPercentage = total > 0 ? Math.round((stats.B / total) * 100) : 0;

            return {
                questionId: q.id,
                title: q.title,
                optionA: q.optionA,
                optionB: q.optionB,
                totalResponses: total,
                optionACount: stats.A,
                optionBCount: stats.B,
                optionAPercentage,
                optionBPercentage,
                tags: tagsByQuestion.get(q.id) || [],
            };
        });

        result.sort((a, b) => b.totalResponses - a.totalResponses);

        return new Response(
            JSON.stringify({
                questions: result,
                totalMembers: memberIds.length,
                tagFilter,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('모임 응답 조회 오류:', error);
        return new Response(
            JSON.stringify({ error: '응답을 조회하는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
