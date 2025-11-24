/**
 * 인증 관련 유틸리티
 */

/**
 * 세션 확인 (로그인 여부만 확인)
 * 로그인하지 않은 상태에서도 호출 가능하며, 불필요한 네트워크 요청을 줄입니다.
 */
async function checkSession() {
    try {
        const response = await fetch('/api/auth/session', {
            credentials: 'include',
        });
        
        if(!response.ok) {
            return null;
        }
        
        const session = await response.json();
        return session?.user || null;
    } catch(error) {
        return null;
    }
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
 * Google 로그인 (팝업 방식)
 * SPA 경험을 유지하면서 로그인을 처리합니다.
 */
export function signInWithGoogle() {
    // 현재 URL을 callback으로 저장
    const currentUrl = window.location.href;
    localStorage.setItem('auth_callback_url', currentUrl);
    
    // 팝업 창 크기 설정
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // 팝업 창 열기
    const popup = window.open(
        '/api/auth/signin/google?popup=true',
        'google-login',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
    
    if(!popup) {
        // 팝업이 차단된 경우 기존 방식으로 폴백
        console.warn('팝업이 차단되었습니다. 리다이렉트 방식으로 로그인합니다.');
        window.location.href = '/api/auth/signin/google';
        return;
    }
    
    // 팝업 창에서 메시지 수신 대기
    const messageListener = (event) => {
        // 보안을 위해 origin 확인
        if(event.origin !== window.location.origin) {
            return;
        }
        
        if(event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            // 팝업 닫기
            popup.close();
            window.removeEventListener('message', messageListener);
            
            // 페이지 새로고침하여 세션 정보 업데이트
            window.location.reload();
        } else if(event.data.type === 'GOOGLE_AUTH_ERROR') {
            // 에러 처리
            popup.close();
            window.removeEventListener('message', messageListener);
            console.error('Google 로그인 실패:', event.data.error);
            
            // 사용자에게 알림 (Toast 등 사용 가능)
            if(window.showToast) {
                window.showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
            } else {
                alert('로그인에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };
    
    window.addEventListener('message', messageListener);
    
    // 팝업이 닫혔는지 확인 (사용자가 수동으로 닫은 경우)
    const checkClosed = setInterval(() => {
        if(popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
        }
    }, 1000);
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
