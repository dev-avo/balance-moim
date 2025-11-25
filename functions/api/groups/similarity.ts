// 취향 유사도 API
// GET /api/groups/similarity?id=xxx

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
    
    if (!groupId) {
      return Response.json(
        { success: false, error: '모임 ID가 필요합니다.' },
        { status: 400 }
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
    
    // 모임 멤버 목록 (자신 제외)
    const members = await env.DB.prepare(`
      SELECT gm.user_id, u.display_name, u.custom_nickname, u.use_nickname
      FROM group_member gm
      INNER JOIN user u ON gm.user_id = u.id
      WHERE gm.group_id = ? AND gm.left_at IS NULL AND gm.user_id != ?
    `).bind(groupId, session.userId).all();
    
    if (!members.results || members.results.length === 0) {
      return Response.json({
        success: true,
        data: { similarities: [] },
      });
    }
    
    // 내 응답 목록
    const myResponses = await env.DB.prepare(`
      SELECT question_id, selected_option FROM response WHERE user_id = ?
    `).bind(session.userId).all();
    
    const myAnswers = new Map<string, string>();
    for (const r of myResponses.results || []) {
      myAnswers.set((r as any).question_id, (r as any).selected_option);
    }
    
    // 각 멤버와의 유사도 계산
    const similarities = await Promise.all(
      (members.results || []).map(async (member: any) => {
        // 멤버의 응답 목록
        const memberResponses = await env.DB.prepare(`
          SELECT question_id, selected_option FROM response WHERE user_id = ?
        `).bind(member.user_id).all();
        
        let matchCount = 0;
        let commonCount = 0;
        
        for (const r of memberResponses.results || []) {
          const resp = r as any;
          const myAnswer = myAnswers.get(resp.question_id);
          
          if (myAnswer !== undefined) {
            commonCount++;
            if (myAnswer === resp.selected_option) {
              matchCount++;
            }
          }
        }
        
        const matchRate = commonCount > 0 ? Math.round((matchCount / commonCount) * 100) : 0;
        const displayName = member.use_nickname && member.custom_nickname
          ? member.custom_nickname
          : member.display_name;
        
        return {
          userId: member.user_id,
          displayName,
          matchCount,
          commonCount,
          matchRate,
        };
      })
    );
    
    // 유사도 내림차순 정렬
    similarities.sort((a, b) => {
      if (b.matchRate !== a.matchRate) return b.matchRate - a.matchRate;
      return b.commonCount - a.commonCount;
    });
    
    return Response.json({
      success: true,
      data: { similarities },
    });
    
  } catch (error) {
    console.error('유사도 조회 오류:', error);
    return Response.json(
      { success: false, error: '유사도를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};
