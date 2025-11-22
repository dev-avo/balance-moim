import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userGroup, groupMember, inviteLink } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';
import { generateId } from '@/lib/utils';
import { sql } from 'drizzle-orm';

/**
 * POST /api/groups/[groupId]/invite
 * 
 * 모임 초대 링크를 생성합니다.
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 모임 존재 확인
 * 3. 모임 멤버 확인 (멤버만 초대 링크 생성 가능)
 * 4. 초대 링크 생성 (UUID)
 * 5. 만료 시간 설정 (30일)
 * 
 * ## 응답
 * - 201: 초대 링크 생성 성공
 * - 401: 로그인 필요
 * - 403: 권한 없음 (모임 멤버 아님)
 * - 404: 모임을 찾을 수 없음
 * - 500: 서버 오류
 */

interface RouteContext {
  params: Promise<{ groupId: string }>;
}

export async function POST(
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

    // 3. 모임 멤버 확인
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
        { error: '모임 멤버만 초대 링크를 생성할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 4. 초대 링크 생성
    const inviteCode = generateId();
    
    // 만료 시간: 현재 시간 + 30일
    const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);

    const newInviteLink = {
      id: inviteCode,
      groupId,
      createdBy: currentUser.id,
      expiresAt,
    };

    await db.insert(inviteLink).values(newInviteLink);

    // 5. 초대 URL 생성
    const inviteUrl = `${process.env.NEXTAUTH_URL}/invite/${inviteCode}`;

    // 6. 성공 응답
    return NextResponse.json(
      {
        message: '초대 링크가 생성되었습니다.',
        inviteCode,
        inviteUrl,
        expiresAt,
      },
      { status: 201 }
    );
  } catch(error) {
    console.error('초대 링크 생성 오류:', error);
    return NextResponse.json(
      { error: '초대 링크를 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/groups/[groupId]/invite
 * 
 * 모임의 초대 링크 목록을 가져옵니다.
 */
export async function GET(
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

    // 2. 모임 멤버 확인
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
        { error: '모임 멤버만 초대 링크를 조회할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 3. 초대 링크 목록 조회
    const inviteLinks = await db
      .select()
      .from(inviteLink)
      .where(eq(inviteLink.groupId, groupId))
      .orderBy(inviteLink.createdAt);

    // 4. 응답 반환
    return NextResponse.json({
      inviteLinks: inviteLinks.map((link) => ({
        id: link.id,
        inviteUrl: `${process.env.NEXTAUTH_URL}/invite/${link.id}`,
        createdBy: link.createdBy,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt,
        isExpired: link.expiresAt ? link.expiresAt < Math.floor(Date.now() / 1000) : false,
      })),
    });
  } catch(error) {
    console.error('초대 링크 조회 오류:', error);
    return NextResponse.json(
      { error: '초대 링크를 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

