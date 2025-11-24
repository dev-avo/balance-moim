// Cloudflare Pages Functions에서는 경로 별칭(@/)이 작동하지 않으므로 상대 경로 사용
import { auth } from '../../auth';

/**
 * 서버 컴포넌트에서 현재 로그인한 사용자 정보를 가져오는 함수
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

/**
 * 서버 컴포넌트에서 현재 세션을 가져오는 함수
 */
export async function getSession() {
  return await auth();
}

/**
 * 로그인 여부 확인
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

