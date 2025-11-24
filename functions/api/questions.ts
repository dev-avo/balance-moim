// /api/questions 엔드포인트
// - GET: 공개 질문 목록 조회
// - POST: 신규 질문 생성

export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
    try {
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../lib/db');
        const { question } = await import('../../lib/db/schema');
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
        const { question, questionTag, tag } = await import('../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../lib/auth/session');
        const { generateId } = await import('../../lib/utils');
        const { sanitizeObject } = await import('../../lib/security/sanitize');
        const { z } = await import('zod');
        const { 
            questionTitleSchema, 
            optionSchema, 
            tagNameSchema, 
            visibilitySchema 
        } = await import('../../lib/security/validation');
        
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
        
        if(visibility === 'group' && !groupId) {
            return new Response(
                JSON.stringify({ error: '모임 전용 질문은 모임을 선택해야 합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '질문을 등록하는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
