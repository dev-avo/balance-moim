/**
 * 인증 관련 유틸리티
 */

/**
 * 현재 사용자 정보 가져오기
 */
export async function getCurrentUser() {
    try {
        const response = await fetch('/api/users/me', {
            credentials: 'include', // 쿠키 포함
        });
        
        // 401 (Unauthorized)는 로그인하지 않은 상태이므로 정상적인 경우
        // 조용히 처리하여 콘솔에 에러가 표시되지 않도록 함
        if(response.status === 401) {
            return null;
        }
        
        if(!response.ok) {
            // 401이 아닌 다른 오류만 로깅 (404, 500 등)
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Get current user error:', response.status, errorData);
            return null;
        }
        
        const data = await response.json();
        return data.user || data; // 응답 형식에 따라 user 객체 또는 직접 반환
    } catch(error) {
        // 네트워크 오류 등만 로깅 (401은 조용히 처리)
        if(error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Get current user fetch error:', error);
        }
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
