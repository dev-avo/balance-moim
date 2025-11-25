// 모임 상세 API
// GET /api/groups/[groupId] - 모임 상세 조회
// PATCH /api/groups/[groupId] - 모임 수정
// DELETE /api/groups/[groupId] - 모임 삭제

import { getSession } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

// GET: 모임 상세 조회
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const groupId = params.groupId as string;
  
  try {
    // 로그인 확인
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // 멤버 확인
    const membership = await env.DB.prepare(`
      SELECT id FROM group_member
      WHERE group_id = ? AND user_id = ? AND left_at IS NULL
    `).bind(groupId, session.userId).first();
    
    if (!membership) {
      return Response.json(
        { success: false, error: '해당 모임에 속해있지 않습니다.' },
        { status: 403 }
      );
    }
    
    // 모임 정보 조회
    const group = await env.DB.prepare(`
      SELECT 
        ug.*,
        (SELECT COUNT(*) FROM group_member WHERE group_id = ug.id AND left_at IS NULL) as member_count,
        (SELECT COUNT(*) FROM question WHERE group_id = ug.id AND deleted_at IS NULL) as question_count
      FROM user_group ug
      WHERE ug.id = ?
    `).bind(groupId).first();
    
    if (!group) {
      return Response.json(
        { success: false, error: '모임을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 멤버 목록 조회
    const members = await env.DB.prepare(`
      SELECT 
        gm.user_id,
        gm.joined_at,
        u.display_name,
        u.profile_url
      FROM group_member gm
      INNER JOIN user u ON gm.user_id = u.id
      WHERE gm.group_id = ? AND gm.left_at IS NULL
      ORDER BY gm.joined_at ASC
    `).bind(groupId).all();
    
    const g = group as any;
    
    return Response.json({
      success: true,
      data: {
        group: {
          id: g.id,
          name: g.name,
          description: g.description,
          creator_id: g.creator_id,
          created_at: g.created_at,
          memberCount: g.member_count,
          questionCount: g.question_count,
          members: members.results || [],
        },
      },
    });
    
  } catch (error) {
    console.error('모임 조회 오류:', error);
    return Response.json(
      { success: false, error: '모임을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};

// PATCH: 모임 수정 (생성자만)
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const groupId = params.groupId as string;
  
  try {
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // 생성자 확인
    const group = await env.DB.prepare(`
      SELECT creator_id FROM user_group WHERE id = ?
    `).bind(groupId).first();
    
    if (!group) {
      return Response.json(
        { success: false, error: '모임을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    if ((group as any).creator_id !== session.userId) {
      return Response.json(
        { success: false, error: '모임 관리자만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }
    
    const body = await request.json() as any;
    const updates: string[] = [];
    const params: any[] = [];
    
    if (body.name !== undefined) {
      if (!body.name?.trim() || body.name.length > 30) {
        return Response.json(
          { success: false, error: '모임 이름은 1~30자여야 합니다.' },
          { status: 400 }
        );
      }
      updates.push('name = ?');
      params.push(body.name.trim());
    }
    
    if (body.description !== undefined) {
      if (body.description && body.description.length > 200) {
        return Response.json(
          { success: false, error: '모임 설명은 200자 이하여야 합니다.' },
          { status: 400 }
        );
      }
      updates.push('description = ?');
      params.push(body.description?.trim() || null);
    }
    
    if (updates.length === 0) {
      return Response.json(
        { success: false, error: '수정할 내용이 없습니다.' },
        { status: 400 }
      );
    }
    
    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(groupId);
    
    await env.DB.prepare(`
      UPDATE user_group SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();
    
    return Response.json({
      success: true,
      message: '모임이 수정되었습니다.',
    });
    
  } catch (error) {
    console.error('모임 수정 오류:', error);
    return Response.json(
      { success: false, error: '모임 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
};

// DELETE: 모임 삭제 (생성자만)
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const groupId = params.groupId as string;
  
  try {
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // 생성자 확인
    const group = await env.DB.prepare(`
      SELECT creator_id FROM user_group WHERE id = ?
    `).bind(groupId).first();
    
    if (!group) {
      return Response.json(
        { success: false, error: '모임을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    if ((group as any).creator_id !== session.userId) {
      return Response.json(
        { success: false, error: '모임 관리자만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }
    
    // 모임 삭제 (관련 데이터는 CASCADE 또는 별도 처리)
    await env.DB.prepare(`DELETE FROM invite_link WHERE group_id = ?`).bind(groupId).run();
    await env.DB.prepare(`DELETE FROM group_member WHERE group_id = ?`).bind(groupId).run();
    await env.DB.prepare(`UPDATE question SET group_id = NULL WHERE group_id = ?`).bind(groupId).run();
    await env.DB.prepare(`DELETE FROM user_group WHERE id = ?`).bind(groupId).run();
    
    return Response.json({
      success: true,
      message: '모임이 삭제되었습니다.',
    });
    
  } catch (error) {
    console.error('모임 삭제 오류:', error);
    return Response.json(
      { success: false, error: '모임 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
};
