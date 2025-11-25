// 헤더 컴포넌트
import { checkSession, logout, redirectToGoogleLogin, getCurrentUser } from '../utils/auth.js';
import { getTheme, toggleTheme, getThemeIcon, getThemeLabel } from '../utils/theme.js';

// Google Client ID (환경에 따라 설정 필요)
const GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID || '';

/**
 * 헤더 초기화
 */
export async function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  
  // 세션 확인
  const user = await checkSession();
  
  // 헤더 렌더링
  renderHeader(header, user);
  
  // 이벤트 바인딩
  bindHeaderEvents(header);
}

/**
 * 헤더 HTML 렌더링
 */
function renderHeader(container, user) {
  const currentPath = window.location.pathname;
  const currentTheme = getTheme();
  const themeIcon = getThemeIcon(currentTheme);
  const themeLabel = getThemeLabel(currentTheme);
  
  container.innerHTML = `
    <div class="header-content">
      <a href="/index.html" class="header-logo">🎯 밸런스 모임</a>
      
      <nav class="header-nav" id="headerNav">
        <a href="/home.html" class="header-nav-link ${currentPath === '/home.html' ? 'active' : ''}">
          플레이
        </a>
        ${user ? `
          <a href="/groups.html" class="header-nav-link ${currentPath === '/groups.html' ? 'active' : ''}">
            내 모임
          </a>
          <a href="/questions/create.html" class="header-nav-link ${currentPath === '/questions/create.html' ? 'active' : ''}">
            질문 만들기
          </a>
          <a href="/settings.html" class="header-nav-link ${currentPath === '/settings.html' ? 'active' : ''}">
            설정
          </a>
        ` : ''}
        <button class="theme-toggle theme-toggle-desktop" id="themeToggleDesktop" title="${themeLabel} 모드">
          ${themeIcon}
        </button>
        ${user ? `
          <button class="btn btn-ghost btn-sm" id="logoutBtn">
            로그아웃
          </button>
        ` : `
          <button class="btn btn-primary btn-sm" id="loginBtn">
            로그인
          </button>
        `}
      </nav>
      
      <div class="header-mobile-actions">
        <button class="theme-toggle theme-toggle-mobile" id="themeToggleMobile" title="${themeLabel} 모드">
          ${themeIcon}
        </button>
        <button class="menu-toggle" id="menuToggle" aria-label="메뉴 열기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  `;
}

/**
 * 헤더 이벤트 바인딩
 */
function bindHeaderEvents(container) {
  // 모바일 메뉴 토글
  const menuToggle = container.querySelector('#menuToggle');
  const headerNav = container.querySelector('#headerNav');
  
  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', () => {
      headerNav.classList.toggle('open');
      const isOpen = headerNav.classList.contains('open');
      menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });
  }
  
  // 테마 토글 버튼 (데스크톱 & 모바일)
  const themeToggleDesktop = container.querySelector('#themeToggleDesktop');
  const themeToggleMobile = container.querySelector('#themeToggleMobile');
  
  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    const newIcon = getThemeIcon(newTheme);
    const newTitle = `${getThemeLabel(newTheme)} 모드`;
    
    if (themeToggleDesktop) {
      themeToggleDesktop.innerHTML = newIcon;
      themeToggleDesktop.title = newTitle;
    }
    if (themeToggleMobile) {
      themeToggleMobile.innerHTML = newIcon;
      themeToggleMobile.title = newTitle;
    }
  };
  
  if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener('click', handleThemeToggle);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', handleThemeToggle);
  }
  
  // 로그인 버튼
  const loginBtn = container.querySelector('#loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      if (GOOGLE_CLIENT_ID) {
        redirectToGoogleLogin(GOOGLE_CLIENT_ID);
      } else {
        console.error('Google Client ID가 설정되지 않았습니다.');
        alert('로그인 설정이 완료되지 않았습니다.');
      }
    });
  }
  
  // 로그아웃 버튼
  const logoutBtn = container.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const success = await logout();
      if (success) {
        window.location.href = '/index.html';
      }
    });
  }
}

/**
 * 현재 사용자 표시 이름 가져오기
 */
export function getDisplayName() {
  const user = getCurrentUser();
  return user?.displayName || '사용자';
}
