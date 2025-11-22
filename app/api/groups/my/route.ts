import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userGroup, groupMember, response } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * GET /api/groups/my
 * 
 * 현재 사용자가 속한 모임 목록을 가져옵니다.
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. group_member 테이블에서 user_id = 현재 사용자인 모임 조회
 * 3. 각 모임의 멤버 수, 응답한 질문 수 통계 포함
 * 4. 생성자 여부 확인
 * 
 * ## 응답 예시
 * ```json
 * {
 *   "groups": [
 *     {
 *       "id": "group1",
 *       "name": "회사 동료",
 *       "description": "우리 팀",
 *       "memberCount": 10,
 *       "responseCount": 50,
 *       "isCreator": true,
 *       "joinedAt": "2025-01-01T00:00:00Z"
 *     }
 *   ]
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    // 1. 로그인 확인
    const currentUser = await getCurrentUser();

    if(!currentUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 사용자가 속한 모임 조회
    const myGroupMemberships = await db
      .select({
        groupId: groupMember.groupId,
        joinedAt: groupMember.joinedAt,
        groupName: userGroup.name,
        groupDescription: userGroup.description,
        creatorId: userGroup.creatorId,
        createdAt: userGroup.createdAt,
      })
      .from(groupMember)
      .innerJoin(userGroup, eq(groupMember.groupId, userGroup.id))
      .where(eq(groupMember.userId, currentUser.id))
      .orderBy(groupMember.joinedAt);

    // 3. 각 모임의 통계 계산
    const groupsWithStats = await Promise.all(
      myGroupMemberships.map(async (membership) => {
        // 멤버 수 계산
        const memberCountResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(groupMember)
          .where(eq(groupMember.groupId, membership.groupId));

        const memberCount = memberCountResult[0]?.count || 0;

        // 모임 멤버들의 총 응답 수 계산
        const responseCountResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(response)
          .innerJoin(groupMember, eq(response.userId, groupMember.userId))
          .where(eq(groupMember.groupId, membership.groupId));

        const responseCount = responseCountResult[0]?.count || 0;

        // 생성자 여부 확인
        const isCreator = membership.creatorId === currentUser.id;

        return {
          id: membership.groupId,
          name: membership.groupName,
          description: membership.groupDescription,
          memberCount,
          responseCount,
          isCreator,
          joinedAt: membership.joinedAt,
          createdAt: membership.createdAt,
        };
      })
    );

    // 4. 응답 반환
    return NextResponse.json({
      groups: groupsWithStats,
      total: groupsWithStats.length,
    });
  } catch(error) {
    console.error('내 모임 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '모임 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

