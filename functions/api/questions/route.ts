// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// POST /api/questions
export const onRequestPost: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { getDb, setDb } = await import('../../../lib/db');
        const { question, questionTag, tag } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        const { generateId } = await import('../../../lib/utils');
        const { z } = await import('zod');
        const { sanitizeObject } = await import('../../../lib/security/sanitize');
        const { questionTitleSchema, optionSchema, tagNameSchema, visibilitySchema } = await import('../../../lib/security/validation');
        
        // D1 데이터베이스 설정
        setDb(context.env.DB);
        
        // 로그인 확인
        const currentUser = await getCurrentUser();
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 요청 본문 파싱, Sanitize 및 검증
        const body = await context.request.json();
        const sanitizedBody = sanitizeObject(body);
        
        const QuestionSchema = z.object({
            title: questionTitleSchema,
            optionA: optionSchema,
            optionB: optionSchema,
            tags: z
                .array(tagNameSchema)
                .min(1, '최소 1개 이상의 태그를 추가해주세요.')
                .max(5, '최대 5개까지 태그를 추가할 수 있습니다.'),
            visibility: visibilitySchema,
            groupId: z.string().optional(),
        });
        
        const validation = QuestionSchema.safeParse(sanitizedBody);
        if(!validation.success) {
            return new Response(
                JSON.stringify({ error: validation.error.issues[0].message }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { title, optionA, optionB, tags, visibility, groupId } = validation.data;

        // visibility가 "group"일 때 groupId 필수 확인
        if(visibility === 'group' && !groupId) {
            return new Response(
                JSON.stringify({ error: '모임 전용 질문은 모임을 선택해야 합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb();

        // 태그 처리: 기존 태그 찾기 또는 새 태그 생성
        const tagIds: string[] = [];
        for(const tagName of tags) {
            let existingTag = await db
                .select()
                .from(tag)
                .where(eq(tag.name, tagName))
                .limit(1);

            if(existingTag.length > 0) {
                tagIds.push(existingTag[0].id);
            } else {
                const newTag = {
                    id: generateId(),
                    name: tagName,
                };
                await db.insert(tag).values(newTag);
                tagIds.push(newTag.id);
            }
        }

        // 질문 생성
        const newQuestion = {
            id: generateId(),
            creatorId: currentUser.id,
            title,
            optionA,
            optionB,
            visibility,
            groupId: visibility === 'group' ? groupId : null,
        };

        await db.insert(question).values(newQuestion);

        // 질문-태그 연결
        const questionTagValues = tagIds.map((tagId) => ({
            questionId: newQuestion.id,
            tagId,
        }));

        await db.insert(questionTag).values(questionTagValues);

        return new Response(
            JSON.stringify({
                message: '질문이 등록되었습니다.',
                question: {
                    id: newQuestion.id,
                    title: newQuestion.title,
                    optionA: newQuestion.optionA,
                    optionB: newQuestion.optionB,
                    visibility: newQuestion.visibility,
                },
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('질문 등록 오류:', error);
        return new Response(
            JSON.stringify({ error: '질문을 등록하는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// GET /api/questions
export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
    try {
        const { getDb, setDb } = await import('../../../lib/db');
        const { question } = await import('../../../lib/db/schema');
        const { eq, isNull } = await import('drizzle-orm');
        
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
