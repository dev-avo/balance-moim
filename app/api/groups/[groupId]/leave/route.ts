import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userGroup, groupMember } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * DELETE /api/groups/[groupId]/leave
 * 
 * 모임에서 나가기 (탈퇴).
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 모임 존재 확인
 * 3. 멤버 확인
 * 4. 생성자는 나가기 불가 (경고)
 * 5. group_member 테이블에서 삭제
 * 
 * ## 응답
 * - 200: 탈퇴 성공
 * - 401: 로그인 필요
 * - 403: 생성자는 나갈 수 없음
 * - 404: 모임을 찾을 수 없음
 * - 500: 서버 오류
 */

interface RouteContext {
  params: Promise<{ groupId: string }>;
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { groupId } = await context.params;

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

    // 3. 생성자 확인 (생성자는 나갈 수 없음)
    if(existingGroup[0].creatorId === currentUser.id) {
      return NextResponse.json(
        { 
          error: '모임 생성자는 나갈 수 없습니다. 모임을 삭제하거나 다른 멤버에게 관리자 권한을 위임해주세요.' 
        },
        { status: 403 }
      );
    }

    // 4. 멤버 확인
    const membership = await db
      .select()
      .from(groupMember)
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(groupMember.userId, currentUser.id)
        )
      )
      .limit(1);

    if(membership.length === 0) {
      return NextResponse.json(
        { error: '이 모임의 멤버가 아닙니다.' },
        { status: 400 }
      );
    }

    // 5. 모임에서 나가기
    await db
      .delete(groupMember)
      .where(
        and(
          eq(groupMember.groupId, groupId),
          eq(groupMember.userId, currentUser.id)
        )
      );

    // 6. 성공 응답
    return NextResponse.json({
      message: '모임에서 나갔습니다.',
    });
  } catch(error) {
    console.error('모임 나가기 오류:', error);
    return NextResponse.json(
      { error: '모임에서 나가는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

