import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userGroup, groupMember, user as userTable, response } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * GET /api/groups/[groupId]
 * 
 * 모임 상세 정보를 가져옵니다.
 * 
 * ## 로직
 * 1. 모임 존재 확인
 * 2. 현재 사용자의 멤버십 확인
 * 3. 모임 정보 반환 (이름, 설명, 생성자 여부)
 * 4. 멤버 목록 반환
 * 5. 통계 반환 (멤버 수, 응답 수)
 * 
 * ## 응답 예시
 * ```json
 * {
 *   "group": {
 *     "id": "group1",
 *     "name": "회사 동료",
 *     "description": "우리 팀",
 *     "creatorId": "user1",
 *     "isCreator": true,
 *     "isMember": true,
 *     "memberCount": 10,
 *     "responseCount": 50
 *   },
 *   "members": [
 *     {
 *       "id": "user1",
 *       "name": "홍길동",
 *       "status": 1,
 *       "joinedAt": "2025-01-01T00:00:00Z"
 *     }
 *   ]
 * }
 * ```
 */

interface RouteContext {
  params: Promise<{ groupId: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { groupId } = await context.params;

    // 1. 로그인 확인 (선택)
    const currentUser = await getCurrentUser();

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

    const group = existingGroup[0];

    // 3. 현재 사용자의 멤버십 확인
    let isMember = false;
    if(currentUser) {
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

      isMember = membership.length > 0;
    }

    // 4. 멤버 목록 가져오기
    const members = await db
      .select({
        id: userTable.id,
        displayName: userTable.displayName,
        customNickname: userTable.customNickname,
        useNickname: userTable.useNickname,
        status: userTable.status,
        joinedAt: groupMember.joinedAt,
      })
      .from(groupMember)
      .innerJoin(userTable, eq(groupMember.userId, userTable.id))
      .where(eq(groupMember.groupId, groupId))
      .orderBy(groupMember.joinedAt);

    // 5. 통계 계산
    const memberCount = members.length;

    // 모임 멤버들의 총 응답 수
    const responseCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(response)
      .innerJoin(groupMember, eq(response.userId, groupMember.userId))
      .where(eq(groupMember.groupId, groupId));

    const responseCount = responseCountResult[0]?.count || 0;

    // 6. 생성자 여부 확인
    const isCreator = currentUser ? group.creatorId === currentUser.id : false;

    // 7. 응답 반환
    return NextResponse.json({
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
        creatorId: group.creatorId,
        isCreator,
        isMember,
        memberCount,
        responseCount,
        createdAt: group.createdAt,
      },
      members: members.map((member) => ({
        id: member.id,
        name: member.useNickname ? member.customNickname : member.displayName,
        status: member.status,
        joinedAt: member.joinedAt,
      })),
    });
  } catch(error) {
    console.error('모임 상세 조회 오류:', error);
    return NextResponse.json(
      { error: '모임 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

