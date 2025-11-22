// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/users/settings
export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { auth } = await import('../../../auth');
        const { getDb, setDb } = await import('../../../lib/db');
        const { user: userTable } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        // D1 데이터베이스 설정
        setDb(context.env.DB);
        
        // 인증 확인
        const session = await auth();
        if (!session?.user?.id) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb();

        // 사용자 정보 조회
        const users = await db
            .select({
                id: userTable.id,
                email: userTable.email,
                displayName: userTable.displayName,
                customNickname: userTable.customNickname,
                useNickname: userTable.useNickname,
                status: userTable.status,
            })
            .from(userTable)
            .where(eq(userTable.id, session.user.id))
            .limit(1);

        if (users.length === 0) {
            return new Response(
                JSON.stringify({ error: '사용자를 찾을 수 없습니다' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ user: users[0] }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return new Response(
            JSON.stringify({ error: '설정 조회에 실패했습니다' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

// PATCH /api/users/settings
export const onRequestPatch: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        // 동적 import
        const { z } = await import('zod');
        const { auth } = await import('../../../auth');
        const { getDb, setDb } = await import('../../../lib/db');
        const { user: userTable } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        // D1 데이터베이스 설정
        setDb(context.env.DB);
        
        // 인증 확인
        const session = await auth();
        if (!session?.user?.id) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 요청 본문 파싱
        const body = await context.request.json();

        // 입력 유효성 검사 스키마
        const updateSettingsSchema = z.object({
            useNickname: z.boolean(),
            customNickname: z.string()
                .refine((val) => {
                    // 빈 문자열이나 null은 허용 (구글 계정명 사용 시)
                    if(!val || val === '') return true;
                    // 별명 사용 시 검증
                    return val.length >= 2 && val.length <= 12;
                }, {
                    message: '별명은 2~12자여야 합니다.',
                })
                .nullable()
                .optional(),
        });

        // 유효성 검사
        const validatedData = updateSettingsSchema.parse(body);

        // useNickname이 true인데 customNickname이 없으면 에러
        if (validatedData.useNickname && !validatedData.customNickname) {
            return new Response(
                JSON.stringify({ error: '익명 별명을 입력해주세요' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = getDb();

        // 사용자 설정 업데이트
        await db
            .update(userTable)
            .set({
                useNickname: validatedData.useNickname,
                customNickname: validatedData.customNickname || null,
                updatedAt: new Date(),
            })
            .where(eq(userTable.id, session.user.id));

        // 업데이트된 사용자 정보 조회
        const updatedUser = await db
            .select({
                id: userTable.id,
                email: userTable.email,
                displayName: userTable.displayName,
                customNickname: userTable.customNickname,
                useNickname: userTable.useNickname,
            })
            .from(userTable)
            .where(eq(userTable.id, session.user.id))
            .limit(1);

        if (updatedUser.length === 0) {
            return new Response(
                JSON.stringify({ error: '사용자를 찾을 수 없습니다' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                user: updatedUser[0],
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                JSON.stringify({ error: error.issues[0].message }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.error('Error updating user settings:', error);
        return new Response(
            JSON.stringify({ error: '설정 업데이트에 실패했습니다' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
