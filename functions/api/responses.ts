// 응답 제출 API
// POST /api/responses

import { getSession } from '../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    // 요청 본문 파싱
    const body = await request.json() as { questionId: string; selectedOption: string };
    const { questionId, selectedOption } = body;
    
    // 유효성 검사
    if (!questionId || !selectedOption) {
      return Response.json(
        { success: false, error: '질문 ID와 선택지가 필요합니다.' },
        { status: 400 }
      );
    }
    
    if (selectedOption !== 'A' && selectedOption !== 'B') {
      return Response.json(
        { success: false, error: '선택지는 A 또는 B여야 합니다.' },
        { status: 400 }
      );
    }
    
    // 질문 존재 확인
    const question = await env.DB.prepare(`
      SELECT id, deleted_at FROM question WHERE id = ?
    `).bind(questionId).first();
    
    if (!question) {
      return Response.json(
        { success: false, error: '질문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    if (question.deleted_at) {
      return Response.json(
        { success: false, error: '삭제된 질문입니다.' },
        { status: 410 }
      );
    }
    
    // 세션 확인 (선택적)
    const session = await getSession(request, env.JWT_SECRET);
    const userId = session?.userId || null;
    
    // 로그인 사용자: 중복 응답 확인
    if (userId) {
      const existingResponse = await env.DB.prepare(`
        SELECT id FROM response WHERE question_id = ? AND user_id = ?
      `).bind(questionId, userId).first();
      
      if (existingResponse) {
        return Response.json(
          { success: false, error: '이미 응답한 질문입니다.' },
          { status: 409 }
        );
      }
    }
    
    // 응답 저장
    const responseId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await env.DB.prepare(`
      INSERT INTO response (id, question_id, user_id, selected_option, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(responseId, questionId, userId, selectedOption, now).run();
    
    return Response.json({
      success: true,
      data: {
        responseId,
        questionId,
        selectedOption,
      },
      message: '응답이 저장되었습니다.',
    });
    
  } catch (error) {
    console.error('응답 제출 오류:', error);
    
    // 중복 키 에러 처리
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return Response.json(
        { success: false, error: '이미 응답한 질문입니다.' },
        { status: 409 }
      );
    }
    
    return Response.json(
      { success: false, error: '응답 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
};
