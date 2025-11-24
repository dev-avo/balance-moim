// GET /api/questions
// 모든 공개 질문을 가져옵니다.

export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
    try {
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../../lib/db');
        const { question } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        setDb(context.env.DB);
        const db = getDb();
        
        const allQuestions = await db
            .select()
            .from(question)
            .where(eq(question.visibility, 'public'))
            .orderBy(question.createdAt)
            .limit(50);
        
        return new Response(
            JSON.stringify({
                questions: allQuestions,
                total: allQuestions.length,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('질문 목록 조회 오류:', error);
        return new Response(
            JSON.stringify({ error: '질문 목록을 가져오는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
