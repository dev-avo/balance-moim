// GET /api/tags/search
// 태그를 검색합니다.

export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
    try {
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../../../lib/db');
        const { tag } = await import('../../../../lib/db/schema');
        const { like } = await import('drizzle-orm');
        
        setDb(context.env.DB);
        const db = getDb();
        
        // URL에서 쿼리 파라미터 추출
        const url = new URL(context.request.url);
        const query = url.searchParams.get('q');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        
        let tags;
        
        if(query) {
            // 검색 키워드가 있으면 LIKE 검색
            tags = await db
                .select()
                .from(tag)
                .where(like(tag.name, `%${query}%`))
                .limit(limit);
        } else {
            // 검색 키워드가 없으면 모든 태그 반환 (최신순)
            tags = await db
                .select()
                .from(tag)
                .orderBy(tag.createdAt)
                .limit(limit);
        }
        
        return new Response(
            JSON.stringify({ tags }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('태그 검색 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '태그를 검색하는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
