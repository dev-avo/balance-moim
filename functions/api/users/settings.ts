// /api/users/settings
// - GET: 사용자 설정 조회
// - PATCH: 사용자 설정 업데이트

const ensureEnv = (env: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
}) => {
    process.env.GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
    process.env.NEXTAUTH_SECRET = env.NEXTAUTH_SECRET;
    process.env.NEXTAUTH_URL = env.NEXTAUTH_URL;
};

export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        ensureEnv(context.env);
        
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { auth } = await import('../../../auth');
        const { getDb, setDb } = await import('../../../lib/db');
        const { user: userTable } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        setDb(context.env.DB);
        const db = getDb();

        const session = await auth(context.request);
        if(!session?.user?.id) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

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

        if(users.length === 0) {
            return new Response(
                JSON.stringify({ error: '사용자를 찾을 수 없습니다' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ user: users[0] }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('설정 조회 오류:', error);
        return new Response(
            JSON.stringify({ error: '설정 조회에 실패했습니다' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

export const onRequestPatch: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        ensureEnv(context.env);
        
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { z } = await import('zod');
        const { auth } = await import('../../../auth');
        const { getDb, setDb } = await import('../../../lib/db');
        const { user: userTable } = await import('../../../lib/db/schema');
        const { eq } = await import('drizzle-orm');
        
        setDb(context.env.DB);
        const db = getDb();

        const session = await auth(context.request);
        if(!session?.user?.id) {
            return new Response(
                JSON.stringify({ error: '로그인이 필요합니다' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await context.request.json();

        const updateSettingsSchema = z.object({
            useNickname: z.boolean(),
            customNickname: z.string()
                .refine((val) => {
                    if(!val || val === '') return true;
                    return val.length >= 2 && val.length <= 12;
                }, {
                    message: '별명은 2~12자여야 합니다.',
                })
                .nullable()
                .optional(),
        });

        const validatedData = updateSettingsSchema.parse(body);

        if(validatedData.useNickname && !validatedData.customNickname) {
            return new Response(
                JSON.stringify({ error: '익명 별명을 입력해주세요' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await db
            .update(userTable)
            .set({
                useNickname: validatedData.useNickname,
                customNickname: validatedData.customNickname || null,
                updatedAt: new Date(),
            })
            .where(eq(userTable.id, session.user.id));

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

        if(updatedUser.length === 0) {
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
    } catch(error) {
        const { z } = await import('zod');
        if(error instanceof z.ZodError) {
            return new Response(
                JSON.stringify({ error: error.issues[0].message }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.error('설정 업데이트 오류:', error);
        return new Response(
            JSON.stringify({ error: '설정 업데이트에 실패했습니다' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
