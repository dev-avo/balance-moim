// 사용자 정보 API
// GET /api/users/me - 내 정보 조회
// PATCH /api/users/me - 내 정보 수정
// DELETE /api/users/me - 회원 탈퇴

import { getSession, clearSessionCookie } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

// GET: 내 정보 조회
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const user = await env.DB.prepare(`
      SELECT id, email, display_name, profile_url, custom_nickname, use_nickname, created_at
      FROM user WHERE id = ?
    `).bind(session.userId).first();
    
    if (!user) {
      return Response.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      data: { user },
    });
    
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return Response.json(
      { success: false, error: '사용자 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};

// PATCH: 내 정보 수정
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const body = await request.json() as any;
    const updates: string[] = [];
    const params: any[] = [];
    
    if (body.useNickname !== undefined) {
      updates.push('use_nickname = ?');
      params.push(body.useNickname ? 1 : 0);
    }
    
    if (body.customNickname !== undefined) {
      if (body.customNickname && (body.customNickname.length < 2 || body.customNickname.length > 12)) {
        return Response.json(
          { success: false, error: '별명은 2~12자여야 합니다.' },
          { status: 400 }
        );
      }
      updates.push('custom_nickname = ?');
      params.push(body.customNickname || null);
    }
    
    if (updates.length === 0) {
      return Response.json(
        { success: false, error: '수정할 내용이 없습니다.' },
        { status: 400 }
      );
    }
    
    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(session.userId);
    
    await env.DB.prepare(`
      UPDATE user SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();
    
    return Response.json({
      success: true,
      message: '설정이 저장되었습니다.',
    });
    
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    return Response.json(
      { success: false, error: '설정 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
};

// DELETE: 회원 탈퇴
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // 생성한 모임이 있는지 확인
    const ownedGroups = await env.DB.prepare(`
      SELECT id FROM user_group WHERE creator_id = ?
    `).bind(session.userId).first();
    
    if (ownedGroups) {
      return Response.json(
        { success: false, error: '생성한 모임이 있으면 탈퇴할 수 없습니다. 모임을 먼저 삭제해주세요.' },
        { status: 400 }
      );
    }
    
    // 응답의 user_id를 NULL로 설정 (익명화)
    await env.DB.prepare(`
      UPDATE response SET user_id = NULL WHERE user_id = ?
    `).bind(session.userId).run();
    
    // 모임 멤버십 정리
    await env.DB.prepare(`
      UPDATE group_member SET left_at = ? WHERE user_id = ? AND left_at IS NULL
    `).bind(new Date().toISOString(), session.userId).run();
    
    // 사용자 삭제
    await env.DB.prepare(`
      DELETE FROM user WHERE id = ?
    `).bind(session.userId).run();
    
    // 세션 쿠키 삭제
    const headers = new Headers();
    headers.append('Set-Cookie', clearSessionCookie());
    
    return new Response(JSON.stringify({
      success: true,
      message: '탈퇴가 완료되었습니다.',
    }), {
      status: 200,
      headers,
    });
    
  } catch (error) {
    console.error('회원 탈퇴 오류:', error);
    return Response.json(
      { success: false, error: '탈퇴 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
};
