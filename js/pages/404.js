/**
 * 404 페이지
 */

import { router } from '../services/router.js';

/**
 * 404 페이지 렌더링
 */
export function render404() {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div class="text-center space-y-6">
                <div class="text-8xl">🔍</div>
                <h1 class="text-4xl font-bold text-foreground">404</h1>
                <p class="text-xl text-muted-foreground">페이지를 찾을 수 없습니다</p>
                <button id="go-home-btn" class="px-8 py-4 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                    홈으로 이동
                </button>
            </div>
        </div>
    `;
    
    const goHomeBtn = document.getElementById('go-home-btn');
    goHomeBtn.addEventListener('click', () => {
        router.navigate('#home');
    });
}
