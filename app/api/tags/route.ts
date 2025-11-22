import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tag } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';
import { z } from 'zod';

// 태그 목록은 자주 변경되지 않으므로 1시간 캐싱
export const revalidate = 3600; // 1시간 (초 단위)

/**
 * POST /api/tags
 * 
 * 새로운 태그를 생성합니다.
 * 
 * ## Request Body
 * ```json
 * {
 *   "name": "음식"
 * }
 * ```
 * 
 * ## 로직
 * 1. 태그명 유효성 검사 (1~20자)
 * 2. 중복 확인
 * 3. 태그 생성
 * 
 * ## 응답
 * - 201: 태그 생성 성공
 * - 400: 이미 존재하는 태그
 * - 500: 서버 오류
 */

const TagSchema = z.object({
  name: z
    .string()
    .min(1, '태그명은 최소 1자 이상이어야 합니다.')
    .max(20, '태그명은 최대 20자까지 가능합니다.')
    .regex(/^[가-힣a-zA-Z0-9_]+$/, '태그명은 한글, 영문, 숫자, _만 사용 가능합니다.'),
});

export async function POST(request: NextRequest) {
  try {
    // 1. 요청 본문 파싱 및 검증
    const body = await request.json();
    const validation = TagSchema.safeParse(body);

    if(!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name } = validation.data;

    // 2. 중복 확인
    const existingTag = await db
      .select()
      .from(tag)
      .where(eq(tag.name, name))
      .limit(1);

    if(existingTag.length > 0) {
      // 이미 존재하는 태그면 해당 태그 반환
      return NextResponse.json(
        {
          message: '이미 존재하는 태그입니다.',
          tag: existingTag[0],
        },
        { status: 200 }
      );
    }

    // 3. 태그 생성
    const newTag = {
      id: generateId(),
      name,
    };

    await db.insert(tag).values(newTag);

    // 4. 성공 응답
    return NextResponse.json(
      {
        message: '태그가 생성되었습니다.',
        tag: newTag,
      },
      { status: 201 }
    );
  } catch(error) {
    console.error('태그 생성 오류:', error);
    return NextResponse.json(
      { error: '태그를 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tags
 * 
 * 모든 태그를 가져옵니다.
 */
export async function GET(request: NextRequest) {
  try {
    const allTags = await db.select().from(tag).orderBy(tag.name);

    return NextResponse.json({
      tags: allTags,
      total: allTags.length,
    });
  } catch(error) {
    console.error('태그 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '태그 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

