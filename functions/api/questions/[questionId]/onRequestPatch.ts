// PATCH /api/questions/[questionId]
// 질문을 수정합니다.

export const onRequestPatch: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
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
        const { question, questionTag, tag } = await import('../../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        const { sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../../lib/auth/session');
        const { generateId } = await import('../../../../lib/utils');
        const { z } = await import('zod');
        
        setDb(context.env.DB);
        const db = getDb();
        
        // URL에서 questionId 추출
        const url = new URL(context.request.url);
        const pathParts = url.pathname.split('/');
        const questionId = pathParts[pathParts.length - 1];
        
        // 로그인 확인
        const currentUser = await getCurrentUser(context.request);
        
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // 요청 본문 파싱 및 검증
        const body = await context.request.json();
        
        const UpdateQuestionSchema = z.object({
            title: z
                .string()
                .min(1, '질문 제목은 필수입니다.')
                .max(100, '질문 제목은 최대 100자까지 가능합니다.')
                .optional(),
            optionA: z
                .string()
                .min(1, '선택지 A는 필수입니다.')
                .max(50, '선택지 A는 최대 50자까지 가능합니다.')
                .optional(),
            optionB: z
                .string()
                .min(1, '선택지 B는 필수입니다.')
                .max(50, '선택지 B는 최대 50자까지 가능합니다.')
                .optional(),
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
                JSON.stringify({ error: '본인이 만든 질문만 수정할 수 있습니다.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // 질문 정보 업데이트
        const updateFields: any = {
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
        
        // 태그 업데이트
        if(updateData.tags !== undefined) {
            // 기존 태그 연결 삭제
            await db
                .delete(questionTag)
                .where(eq(questionTag.questionId, questionId));
            
            // 새 태그 처리
            const tagIds: string[] = [];
            
            for(const tagName of updateData.tags) {
                // 기존 태그 확인
                let existingTag = await db
                    .select()
                    .from(tag)
                    .where(eq(tag.name, tagName))
                    .limit(1);
                
                if(existingTag.length > 0) {
                    tagIds.push(existingTag[0].id);
                } else {
                    // 새 태그 생성
                    const newTag = {
                        id: generateId(),
                        name: tagName,
                    };
                    await db.insert(tag).values(newTag);
                    tagIds.push(newTag.id);
                }
            }
            
            // 새 태그 연결
            const questionTagValues = tagIds.map((tagId) => ({
                questionId,
                tagId,
            }));
            
            await db.insert(questionTag).values(questionTagValues);
        }
        
        // 성공 응답
        return new Response(
            JSON.stringify({
                message: '질문이 수정되었습니다.',
            }),
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
