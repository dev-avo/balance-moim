// 랜덤 질문 API
// GET /api/questions/random?tags=음식,라면
// GET /api/questions/random?groupId=xxx (모임 전용 질문만)

import { getSession } from '../../../lib/auth/session';

interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  try {
    // 파라미터 파싱
    const url = new URL(request.url);
    const tagsParam = url.searchParams.get('tags');
    const groupId = url.searchParams.get('groupId');
    const tags = tagsParam ? tagsParam.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    // 세션 확인 (선택적)
    const session = await getSession(request, env.JWT_SECRET);
    const userId = session?.userId || null;
    
    let query: string;
    const params: (string | number | null)[] = [];
    
    // 모임 전용 질문 필터링
    if (groupId) {
      // 모임 전용 모드: 해당 모임의 질문만
      if (!userId) {
        return Response.json(
          { success: false, error: '로그인이 필요합니다.' },
          { status: 401 }
        );
      }
      
      // 멤버 확인
      const membership = await env.DB.prepare(`
        SELECT group_id FROM group_member
        WHERE group_id = ? AND user_id = ? AND left_at IS NULL
      `).bind(groupId, userId).first();
      
      if (!membership) {
        return Response.json(
          { success: false, error: '해당 모임에 속해있지 않습니다.' },
          { status: 403 }
        );
      }
      
      query = `
        SELECT q.id, q.title, q.option_a, q.option_b, q.visibility, q.group_id, q.created_at
        FROM question q
        WHERE q.deleted_at IS NULL
          AND q.group_id = ?
          AND q.id NOT IN (
            SELECT question_id FROM response WHERE user_id = ?
          )
        ORDER BY RANDOM()
        LIMIT 1
      `;
      params.push(groupId, userId);
    } else if (tags.length > 0) {
      // 태그 필터가 있는 경우
      const tagPlaceholders = tags.map(() => '?').join(',');
      
      if (userId) {
        // 로그인 사용자: 이미 응답한 질문 제외
        query = `
          SELECT DISTINCT q.id, q.title, q.option_a, q.option_b, q.visibility, q.group_id, q.created_at
          FROM question q
          INNER JOIN question_tag qt ON q.id = qt.question_id
          INNER JOIN tag t ON qt.tag_id = t.id
          WHERE q.deleted_at IS NULL
            AND t.name IN (${tagPlaceholders})
            AND (q.visibility = 'public' 
                 OR (q.visibility = 'group' AND q.group_id IN (
                   SELECT group_id FROM group_member WHERE user_id = ? AND left_at IS NULL
                 ))
                 OR q.creator_id = ?)
            AND q.id NOT IN (
              SELECT question_id FROM response WHERE user_id = ?
            )
          ORDER BY RANDOM()
          LIMIT 1
        `;
        params.push(...tags, userId, userId, userId);
      } else {
        // 비로그인: 공개 질문만
        query = `
          SELECT DISTINCT q.id, q.title, q.option_a, q.option_b, q.visibility, q.created_at
          FROM question q
          INNER JOIN question_tag qt ON q.id = qt.question_id
          INNER JOIN tag t ON qt.tag_id = t.id
          WHERE q.deleted_at IS NULL
            AND t.name IN (${tagPlaceholders})
            AND q.visibility = 'public'
          ORDER BY RANDOM()
          LIMIT 1
        `;
        params.push(...tags);
      }
    } else {
      // 태그 필터 없음
      if (userId) {
        query = `
          SELECT q.id, q.title, q.option_a, q.option_b, q.visibility, q.group_id, q.created_at
          FROM question q
          WHERE q.deleted_at IS NULL
            AND (q.visibility = 'public' 
                 OR (q.visibility = 'group' AND q.group_id IN (
                   SELECT group_id FROM group_member WHERE user_id = ? AND left_at IS NULL
                 ))
                 OR q.creator_id = ?)
            AND q.id NOT IN (
              SELECT question_id FROM response WHERE user_id = ?
            )
          ORDER BY RANDOM()
          LIMIT 1
        `;
        params.push(userId, userId, userId);
      } else {
        query = `
          SELECT q.id, q.title, q.option_a, q.option_b, q.visibility, q.created_at
          FROM question q
          WHERE q.deleted_at IS NULL
            AND q.visibility = 'public'
          ORDER BY RANDOM()
          LIMIT 1
        `;
      }
    }
    
    const result = await env.DB.prepare(query).bind(...params).first();
    
    if (!result) {
      return Response.json({
        success: true,
        data: { question: null },
        message: '더 이상 답변할 질문이 없습니다.',
      });
    }
    
    // 태그 조회
    const tagsResult = await env.DB.prepare(`
      SELECT t.name
      FROM tag t
      INNER JOIN question_tag qt ON t.id = qt.tag_id
      WHERE qt.question_id = ?
    `).bind(result.id).all();
    
    const questionTags = tagsResult.results?.map((r: any) => r.name) || [];
    
    return Response.json({
      success: true,
      data: {
        question: {
          id: result.id,
          title: result.title,
          option_a: result.option_a,
          option_b: result.option_b,
          visibility: result.visibility,
          tags: questionTags,
        },
      },
    });
    
  } catch (error) {
    console.error('랜덤 질문 조회 오류:', error);
    return Response.json(
      { success: false, error: '질문을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
};
