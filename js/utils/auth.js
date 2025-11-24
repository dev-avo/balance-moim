/**
 * 인증 관련 유틸리티
 */

/**
 * 현재 사용자 정보 가져오기
 */
export async function getCurrentUser() {
    try {
        const response = await fetch('/api/users/me');
        if(!response.ok) {
            // 401 (Unauthorized)는 로그인하지 않은 상태이므로 정상적인 경우
            if(response.status === 401) {
                return null;
            }
            // 다른 오류는 로깅
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Get current user error:', response.status, errorData);
            return null;
        }
        return await response.json();
    } catch(error) {
        console.error('Get current user fetch error:', error);
        return null;
    }
}

/**
 * 로그인 상태 확인
 */
export async function checkAuth() {
    const user = await getCurrentUser();
    return user !== null;
}

/**
 * Google 로그인
 */
export function signInWithGoogle() {
    // 현재 URL을 callback으로 저장
    const currentUrl = window.location.href;
    localStorage.setItem('auth_callback_url', currentUrl);
    
    // Google 로그인 페이지로 이동
    window.location.href = '/api/auth/signin/google';
}

/**
 * 로그아웃
 */
export async function signOut() {
    try {
        const response = await fetch('/api/auth/signout', {
            method: 'POST'
        });
        
        if(response.ok) {
            window.location.hash = '#home';
            window.location.reload();
        }
    } catch(error) {
        console.error('Sign out error:', error);
    }
}
