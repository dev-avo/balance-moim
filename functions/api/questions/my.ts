// 내 질문 목록 API
// GET /api/questions/my?page=1&limit=10

import { getSession } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
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
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
    const offset = (page - 1) * limit;
    
    // 질문 목록 조회
    const result = await env.DB.prepare(`
      SELECT 
        q.id, q.title, q.option_a, q.option_b, q.visibility, q.group_id, q.created_at,
        (SELECT COUNT(*) FROM response WHERE question_id = q.id) as response_count
      FROM question q
      WHERE q.creator_id = ? AND q.deleted_at IS NULL
      ORDER BY q.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(session.userId, limit, offset).all();
    
    // 전체 개수
    const countResult = await env.DB.prepare(`
      SELECT COUNT(*) as total FROM question WHERE creator_id = ? AND deleted_at IS NULL
    `).bind(session.userId).first();
    
    const total = (countResult as any)?.total || 0;
    
    // 각 질문의 태그와 통계 추가
    const questions = await Promise.all((result.results || []).map(async (q: any) => {
      // 태그 조회
      const tagsResult = await env.DB.prepare(`
        SELECT t.name FROM tag t
        INNER JOIN question_tag qt ON t.id = qt.tag_id
        WHERE qt.question_id = ?
      `).bind(q.id).all();
      
      // 통계 계산
      let optionAPercent = 50;
      let optionBPercent = 50;
      
      if (q.response_count > 0) {
        const statsResult = await env.DB.prepare(`
          SELECT selected_option, COUNT(*) as count
          FROM response WHERE question_id = ?
          GROUP BY selected_option
        `).bind(q.id).all();
        
        let aCount = 0, bCount = 0;
        for (const row of statsResult.results || []) {
          if ((row as any).selected_option === 'A') aCount = (row as any).count;
          else if ((row as any).selected_option === 'B') bCount = (row as any).count;
        }
        
        const total = aCount + bCount;
        if (total > 0) {
          optionAPercent = Math.round((aCount / total) * 100);
          optionBPercent = 100 - optionAPercent;
        }
      }
      
      return {
        ...q,
        tags: (tagsResult.results || []).map((t: any) => t.name),
        responseCount: q.response_count,
        optionAPercent,
        optionBPercent,
      };
    }));
    
    return Response.json({
      success: true,
      data: {
        questions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
    
  } catch (error) {
    console.error('내 질문 목록 조회 오류:', error);
    return Response.json(
      { success: false, error: '질문 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};
