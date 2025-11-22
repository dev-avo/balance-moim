import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { response, question } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';
import { generateId } from '@/lib/utils';
import { z } from 'zod';

/**
 * POST /api/responses
 * 
 * 밸런스 질문에 대한 응답을 제출합니다.
 * 
 * ## Request Body
 * ```json
 * {
 *   "questionId": "abc123",
 *   "selectedOption": "A" // "A" or "B"
 * }
 * ```
 * 
 * ## 로직
 * 1. 로그인 여부 확인 (비로그인도 허용)
 * 2. 질문 존재 확인
 * 3. 중복 응답 확인 (로그인 사용자만)
 * 4. 응답 저장
 * 
 * ## 응답
 * - 201: 응답 저장 성공
 * - 400: 잘못된 요청 (이미 응답한 질문 등)
 * - 404: 질문을 찾을 수 없음
 * - 500: 서버 오류
 */

const ResponseSchema = z.object({
  questionId: z.string().min(1, '질문 ID는 필수입니다.'),
  selectedOption: z.enum(['A', 'B'], {
    errorMap: () => ({ message: '선택지는 A 또는 B여야 합니다.' }),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // 1. 요청 본문 파싱 및 검증
    const body = await request.json();
    const validation = ResponseSchema.safeParse(body);

    if(!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { questionId, selectedOption } = validation.data;

    // 2. 현재 사용자 확인 (비로그인 허용)
    const currentUser = await getCurrentUser();

    // 3. 질문 존재 확인
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

    // 4. 중복 응답 확인 (로그인 사용자만)
    if(currentUser) {
      const existingResponse = await db
        .select()
        .from(response)
        .where(
          and(
            eq(response.questionId, questionId),
            eq(response.userId, currentUser.id)
          )
        )
        .limit(1);

      if(existingResponse.length > 0) {
        return NextResponse.json(
          { error: '이미 응답한 질문입니다. 답변은 수정할 수 없습니다.' },
          { status: 400 }
        );
      }
    }

    // 5. 응답 저장
    const newResponse = {
      id: generateId(),
      questionId,
      userId: currentUser?.id || null, // 비로그인 시 NULL
      selectedOption,
    };

    await db.insert(response).values(newResponse);

    // 6. 성공 응답
    return NextResponse.json(
      {
        message: '응답이 저장되었습니다.',
        response: {
          id: newResponse.id,
          questionId: newResponse.questionId,
          selectedOption: newResponse.selectedOption,
        },
      },
      { status: 201 }
    );
  } catch(error) {
    console.error('응답 저장 오류:', error);
    return NextResponse.json(
      { error: '응답을 저장하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/responses
 * 
 * 현재 사용자의 응답 목록을 가져옵니다.
 * (향후 구현 예정)
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자의 모든 응답 가져오기
    const userResponses = await db
      .select({
        id: response.id,
        questionId: response.questionId,
        selectedOption: response.selectedOption,
        createdAt: response.createdAt,
        questionTitle: question.title,
        optionA: question.optionA,
        optionB: question.optionB,
      })
      .from(response)
      .innerJoin(question, eq(response.questionId, question.id))
      .where(eq(response.userId, currentUser.id))
      .orderBy(response.createdAt);

    return NextResponse.json({
      responses: userResponses,
      total: userResponses.length,
    });
  } catch(error) {
    console.error('응답 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '응답 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

