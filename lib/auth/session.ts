// Cloudflare Pages Functions에서는 경로 별칭(@/)이 작동하지 않으므로 상대 경로 사용
// 동적 import를 사용하여 auth 함수를 가져옵니다
let authFunction: (() => Promise<any>) | null = null;

async function getAuthFunction() {
  if(!authFunction) {
    const authModule = await import('../../auth');
    // auth가 함수인지 확인
    if(typeof authModule.auth === 'function') {
      authFunction = authModule.auth;
    } else {
      throw new Error('auth is not a function. authModule: ' + JSON.stringify(Object.keys(authModule)));
    }
  }
  return authFunction;
}

/**
 * 서버 컴포넌트에서 현재 로그인한 사용자 정보를 가져오는 함수
 */
export async function getCurrentUser() {
  try {
    const auth = await getAuthFunction();
    const session = await auth();
    return session?.user;
  } catch(error) {
    console.error('getCurrentUser 오류:', error);
    throw error;
  }
}

/**
 * 서버 컴포넌트에서 현재 세션을 가져오는 함수
 */
export async function getSession() {
  const auth = await getAuthFunction();
  return await auth();
}

/**
 * 로그인 여부 확인
 */
export async function isAuthenticated() {
  const auth = await getAuthFunction();
  const session = await auth();
  return !!session?.user;
}

