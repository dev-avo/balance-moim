// 모임 응답 목록 API
// GET /api/groups/responses?id=xxx&tag=음식

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
