// GET /api/questions/random
// 랜덤 밸런스 질문을 가져옵니다.

export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // D1 데이터베이스 설정
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // 동적 import
        const { setDb, getDb } = await import('../../../../lib/db');
        const { question, questionTag, tag, response } = await import('../../../../lib/db/schema');
        const { eq, isNull, and, inArray, notInArray, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();
        
        // URL에서 쿼리 파라미터 추출
        const url = new URL(context.request.url);
        const tagFilter = url.searchParams.get('tags');
        
        // 현재 로그인한 사용자 확인
        const secret = context.env.NEXTAUTH_SECRET || '';
        const currentUser = await getCurrentUser(context.request, secret);
        
        // 1. 삭제되지 않은 질문 필터 조건
        let conditions = [isNull(question.deletedAt)];
        
        // 2. 로그인 사용자: 이미 응답한 질문 제외
        if(currentUser) {
            // 사용자가 이미 응답한 질문 ID 목록 가져오기
            const userResponses = await db
                .select({ questionId: response.questionId })
                .from(response)
                .where(eq(response.userId, currentUser.id));
            
            const answeredQuestionIds = userResponses.map(r => r.questionId);
            
            if(answeredQuestionIds.length > 0) {
                // 이미 응답한 질문 제외
                conditions.push(notInArray(question.id, answeredQuestionIds));
            }
        }
        
        // 3. 태그 필터 (선택사항)
        if(tagFilter) {
            const tagIds = tagFilter.split(',').map(t => t.trim()).filter(t => t);
            if(tagIds.length > 0) {
                // 태그가 포함된 질문만 조회
                const questionsWithTags = await db
                    .select({ questionId: questionTag.questionId })
                    .from(questionTag)
                    .innerJoin(tag, eq(questionTag.tagId, tag.id))
                    .where(inArray(tag.name, tagIds));
                
                const filteredQuestionIds = questionsWithTags.map(q => q.questionId);
                
                if(filteredQuestionIds.length > 0) {
                    conditions.push(inArray(question.id, filteredQuestionIds));
                } else {
                    // 태그에 해당하는 질문이 없으면 빈 결과 반환
                    return new Response(
                        JSON.stringify({ question: null }),
                        { status: 200, headers: { 'Content-Type': 'application/json' } }
                    );
                }
            }
        }
        
        // 조건에 맞는 질문 중 랜덤으로 하나 선택
        const allQuestions = await db
            .select({
                id: question.id,
                optionA: question.optionA,
                optionB: question.optionB,
                creatorId: question.creatorId,
                createdAt: question.createdAt,
            })
            .from(question)
            .where(and(...conditions));
        
        if(allQuestions.length === 0) {
            return new Response(
                JSON.stringify({ question: null }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // 랜덤 선택
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        const selectedQuestion = allQuestions[randomIndex];
        
        // 태그 정보 가져오기
        const questionTags = await db
            .select({
                tagId: questionTag.tagId,
                tagName: tag.name,
            })
            .from(questionTag)
            .innerJoin(tag, eq(questionTag.tagId, tag.id))
            .where(eq(questionTag.questionId, selectedQuestion.id));
        
        // 응답 통계 가져오기
        const responseStats = await db
            .select({
                selectedOption: response.selectedOption,
                count: sql<number>`COUNT(*)`.as('count'),
            })
            .from(response)
            .where(eq(response.questionId, selectedQuestion.id))
            .groupBy(response.selectedOption);
        
        const optionACount = responseStats.find(s => s.selectedOption === 'A')?.count || 0;
        const optionBCount = responseStats.find(s => s.selectedOption === 'B')?.count || 0;
        const totalResponses = optionACount + optionBCount;
        
        // 사용자가 이미 응답했는지 확인
        let userSelection: 'A' | 'B' | null = null;
        if(currentUser) {
            const userResponse = await db
                .select({ selectedOption: response.selectedOption })
                .from(response)
                .where(
                    and(
                        eq(response.questionId, selectedQuestion.id),
                        eq(response.userId, currentUser.id)
                    )
                )
                .limit(1);
            
            if(userResponse.length > 0) {
                userSelection = userResponse[0].selectedOption as 'A' | 'B';
            }
        }
        
        // 응답 반환
        return new Response(
            JSON.stringify({
                question: {
                    id: selectedQuestion.id,
                    optionA: selectedQuestion.optionA,
                    optionB: selectedQuestion.optionB,
                    tags: questionTags.map(t => ({ id: t.tagId, name: t.tagName })),
                    stats: {
                        optionA: optionACount,
                        optionB: optionBCount,
                        total: totalResponses,
                    },
                    userSelection: userSelection,
                    createdAt: selectedQuestion.createdAt,
                }
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('랜덤 질문 로드 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '질문을 불러오는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
