/**
 * Header 컴포넌트
 * Apple 스타일의 상단 네비게이션 바
 */

import { getCurrentUser, signInWithGoogle, signOut } from '../utils/auth.js';
import { toggleTheme } from '../utils/theme.js';
import { router } from '../services/router.js';

let currentUser = null;

/**
 * Header 렌더링
 */
export async function renderHeader() {
    const headerEl = document.getElementById('header');
    if(!headerEl) return;
    
    // 현재 사용자 정보 가져오기
    currentUser = await getCurrentUser();
    const isAuthenticated = currentUser !== null;
    
    headerEl.innerHTML = `
        <header class="sticky top-0 z-40 w-full glass border-b border-border/40 backdrop-blur-xl">
            <div class="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto">
                <!-- 모바일 메뉴 + 로고 -->
                <div class="flex items-center space-x-2">
                    <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-lg hover:bg-accent smooth-transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <a href="#home" class="flex items-center space-x-2">
                        <span class="text-2xl font-bold">🎯</span>
                        <span class="text-xl font-bold">밸런스 모임</span>
                    </a>
                </div>

                <!-- 네비게이션 -->
                <nav class="hidden lg:flex items-center space-x-6">
                    <a href="#home" class="text-sm font-medium hover:text-blue-600 smooth-transition">홈</a>
                    ${isAuthenticated ? `
                        <a href="#groups" class="text-sm font-medium hover:text-blue-600 smooth-transition">내 모임</a>
                        <a href="#questions/create" class="text-sm font-medium hover:text-blue-600 smooth-transition">질문 만들기</a>
                        <a href="#questions/my" class="text-sm font-medium hover:text-blue-600 smooth-transition">내 질문</a>
                        <a href="#settings" class="text-sm font-medium hover:text-blue-600 smooth-transition">설정</a>
                    ` : ''}
                </nav>

                <!-- 사용자 메뉴 -->
                <div class="flex items-center space-x-2">
                    <button id="theme-toggle" class="p-2 rounded-lg hover:bg-accent smooth-transition" aria-label="테마 토글">
                        <svg id="theme-icon-light" class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        <svg id="theme-icon-dark" class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                        </svg>
                    </button>
                    ${isAuthenticated ? `
                        <span class="hidden lg:inline text-sm font-medium text-muted-foreground px-2">
                            ${currentUser.name || currentUser.email}
                        </span>
                        <button id="sign-out-btn" class="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98] smooth-transition transition-all duration-200">
                            로그아웃
                        </button>
                    ` : `
                        <button id="sign-in-btn" class="px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] smooth-transition transition-all duration-200">
                            로그인
                        </button>
                    `}
                </div>
            </div>
            
            <!-- 모바일 메뉴 -->
            <div id="mobile-menu" class="hidden lg:hidden border-t border-border/40">
                <nav class="flex flex-col p-4 space-y-2">
                    <a href="#home" class="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg smooth-transition">홈</a>
                    ${isAuthenticated ? `
                        <a href="#groups" class="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg smooth-transition">내 모임</a>
                        <a href="#questions/create" class="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg smooth-transition">질문 만들기</a>
                        <a href="#questions/my" class="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg smooth-transition">내 질문</a>
                        <a href="#settings" class="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg smooth-transition">설정</a>
                    ` : ''}
                </nav>
            </div>
        </header>
    `;
    
    // 이벤트 리스너 등록
    attachEventListeners();
}

/**
 * 이벤트 리스너 등록
 */
function attachEventListeners() {
    // 테마 토글
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            toggleTheme();
            updateThemeIcon();
        });
    }
    
    // 로그인 버튼
    const signInBtn = document.getElementById('sign-in-btn');
    if(signInBtn) {
        signInBtn.addEventListener('click', () => {
            signInWithGoogle();
        });
    }
    
    // 로그아웃 버튼
    const signOutBtn = document.getElementById('sign-out-btn');
    if(signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            await signOut();
        });
    }
    
    // 모바일 메뉴 토글
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // 링크 클릭 시 해시 라우팅
    const links = document.querySelectorAll('header a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if(href) {
                router.navigate(href);
            }
        });
    });
    
    // 초기 테마 아이콘 업데이트
    updateThemeIcon();
}

/**
 * 테마 아이콘 업데이트
 */
function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');
    
    if(lightIcon && darkIcon) {
        if(isDark) {
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        } else {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        }
    }
}

/**
 * 현재 사용자 정보 가져오기
 */
export function getCurrentUserFromHeader() {
    return currentUser;
}
