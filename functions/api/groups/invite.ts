// 모임 초대 API
// POST /api/groups/invite?id=xxx - 초대 링크 생성

import { getSession } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

// POST: 초대 링크 생성
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
    
    // 멤버 확인
    const membership = await env.DB.prepare(`
      SELECT group_id FROM group_member
      WHERE group_id = ? AND user_id = ? AND left_at IS NULL
    `).bind(groupId, session.userId).first();
    
    if (!membership) {
      return Response.json(
        { success: false, error: '해당 모임에 속해있지 않습니다.' },
        { status: 403 }
      );
    }
    
    // 기존 유효한 초대 링크 확인
    const nowTs = Math.floor(Date.now() / 1000);
    const existing = await env.DB.prepare(`
      SELECT id FROM invite_link
      WHERE group_id = ? AND expires_at > ?
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(groupId, nowTs).first();
    
    if (existing) {
      return Response.json({
        success: true,
        data: { inviteCode: (existing as any).id },
        message: '기존 초대 링크를 반환합니다.',
      });
    }
    
    // 새 초대 코드 생성 (UUID의 앞 8자리 사용)
    const inviteId = crypto.randomUUID().substring(0, 8);
    const expiresAt = nowTs + 30 * 24 * 60 * 60; // 30일 후
    
    await env.DB.prepare(`
      INSERT INTO invite_link (id, group_id, created_by, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      inviteId,
      groupId,
      session.userId,
      expiresAt,
      nowTs
    ).run();
    
    return Response.json({
      success: true,
      data: { inviteCode: inviteId },
      message: '초대 링크가 생성되었습니다.',
    });
    
  } catch (error) {
    console.error('초대 링크 생성 오류:', error);
    return Response.json(
      { success: false, error: '초대 링크 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
};
