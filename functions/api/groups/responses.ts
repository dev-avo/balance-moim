// 모임 응답 목록 API
// GET /api/groups/responses?id=xxx&tag=음식
// GET /api/groups/responses?id=xxx&questionId=yyy (특정 질문의 멤버 목록)

import { getSession } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

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
    
    const url = new URL(request.url);
    const groupId = url.searchParams.get('id');
    const tagFilter = url.searchParams.get('tag');
    const questionId = url.searchParams.get('questionId');
    
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
    
    // 특정 질문의 멤버 목록 조회
    if (questionId) {
      return await getQuestionMembers(env, groupId, questionId);
    }
    
    // 모임 멤버들이 응답한 질문들 조회
    let query = `
      SELECT DISTINCT q.id, q.title, q.option_a, q.option_b
      FROM question q
      INNER JOIN response r ON q.id = r.question_id
      INNER JOIN group_member gm ON r.user_id = gm.user_id
      WHERE gm.group_id = ? AND gm.left_at IS NULL AND q.deleted_at IS NULL
    `;
    const params: any[] = [groupId];
    
    if (tagFilter) {
      query += `
        AND q.id IN (
          SELECT qt.question_id FROM question_tag qt
          INNER JOIN tag t ON qt.tag_id = t.id
          WHERE t.name = ?
        )
      `;
      params.push(tagFilter);
    }
    
    query += ` ORDER BY q.created_at DESC LIMIT 50`;
    
    const questions = await env.DB.prepare(query).bind(...params).all();
    
    // 각 질문의 모임 내 통계 계산
    const responses = await Promise.all(
      (questions.results || []).map(async (q: any) => {
        const stats = await env.DB.prepare(`
          SELECT r.selected_option, COUNT(*) as count
          FROM response r
          INNER JOIN group_member gm ON r.user_id = gm.user_id
          WHERE r.question_id = ?
            AND gm.group_id = ?
            AND gm.left_at IS NULL
          GROUP BY r.selected_option
        `).bind(q.id, groupId).all();
        
        let aCount = 0, bCount = 0;
        for (const row of stats.results || []) {
          if ((row as any).selected_option === 'A') aCount = (row as any).count;
          else if ((row as any).selected_option === 'B') bCount = (row as any).count;
        }
        
        const total = aCount + bCount;
        const aPercent = total > 0 ? Math.round((aCount / total) * 100) : 50;
        
        return {
          id: q.id,
          title: q.title,
          optionA: {
            text: q.option_a,
            count: aCount,
            percentage: aPercent,
          },
          optionB: {
            text: q.option_b,
            count: bCount,
            percentage: 100 - aPercent,
          },
        };
      })
    );
    
    return Response.json({
      success: true,
      data: { responses },
    });
    
  } catch (error) {
    console.error('모임 응답 조회 오류:', error);
    return Response.json(
      { success: false, error: '응답 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};

// 특정 질문의 선택지별 멤버 목록 조회
async function getQuestionMembers(env: Env, groupId: string, questionId: string) {
  // 질문 정보 조회
  const question = await env.DB.prepare(`
    SELECT id, title, option_a, option_b FROM question WHERE id = ? AND deleted_at IS NULL
  `).bind(questionId).first();
  
  if (!question) {
    return Response.json(
      { success: false, error: '질문을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
  
  // 각 선택지별 멤버 조회 (익명 별명 설정 포함)
  const members = await env.DB.prepare(`
    SELECT u.id, u.display_name, u.custom_nickname, u.use_nickname, r.selected_option
    FROM response r
    INNER JOIN user u ON r.user_id = u.id
    INNER JOIN group_member gm ON r.user_id = gm.user_id
    WHERE r.question_id = ?
      AND gm.group_id = ?
      AND gm.left_at IS NULL
    ORDER BY r.created_at DESC
  `).bind(questionId, groupId).all();
  
  const optionAMembers: { id: string; displayName: string }[] = [];
  const optionBMembers: { id: string; displayName: string }[] = [];
  
  for (const member of members.results || []) {
    const m = member as any;
    // 표시 이름 결정 (익명 별명 사용 시 별명, 아니면 구글 계정명)
    const displayName = m.use_nickname && m.custom_nickname
      ? m.custom_nickname
      : m.display_name;
    const memberData = { id: m.id, displayName };
    if (m.selected_option === 'A') {
      optionAMembers.push(memberData);
    } else if (m.selected_option === 'B') {
      optionBMembers.push(memberData);
    }
  }
  
  return Response.json({
    success: true,
    data: {
      question: {
        id: (question as any).id,
        title: (question as any).title,
        optionA: (question as any).option_a,
        optionB: (question as any).option_b,
      },
      optionAMembers,
      optionBMembers,
    },
  });
}
