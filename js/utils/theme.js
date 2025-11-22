/**
 * 테마 관리 유틸리티
 */

const THEME_KEY = 'balance-moim-theme';

/**
 * 테마 초기화
 */
export function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(theme);
    return theme;
}

/**
 * 테마 설정
 */
export function setTheme(theme) {
    const root = document.documentElement;
    
    if(theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    
    localStorage.setItem(THEME_KEY, theme);
}

/**
 * 테마 토글
 */
export function toggleTheme() {
    const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    return newTheme;
}

/**
 * 현재 테마 가져오기
 */
export function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}
