// 모임 참여 API
// GET /api/groups/join?code=xxx - 초대 정보 조회
// POST /api/groups/join?code=xxx - 모임 참여

import { getSession } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

// GET: 초대 정보 조회
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return Response.json(
        { success: false, error: '초대 코드가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 초대 링크 확인
    const invite = await env.DB.prepare(`
      SELECT il.*, ug.name as group_name, ug.description as group_description,
        (SELECT COUNT(*) FROM group_member WHERE group_id = ug.id AND left_at IS NULL) as member_count
      FROM invite_link il
      INNER JOIN user_group ug ON il.group_id = ug.id
      WHERE il.code = ? AND il.is_active = 1
    `).bind(code).first();
    
    if (!invite) {
      return Response.json(
        { success: false, error: '유효하지 않은 초대 코드입니다.' },
        { status: 404 }
      );
    }
    
    const inv = invite as any;
    
    // 만료 확인
    if (new Date(inv.expires_at) < new Date()) {
      return Response.json(
        { success: false, error: '만료된 초대 링크입니다.' },
        { status: 410 }
      );
    }
    
    return Response.json({
      success: true,
      data: {
        groupId: inv.group_id,
        groupName: inv.group_name,
        groupDescription: inv.group_description,
        memberCount: inv.member_count,
      },
    });
    
  } catch (error) {
    console.error('초대 정보 조회 오류:', error);
    return Response.json(
      { success: false, error: '초대 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};

// POST: 모임 참여
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
    const code = url.searchParams.get('code');
    
    if (!code) {
      return Response.json(
        { success: false, error: '초대 코드가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 초대 링크 확인
    const invite = await env.DB.prepare(`
      SELECT * FROM invite_link
      WHERE code = ? AND is_active = 1
    `).bind(code).first();
    
    if (!invite) {
      return Response.json(
        { success: false, error: '유효하지 않은 초대 코드입니다.' },
        { status: 404 }
      );
    }
    
    const inv = invite as any;
    
    // 만료 확인
    if (new Date(inv.expires_at) < new Date()) {
      return Response.json(
        { success: false, error: '만료된 초대 링크입니다.' },
        { status: 410 }
      );
    }
    
    // 이미 멤버인지 확인
    const existingMember = await env.DB.prepare(`
      SELECT id, left_at FROM group_member
      WHERE group_id = ? AND user_id = ?
    `).bind(inv.group_id, session.userId).first();
    
    if (existingMember) {
      const member = existingMember as any;
      if (!member.left_at) {
        return Response.json({
          success: true,
          message: '이미 참여한 모임입니다.',
          data: { groupId: inv.group_id },
        });
      }
      
      // 재참여
      await env.DB.prepare(`
        UPDATE group_member SET left_at = NULL, joined_at = ?
        WHERE id = ?
      `).bind(new Date().toISOString(), member.id).run();
    } else {
      // 새로 참여
      const memberId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO group_member (id, group_id, user_id, joined_at)
        VALUES (?, ?, ?, ?)
      `).bind(memberId, inv.group_id, session.userId, new Date().toISOString()).run();
    }
    
    return Response.json({
      success: true,
      message: '모임에 참여했습니다.',
      data: { groupId: inv.group_id },
    });
    
  } catch (error) {
    console.error('모임 참여 오류:', error);
    return Response.json(
      { success: false, error: '모임 참여에 실패했습니다.' },
      { status: 500 }
    );
  }
};
