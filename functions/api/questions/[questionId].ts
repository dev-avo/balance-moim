// 질문 상세 API
// GET /api/questions/[questionId] - 질문 상세 조회
// PATCH /api/questions/[questionId] - 질문 수정
// DELETE /api/questions/[questionId] - 질문 삭제

import { getSession } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

// GET: 질문 상세 조회
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const questionId = params.questionId as string;
  
  try {
    // 세션 확인 (선택적)
    const session = await getSession(request, env.JWT_SECRET);
    const userId = session?.userId || null;
    
    // 질문 조회
    const question = await env.DB.prepare(`
      SELECT q.*, u.display_name as creator_name
      FROM question q
      LEFT JOIN user u ON q.creator_id = u.id
      WHERE q.id = ? AND q.deleted_at IS NULL
    `).bind(questionId).first();
    
    if (!question) {
      return Response.json(
        { success: false, error: '질문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 접근 권한 확인
    const q = question as any;
    if (q.visibility === 'private' && q.creator_id !== userId) {
      return Response.json(
        { success: false, error: '접근 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    if (q.visibility === 'group' && userId) {
      const membership = await env.DB.prepare(`
        SELECT id FROM group_member
        WHERE group_id = ? AND user_id = ? AND left_at IS NULL
      `).bind(q.group_id, userId).first();
      
      if (!membership && q.creator_id !== userId) {
        return Response.json(
          { success: false, error: '해당 모임에 속해있지 않습니다.' },
          { status: 403 }
        );
      }
    }
    
    // 태그 조회
    const tagsResult = await env.DB.prepare(`
      SELECT t.name FROM tag t
      INNER JOIN question_tag qt ON t.id = qt.tag_id
      WHERE qt.question_id = ?
    `).bind(questionId).all();
    
    return Response.json({
      success: true,
      data: {
        question: {
          ...question,
          tags: (tagsResult.results || []).map((t: any) => t.name),
        },
      },
    });
    
  } catch (error) {
    console.error('질문 조회 오류:', error);
    return Response.json(
      { success: false, error: '질문을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};

// PATCH: 질문 수정
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const questionId = params.questionId as string;
  
  try {
    // 로그인 확인
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // 질문 소유자 확인
    const question = await env.DB.prepare(`
      SELECT creator_id FROM question WHERE id = ? AND deleted_at IS NULL
    `).bind(questionId).first();
    
    if (!question) {
      return Response.json(
        { success: false, error: '질문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    if ((question as any).creator_id !== session.userId) {
      return Response.json(
        { success: false, error: '수정 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    const body = await request.json() as any;
    const updates: string[] = [];
    const params: any[] = [];
    
    if (body.title !== undefined) {
      if (!body.title?.trim() || body.title.length > 100) {
        return Response.json(
          { success: false, error: '제목은 1~100자여야 합니다.' },
          { status: 400 }
        );
      }
      updates.push('title = ?');
      params.push(body.title.trim());
    }
    
    if (body.optionA !== undefined) {
      if (!body.optionA?.trim() || body.optionA.length > 50) {
        return Response.json(
          { success: false, error: '선택지 A는 1~50자여야 합니다.' },
          { status: 400 }
        );
      }
      updates.push('option_a = ?');
      params.push(body.optionA.trim());
    }
    
    if (body.optionB !== undefined) {
      if (!body.optionB?.trim() || body.optionB.length > 50) {
        return Response.json(
          { success: false, error: '선택지 B는 1~50자여야 합니다.' },
          { status: 400 }
        );
      }
      updates.push('option_b = ?');
      params.push(body.optionB.trim());
    }
    
    if (body.visibility !== undefined) {
      if (!['public', 'group', 'private'].includes(body.visibility)) {
        return Response.json(
          { success: false, error: '유효하지 않은 공개 설정입니다.' },
          { status: 400 }
        );
      }
      updates.push('visibility = ?');
      params.push(body.visibility);
    }
    
    if (updates.length === 0) {
      return Response.json(
        { success: false, error: '수정할 내용이 없습니다.' },
        { status: 400 }
      );
    }
    
    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(questionId);
    
    await env.DB.prepare(`
      UPDATE question SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run();
    
    return Response.json({
      success: true,
      message: '질문이 수정되었습니다.',
    });
    
  } catch (error) {
    console.error('질문 수정 오류:', error);
    return Response.json(
      { success: false, error: '질문 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
};

// DELETE: 질문 삭제 (소프트 삭제)
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const questionId = params.questionId as string;
  
  try {
    // 로그인 확인
    const session = await getSession(request, env.JWT_SECRET);
    if (!session) {
      return Response.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // 질문 소유자 확인
    const question = await env.DB.prepare(`
      SELECT creator_id FROM question WHERE id = ? AND deleted_at IS NULL
    `).bind(questionId).first();
    
    if (!question) {
      return Response.json(
        { success: false, error: '질문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    if ((question as any).creator_id !== session.userId) {
      return Response.json(
        { success: false, error: '삭제 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    // 소프트 삭제
    await env.DB.prepare(`
      UPDATE question SET deleted_at = ? WHERE id = ?
    `).bind(new Date().toISOString(), questionId).run();
    
    return Response.json({
      success: true,
      message: '질문이 삭제되었습니다.',
    });
    
  } catch (error) {
    console.error('질문 삭제 오류:', error);
    return Response.json(
      { success: false, error: '질문 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
};
