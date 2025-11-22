import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userGroup, groupMember, inviteLink } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

export const runtime = 'edge';

/**
 * POST /api/groups/join/[inviteCode]
 * 
 * 초대 링크를 통해 모임에 참여합니다.
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 초대 링크 유효성 검사 (존재 여부, 만료 여부)
 * 3. 이미 멤버인지 확인
 * 4. group_member 테이블에 추가
 * 
 * ## 응답
 * - 200: 모임 참여 성공
 * - 401: 로그인 필요
 * - 400: 이미 모임 멤버임 또는 초대 링크 만료
 * - 404: 초대 링크를 찾을 수 없음
 * - 500: 서버 오류
 */

interface RouteContext {
  params: Promise<{ inviteCode: string }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { inviteCode } = await context.params;

    // 1. 로그인 확인
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 초대 링크 조회
    const invite = await db
      .select()
      .from(inviteLink)
      .where(eq(inviteLink.id, inviteCode))
      .limit(1);

    if(invite.length === 0) {
      return NextResponse.json(
        { error: '초대 링크를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 3. 초대 링크 만료 확인
    const now = new Date();
    if(invite[0].expiresAt && invite[0].expiresAt < now) {
      return NextResponse.json(
        { error: '초대 링크가 만료되었습니다.' },
        { status: 400 }
      );
    }

    // 4. 이미 모임 멤버인지 확인
    const existingMembership = await db
      .select()
      .from(groupMember)
      .where(
        and(
          eq(groupMember.groupId, invite[0].groupId),
          eq(groupMember.userId, currentUser.id)
        )
      )
      .limit(1);

    if(existingMembership.length > 0) {
      return NextResponse.json(
        { error: '이미 모임에 참여하고 있습니다.' },
        { status: 400 }
      );
    }

    // 5. 모임에 참여
    await db.insert(groupMember).values({
      groupId: invite[0].groupId,
      userId: currentUser.id,
    });

    // 6. 성공 응답
    return NextResponse.json({
      message: '모임에 참여했습니다.',
      groupId: invite[0].groupId,
    });
  } catch(error) {
    console.error('모임 참여 오류:', error);
    return NextResponse.json(
      { error: '모임 참여 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/groups/join/[inviteCode]
 * 
 * 초대 링크 정보를 조회합니다.
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { inviteCode } = await context.params;

    // 1. 초대 링크 조회
    const invite = await db
      .select({
        inviteId: inviteLink.id,
        groupId: inviteLink.groupId,
        expiresAt: inviteLink.expiresAt,
        groupName: userGroup.name,
        groupDescription: userGroup.description,
      })
      .from(inviteLink)
      .innerJoin(userGroup, eq(inviteLink.groupId, userGroup.id))
      .where(eq(inviteLink.id, inviteCode))
      .limit(1);

    if(invite.length === 0) {
      return NextResponse.json(
        { error: '초대 링크를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 2. 만료 여부 확인
    const now = new Date();
    const isExpired = invite[0].expiresAt ? invite[0].expiresAt < now : false;

    // 3. 멤버 수 계산
    const memberCountResult = await db
      .select({ count: db.$count(groupMember.userId) })
      .from(groupMember)
      .where(eq(groupMember.groupId, invite[0].groupId));

    const memberCount = memberCountResult[0]?.count || 0;

    // 4. 응답 반환
    return NextResponse.json({
      groupId: invite[0].groupId,
      groupName: invite[0].groupName,
      groupDescription: invite[0].groupDescription,
      memberCount,
      expiresAt: invite[0].expiresAt ? Math.floor(invite[0].expiresAt.getTime() / 1000) : null,
      isExpired,
    });
  } catch(error) {
    console.error('초대 링크 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '초대 링크 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

