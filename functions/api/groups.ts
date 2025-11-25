// 모임 API
// GET /api/groups/my - 내 모임 목록
// POST /api/groups - 모임 생성

import { getSession } from '../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

// GET은 /api/groups/my에서 처리

// POST: 모임 생성
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
    
    const body = await request.json() as { name: string; description?: string };
    const { name, description } = body;
    
    // 유효성 검사
    if (!name?.trim() || name.length > 30) {
      return Response.json(
        { success: false, error: '모임 이름은 1~30자여야 합니다.' },
        { status: 400 }
      );
    }
    
    if (description && description.length > 200) {
      return Response.json(
        { success: false, error: '모임 설명은 200자 이하여야 합니다.' },
        { status: 400 }
      );
    }
    
    // 모임 생성
    const groupId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await env.DB.prepare(`
      INSERT INTO user_group (id, name, description, creator_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(groupId, name.trim(), description?.trim() || null, session.userId, now, now).run();
    
    // 생성자를 멤버로 추가
    const memberId = crypto.randomUUID();
    await env.DB.prepare(`
      INSERT INTO group_member (id, group_id, user_id, joined_at)
      VALUES (?, ?, ?, ?)
    `).bind(memberId, groupId, session.userId, now).run();
    
    return Response.json({
      success: true,
      data: {
        group: {
          id: groupId,
          name: name.trim(),
          description: description?.trim() || null,
        },
      },
      message: '모임이 생성되었습니다.',
    });
    
  } catch (error) {
    console.error('모임 생성 오류:', error);
    return Response.json(
      { success: false, error: '모임 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
};
