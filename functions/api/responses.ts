// /api/responses 엔드포인트
// - GET: 현재 사용자의 응답 목록 조회
// - POST: 밸런스 질문에 대한 응답 제출

export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
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
        
        const { setDb, getDb } = await import('../../lib/db');
        const { response, question } = await import('../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();
        
        const secret = context.env.NEXTAUTH_SECRET || '';
        const currentUser = await getCurrentUser(context.request, secret);
        
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const userResponses = await db
            .select({
                id: response.id,
                questionId: response.questionId,
                selectedOption: response.selectedOption,
                createdAt: response.createdAt,
                questionTitle: question.title,
                optionA: question.optionA,
                optionB: question.optionB,
            })
            .from(response)
            .innerJoin(question, eq(response.questionId, question.id))
            .where(eq(response.userId, currentUser.id))
            .orderBy(response.createdAt);
        
        return new Response(
            JSON.stringify({
                responses: userResponses,
                total: userResponses.length,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('응답 목록 조회 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '응답 목록을 가져오는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

export const onRequestPost: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
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
        
        const { setDb, getDb } = await import('../../lib/db');
        const { response, question } = await import('../../lib/db/schema');
        const { eq, and } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../lib/auth/session');
        const { generateId } = await import('../../lib/utils');
        const { z } = await import('zod');
        
        setDb(context.env.DB);
        const db = getDb();
        
        const body = await context.request.json();
        
        const ResponseSchema = z.object({
            questionId: z.string().min(1, '질문 ID는 필수입니다.'),
            selectedOption: z.enum(['A', 'B'], {
                message: '선택지는 A 또는 B여야 합니다.',
            }),
        });
        
        const validation = ResponseSchema.safeParse(body);
        
        if(!validation.success) {
            return new Response(
                JSON.stringify({ error: validation.error.issues[0].message }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { questionId, selectedOption } = validation.data;
        
        const secret = context.env.NEXTAUTH_SECRET || '';
        const currentUser = await getCurrentUser(context.request, secret);
        
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
        
        if(currentUser) {
            const existingResponse = await db
                .select()
                .from(response)
                .where(
                    and(
                        eq(response.questionId, questionId),
                        eq(response.userId, currentUser.id)
                    )
                )
                .limit(1);
            
            if(existingResponse.length > 0) {
                return new Response(
                    JSON.stringify({ error: '이미 응답한 질문입니다. 답변은 수정할 수 없습니다.' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }
        
        const newResponse = {
            id: generateId(),
            questionId,
            userId: currentUser?.id || null,
            selectedOption,
        };
        
        await db.insert(response).values(newResponse);
        
        return new Response(
            JSON.stringify({
                message: '응답이 저장되었습니다.',
                response: {
                    id: newResponse.id,
                    questionId: newResponse.questionId,
                    selectedOption: newResponse.selectedOption,
                },
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('응답 저장 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '응답을 저장하는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
