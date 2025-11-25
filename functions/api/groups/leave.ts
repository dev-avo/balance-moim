// 모임 나가기 API
// POST /api/groups/leave?id=xxx

import { getSession } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const url = new URL(request.url);
    const groupId = url.searchParams.get('id');
    
    if (!groupId) {
      return Response.json(
        { success: false, error: '모임 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 모임 생성자인지 확인
    const group = await env.DB.prepare(`
      SELECT creator_id FROM user_group WHERE id = ?
    `).bind(groupId).first();
    
    if (!group) {
      return Response.json(
        { success: false, error: '모임을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    if ((group as any).creator_id === session.userId) {
      return Response.json(
        { success: false, error: '모임 관리자는 나갈 수 없습니다. 모임을 삭제하거나 관리자를 양도해주세요.' },
        { status: 400 }
      );
    }
    
    // 멤버 확인 및 나가기 처리
    const membership = await env.DB.prepare(`
      SELECT id FROM group_member
      WHERE group_id = ? AND user_id = ? AND left_at IS NULL
    `).bind(groupId, session.userId).first();
    
    if (!membership) {
      return Response.json(
        { success: false, error: '해당 모임에 속해있지 않습니다.' },
        { status: 400 }
      );
    }
    
    await env.DB.prepare(`
      UPDATE group_member SET left_at = ? WHERE id = ?
    `).bind(new Date().toISOString(), (membership as any).id).run();
    
    return Response.json({
      success: true,
      message: '모임을 나갔습니다.',
    });
    
  } catch (error) {
    console.error('모임 나가기 오류:', error);
    return Response.json(
      { success: false, error: '모임 나가기에 실패했습니다.' },
      { status: 500 }
    );
  }
};
