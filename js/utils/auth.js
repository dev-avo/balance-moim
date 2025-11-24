/**
 * 인증 관련 유틸리티
 */

// 세션 확인 결과 캐싱 (같은 페이지 로드 중에는 한 번만 호출)
let sessionCache = null;
let sessionCacheTime = 0;
const SESSION_CACHE_DURATION = 5000; // 5초 캐시

/**
 * 세션 확인 (로그인 여부만 확인)
 * 로그인하지 않은 상태에서도 호출 가능하며, 불필요한 네트워크 요청을 줄입니다.
 */
async function checkSession() {
    // 캐시가 유효한 경우 캐시된 결과 반환
    const now = Date.now();
    if(sessionCache !== null && (now - sessionCacheTime) < SESSION_CACHE_DURATION) {
        return sessionCache;
    }
    
    try {
        const response = await fetch('/api/auth/session', {
            credentials: 'include',
        });
        
        if(!response.ok) {
            sessionCache = null;
            sessionCacheTime = now;
            return null;
        }
        
        const session = await response.json();
        const user = session?.user || null;
        
        // 캐시 업데이트
        sessionCache = user;
        sessionCacheTime = now;
        
        return user;
    } catch(error) {
        sessionCache = null;
        sessionCacheTime = now;
        return null;
    }
}

/**
 * 세션 캐시 초기화 (로그인/로그아웃 시 호출)
 */
export function clearSessionCache() {
    sessionCache = null;
    sessionCacheTime = 0;
}

/**
 * 현재 사용자 정보 가져오기
 * 실제 사용자 정보가 필요할 때만 호출합니다 (예: 프로필 페이지, 설정 페이지)
 */
export async function getCurrentUser() {
    try {
        // 먼저 세션 확인 (로그인 여부만 빠르게 확인)
        const sessionUser = await checkSession();
        if(!sessionUser) {
            return null; // 로그인하지 않은 상태
        }
        
        // 로그인한 상태에서만 사용자 정보 가져오기
        const response = await fetch('/api/users/me', {
            credentials: 'include',
        });
        
        if(!response.ok) {
            // 401이 아닌 다른 오류만 로깅
            if(response.status !== 401) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.warn('Get current user error:', response.status, errorData);
            }
            return null;
        }
        
        const data = await response.json();
        return data.user || data;
    } catch(error) {
        return null;
    }
}

/**
 * 로그인 상태 확인
 * 세션만 확인하여 불필요한 네트워크 요청을 줄입니다.
 */
export async function checkAuth() {
    const sessionUser = await checkSession();
    return sessionUser !== null;
}

/**
 * Google 로그인 (일반 리다이렉트 방식)
 * 전통적인 웹 페이지 방식으로 로그인을 처리합니다.
 */
export function signInWithGoogle() {
    // 세션 캐시 초기화
    clearSessionCache();
    
    // 현재 URL을 callback으로 저장 (로그인 후 돌아올 페이지)
    const currentUrl = window.location.href;
    localStorage.setItem('auth_callback_url', currentUrl);
    
    // Google 로그인 페이지로 리다이렉트
    window.location.href = '/api/auth/signin/google';
}

/**
 * 로그아웃
 */
export async function signOut() {
    try {
        // 세션 캐시 초기화
        clearSessionCache();
        
        const response = await fetch('/api/auth/signout', {
            method: 'POST'
        });
        
        if(response.ok) {
            window.location.href = '/home.html';
        }
    } catch(error) {
        console.error('Sign out error:', error);
    }
}
