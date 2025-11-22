import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userGroup, groupMember } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

export const runtime = 'edge';

/**
 * DELETE /api/groups/[groupId]/members/[memberId]
 * 
 * 모임에서 멤버를 추방합니다 (생성자 전용).
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 모임 존재 확인
 * 3. 생성자 권한 확인
 * 4. 자기 자신은 추방 불가
 * 5. group_member 테이블에서 삭제
 * 
 * ## 응답
 * - 200: 추방 성공
 * - 401: 로그인 필요
 * - 403: 권한 없음
 * - 400: 잘못된 요청
 * - 404: 모임 또는 멤버를 찾을 수 없음
 * - 500: 서버 오류
 */

interface RouteContext {
  params: Promise<{ groupId: string; memberId: string }>;
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { groupId, memberId } = await context.params;

    // 1. 로그인 확인
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 모임 존재 확인
    const existingGroup = await db
      .select()
      .from(userGroup)
      .where(eq(userGroup.id, groupId))
      .limit(1);

    if(existingGroup.length === 0) {
      return NextResponse.json(
        { error: '모임을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 3. 생성자 권한 확인
    if(existingGroup[0].creatorId !== currentUser.id) {
      return NextResponse.json(
        { error: '모임 생성자만 멤버를 추방할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 4. 자기 자신 추방 불가
    if(memberId === currentUser.id) {
      return NextResponse.json(
        { error: '자기 자신을 추방할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 5. 멤버 존재 확인
    const existingMember = await db
      .select()
      .from(groupMember)
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(groupMember.userId, memberId)
        )
      )
      .limit(1);

    if(existingMember.length === 0) {
      return NextResponse.json(
        { error: '멤버를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 6. 멤버 추방
    await db
      .delete(groupMember)
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(groupMember.userId, memberId)
        )
      );

    // 7. 성공 응답
    return NextResponse.json({
      message: '멤버가 추방되었습니다.',
    });
  } catch(error) {
    console.error('멤버 추방 오류:', error);
    return NextResponse.json(
      { error: '멤버를 추방하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

