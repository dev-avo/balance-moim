import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스명을 병합하는 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UUID v4 생성 (Edge Runtime 호환)
 * Edge Runtime에서는 Node.js의 crypto 모듈을 사용할 수 없으므로 Web Crypto API 사용
 */
export function generateId(): string {
  // Edge Runtime 호환: Web Crypto API 사용 (Cloudflare Pages 환경)
  if(typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback: Math.random 사용 (보안이 중요하지 않은 경우)
  // Edge Runtime에서는 항상 Web Crypto API를 사용해야 하므로 이 코드는 실행되지 않아야 함
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
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

