// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/questions/random
export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../lib/db');
        const { question, questionTag, tag, response } = await import('../../../lib/db/schema');
        const { eq, isNull, and, inArray, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();

        const url = new URL(context.request.url);
        const tagFilter = url.searchParams.get('tags');

        // 현재 로그인한 사용자 확인
        const currentUser = await getCurrentUser();

        // 삭제되지 않은 질문 필터 조건
        let conditions = [isNull(question.deletedAt)];

        // 로그인 사용자: 이미 응답한 질문 제외
        let excludedQuestionIds: string[] = [];
        if(currentUser) {
            const userResponses = await db
                .select({ questionId: response.questionId })
                .from(response)
                .where(eq(response.userId, currentUser.id));
            
            excludedQuestionIds = userResponses.map((r) => r.questionId);
        }

        // 태그 필터 적용
        let eligibleQuestionIds: string[] | null = null;
        if(tagFilter) {
            const tagNames = tagFilter.split(',').map((t) => t.trim());
            
            const tags = await db
                .select()
                .from(tag)
                .where(inArray(tag.name, tagNames));
            
            if(tags.length === 0) {
                return new Response(
                    JSON.stringify({ error: '해당 태그를 찾을 수 없습니다.' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }

            const tagIds = tags.map((t) => t.id);

            const questionsWithTags = await db
                .select({ questionId: questionTag.questionId })
                .from(questionTag)
                .where(inArray(questionTag.tagId, tagIds));
            
            eligibleQuestionIds = questionsWithTags.map((qt) => qt.questionId);

            if(eligibleQuestionIds.length === 0) {
                return new Response(
                    JSON.stringify({ error: '해당 태그의 질문이 없습니다.' }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        // 질문 가져오기
        const finalConditions = [];
        finalConditions.push(isNull(question.deletedAt));
        
        if(excludedQuestionIds.length > 0) {
            finalConditions.push(sql`${question.id} NOT IN ${excludedQuestionIds}`);
        }
        
        if(eligibleQuestionIds !== null) {
            finalConditions.push(inArray(question.id, eligibleQuestionIds));
        }

        const questions = await db
            .select()
            .from(question)
            .where(and(...finalConditions));

        if(questions.length === 0) {
            return new Response(
                JSON.stringify({ error: '더 이상 응답할 질문이 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 랜덤으로 1개 선택
        const randomIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomIndex];

        // 질문의 태그 정보 가져오기
        const questionTags = await db
            .select({
                id: tag.id,
                name: tag.name,
            })
            .from(questionTag)
            .innerJoin(tag, eq(questionTag.tagId, tag.id))
            .where(eq(questionTag.questionId, randomQuestion.id));

        return new Response(
            JSON.stringify({
                id: randomQuestion.id,
                title: randomQuestion.title,
                optionA: randomQuestion.optionA,
                optionB: randomQuestion.optionB,
                visibility: randomQuestion.visibility,
                tags: questionTags,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('랜덤 질문 가져오기 오류:', error);
        return new Response(
            JSON.stringify({ error: '질문을 가져오는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
