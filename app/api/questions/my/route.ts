import { NextRequest, NextResponse } from 'next/server';
import { db, setDb } from '@/lib/db';
import { question, questionTag, tag, response } from '@/lib/db/schema';
import { eq, isNull, and, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

export const runtime = 'edge';

/**
 * GET /api/questions/my
 * 
 * 현재 로그인한 사용자가 만든 질문 목록을 가져옵니다.
 * 
 * ## Query Parameters
 * - page: 페이지 번호 (기본값: 1)
 * - limit: 페이지당 항목 수 (기본값: 20, 최대: 100)
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. creatorId = 현재 사용자 조건
 * 3. deletedAt IS NULL 조건
 * 4. 페이지네이션 적용 (LIMIT, OFFSET)
 * 5. 각 질문의 태그 정보 포함
 * 6. 각 질문의 응답 통계 포함
 * 7. 최신순 정렬
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
  // Cloudflare Pages 환경: D1 데이터베이스 설정
  if((request as any).env?.DB) {
    setDb((request as any).env.DB);
  }
  try {
    // 1. 로그인 확인
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 페이지네이션 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    // 3. 전체 질문 수 조회 (페이지네이션 메타데이터용)
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(question)
      .where(
        and(
          eq(question.creatorId, currentUser.id),
          isNull(question.deletedAt)
        )
      );
    
    const totalCount = Number(totalCountResult[0]?.count || 0);
    const totalPages = Math.ceil(totalCount / limit);

    // 4. 사용자가 만든 질문 가져오기 (페이지네이션 적용)
    const myQuestions = await db
      .select()
      .from(question)
      .where(
        and(
          eq(question.creatorId, currentUser.id),
          isNull(question.deletedAt)
        )
      )
      .orderBy(question.createdAt)
      .limit(limit)
      .offset(offset);

    // 5. 각 질문에 대한 태그와 통계 정보 추가
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

    // 5. 응답 반환 (페이지네이션 메타데이터 포함)
    return NextResponse.json({
      questions: questionsWithDetails,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch(error) {
    console.error('내 질문 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '질문 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

