import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { getDb } from '@/lib/db';
import { user as userTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// 입력 유효성 검사 스키마
const updateSettingsSchema = z.object({
  useNickname: z.boolean(),
  customNickname: z.string().min(2, '별명은 최소 2자 이상이어야 합니다').max(12, '별명은 최대 12자까지 가능합니다').optional(),
});

/**
 * PATCH /api/users/settings
 * 사용자 설정 업데이트 (표시 이름 설정)
 */
export async function PATCH(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();

    // 유효성 검사
    const validatedData = updateSettingsSchema.parse(body);

    // useNickname이 true인데 customNickname이 없으면 에러
    if (validatedData.useNickname && !validatedData.customNickname) {
      return NextResponse.json(
        { error: '익명 별명을 입력해주세요' },
        { status: 400 }
      );
    }

    const db = getDb();

    // 사용자 설정 업데이트
    await db
      .update(userTable)
      .set({
        useNickname: validatedData.useNickname,
        customNickname: validatedData.customNickname || null,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, session.user.id));

    // 업데이트된 사용자 정보 조회
    const updatedUser = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        displayName: userTable.displayName,
        customNickname: userTable.customNickname,
        useNickname: userTable.useNickname,
      })
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: '설정 업데이트에 실패했습니다' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/settings
 * 현재 사용자 설정 조회
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
        email: userTable.email,
        displayName: userTable.displayName,
        customNickname: userTable.customNickname,
        useNickname: userTable.useNickname,
        status: userTable.status,
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

    return NextResponse.json({
      user: users[0],
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: '설정 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

