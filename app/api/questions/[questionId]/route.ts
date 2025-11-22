import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { question, questionTag, tag } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';
import { sql } from 'drizzle-orm';
import { generateId } from '@/lib/utils';
import { z } from 'zod';

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
 * 특정 질문의 상세 정보를 가져옵니다 (태그 포함).
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

    // 태그 정보 가져오기
    const questionTags = await db
      .select({
        id: tag.id,
        name: tag.name,
      })
      .from(questionTag)
      .innerJoin(tag, eq(questionTag.tagId, tag.id))
      .where(eq(questionTag.questionId, questionId));

    return NextResponse.json({
      question: {
        ...questionData[0],
        tags: questionTags,
      },
    });
  } catch(error) {
    console.error('질문 조회 오류:', error);
    return NextResponse.json(
      { error: '질문을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/questions/[questionId]
 * 
 * 질문을 수정합니다.
 * 
 * ## Request Body
 * ```json
 * {
 *   "title": "수정된 질문 제목",
 *   "optionA": "수정된 선택지 A",
 *   "optionB": "수정된 선택지 B",
 *   "tags": ["태그1", "태그2"],
 *   "visibility": "public"
 * }
 * ```
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 질문 존재 확인
 * 3. 생성자 확인 (본인만 수정 가능)
 * 4. 질문 정보 업데이트
 * 5. 태그 업데이트 (기존 태그 삭제 후 새로 추가)
 * 
 * ## 응답
 * - 200: 수정 성공
 * - 401: 로그인 필요
 * - 403: 권한 없음
 * - 404: 질문을 찾을 수 없음
 * - 500: 서버 오류
 */

const UpdateQuestionSchema = z.object({
  title: z
    .string()
    .min(1, '질문 제목은 필수입니다.')
    .max(100, '질문 제목은 최대 100자까지 가능합니다.')
    .optional(),
  optionA: z
    .string()
    .min(1, '선택지 A는 필수입니다.')
    .max(50, '선택지 A는 최대 50자까지 가능합니다.')
    .optional(),
  optionB: z
    .string()
    .min(1, '선택지 B는 필수입니다.')
    .max(50, '선택지 B는 최대 50자까지 가능합니다.')
    .optional(),
  tags: z
    .array(z.string())
    .min(1, '최소 1개 이상의 태그를 추가해주세요.')
    .max(5, '최대 5개까지 태그를 추가할 수 있습니다.')
    .optional(),
  visibility: z.enum(['public', 'group', 'private']).optional(),
});

export async function PATCH(
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

    // 2. 요청 본문 파싱 및 검증
    const body = await request.json();
    const validation = UpdateQuestionSchema.safeParse(body);

    if(!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const updateData = validation.data;

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

    // 4. 생성자 확인
    if(existingQuestion[0].creatorId !== currentUser.id) {
      return NextResponse.json(
        { error: '본인이 만든 질문만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 5. 질문 정보 업데이트
    const updateFields: any = {
      updatedAt: sql`(unixepoch())`,
    };

    if(updateData.title !== undefined) updateFields.title = updateData.title;
    if(updateData.optionA !== undefined) updateFields.optionA = updateData.optionA;
    if(updateData.optionB !== undefined) updateFields.optionB = updateData.optionB;
    if(updateData.visibility !== undefined) updateFields.visibility = updateData.visibility;

    await db
      .update(question)
      .set(updateFields)
      .where(eq(question.id, questionId));

    // 6. 태그 업데이트
    if(updateData.tags !== undefined) {
      // 기존 태그 연결 삭제
      await db
        .delete(questionTag)
        .where(eq(questionTag.questionId, questionId));

      // 새 태그 처리
      const tagIds: string[] = [];

      for(const tagName of updateData.tags) {
        // 기존 태그 확인
        let existingTag = await db
          .select()
          .from(tag)
          .where(eq(tag.name, tagName))
          .limit(1);

        if(existingTag.length > 0) {
          tagIds.push(existingTag[0].id);
        } else {
          // 새 태그 생성
          const newTag = {
            id: generateId(),
            name: tagName,
          };
          await db.insert(tag).values(newTag);
          tagIds.push(newTag.id);
        }
      }

      // 새 태그 연결
      const questionTagValues = tagIds.map((tagId) => ({
        questionId,
        tagId,
      }));

      await db.insert(questionTag).values(questionTagValues);
    }

    // 7. 성공 응답
    return NextResponse.json({
      message: '질문이 수정되었습니다.',
    });
  } catch(error) {
    console.error('질문 수정 오류:', error);
    return NextResponse.json(
      { error: '질문을 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

