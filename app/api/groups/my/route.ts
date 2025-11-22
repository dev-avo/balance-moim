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
 * ## Query Parameters
 * - page: 페이지 번호 (기본값: 1)
 * - limit: 페이지당 항목 수 (기본값: 20, 최대: 100)
 * 
 * ## 로직
 * 1. 로그인 확인
 * 2. 페이지네이션 파라미터 추출
 * 3. group_member 테이블에서 user_id = 현재 사용자인 모임 조회
 * 4. 각 모임의 멤버 수, 응답한 질문 수 통계 포함
 * 5. 생성자 여부 확인
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

    // 2. 페이지네이션 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    // 3. 전체 모임 수 조회
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(groupMember)
      .where(eq(groupMember.userId, currentUser.id));
    
    const totalCount = Number(totalCountResult[0]?.count || 0);
    const totalPages = Math.ceil(totalCount / limit);

    // 4. 사용자가 속한 모임 조회 (페이지네이션 적용)
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
      .orderBy(groupMember.joinedAt)
      .limit(limit)
      .offset(offset);

    // 5. 각 모임의 통계 계산
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

    // 6. 응답 반환 (페이지네이션 메타데이터 포함)
    return NextResponse.json({
      groups: groupsWithStats,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch(error) {
    console.error('내 모임 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '모임 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

