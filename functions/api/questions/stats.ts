// 질문 통계 API
// GET /api/questions/stats?id=xxx

import { getSession } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

interface StatsResult {
  total: {
    optionA: { count: number; percentage: number };
    optionB: { count: number; percentage: number };
    totalCount: number;
  };
  groups?: Array<{
    groupId: string;
    groupName: string;
    optionA: { count: number; percentage: number };
    optionB: { count: number; percentage: number };
  }>;
}

// 5분 캐싱 (비로그인 전체 통계)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const questionId = url.searchParams.get('id');
    
    if (!questionId) {
      return Response.json(
        { success: false, error: '질문 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 세션 확인 (모임별 통계는 로그인 사용자만 - 캐시 안 함)
    const session = await getSession(request, env.JWT_SECRET);
    
    // 비로그인 사용자는 캐시된 전체 통계 반환
    if (!session?.userId) {
      const cacheKey = new Request(new URL(`/api/questions/stats?id=${questionId}`, request.url).toString());
      const cache = caches.default;
      
      let cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
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
    
    // 전체 통계
    const totalStats = await env.DB.prepare(`
      SELECT 
        selected_option,
        COUNT(*) as count
      FROM response
      WHERE question_id = ?
      GROUP BY selected_option
    `).bind(questionId).all();
    
    let optionACount = 0;
    let optionBCount = 0;
    
    for (const row of totalStats.results || []) {
      if ((row as any).selected_option === 'A') {
        optionACount = (row as any).count;
      } else if ((row as any).selected_option === 'B') {
        optionBCount = (row as any).count;
      }
    }
    
    const totalCount = optionACount + optionBCount;
    const optionAPercent = totalCount > 0 ? Math.round((optionACount / totalCount) * 100) : 50;
    const optionBPercent = totalCount > 0 ? 100 - optionAPercent : 50;
    
    const result: StatsResult = {
      total: {
        optionA: { count: optionACount, percentage: optionAPercent },
        optionB: { count: optionBCount, percentage: optionBPercent },
        totalCount,
      },
    };
    
    // 로그인 사용자는 모임별 통계도 포함
    if (session?.userId) {
      // 사용자가 속한 모임 목록
      const userGroups = await env.DB.prepare(`
        SELECT gm.group_id, ug.name as group_name
        FROM group_member gm
        INNER JOIN user_group ug ON gm.group_id = ug.id
        WHERE gm.user_id = ? AND gm.left_at IS NULL
      `).bind(session.userId).all();
      
      if (userGroups.results && userGroups.results.length > 0) {
        const groupStats: StatsResult['groups'] = [];
        
        for (const group of userGroups.results) {
          const groupId = (group as any).group_id;
          const groupName = (group as any).group_name;
          
          // 해당 모임 멤버들의 응답 통계
          const stats = await env.DB.prepare(`
            SELECT 
              r.selected_option,
              COUNT(*) as count
            FROM response r
            INNER JOIN group_member gm ON r.user_id = gm.user_id
            WHERE r.question_id = ?
              AND gm.group_id = ?
              AND gm.left_at IS NULL
            GROUP BY r.selected_option
          `).bind(questionId, groupId).all();
          
          let groupACount = 0;
          let groupBCount = 0;
          
          for (const row of stats.results || []) {
            if ((row as any).selected_option === 'A') {
              groupACount = (row as any).count;
            } else if ((row as any).selected_option === 'B') {
              groupBCount = (row as any).count;
            }
          }
          
          const groupTotal = groupACount + groupBCount;
          
          if (groupTotal > 0) {
            const groupAPercent = Math.round((groupACount / groupTotal) * 100);
            
            groupStats.push({
              groupId,
              groupName,
              optionA: { count: groupACount, percentage: groupAPercent },
              optionB: { count: groupBCount, percentage: 100 - groupAPercent },
            });
          }
        }
        
        if (groupStats.length > 0) {
          result.groups = groupStats;
        }
      }
    }
    
    let response = Response.json({
      success: true,
      data: result,
    });
    
    // 비로그인 사용자의 전체 통계만 캐싱 (5분)
    if (!session?.userId) {
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=300');
      
      const cacheKey = new Request(new URL(`/api/questions/stats?id=${questionId}`, request.url).toString());
      const cache = caches.default;
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }
    
    return response;
    
  } catch (error) {
    console.error('통계 조회 오류:', error);
    return Response.json(
      { success: false, error: '통계를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};
