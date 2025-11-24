// GET /api/tags
// 모든 태그를 가져옵니다.

export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
    try {
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../../lib/db');
        const { tag } = await import('../../../lib/db/schema');
        
        setDb(context.env.DB);
        const db = getDb();
        
        const allTags = await db.select().from(tag).orderBy(tag.name);
        
        return new Response(
            JSON.stringify({
                tags: allTags,
                total: allTags.length,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('태그 목록 조회 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '태그 목록을 가져오는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
