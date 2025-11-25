// 테마 관리 유틸리티
// 로컬 스토리지에 저장되어 로그인 없이도 사용 가능

const THEME_KEY = 'balance-moim-theme';
const THEMES = ['system', 'light', 'dark'];

/**
 * 현재 테마 가져오기
 */
export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'system';
}

/**
 * 테마 설정
 */
export function setTheme(theme) {
  if (!THEMES.includes(theme)) {
    theme = 'system';
  }
  
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

/**
 * 테마 적용
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  
  // 기존 테마 클래스 제거
  root.classList.remove('theme-light', 'theme-dark');
  
  if (theme === 'light') {
    root.classList.add('theme-light');
  } else if (theme === 'dark') {
    root.classList.add('theme-dark');
  }
  // 'system'인 경우 클래스 없이 CSS의 prefers-color-scheme이 적용됨
}

/**
 * 테마 초기화 (페이지 로드 시 호출)
 */
export function initTheme() {
  const theme = getTheme();
  applyTheme(theme);
}

/**
 * 테마 순환 토글 (system → light → dark → system)
 */
export function toggleTheme() {
  const currentTheme = getTheme();
  const currentIndex = THEMES.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % THEMES.length;
  const nextTheme = THEMES[nextIndex];
  
  setTheme(nextTheme);
  return nextTheme;
}

/**
 * 현재 실제 적용된 모드 (light/dark)
 */
export function getEffectiveTheme() {
  const theme = getTheme();
  
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  return theme;
}

/**
 * 테마 아이콘 가져오기
 */
export function getThemeIcon(theme) {
  switch (theme) {
    case 'light': return '☀️';
    case 'dark': return '🌙';
    default: return '💻';
  }
}

/**
 * 테마 라벨 가져오기
 */
export function getThemeLabel(theme) {
  switch (theme) {
    case 'light': return '라이트';
    case 'dark': return '다크';
    default: return '시스템';
  }
}

// 페이지 로드 시 즉시 테마 적용
initTheme();
