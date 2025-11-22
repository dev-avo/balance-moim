import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groupMember, response, question, user as userTable, questionTag, tag } from '@/lib/db/schema';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

export const runtime = 'edge';

/**
 * GET /api/groups/[groupId]/compare/[userId]
 * 
 * 현재 사용자와 지정된 사용자의 응답을 상세 비교합니다.
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 모임 멤버 확인 (양쪽 모두)
 * 3. 공통 응답 조회
 * 4. 질문별 선택 비교
 * 5. 일치 여부 표시
 * 
 * ## 응답 예시
 * ```json
 * {
 *   "comparison": {
 *     "targetUser": {
 *       "id": "user2",
 *       "name": "홍길동"
 *     },
 *     "matchPercentage": 85.5,
 *     "commonQuestions": 20,
 *     "matchedAnswers": 17,
 *     "questions": [
 *       {
 *         "questionId": "q1",
 *         "title": "더 맛있는 진라면은?",
 *         "optionA": "매운맛",
 *         "optionB": "순한맛",
 *         "myChoice": "A",
 *         "theirChoice": "A",
 *         "isMatch": true,
 *         "tags": ["음식", "라면"]
 *       }
 *     ]
 *   }
 * }
 * ```
 */

interface RouteContext {
  params: Promise<{ groupId: string; userId: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { groupId, userId: targetUserId } = await context.params;

    // 1. 로그인 확인
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 자신과 비교하는 경우
    if(currentUser.id === targetUserId) {
      return NextResponse.json(
        { error: '자신과는 비교할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 2. 모임 멤버 확인 (현재 사용자)
    const myMembership = await db
      .select()
      .from(groupMember)
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(groupMember.userId, currentUser.id)
        )
      )
      .limit(1);

    if(myMembership.length === 0) {
      return NextResponse.json(
        { error: '모임 멤버만 조회할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 3. 모임 멤버 확인 (대상 사용자)
    const targetMembership = await db
      .select()
      .from(groupMember)
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(groupMember.userId, targetUserId)
        )
      )
      .limit(1);

    if(targetMembership.length === 0) {
      return NextResponse.json(
        { error: '해당 사용자는 이 모임의 멤버가 아닙니다.' },
        { status: 404 }
      );
    }

    // 4. 대상 사용자 정보 조회
    const targetUserData = await db
      .select({
        id: userTable.id,
        displayName: userTable.displayName,
        customNickname: userTable.customNickname,
        useNickname: userTable.useNickname,
      })
      .from(userTable)
      .where(eq(userTable.id, targetUserId))
      .limit(1);

    if(targetUserData.length === 0) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const targetUser = targetUserData[0];

    // 5. 나의 응답 조회
    const myResponses = await db
      .select({
        questionId: response.questionId,
        selectedOption: response.selectedOption,
      })
      .from(response)
      .where(eq(response.userId, currentUser.id));

    // 6. 대상 사용자의 응답 조회
    const theirResponses = await db
      .select({
        questionId: response.questionId,
        selectedOption: response.selectedOption,
      })
      .from(response)
      .where(eq(response.userId, targetUserId));

    // 7. 공통 질문 찾기
    const myResponseMap = new Map(
      myResponses.map(r => [r.questionId, r.selectedOption])
    );
    const theirResponseMap = new Map(
      theirResponses.map(r => [r.questionId, r.selectedOption])
    );

    const commonQuestionIds: string[] = [];
    
    for(const [questionId] of myResponseMap) {
      if(theirResponseMap.has(questionId)) {
        commonQuestionIds.push(questionId);
      }
    }

    if(commonQuestionIds.length === 0) {
      return NextResponse.json({
        comparison: {
          targetUser: {
            id: targetUser.id,
            name: targetUser.useNickname ? targetUser.customNickname : targetUser.displayName,
          },
          matchPercentage: 0,
          commonQuestions: 0,
          matchedAnswers: 0,
          questions: [],
        },
        message: '공통으로 응답한 질문이 없습니다.',
      });
    }

    // 8. 공통 질문 정보 조회
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
          inArray(question.id, commonQuestionIds),
          isNull(question.deletedAt)
        )
      );

    // 9. 각 질문의 태그 조회
    const questionTagsData = await db
      .select({
        questionId: questionTag.questionId,
        tagName: tag.name,
      })
      .from(questionTag)
      .innerJoin(tag, eq(questionTag.tagId, tag.id))
      .where(inArray(questionTag.questionId, commonQuestionIds));

    // 태그를 질문별로 그룹화
    const tagsByQuestion = new Map<string, string[]>();
    for(const qt of questionTagsData) {
      if(!tagsByQuestion.has(qt.questionId)) {
        tagsByQuestion.set(qt.questionId, []);
      }
      tagsByQuestion.get(qt.questionId)!.push(qt.tagName);
    }

    // 10. 비교 데이터 생성
    let matchedAnswers = 0;
    const comparisonQuestions = questions.map(q => {
      const myChoice = myResponseMap.get(q.id);
      const theirChoice = theirResponseMap.get(q.id);
      const isMatch = myChoice === theirChoice;

      if(isMatch) matchedAnswers++;

      return {
        questionId: q.id,
        title: q.title,
        optionA: q.optionA,
        optionB: q.optionB,
        myChoice,
        theirChoice,
        isMatch,
        tags: tagsByQuestion.get(q.id) || [],
      };
    });

    // 일치율 계산
    const matchPercentage = Math.round((matchedAnswers / commonQuestionIds.length) * 100 * 10) / 10;

    return NextResponse.json({
      comparison: {
        targetUser: {
          id: targetUser.id,
          name: targetUser.useNickname ? targetUser.customNickname : targetUser.displayName,
        },
        matchPercentage,
        commonQuestions: commonQuestionIds.length,
        matchedAnswers,
        questions: comparisonQuestions,
      },
    });
  } catch(error) {
    console.error('응답 비교 오류:', error);
    return NextResponse.json(
      { error: '응답을 비교하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

