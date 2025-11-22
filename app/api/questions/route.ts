import { NextRequest, NextResponse } from 'next/server';
import { db, setDb } from '@/lib/db';
import { question, questionTag, tag } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';
import { generateId } from '@/lib/utils';
import { z } from 'zod';
import { sanitizeObject } from '@/lib/security/sanitize';

export const runtime = 'edge';
import { 
  questionTitleSchema, 
  optionSchema, 
  tagNameSchema, 
  visibilitySchema 
} from '@/lib/security/validation';

/**
 * POST /api/questions
 * 
 * 새로운 밸런스 질문을 등록합니다.
 * 
 * ## Request Body
 * ```json
 * {
 *   "title": "더 맛있는 진라면은?",
 *   "optionA": "매운맛",
 *   "optionB": "순한맛",
 *   "tags": ["음식", "라면"],
 *   "visibility": "public", // "public", "group", "private"
 *   "groupId": "group123" // visibility가 "group"일 때만 필수
 * }
 * ```
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 입력 데이터 검증
 * 3. 태그 생성 또는 기존 태그 찾기
 * 4. 질문 생성
 * 5. 질문-태그 연결
 * 
 * ## 응답
 * - 201: 질문 생성 성공
 * - 401: 로그인 필요
 * - 400: 잘못된 요청
 * - 500: 서버 오류
 */

const QuestionSchema = z.object({
  title: questionTitleSchema,
  optionA: optionSchema,
  optionB: optionSchema,
  tags: z
    .array(tagNameSchema)
    .min(1, '최소 1개 이상의 태그를 추가해주세요.')
    .max(5, '최대 5개까지 태그를 추가할 수 있습니다.'),
  visibility: visibilitySchema,
  groupId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Cloudflare Pages 환경: D1 데이터베이스 설정
    if((request as any).env?.DB) {
      setDb((request as any).env.DB);
    }
    
    // 1. 로그인 확인
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 요청 본문 파싱, Sanitize 및 검증
    const body = await request.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = QuestionSchema.safeParse(sanitizedBody);

    if(!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, optionA, optionB, tags, visibility, groupId } = validation.data;

    // 3. visibility가 "group"일 때 groupId 필수 확인
    if(visibility === 'group' && !groupId) {
      return NextResponse.json(
        { error: '모임 전용 질문은 모임을 선택해야 합니다.' },
        { status: 400 }
      );
    }

    // 4. 태그 처리: 기존 태그 찾기 또는 새 태그 생성
    const tagIds: string[] = [];

    for(const tagName of tags) {
      // 기존 태그 확인
      let existingTag = await db
        .select()
        .from(tag)
        .where(eq(tag.name, tagName))
        .limit(1);

      if(existingTag.length > 0) {
        // 기존 태그 사용
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

    // 5. 질문 생성
    const newQuestion = {
      id: generateId(),
      creatorId: currentUser.id,
      title,
      optionA,
      optionB,
      visibility,
      groupId: visibility === 'group' ? groupId : null,
    };

    await db.insert(question).values(newQuestion);

    // 6. 질문-태그 연결
    const questionTagValues = tagIds.map((tagId) => ({
      questionId: newQuestion.id,
      tagId,
    }));

    await db.insert(questionTag).values(questionTagValues);

    // 7. 성공 응답
    return NextResponse.json(
      {
        message: '질문이 등록되었습니다.',
        question: {
          id: newQuestion.id,
          title: newQuestion.title,
          optionA: newQuestion.optionA,
          optionB: newQuestion.optionB,
          visibility: newQuestion.visibility,
        },
      },
      { status: 201 }
    );
  } catch(error) {
    console.error('질문 등록 오류:', error);
    return NextResponse.json(
      { error: '질문을 등록하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/questions
 * 
 * 모든 공개 질문을 가져옵니다.
 * (향후 페이지네이션 추가 예정)
 */
export async function GET(request: NextRequest) {
  // Cloudflare Pages 환경: D1 데이터베이스 설정
  if((request as any).env?.DB) {
    setDb((request as any).env.DB);
  }
  try {
    const allQuestions = await db
      .select()
      .from(question)
      .where(eq(question.visibility, 'public'))
      .orderBy(question.createdAt)
      .limit(50);

    return NextResponse.json({
      questions: allQuestions,
      total: allQuestions.length,
    });
  } catch(error) {
    console.error('질문 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '질문 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

