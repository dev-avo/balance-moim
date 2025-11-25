// 태그 검색 API
// GET /api/tags/search?q=keyword

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.trim().toLowerCase();
    
    if (!query) {
      return Response.json({
        success: true,
        data: { tags: [] },
      });
    }
    
    // LIKE 검색
    const result = await env.DB.prepare(`
      SELECT id, name
      FROM tag
      WHERE name LIKE ?
      ORDER BY name ASC
      LIMIT 10
    `).bind(`%${query}%`).all();
    
    return Response.json({
      success: true,
      data: {
        tags: result.results || [],
      },
    });
    
  } catch (error) {
    console.error('태그 검색 오류:', error);
    return Response.json(
      { success: false, error: '태그 검색에 실패했습니다.' },
      { status: 500 }
    );
  }
};
