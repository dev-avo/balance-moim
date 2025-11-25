// 질문 API
// POST /api/questions - 질문 생성

import { getSession } from '../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

interface CreateQuestionBody {
  title: string;
  optionA: string;
  optionB: string;
  tags: string[];
  visibility: 'public' | 'group' | 'private';
  groupId?: string | null;
}

// POST: 질문 생성
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
    
    const body = await request.json() as CreateQuestionBody;
    const { title, optionA, optionB, tags, visibility, groupId } = body;
    
    // 유효성 검사
    if (!title?.trim() || title.length > 100) {
      return Response.json(
        { success: false, error: '제목은 1~100자여야 합니다.' },
        { status: 400 }
      );
    }
    
    if (!optionA?.trim() || optionA.length > 50) {
      return Response.json(
        { success: false, error: '선택지 A는 1~50자여야 합니다.' },
        { status: 400 }
      );
    }
    
    if (!optionB?.trim() || optionB.length > 50) {
      return Response.json(
        { success: false, error: '선택지 B는 1~50자여야 합니다.' },
        { status: 400 }
      );
    }
    
    if (!tags || !Array.isArray(tags) || tags.length < 1) {
      return Response.json(
        { success: false, error: '태그를 최소 1개 이상 추가해주세요.' },
        { status: 400 }
      );
    }
    
    if (!['public', 'group', 'private'].includes(visibility)) {
      return Response.json(
        { success: false, error: '유효하지 않은 공개 설정입니다.' },
        { status: 400 }
      );
    }
    
    // 모임 전용인 경우 권한 확인
    if (visibility === 'group') {
      if (!groupId) {
        return Response.json(
          { success: false, error: '모임을 선택해주세요.' },
          { status: 400 }
        );
      }
      
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
    }
    
    // 질문 생성
    const questionId = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    await env.DB.prepare(`
      INSERT INTO question (id, creator_id, title, option_a, option_b, visibility, group_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      questionId,
      session.userId,
      title.trim(),
      optionA.trim(),
      optionB.trim(),
      visibility,
      visibility === 'group' ? groupId : null,
      now,
      now
    ).run();
    
    // 태그 연결
    for (const tagName of tags) {
      const normalizedTag = tagName.trim().toLowerCase();
      if (!normalizedTag) continue;
      
      // 태그 찾기 또는 생성
      let tag = await env.DB.prepare(`
        SELECT id FROM tag WHERE name = ?
      `).bind(normalizedTag).first();
      
      if (!tag) {
        const tagId = crypto.randomUUID();
        await env.DB.prepare(`
          INSERT INTO tag (id, name) VALUES (?, ?)
        `).bind(tagId, normalizedTag).run();
        tag = { id: tagId };
      }
      
      // 질문-태그 연결
      await env.DB.prepare(`
        INSERT INTO question_tag (question_id, tag_id) VALUES (?, ?)
      `).bind(questionId, tag.id).run();
    }
    
    return Response.json({
      success: true,
      data: {
        question: {
          id: questionId,
          title: title.trim(),
          optionA: optionA.trim(),
          optionB: optionB.trim(),
          visibility,
          tags,
        },
      },
      message: '질문이 등록되었습니다.',
    });
    
  } catch (error) {
    console.error('질문 생성 오류:', error);
    return Response.json(
      { success: false, error: '질문 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
};
