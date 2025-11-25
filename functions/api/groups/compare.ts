// 사용자 비교 API
// GET /api/groups/compare?groupId=xxx&userId=xxx

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
    const groupId = url.searchParams.get('groupId');
    const targetUserId = url.searchParams.get('userId');
    
    if (!groupId || !targetUserId) {
      return Response.json(
        { success: false, error: '모임 ID와 사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 두 사용자 모두 해당 모임 멤버인지 확인
    const myMembership = await env.DB.prepare(`
      SELECT id FROM group_member
      WHERE group_id = ? AND user_id = ? AND left_at IS NULL
    `).bind(groupId, session.userId).first();
    
    if (!myMembership) {
      return Response.json(
        { success: false, error: '해당 모임에 속해있지 않습니다.' },
        { status: 403 }
      );
    }
    
    const targetMembership = await env.DB.prepare(`
      SELECT id FROM group_member
      WHERE group_id = ? AND user_id = ? AND left_at IS NULL
    `).bind(groupId, targetUserId).first();
    
    if (!targetMembership) {
      return Response.json(
        { success: false, error: '상대방이 해당 모임 멤버가 아닙니다.' },
        { status: 404 }
      );
    }
    
    // 대상 사용자 정보
    const targetUser = await env.DB.prepare(`
      SELECT id, display_name, custom_nickname, use_nickname, profile_url
      FROM user WHERE id = ?
    `).bind(targetUserId).first();
    
    if (!targetUser) {
      return Response.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const target = targetUser as any;
    const targetDisplayName = target.use_nickname && target.custom_nickname
      ? target.custom_nickname
      : target.display_name;
    
    // 내 응답 목록
    const myResponses = await env.DB.prepare(`
      SELECT r.question_id, r.selected_option, q.title, q.option_a, q.option_b
      FROM response r
      INNER JOIN question q ON r.question_id = q.id
      WHERE r.user_id = ? AND q.deleted_at IS NULL
    `).bind(session.userId).all();
    
    const myAnswers = new Map<string, any>();
    for (const r of myResponses.results || []) {
      const resp = r as any;
      myAnswers.set(resp.question_id, {
        selectedOption: resp.selected_option,
        title: resp.title,
        optionA: resp.option_a,
        optionB: resp.option_b,
      });
    }
    
    // 대상 사용자 응답 목록
    const targetResponses = await env.DB.prepare(`
      SELECT r.question_id, r.selected_option, q.title, q.option_a, q.option_b
      FROM response r
      INNER JOIN question q ON r.question_id = q.id
      WHERE r.user_id = ? AND q.deleted_at IS NULL
    `).bind(targetUserId).all();
    
    // 공통 질문 비교
    const comparisons: any[] = [];
    let matchCount = 0;
    
    for (const r of targetResponses.results || []) {
      const resp = r as any;
      const myAnswer = myAnswers.get(resp.question_id);
      
      if (myAnswer) {
        const isMatch = myAnswer.selectedOption === resp.selected_option;
        if (isMatch) matchCount++;
        
        comparisons.push({
          questionId: resp.question_id,
          title: resp.title,
          optionA: resp.option_a,
          optionB: resp.option_b,
          myChoice: myAnswer.selectedOption,
          theirChoice: resp.selected_option,
          isMatch,
        });
      }
    }
    
    const commonCount = comparisons.length;
    const matchRate = commonCount > 0 ? Math.round((matchCount / commonCount) * 100) : 0;
    
    // 일치 여부로 정렬 (일치하는 것 먼저)
    comparisons.sort((a, b) => {
      if (a.isMatch !== b.isMatch) return a.isMatch ? -1 : 1;
      return 0;
    });
    
    return Response.json({
      success: true,
      data: {
        targetUser: {
          id: target.id,
          displayName: targetDisplayName,
          profileUrl: target.profile_url,
        },
        summary: {
          matchCount,
          commonCount,
          matchRate,
        },
        comparisons,
      },
    });
    
  } catch (error) {
    console.error('사용자 비교 오류:', error);
    return Response.json(
      { success: false, error: '비교 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};
