// 동적 import 사용 (Cloudflare Pages Functions에서 경로 별칭 문제 해결)

// GET /api/tags
export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
    try {
        const { getDb, setDb } = await import('../../../lib/db');
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
        return new Response(
            JSON.stringify({ error: '태그 목록을 가져오는 중 오류가 발생했습니다.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
