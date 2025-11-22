import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groupMember, response, user as userTable } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

export const runtime = 'edge';

/**
 * GET /api/groups/[groupId]/similarity
 * 
 * 현재 사용자와 모임 내 다른 사용자들의 취향 유사도를 계산합니다.
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 모임 멤버 확인
 * 3. 현재 사용자의 응답 목록 조회
 * 4. 각 멤버와의 공통 응답 비교
 * 5. 일치율 계산 = (동일한 선택 수 / 공통 질문 수) * 100
 * 6. 최소 5개 공통 질문 필요
 * 7. 일치율 높은 순으로 정렬
 * 
 * ## 응답 예시
 * ```json
 * {
 *   "similarities": [
 *     {
 *       "userId": "user2",
 *       "userName": "홍길동",
 *       "matchPercentage": 85.5,
 *       "commonQuestions": 20,
 *       "matchedAnswers": 17
 *     }
 *   ]
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
  try {
    const { groupId } = await context.params;

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

    // 3. 현재 사용자의 모든 응답 조회
    const myResponses = await db
      .select({
        questionId: response.questionId,
        selectedOption: response.selectedOption,
      })
      .from(response)
      .where(eq(response.userId, currentUser.id));

    if(myResponses.length === 0) {
      return NextResponse.json({
        similarities: [],
        message: '아직 응답한 질문이 없습니다.',
      });
    }

    // 4. 모임의 다른 멤버들 조회 (활성 사용자만, 본인 제외)
    const otherMembers = await db
      .select({
        userId: groupMember.userId,
        userName: userTable.displayName,
        customNickname: userTable.customNickname,
        useNickname: userTable.useNickname,
      })
      .from(groupMember)
      .innerJoin(userTable, eq(groupMember.userId, userTable.id))
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(userTable.status, 1) // 활성 사용자만
        )
      );

    // 5. 각 멤버와의 유사도 계산
    const similarities = [];

    for(const member of otherMembers) {
      // 본인 제외
      if(member.userId === currentUser.id) continue;

      // 해당 멤버의 응답 조회
      const memberResponses = await db
        .select({
          questionId: response.questionId,
          selectedOption: response.selectedOption,
        })
        .from(response)
        .where(eq(response.userId, member.userId));

      // 공통 질문 찾기
      const myResponseMap = new Map(
        myResponses.map(r => [r.questionId, r.selectedOption])
      );

      let commonQuestions = 0;
      let matchedAnswers = 0;

      for(const memberResponse of memberResponses) {
        const myAnswer = myResponseMap.get(memberResponse.questionId);
        
        if(myAnswer !== undefined) {
          commonQuestions++;
          if(myAnswer === memberResponse.selectedOption) {
            matchedAnswers++;
          }
        }
      }

      // 최소 5개 공통 질문이 있어야 유사도 계산
      if(commonQuestions >= 5) {
        const matchPercentage = Math.round((matchedAnswers / commonQuestions) * 100 * 10) / 10;

        similarities.push({
          userId: member.userId,
          userName: member.useNickname ? member.customNickname : member.userName,
          matchPercentage,
          commonQuestions,
          matchedAnswers,
        });
      }
    }

    // 6. 일치율 높은 순으로 정렬
    similarities.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // 7. 응답 반환
    return NextResponse.json({
      similarities,
      myResponsesCount: myResponses.length,
    });
  } catch(error) {
    console.error('취향 유사도 계산 오류:', error);
    return NextResponse.json(
      { error: '유사도를 계산하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

