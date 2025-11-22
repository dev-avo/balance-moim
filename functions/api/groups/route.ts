// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// POST /api/groups
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
        const { userGroup, groupMember } = await import('../../../lib/db/schema');
        const { getCurrentUser } = await import('../../../lib/auth/session');
        const { generateId } = await import('../../../lib/utils');
        
        setDb(context.env.DB);
        const db = getDb();

        // 로그인 확인
        const currentUser = await getCurrentUser();
        if(!currentUser) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 요청 본문 파싱 및 검증
        const body = await context.request.json();
        const GroupSchema = z.object({
            name: z
                .string()
                .min(1, '모임 이름은 필수입니다.')
                .max(30, '모임 이름은 최대 30자까지 가능합니다.'),
            description: z
                .string()
                .max(200, '모임 설명은 최대 200자까지 가능합니다.')
                .optional(),
        });
        
        const validation = GroupSchema.safeParse(body);
        if(!validation.success) {
            return new Response(
                JSON.stringify({ error: validation.error.issues[0].message }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { name, description } = validation.data;

        // 모임 생성
        const newGroup = {
            id: generateId(),
            name,
            description: description || null,
            creatorId: currentUser.id,
        };

        await db.insert(userGroup).values(newGroup);

        // 생성자를 멤버로 자동 추가
        await db.insert(groupMember).values({
            groupId: newGroup.id,
            userId: currentUser.id,
        });

        return new Response(
            JSON.stringify({
                message: '모임이 생성되었습니다.',
                group: {
                    id: newGroup.id,
                    name: newGroup.name,
                    description: newGroup.description,
                },
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('모임 생성 오류:', error);
        return new Response(
            JSON.stringify({ error: '모임을 생성하는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
