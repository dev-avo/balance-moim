import { randomBytes } from 'crypto';

/**
 * UUID v4 생성
 */
export function generateId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * 사용자 표시 이름 가져오기
 * use_nickname이 true면 custom_nickname, 아니면 display_name 반환
 */
export function getUserDisplayName(user: {
  displayName: string | null;
  customNickname: string | null;
  useNickname: boolean;
}): string {
  if (user.useNickname && user.customNickname) {
    return user.customNickname;
  }
  return user.displayName || '익명';
}

