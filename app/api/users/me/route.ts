import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDb } from '@/lib/db';
import { user as userTable, userGroup } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * DELETE /api/users/me
 * 회원 탈퇴 (Soft Delete: status = -1)
 */
export async function DELETE() {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const db = getDb();

    // 생성한 모임 확인
    const createdGroups = await db
      .select()
      .from(userGroup)
      .where(eq(userGroup.creatorId, session.user.id));

    if (createdGroups.length > 0) {
      return NextResponse.json(
        {
          error: '생성한 모임이 있습니다',
          message: '모임 관리자 권한을 다른 사용자에게 위임하거나 모임을 삭제한 후 탈퇴할 수 있습니다.',
          createdGroupsCount: createdGroups.length,
          groups: createdGroups.map(g => ({
            id: g.id,
            name: g.name,
          })),
        },
        { status: 400 }
      );
    }

    // 사용자 상태를 탈퇴(-1)로 변경 (Soft Delete)
    await db
      .update(userTable)
      .set({
        status: -1, // 탈퇴
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: '회원 탈퇴가 완료되었습니다.',
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json(
      { error: '회원 탈퇴에 실패했습니다' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/me
 * 현재 로그인한 사용자 정보 조회
 */
export async function GET() {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const db = getDb();

    // 사용자 정보 조회
    const users = await db
      .select({
        id: userTable.id,
        googleId: userTable.googleId,
        email: userTable.email,
        displayName: userTable.displayName,
        customNickname: userTable.customNickname,
        useNickname: userTable.useNickname,
        status: userTable.status,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
      })
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    if (users.length === 0) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const user = users[0];

    // 탈퇴한 사용자인 경우
    if (user.status === -1) {
      return NextResponse.json(
        { error: '탈퇴한 사용자입니다' },
        { status: 403 }
      );
    }

    // 생성한 모임 수 조회
    const createdGroups = await db
      .select()
      .from(userGroup)
      .where(eq(userGroup.creatorId, user.id));

    return NextResponse.json({
      user: {
        ...user,
        createdGroupsCount: createdGroups.length,
      },
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json(
      { error: '사용자 정보 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

