// GET /api/questions/my
// 현재 로그인한 사용자가 만든 질문 목록을 가져옵니다.

export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../../../lib/db');
        const { question, questionTag, tag, response } = await import('../../../../lib/db/schema');
        const { eq, isNull, and, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();
        
        // 로그인 확인
        const currentUser = await getCurrentUser(context.request);
        
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
        
        // 전체 질문 수 조회
        const totalCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(question)
            .where(
                and(
                    eq(question.creatorId, currentUser.id),
                    isNull(question.deletedAt)
                )
            );
        
        const totalCount = Number(totalCountResult[0]?.count || 0);
        const totalPages = Math.ceil(totalCount / limit);
        
        // 사용자가 만든 질문 가져오기
        const myQuestions = await db
            .select()
            .from(question)
            .where(
                and(
                    eq(question.creatorId, currentUser.id),
                    isNull(question.deletedAt)
                )
            )
            .orderBy(question.createdAt)
            .limit(limit)
            .offset(offset);
        
        // 각 질문에 대한 태그와 통계 정보 추가
        const questionsWithDetails = await Promise.all(
            myQuestions.map(async (q) => {
                // 태그 정보 가져오기
                const questionTags = await db
                    .select({
                        id: tag.id,
                        name: tag.name,
                    })
                    .from(questionTag)
                    .innerJoin(tag, eq(questionTag.tagId, tag.id))
                    .where(eq(questionTag.questionId, q.id));
                
                // 응답 통계 계산
                const responseStats = await db
                    .select({
                        selectedOption: response.selectedOption,
                        count: sql<number>`count(*)`,
                    })
                    .from(response)
                    .where(eq(response.questionId, q.id))
                    .groupBy(response.selectedOption);
                
                const optionACount = responseStats.find((r) => r.selectedOption === 'A')?.count || 0;
                const optionBCount = responseStats.find((r) => r.selectedOption === 'B')?.count || 0;
                const totalResponses = optionACount + optionBCount;
                
                return {
                    id: q.id,
                    title: q.title,
                    optionA: q.optionA,
                    optionB: q.optionB,
                    visibility: q.visibility,
                    createdAt: q.createdAt,
                    tags: questionTags,
                    stats: {
                        totalResponses,
                        optionACount,
                        optionBCount,
                    },
                };
            })
        );
        
        // 응답 반환
        return new Response(
            JSON.stringify({
                questions: questionsWithDetails,
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
        console.error('내 질문 목록 조회 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '질문 목록을 가져오는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
