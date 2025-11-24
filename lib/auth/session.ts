// Cloudflare Pages Functions에서는 경로 별칭(@/)이 작동하지 않으므로 상대 경로 사용
// 동적 import를 사용하여 auth 함수를 가져옵니다

/**
 * 서버 컴포넌트에서 현재 로그인한 사용자 정보를 가져오는 함수
 * @param request - Request 객체 (선택사항, Cloudflare Pages Functions에서 전달)
 */
export async function getCurrentUser(request?: Request) {
  try {
    const authModule = await import('../../auth');
    
    // auth 함수를 가져오기 (여러 방법 시도)
    let authFunction: ((request?: Request) => Promise<any>) | null = null;
    
    if(typeof authModule.auth === 'function') {
      authFunction = authModule.auth;
    } else if(typeof authModule.default === 'function') {
      authFunction = authModule.default;
    } else {
      // 디버깅을 위한 상세 정보
      console.error('auth 모듈 구조:', {
        keys: Object.keys(authModule),
        authType: typeof authModule.auth,
        defaultType: typeof authModule.default,
        authValue: authModule.auth,
      });
      throw new Error('auth is not a function. authModule keys: ' + JSON.stringify(Object.keys(authModule)) + ', auth type: ' + typeof authModule.auth);
    }
    
    // auth 함수 호출 (Request 객체 전달)
    const session = await authFunction(request);
    return session?.user || null;
  } catch(error) {
    console.error('getCurrentUser 오류:', error);
    throw error;
  }
}

/**
 * 서버 컴포넌트에서 현재 세션을 가져오는 함수
 */
export async function getSession() {
  try {
    const authModule = await import('../../auth');
    const authFunction = authModule.auth || authModule.default;
    if(typeof authFunction !== 'function') {
      return null;
    }
    const dummyRequest = new Request('http://localhost/api/auth/session');
    return await authFunction(dummyRequest);
  } catch(error) {
    console.error('getSession 오류:', error);
    return null;
  }
}

/**
 * 로그인 여부 확인
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

