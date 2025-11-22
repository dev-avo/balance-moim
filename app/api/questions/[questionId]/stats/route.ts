import { NextRequest, NextResponse } from 'next/server';
import { db, setDb } from '@/lib/db';
import { response, question, groupMember, userGroup, user } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

export const runtime = 'edge';

// 통계는 실시간일 필요가 없으므로 5분 캐싱
export const revalidate = 300; // 5분 (초 단위)

/**
 * GET /api/questions/[questionId]/stats
 * 
 * 특정 질문의 통계를 가져옵니다.
 * 
 * ## 응답 데이터
 * ```json
 * {
 *   "questionId": "abc123",
 *   "totalResponses": 100,
 *   "optionACount": 60,
 *   "optionBCount": 40,
 *   "optionAPercentage": 60,
 *   "optionBPercentage": 40,
 *   "userSelection": "A", // 로그인 사용자가 선택한 옵션 (로그인 시)
 *   "groupStats": [
 *     {
 *       "groupId": "group1",
 *       "groupName": "회사 동료",
 *       "totalResponses": 10,
 *       "optionACount": 7,
 *       "optionBCount": 3,
 *       "optionAPercentage": 70,
 *       "optionBPercentage": 30
 *     }
 *   ]
 * }
 * ```
 */

interface RouteContext {
  params: Promise<{ questionId: string }>;
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
    const { questionId } = await context.params;

    // 1. 질문 존재 확인
    const existingQuestion = await db
      .select()
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if(existingQuestion.length === 0) {
      return NextResponse.json(
        { error: '질문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 2. 전체 통계 계산
    const allResponses = await db
      .select({
        selectedOption: response.selectedOption,
        count: sql<number>`count(*)`,
      })
      .from(response)
      .where(eq(response.questionId, questionId))
      .groupBy(response.selectedOption);

    const optionACount = allResponses.find((r) => r.selectedOption === 'A')?.count || 0;
    const optionBCount = allResponses.find((r) => r.selectedOption === 'B')?.count || 0;
    const totalResponses = optionACount + optionBCount;

    const optionAPercentage = totalResponses > 0 
      ? Math.round((optionACount / totalResponses) * 100) 
      : 0;
    const optionBPercentage = totalResponses > 0 
      ? Math.round((optionBCount / totalResponses) * 100) 
      : 0;

    // 3. 현재 사용자의 선택 확인
    const currentUser = await getCurrentUser();
    let userSelection: 'A' | 'B' | null = null;

    if(currentUser) {
      const userResponse = await db
        .select({ selectedOption: response.selectedOption })
        .from(response)
        .where(
          and(
            eq(response.questionId, questionId),
            eq(response.userId, currentUser.id)
          )
        )
        .limit(1);

      if(userResponse.length > 0) {
        userSelection = userResponse[0].selectedOption as 'A' | 'B';
      }
    }

    // 4. 모임별 통계 (로그인 사용자만)
    const groupStats = [];

    if(currentUser) {
      // 사용자가 속한 모임 목록 가져오기
      const userGroups = await db
        .select({
          groupId: groupMember.groupId,
          groupName: userGroup.name,
        })
        .from(groupMember)
        .innerJoin(userGroup, eq(groupMember.groupId, userGroup.id))
        .where(eq(groupMember.userId, currentUser.id));

      // 각 모임별 통계 계산
      for(const group of userGroups) {
        // 모임 멤버들의 응답 가져오기
        const groupResponses = await db
          .select({
            selectedOption: response.selectedOption,
            count: sql<number>`count(*)`,
          })
          .from(response)
          .innerJoin(groupMember, eq(response.userId, groupMember.userId))
          .where(
            and(
              eq(response.questionId, questionId),
              eq(groupMember.groupId, group.groupId)
            )
          )
          .groupBy(response.selectedOption);

        const groupOptionACount = groupResponses.find((r) => r.selectedOption === 'A')?.count || 0;
        const groupOptionBCount = groupResponses.find((r) => r.selectedOption === 'B')?.count || 0;
        const groupTotalResponses = groupOptionACount + groupOptionBCount;

        const groupOptionAPercentage = groupTotalResponses > 0
          ? Math.round((groupOptionACount / groupTotalResponses) * 100)
          : 0;
        const groupOptionBPercentage = groupTotalResponses > 0
          ? Math.round((groupOptionBCount / groupTotalResponses) * 100)
          : 0;

        groupStats.push({
          groupId: group.groupId,
          groupName: group.groupName,
          totalResponses: groupTotalResponses,
          optionACount: groupOptionACount,
          optionBCount: groupOptionBCount,
          optionAPercentage: groupOptionAPercentage,
          optionBPercentage: groupOptionBPercentage,
        });
      }
    }

    // 5. 응답 반환
    return NextResponse.json({
      questionId,
      totalResponses,
      optionACount,
      optionBCount,
      optionAPercentage,
      optionBPercentage,
      userSelection,
      groupStats,
    });
  } catch(error) {
    console.error('질문 통계 조회 오류:', error);
    return NextResponse.json(
      { error: '통계를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

