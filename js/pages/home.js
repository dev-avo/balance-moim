/**
 * 홈 페이지
 */

import { checkAuth } from '../utils/auth.js';
import { router } from '../services/router.js';
import { createButton } from '../components/Button.js';

let isAuthenticated = false;

/**
 * 홈 페이지 렌더링
 */
export async function renderHome() {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    isAuthenticated = await checkAuth();
    
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div class="max-w-3xl px-4 sm:px-6 py-10 sm:py-16 text-center">
                <!-- 로고 및 서비스명 -->
                <div class="mb-8 sm:mb-10 flex flex-col items-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div class="text-6xl sm:text-7xl md:text-8xl lg:text-9xl animate-bounce" role="img" aria-label="타겟">
                        🎯
                    </div>
                    <div>
                        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-2 sm:mb-3">
                            밸런스 모임?
                        </h1>
                        <p class="text-base sm:text-lg font-medium text-primary tracking-wide">
                            Balance Moim
                        </p>
                        <p class="text-xs sm:text-sm text-muted-foreground italic mt-1">
                            What's Your Balance?
                        </p>
                    </div>
                </div>

                <!-- 소개 문구 -->
                <div class="mb-10 sm:mb-12 space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <p class="font-semibold text-foreground text-xl sm:text-2xl">
                        당신의 선택은 무엇인가요?
                    </p>
                    <p class="leading-relaxed text-muted-foreground">
                        밸런스 질문으로 취향을 나누고,<br>
                        모임 친구들과 비교하며 서로를 알아가세요.
                    </p>
                </div>

                <!-- CTA 버튼 -->
                <div class="flex flex-col items-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <button id="start-btn" class="max-w-md mx-4 w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple-lg hover:shadow-apple-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] smooth-transition transition-all duration-200">
                        시작하기
                    </button>

                    <!-- 추가 안내 (비로그인 사용자) -->
                    ${!isAuthenticated ? `
                        <div class="rounded-xl glass border-2 border-border p-3 sm:p-4 max-w-md mx-4 w-full">
                            <p class="text-xs sm:text-sm text-muted-foreground">
                                💡 로그인하지 않아도 플레이할 수 있습니다.<br>
                                <span class="text-[10px] sm:text-xs">
                                    (단, 응답 기록은 저장되지 않으며 모임 기능을 사용할 수 없습니다)
                                </span>
                            </p>
                        </div>
                    ` : ''}
                </div>

                <!-- 서비스 철학 설명 -->
                <div class="mt-12 sm:mt-16 md:mt-20 rounded-2xl glass border-2 border-primary/30 bg-primary/5 p-5 sm:p-6 md:p-8 text-left shadow-apple animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                    <h2 class="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-foreground">
                        밸런스 모임 = 밸런스 질문 + 모임
                    </h2>
                    <ul class="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                        <li class="flex items-start gap-2 sm:gap-3">
                            <span class="mt-0.5 sm:mt-1 text-primary text-lg sm:text-xl">•</span>
                            <span>
                                둘 중 하나를 선택하는 <strong class="text-foreground">밸런스 질문</strong>으로 취향을 공유하고
                            </span>
                        </li>
                        <li class="flex items-start gap-2 sm:gap-3">
                            <span class="mt-0.5 sm:mt-1 text-primary text-lg sm:text-xl">•</span>
                            <span>
                                나와 같은 <strong class="text-foreground">모임</strong>에 속한 사람들과 선택을 비교하며 친목을 도모합니다
                            </span>
                        </li>
                    </ul>
                    <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/40">
                        <p class="text-xs sm:text-sm italic text-muted-foreground leading-relaxed">
                            같은 모임에 속한 사람들이 서로의 질문에 답하며 취향을 알아가는 것은
                            사람들 간의 균형을 맞춰나가는 과정과 같습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 시작하기 버튼 이벤트
    const startBtn = document.getElementById('start-btn');
    if(startBtn) {
        startBtn.addEventListener('click', () => {
            router.navigate('#play');
        });
    }
}
