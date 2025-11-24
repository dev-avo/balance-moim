// /api/questions/[questionId]
// - GET: 질문 상세 조회
// - PATCH: 질문 수정
// - DELETE: 질문 삭제 (Soft Delete)

const getQuestionId = (context: { params?: Record<string, string>; request: Request }): string | null => {
    if(context.params && context.params.questionId) {
        return context.params.questionId;
    }
    
    const url = new URL(context.request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : null;
};

export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
    try {
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const questionId = getQuestionId(context);
        if(!questionId) {
            return new Response(
                JSON.stringify({ error: '질문 ID가 필요합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../../lib/db');
        const { question, questionTag, tag } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        setDb(context.env.DB);
        const db = getDb();
        
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

export const onRequestPatch: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
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
        
        const questionId = getQuestionId(context);
        if(!questionId) {
            return new Response(
                JSON.stringify({ error: '질문 ID가 필요합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../../lib/db');
        const { question, questionTag, tag } = await import('../../../lib/db/schema');
        const { eq, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        const { generateId } = await import('../../../lib/utils');
        const { z } = await import('zod');
        
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
        
        const UpdateQuestionSchema = z.object({
            title: z.string().min(1).max(100).optional(),
            optionA: z.string().min(1).max(50).optional(),
            optionB: z.string().min(1).max(50).optional(),
            tags: z
                .array(z.string())
                .min(1, '최소 1개 이상의 태그를 추가해주세요.')
                .max(5, '최대 5개까지 태그를 추가할 수 있습니다.')
                .optional(),
            visibility: z.enum(['public', 'group', 'private']).optional(),
        });
        
        const validation = UpdateQuestionSchema.safeParse(body);
        
        if(!validation.success) {
            return new Response(
                JSON.stringify({ error: validation.error.issues[0].message }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const updateData = validation.data;
        
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
        
        if(existingQuestion[0].creatorId !== currentUser.id) {
            return new Response(
                JSON.stringify({ error: '본인이 만든 질문만 수정할 수 있습니다.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const updateFields: Record<string, unknown> = {
            updatedAt: sql`(unixepoch())`,
        };
        
        if(updateData.title !== undefined) updateFields.title = updateData.title;
        if(updateData.optionA !== undefined) updateFields.optionA = updateData.optionA;
        if(updateData.optionB !== undefined) updateFields.optionB = updateData.optionB;
        if(updateData.visibility !== undefined) updateFields.visibility = updateData.visibility;
        
        await db
            .update(question)
            .set(updateFields)
            .where(eq(question.id, questionId));
        
        if(updateData.tags !== undefined) {
            await db
                .delete(questionTag)
                .where(eq(questionTag.questionId, questionId));
            
            const tagIds: string[] = [];
            
            for(const tagName of updateData.tags) {
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
            
            const questionTagValues = tagIds.map((tagId) => ({
                questionId,
                tagId,
            }));
            
            await db.insert(questionTag).values(questionTagValues);
        }
        
        return new Response(
            JSON.stringify({ message: '질문이 수정되었습니다.' }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('질문 수정 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '질문을 수정하는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

export const onRequestDelete: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
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
        
        const questionId = getQuestionId(context);
        if(!questionId) {
            return new Response(
                JSON.stringify({ error: '질문 ID가 필요합니다.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../../lib/db');
        const { question } = await import('../../../lib/db/schema');
        const { eq, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        
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
        
        if(existingQuestion[0].creatorId !== currentUser.id) {
            return new Response(
                JSON.stringify({ error: '본인이 만든 질문만 삭제할 수 있습니다.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '질문을 삭제하는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
