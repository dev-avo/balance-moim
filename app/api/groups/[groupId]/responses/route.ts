import { NextRequest, NextResponse } from 'next/server';
import { db, setDb } from '@/lib/db';
import { groupMember, response, question, user as userTable, questionTag, tag } from '@/lib/db/schema';
import { eq, and, isNull, inArray, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

export const runtime = 'edge';

/**
 * GET /api/groups/[groupId]/responses?tag=음식
 * 
 * 모임 멤버들의 응답 통계를 조회합니다.
 * 
 * ## 쿼리 파라미터
 * - tag (optional): 특정 태그로 필터링
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 모임 멤버 확인
 * 3. 태그 필터 처리
 * 4. 모임 멤버들의 응답 집계
 * 5. 질문별 선택 비율 계산
 * 
 * ## 응답 예시
 * ```json
 * {
 *   "questions": [
 *     {
 *       "questionId": "q1",
 *       "title": "더 맛있는 진라면은?",
 *       "optionA": "매운맛",
 *       "optionB": "순한맛",
 *       "totalResponses": 10,
 *       "optionACount": 7,
 *       "optionBCount": 3,
 *       "optionAPercentage": 70,
 *       "optionBPercentage": 30,
 *       "tags": ["음식", "라면"]
 *     }
 *   ],
 *   "totalMembers": 15
 * }
 * ```
 */

interface RouteContext {
  params: Promise<{ groupId: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  // Cloudflare Pages 환경: D1 데이터베이스 설정
  if((request as any).env?.DB) {
    setDb((request as any).env.DB);
  }
  try {
    const { groupId } = await context.params;
    const { searchParams } = new URL(request.url);
    const tagFilter = searchParams.get('tag');

    // 1. 로그인 확인
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 모임 멤버 확인
    const membership = await db
      .select()
      .from(groupMember)
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(groupMember.userId, currentUser.id)
        )
      )
      .limit(1);

    if(membership.length === 0) {
      return NextResponse.json(
        { error: '모임 멤버만 조회할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 3. 모임의 모든 멤버 조회
    const members = await db
      .select({
        userId: groupMember.userId,
      })
      .from(groupMember)
      .where(eq(groupMember.groupId, groupId));

    const memberIds = members.map(m => m.userId);

    if(memberIds.length === 0) {
      return NextResponse.json({
        questions: [],
        totalMembers: 0,
      });
    }

    // 4. 태그 필터가 있는 경우 해당 태그의 질문 ID 조회
    let filteredQuestionIds: string[] | null = null;

    if(tagFilter) {
      const tagData = await db
        .select({ id: tag.id })
        .from(tag)
        .where(eq(tag.name, tagFilter))
        .limit(1);

      if(tagData.length > 0) {
        const questionTagData = await db
          .select({ questionId: questionTag.questionId })
          .from(questionTag)
          .where(eq(questionTag.tagId, tagData[0].id));

        filteredQuestionIds = questionTagData.map(qt => qt.questionId);
      } else {
        // 해당 태그가 없으면 빈 배열
        filteredQuestionIds = [];
      }
    }

    // 5. 모임 멤버들의 응답 조회
    // 태그 필터 적용
    if(filteredQuestionIds !== null && filteredQuestionIds.length === 0) {
      // 태그가 없으면 빈 결과
      return NextResponse.json({
        questions: [],
        totalMembers: memberIds.length,
        tagFilter,
      });
    }

    // where 조건 구성
    const whereConditions = [inArray(response.userId, memberIds)];
    if(filteredQuestionIds !== null && filteredQuestionIds.length > 0) {
      whereConditions.push(inArray(response.questionId, filteredQuestionIds));
    }

    const responses = await db
      .select({
        questionId: response.questionId,
        selectedOption: response.selectedOption,
      })
      .from(response)
      .where(and(...whereConditions));

    // 6. 질문별 응답 집계
    const questionStats = new Map<string, { A: number; B: number }>();

    for(const r of responses) {
      if(!questionStats.has(r.questionId)) {
        questionStats.set(r.questionId, { A: 0, B: 0 });
      }
      const stats = questionStats.get(r.questionId)!;
      if(r.selectedOption === 'A') {
        stats.A++;
      } else {
        stats.B++;
      }
    }

    if(questionStats.size === 0) {
      return NextResponse.json({
        questions: [],
        totalMembers: memberIds.length,
        tagFilter,
      });
    }

    // 7. 질문 정보 조회
    const questionIds = Array.from(questionStats.keys());
    const questions = await db
      .select({
        id: question.id,
        title: question.title,
        optionA: question.optionA,
        optionB: question.optionB,
      })
      .from(question)
      .where(
        and(
          inArray(question.id, questionIds),
          isNull(question.deletedAt)
        )
      );

    // 8. 각 질문의 태그 조회
    const questionTagsData = await db
      .select({
        questionId: questionTag.questionId,
        tagName: tag.name,
      })
      .from(questionTag)
      .innerJoin(tag, eq(questionTag.tagId, tag.id))
      .where(inArray(questionTag.questionId, questionIds));

    // 태그를 질문별로 그룹화
    const tagsByQuestion = new Map<string, string[]>();
    for(const qt of questionTagsData) {
      if(!tagsByQuestion.has(qt.questionId)) {
        tagsByQuestion.set(qt.questionId, []);
      }
      tagsByQuestion.get(qt.questionId)!.push(qt.tagName);
    }

    // 9. 결과 생성
    const result = questions.map(q => {
      const stats = questionStats.get(q.id) || { A: 0, B: 0 };
      const total = stats.A + stats.B;
      const optionAPercentage = total > 0 ? Math.round((stats.A / total) * 100) : 0;
      const optionBPercentage = total > 0 ? Math.round((stats.B / total) * 100) : 0;

      return {
        questionId: q.id,
        title: q.title,
        optionA: q.optionA,
        optionB: q.optionB,
        totalResponses: total,
        optionACount: stats.A,
        optionBCount: stats.B,
        optionAPercentage,
        optionBPercentage,
        tags: tagsByQuestion.get(q.id) || [],
      };
    });

    // 응답 수가 많은 순으로 정렬
    result.sort((a, b) => b.totalResponses - a.totalResponses);

    return NextResponse.json({
      questions: result,
      totalMembers: memberIds.length,
      tagFilter,
    });
  } catch(error) {
    console.error('모임 응답 조회 오류:', error);
    return NextResponse.json(
      { error: '응답을 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

