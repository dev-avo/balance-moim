// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/questions/[questionId]
export const onRequestGet: PagesFunction<{ DB: D1Database }, 'questionId'> = async (context) => {
    try {
        const { getDb, setDb } = await import('../../../lib/db');
        const { question, questionTag, tag } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        setDb(context.env.DB);
        const db = getDb();

        const questionId = context.params.questionId;

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
        return new Response(
            JSON.stringify({ error: '질문을 가져오는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// DELETE /api/questions/[questionId]
export const onRequestDelete: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }, 'questionId'> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../lib/db');
        const { question } = await import('../../../lib/db/schema');
        const { eq, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();

        const questionId = context.params.questionId;

        // 로그인 확인
        const currentUser = await getCurrentUser();
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 질문 존재 확인
        const existingQuestion = await db
            .select()
            .from(question)
            .where(eq(question.id, questionId))
            .limit(1);

        if(existingQuestion.length === 0) {
            return new Response(
                JSON.stringify({ error: '질문을 찾을 수 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 생성자 확인
        if(existingQuestion[0].creatorId !== currentUser.id) {
            return new Response(
                JSON.stringify({ error: '본인이 만든 질문만 삭제할 수 있습니다.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Soft Delete
        await db
            .update(question)
            .set({ deletedAt: sql`(unixepoch())` })
            .where(eq(question.id, questionId));

        return new Response(
            JSON.stringify({ message: '질문이 삭제되었습니다.' }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('질문 삭제 오류:', error);
        return new Response(
            JSON.stringify({ error: '질문을 삭제하는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
