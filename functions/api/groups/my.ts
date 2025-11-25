// 내 모임 목록 API
// GET /api/groups/my?page=1&limit=10

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
    
    // 모임 목록 조회
    const result = await env.DB.prepare(`
      SELECT 
        ug.id, ug.name, ug.description, ug.creator_id, ug.created_at,
        (SELECT COUNT(*) FROM group_member WHERE group_id = ug.id AND left_at IS NULL) as member_count,
        (SELECT COUNT(*) FROM question WHERE group_id = ug.id AND deleted_at IS NULL) as question_count
      FROM user_group ug
      INNER JOIN group_member gm ON ug.id = gm.group_id
      WHERE gm.user_id = ? AND gm.left_at IS NULL
      ORDER BY ug.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(session.userId, limit, offset).all();
    
    // 전체 개수
    const countResult = await env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM group_member
      WHERE user_id = ? AND left_at IS NULL
    `).bind(session.userId).first();
    
    const total = (countResult as any)?.total || 0;
    
    const groups = (result.results || []).map((g: any) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      creator_id: g.creator_id,
      created_at: g.created_at,
      memberCount: g.member_count,
      questionCount: g.question_count,
    }));
    
    return Response.json({
      success: true,
      data: {
        groups,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
    
  } catch (error) {
    console.error('모임 목록 조회 오류:', error);
    return Response.json(
      { success: false, error: '모임 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};
