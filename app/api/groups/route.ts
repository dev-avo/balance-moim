import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userGroup, groupMember } from '@/lib/db/schema';
import { getCurrentUser } from '@/lib/auth/session';
import { generateId } from '@/lib/utils';
import { z } from 'zod';

/**
 * POST /api/groups
 * 
 * 새로운 모임을 생성합니다.
 * 
 * ## Request Body
 * ```json
 * {
 *   "name": "회사 동료",
 *   "description": "우리 팀 밸런스 게임"
 * }
 * ```
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 입력 데이터 검증
 * 3. user_group 테이블에 모임 생성
 * 4. group_member 테이블에 생성자 자동 추가
 * 
 * ## 응답
 * - 201: 모임 생성 성공
 * - 401: 로그인 필요
 * - 400: 잘못된 요청
 * - 500: 서버 오류
 */

const GroupSchema = z.object({
  name: z
    .string()
    .min(1, '모임 이름은 필수입니다.')
    .max(30, '모임 이름은 최대 30자까지 가능합니다.'),
  description: z
    .string()
    .max(200, '모임 설명은 최대 200자까지 가능합니다.')
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
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
    const validation = GroupSchema.safeParse(body);

    if(!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description } = validation.data;

    // 3. 모임 생성
    const newGroup = {
      id: generateId(),
      name,
      description: description || null,
      creatorId: currentUser.id,
    };

    await db.insert(userGroup).values(newGroup);

    // 4. 생성자를 멤버로 자동 추가
    await db.insert(groupMember).values({
      groupId: newGroup.id,
      userId: currentUser.id,
    });

    // 5. 성공 응답
    return NextResponse.json(
      {
        message: '모임이 생성되었습니다.',
        group: {
          id: newGroup.id,
          name: newGroup.name,
          description: newGroup.description,
        },
      },
      { status: 201 }
    );
  } catch(error) {
    console.error('모임 생성 오류:', error);
    return NextResponse.json(
      { error: '모임을 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

