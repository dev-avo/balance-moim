// GET /api/questions/[questionId]
// 특정 질문의 상세 정보를 가져옵니다 (태그 포함).

export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
    try {
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../../../lib/db');
        const { question, questionTag, tag } = await import('../../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        setDb(context.env.DB);
        const db = getDb();
        
        // URL에서 questionId 추출
        const url = new URL(context.request.url);
        const pathParts = url.pathname.split('/');
        const questionId = pathParts[pathParts.length - 1];
        
        // 질문 조회
        const questionData = await db
            .select()
            .from(question)
            .where(eq(question.id, questionId))
            .limit(1);
        
        if(questionData.length === 0) {
            return new Response(
                JSON.stringify({ error: '질문을 찾을 수 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // 태그 정보 가져오기
        const questionTags = await db
            .select({
                id: tag.id,
                name: tag.name,
            })
            .from(questionTag)
            .innerJoin(tag, eq(questionTag.tagId, tag.id))
            .where(eq(questionTag.questionId, questionId));
        
        return new Response(
            JSON.stringify({
                question: {
                    ...questionData[0],
                    tags: questionTags,
                },
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('질문 조회 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '질문을 가져오는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
