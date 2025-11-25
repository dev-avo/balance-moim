// 프론트엔드 인증 유틸리티
// Google OAuth 로그인, 세션 관리

// Google OAuth 설정
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

// 현재 사용자 상태 (캐시)
let currentUser = null;

// Google Client ID (캐시)
let cachedGoogleClientId = null;

/**
 * Google Client ID 가져오기 (API에서 로드)
 * @returns {Promise<string>} Google Client ID
 */
export async function getGoogleClientId() {
  if (cachedGoogleClientId) {
    return cachedGoogleClientId;
  }
  
  try {
    const response = await fetch('/api/auth/config');
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.googleClientId) {
        cachedGoogleClientId = data.data.googleClientId;
        return cachedGoogleClientId;
      }
    }
  } catch (error) {
    console.error('인증 설정 로드 실패:', error);
  }
  
  return '';
}

/**
 * Google 로그인 페이지로 리다이렉트
 * @param {string} clientId - Google OAuth 클라이언트 ID
 */
export function redirectToGoogleLogin(clientId) {
  const redirectUri = `${window.location.origin}/api/auth/callback`;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account', // 항상 계정 선택 화면 표시
  });
  
  window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * 현재 세션 확인
 * @returns {Promise<Object|null>} 사용자 정보 또는 null
 */
export async function checkSession() {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
    });
    
    if (!response.ok) {
      currentUser = null;
      return null;
    }
    
    const data = await response.json();
    
    if (data.success && data.data?.user) {
      currentUser = data.data.user;
      return currentUser;
    }
    
    currentUser = null;
    return null;
  } catch (error) {
    console.error('세션 확인 실패:', error);
    currentUser = null;
    return null;
  }
}

/**
 * 로그아웃
 * @returns {Promise<boolean>} 성공 여부
 */
export async function logout() {
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });
    
    if (response.ok) {
      currentUser = null;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    return false;
  }
}

/**
 * 현재 로그인한 사용자 가져오기 (캐시된 값)
 * @returns {Object|null} 사용자 정보 또는 null
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 여부
 */
export function isLoggedIn() {
  return currentUser !== null;
}

/**
 * 로그인 필요 페이지 가드
 * 로그인하지 않은 경우 인덱스 페이지로 리다이렉트
 * @returns {Promise<boolean>} 로그인 여부
 */
export async function requireAuth() {
  const user = await checkSession();
  
  if (!user) {
    window.location.href = '/index.html?login_required=true';
    return false;
  }
  
  return true;
}

/**
 * URL 파라미터에서 로그인 에러 메시지 확인
 * @returns {string|null} 에러 메시지 또는 null
 */
export function getLoginError() {
  const params = new URLSearchParams(window.location.search);
  const success = params.get('success');
  const message = params.get('message');
  
  if (success === 'false' && message) {
    return decodeURIComponent(message);
  }
  
  if (params.get('login_required') === 'true') {
    return '로그인이 필요합니다.';
  }
  
  return null;
}

/**
 * URL 파라미터 정리 (로그인 관련 파라미터 제거)
 */
export function clearLoginParams() {
  const url = new URL(window.location.href);
  url.searchParams.delete('success');
  url.searchParams.delete('message');
  url.searchParams.delete('login_required');
  
  if (url.search !== window.location.search) {
    window.history.replaceState({}, '', url.toString());
  }
}
