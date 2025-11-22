import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { question, questionTag, tag, response } from '@/lib/db/schema';
import { eq, isNull, and, inArray, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * GET /api/questions/random
 * 
 * 랜덤 밸런스 질문을 가져옵니다.
 * 
 * ## Query Parameters
 * - tags: 태그 ID 또는 이름 (쉼표로 구분, 선택사항)
 * 
 * ## 로직
 * 1. deletedAt이 NULL인 질문만 가져오기
 * 2. 로그인 사용자: 이미 응답한 질문 제외
 * 3. tags 파라미터가 있으면 해당 태그를 가진 질문만 필터링
 * 4. 랜덤으로 1개 선택
 * 5. 질문과 함께 태그 정보 반환
 * 
 * ## 응답 예시
 * ```json
 * {
 *   "id": "abc123",
 *   "title": "더 맛있는 진라면은?",
 *   "optionA": "매운맛",
 *   "optionB": "순한맛",
 *   "tags": [
 *     { "id": "tag1", "name": "음식" }
 *   ]
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tagFilter = searchParams.get('tags');

    // 현재 로그인한 사용자 확인
    const currentUser = await getCurrentUser();

    // 1. 삭제되지 않은 질문 필터 조건
    let conditions = [isNull(question.deletedAt)];

    // 2. 로그인 사용자: 이미 응답한 질문 제외
    let excludedQuestionIds: string[] = [];
    if(currentUser) {
      const userResponses = await db
        .select({ questionId: response.questionId })
        .from(response)
        .where(eq(response.userId, currentUser.id));
      
      excludedQuestionIds = userResponses.map((r) => r.questionId);
    }

    // 3. 태그 필터 적용
    let eligibleQuestionIds: string[] | null = null;
    if(tagFilter) {
      const tagNames = tagFilter.split(',').map((t) => t.trim());
      
      // 태그 이름으로 태그 ID 찾기
      const tags = await db
        .select()
        .from(tag)
        .where(inArray(tag.name, tagNames));
      
      if(tags.length === 0) {
        return NextResponse.json(
          { error: '해당 태그를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      const tagIds = tags.map((t) => t.id);

      // 해당 태그를 가진 질문 ID 찾기
      const questionsWithTags = await db
        .select({ questionId: questionTag.questionId })
        .from(questionTag)
        .where(inArray(questionTag.tagId, tagIds));
      
      eligibleQuestionIds = questionsWithTags.map((qt) => qt.questionId);

      if(eligibleQuestionIds.length === 0) {
        return NextResponse.json(
          { error: '해당 태그의 질문이 없습니다.' },
          { status: 404 }
        );
      }
    }

    // 4. 질문 가져오기
    let query = db.select().from(question);

    // 조건 적용
    const finalConditions = [];
    
    // 삭제되지 않은 질문
    finalConditions.push(isNull(question.deletedAt));
    
    // 이미 응답한 질문 제외
    if(excludedQuestionIds.length > 0) {
      finalConditions.push(sql`${question.id} NOT IN ${excludedQuestionIds}`);
    }
    
    // 태그 필터
    if(eligibleQuestionIds !== null) {
      finalConditions.push(inArray(question.id, eligibleQuestionIds));
    }

    const questions = await query.where(and(...finalConditions));

    if(questions.length === 0) {
      return NextResponse.json(
        { error: '더 이상 응답할 질문이 없습니다.' },
        { status: 404 }
      );
    }

    // 5. 랜덤으로 1개 선택
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];

    // 6. 질문의 태그 정보 가져오기
    const questionTags = await db
      .select({
        id: tag.id,
        name: tag.name,
      })
      .from(questionTag)
      .innerJoin(tag, eq(questionTag.tagId, tag.id))
      .where(eq(questionTag.questionId, randomQuestion.id));

    // 7. 응답 반환
    return NextResponse.json({
      id: randomQuestion.id,
      title: randomQuestion.title,
      optionA: randomQuestion.optionA,
      optionB: randomQuestion.optionB,
      visibility: randomQuestion.visibility,
      tags: questionTags,
    });
  } catch(error) {
    console.error('랜덤 질문 가져오기 오류:', error);
    return NextResponse.json(
      { error: '질문을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

