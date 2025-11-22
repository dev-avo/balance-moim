// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// POST /api/responses
export const onRequestPost: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { z } = await import('zod');
        const { getDb, setDb } = await import('../../../lib/db');
        const { response, question } = await import('../../../lib/db/schema');
        const { eq, and } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        const { generateId } = await import('../../../lib/utils');
        
        setDb(context.env.DB);
        const db = getDb();

        // 요청 본문 파싱 및 검증
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

        // 현재 사용자 확인 (비로그인 허용)
        const currentUser = await getCurrentUser();

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

        // 중복 응답 확인 (로그인 사용자만)
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

        // 응답 저장
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
        return new Response(
            JSON.stringify({ error: '응답을 저장하는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
