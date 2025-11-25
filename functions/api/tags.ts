// 태그 API
// GET /api/tags - 전체 태그 목록
// POST /api/tags - 태그 생성

import { getSession } from '../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

// GET: 전체 태그 목록 (1시간 캐싱)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    // 캐시 키 생성
    const cacheKey = new Request(new URL('/api/tags', request.url).toString());
    const cache = caches.default;
    
    // 캐시 확인
    let response = await cache.match(cacheKey);
    if (response) {
      return response;
    }
    
    const result = await env.DB.prepare(`
      SELECT t.id, t.name, COUNT(qt.question_id) as question_count
      FROM tag t
      LEFT JOIN question_tag qt ON t.id = qt.tag_id
      LEFT JOIN question q ON qt.question_id = q.id AND q.deleted_at IS NULL
      GROUP BY t.id
      ORDER BY question_count DESC, t.name ASC
      LIMIT 100
    `).all();
    
    response = Response.json({
      success: true,
      data: {
        tags: result.results || [],
      },
    });
    
    // 1시간 캐싱 (3600초)
    response = new Response(response.body, response);
    response.headers.set('Cache-Control', 'public, max-age=3600');
    
    // 캐시에 저장
    context.waitUntil(cache.put(cacheKey, response.clone()));
    
    return response;
    
  } catch (error) {
    console.error('태그 목록 조회 오류:', error);
    return Response.json(
      { success: false, error: '태그 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};

// POST: 태그 생성
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    // 로그인 확인
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const body = await request.json() as { name: string };
    const name = body.name?.trim().toLowerCase();
    
    // 유효성 검사
    if (!name || name.length < 1 || name.length > 20) {
      return Response.json(
        { success: false, error: '태그 이름은 1~20자여야 합니다.' },
        { status: 400 }
      );
    }
    
    // 중복 확인
    const existing = await env.DB.prepare(`
      SELECT id FROM tag WHERE name = ?
    `).bind(name).first();
    
    if (existing) {
      return Response.json({
        success: true,
        data: { tag: existing },
        message: '이미 존재하는 태그입니다.',
      });
    }
    
    // 태그 생성
    const tagId = crypto.randomUUID();
    
    await env.DB.prepare(`
      INSERT INTO tag (id, name) VALUES (?, ?)
    `).bind(tagId, name).run();
    
    return Response.json({
      success: true,
      data: {
        tag: { id: tagId, name },
      },
      message: '태그가 생성되었습니다.',
    });
    
  } catch (error) {
    console.error('태그 생성 오류:', error);
    return Response.json(
      { success: false, error: '태그 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
};
