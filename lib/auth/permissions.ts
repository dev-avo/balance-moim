import { db } from '@/lib/db';
import { userGroup, groupMember, question } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * 권한 체크 유틸리티
 * 
 * ## 기능
 * - 모임 생성자 확인
 * - 모임 멤버 확인
 * - 질문 작성자 확인
 * 
 * ## 사용법
 * ```typescript
 * const isCreator = await checkIsGroupCreator(userId, groupId);
 * if(!isCreator) {
 *   return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
 * }
 * ```
 */

/**
 * 사용자가 모임의 생성자인지 확인
 * 
 * @param userId - 사용자 ID
 * @param groupId - 모임 ID
 * @returns 생성자 여부
 */
export async function checkIsGroupCreator(
  userId: string,
  groupId: string
): Promise<boolean> {
  try {
    const result = await db
      .select({ creatorId: userGroup.creatorId })
      .from(userGroup)
      .where(eq(userGroup.id, groupId))
      .limit(1);

    if(result.length === 0) {
      return false;
    }

    return result[0].creatorId === userId;
  } catch(error) {
    console.error('모임 생성자 확인 오류:', error);
    return false;
  }
}

/**
 * 사용자가 모임의 멤버인지 확인
 * 
 * @param userId - 사용자 ID
 * @param groupId - 모임 ID
 * @returns 멤버 여부
 */
export async function checkIsGroupMember(
  userId: string,
  groupId: string
): Promise<boolean> {
  try {
    const result = await db
      .select()
      .from(groupMember)
      .where(
        and(
          eq(groupMember.userId, userId),
          eq(groupMember.groupId, groupId)
        )
      )
      .limit(1);

    return result.length > 0;
  } catch(error) {
    console.error('모임 멤버 확인 오류:', error);
    return false;
  }
}

/**
 * 사용자가 질문의 작성자인지 확인
 * 
 * @param userId - 사용자 ID
 * @param questionId - 질문 ID
 * @returns 작성자 여부
 */
export async function checkIsQuestionCreator(
  userId: string,
  questionId: string
): Promise<boolean> {
  try {
    const result = await db
      .select({ creatorId: question.creatorId })
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    if(result.length === 0) {
      return false;
    }

    return result[0].creatorId === userId;
  } catch(error) {
    console.error('질문 작성자 확인 오류:', error);
    return false;
  }
}

/**
 * 모임이 존재하는지 확인
 * 
 * @param groupId - 모임 ID
 * @returns 존재 여부
 */
export async function checkGroupExists(groupId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: userGroup.id })
      .from(userGroup)
      .where(eq(userGroup.id, groupId))
      .limit(1);

    return result.length > 0;
  } catch(error) {
    console.error('모임 존재 확인 오류:', error);
    return false;
  }
}

/**
 * 질문이 존재하는지 확인
 * 
 * @param questionId - 질문 ID
 * @returns 존재 여부
 */
export async function checkQuestionExists(questionId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: question.id })
      .from(question)
      .where(eq(question.id, questionId))
      .limit(1);

    return result.length > 0;
  } catch(error) {
    console.error('질문 존재 확인 오류:', error);
    return false;
  }
}

/**
 * 사용자가 모임 생성자 또는 멤버인지 확인
 * 
 * @param userId - 사용자 ID
 * @param groupId - 모임 ID
 * @returns 생성자 또는 멤버 여부
 */
export async function checkIsGroupCreatorOrMember(
  userId: string,
  groupId: string
): Promise<boolean> {
  const [isCreator, isMember] = await Promise.all([
    checkIsGroupCreator(userId, groupId),
    checkIsGroupMember(userId, groupId),
  ]);

  return isCreator || isMember;
}

/**
 * 권한 체크 결과 타입
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

/**
 * 모임 수정 권한 확인
 * 
 * @param userId - 사용자 ID
 * @param groupId - 모임 ID
 * @returns 권한 확인 결과
 */
export async function checkCanModifyGroup(
  userId: string,
  groupId: string
): Promise<PermissionCheckResult> {
  // 모임 존재 확인
  const groupExists = await checkGroupExists(groupId);
  if(!groupExists) {
    return { allowed: false, reason: '모임을 찾을 수 없습니다.' };
  }

  // 생성자 권한 확인
  const isCreator = await checkIsGroupCreator(userId, groupId);
  if(!isCreator) {
    return { allowed: false, reason: '모임 생성자만 수정할 수 있습니다.' };
  }

  return { allowed: true };
}

/**
 * 질문 수정 권한 확인
 * 
 * @param userId - 사용자 ID
 * @param questionId - 질문 ID
 * @returns 권한 확인 결과
 */
export async function checkCanModifyQuestion(
  userId: string,
  questionId: string
): Promise<PermissionCheckResult> {
  // 질문 존재 확인
  const questionExists = await checkQuestionExists(questionId);
  if(!questionExists) {
    return { allowed: false, reason: '질문을 찾을 수 없습니다.' };
  }

  // 작성자 권한 확인
  const isCreator = await checkIsQuestionCreator(userId, questionId);
  if(!isCreator) {
    return { allowed: false, reason: '질문 작성자만 수정할 수 있습니다.' };
  }

  return { allowed: true };
}

/**
 * 모임 응답 접근 권한 확인
 * 
 * @param userId - 사용자 ID
 * @param groupId - 모임 ID
 * @returns 권한 확인 결과
 */
export async function checkCanViewGroupResponses(
  userId: string,
  groupId: string
): Promise<PermissionCheckResult> {
  // 모임 존재 확인
  const groupExists = await checkGroupExists(groupId);
  if(!groupExists) {
    return { allowed: false, reason: '모임을 찾을 수 없습니다.' };
  }

  // 멤버 확인
  const isMember = await checkIsGroupCreatorOrMember(userId, groupId);
  if(!isMember) {
    return { allowed: false, reason: '모임 멤버만 볼 수 있습니다.' };
  }

  return { allowed: true };
}

