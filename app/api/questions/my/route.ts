import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { question, questionTag, tag, response } from '@/lib/db/schema';
import { eq, isNull, and, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * GET /api/questions/my
 * 
 * 현재 로그인한 사용자가 만든 질문 목록을 가져옵니다.
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. creatorId = 현재 사용자 조건
 * 3. deletedAt IS NULL 조건
 * 4. 각 질문의 태그 정보 포함
 * 5. 각 질문의 응답 통계 포함
 * 6. 최신순 정렬
 * 
 * ## 응답 예시
 * ```json
 * {
 *   "questions": [
 *     {
 *       "id": "abc123",
 *       "title": "더 맛있는 진라면은?",
 *       "optionA": "매운맛",
 *       "optionB": "순한맛",
 *       "visibility": "public",
 *       "createdAt": "2025-01-01T00:00:00Z",
 *       "tags": [
 *         { "id": "tag1", "name": "음식" }
 *       ],
 *       "stats": {
 *         "totalResponses": 100,
 *         "optionACount": 60,
 *         "optionBCount": 40
 *       }
 *     }
 *   ]
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    // 1. 로그인 확인
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 사용자가 만든 질문 가져오기
    const myQuestions = await db
      .select()
      .from(question)
      .where(
        and(
          eq(question.creatorId, currentUser.id),
          isNull(question.deletedAt)
        )
      )
      .orderBy(question.createdAt);

    // 3. 각 질문에 대한 태그와 통계 정보 추가
    const questionsWithDetails = await Promise.all(
      myQuestions.map(async (q) => {
        // 태그 정보 가져오기
        const questionTags = await db
          .select({
            id: tag.id,
            name: tag.name,
          })
          .from(questionTag)
          .innerJoin(tag, eq(questionTag.tagId, tag.id))
          .where(eq(questionTag.questionId, q.id));

        // 응답 통계 계산
        const responseStats = await db
          .select({
            selectedOption: response.selectedOption,
            count: sql<number>`count(*)`,
          })
          .from(response)
          .where(eq(response.questionId, q.id))
          .groupBy(response.selectedOption);

        const optionACount = responseStats.find((r) => r.selectedOption === 'A')?.count || 0;
        const optionBCount = responseStats.find((r) => r.selectedOption === 'B')?.count || 0;
        const totalResponses = optionACount + optionBCount;

        return {
          id: q.id,
          title: q.title,
          optionA: q.optionA,
          optionB: q.optionB,
          visibility: q.visibility,
          createdAt: q.createdAt,
          tags: questionTags,
          stats: {
            totalResponses,
            optionACount,
            optionBCount,
          },
        };
      })
    );

    // 4. 응답 반환
    return NextResponse.json({
      questions: questionsWithDetails,
      total: questionsWithDetails.length,
    });
  } catch(error) {
    console.error('내 질문 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '질문 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

