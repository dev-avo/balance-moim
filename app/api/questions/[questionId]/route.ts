import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { question } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';
import { sql } from 'drizzle-orm';

/**
 * DELETE /api/questions/[questionId]
 * 
 * 질문을 삭제합니다 (Soft Delete).
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 질문 존재 확인
 * 3. 생성자 확인 (본인만 삭제 가능)
 * 4. deletedAt 업데이트 (Soft Delete)
 * 
 * ## 응답
 * - 200: 삭제 성공
 * - 401: 로그인 필요
 * - 403: 권한 없음
 * - 404: 질문을 찾을 수 없음
 * - 500: 서버 오류
 */

interface RouteContext {
  params: Promise<{ questionId: string }>;
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { questionId } = await context.params;

    // 1. 로그인 확인
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 질문 존재 확인
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

    // 3. 생성자 확인
    if(existingQuestion[0].creatorId !== currentUser.id) {
      return NextResponse.json(
        { error: '본인이 만든 질문만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 4. Soft Delete (deletedAt 업데이트)
    await db
      .update(question)
      .set({ deletedAt: sql`(unixepoch())` })
      .where(eq(question.id, questionId));

    // 5. 성공 응답
    return NextResponse.json({
      message: '질문이 삭제되었습니다.',
    });
  } catch(error) {
    console.error('질문 삭제 오류:', error);
    return NextResponse.json(
      { error: '질문을 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/questions/[questionId]
 * 
 * 특정 질문의 상세 정보를 가져옵니다.
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { questionId } = await context.params;

    // 질문 조회
    const questionData = await db
      .select()
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if(questionData.length === 0) {
      return NextResponse.json(
        { error: '질문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      question: questionData[0],
    });
  } catch(error) {
    console.error('질문 조회 오류:', error);
    return NextResponse.json(
      { error: '질문을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

