/**
 * 플레이 페이지 - 밸런스 게임
 */

import { questionApi, responseApi } from '../services/api.js';
import { showErrorToast, showSuccessToast } from '../components/Toast.js';
import { createLoading } from '../components/Loading.js';
import { getRouteFromHash, parseQueryString } from '../utils/helpers.js';

let gameStarted = false;
let currentQuestion = null;
let currentStats = null;
let selectedTags = [];

/**
 * 플레이 페이지 렌더링
 */
export async function renderPlay() {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    // 주의사항 모달 표시 (첫 방문 시)
    const hasSeenWarning = localStorage.getItem('balance-moim-warning-seen');
    if(!hasSeenWarning) {
        showWarningModal();
        return;
    }
    
    gameStarted = true;
    await loadQuestion();
}

/**
 * 주의사항 모달 표시
 */
function showWarningModal() {
    const mainEl = document.getElementById('main');
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div class="glass border-2 border-border rounded-2xl p-6 shadow-apple-lg max-w-xl w-full mx-4">
                <div class="space-y-6">
                    <div class="text-center">
                        <div class="mb-4 text-6xl">🎯</div>
                        <h2 class="text-2xl font-bold text-foreground mb-2">밸런스 모임?</h2>
                    </div>
                    
                    <div class="text-center space-y-2">
                        <p class="text-base font-medium text-foreground">
                            당신의 선택은 무엇인가요?
                        </p>
                        <p class="text-sm text-muted-foreground">
                            밸런스 질문으로 취향을 나누고,<br>
                            모임 친구들과 비교하며 서로를 알아가세요.
                        </p>
                    </div>
                    
                    <div class="rounded-2xl border-2 border-yellow-500/30 glass bg-yellow-500/10 p-5">
                        <h3 class="mb-3 flex items-center gap-2 font-bold text-foreground">
                            <span class="text-2xl">⚠️</span>
                            중요: 답변 수정 불가
                        </h3>
                        <ul class="space-y-2 text-sm text-muted-foreground">
                            <li class="flex items-start gap-2">
                                <span class="mt-0.5 text-yellow-600 dark:text-yellow-400">•</span>
                                <span>
                                    <strong class="text-foreground">한 번 선택한 답변은 수정할 수 없습니다.</strong>
                                </span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="mt-0.5 text-yellow-600 dark:text-yellow-400">•</span>
                                <span>신중하게 선택해주세요!</span>
                            </li>
                        </ul>
                    </div>
                    
                    
                    <button id="start-game-btn" class="w-full px-8 py-6 text-lg font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple-lg hover:shadow-apple hover:bg-primary/90 smooth-transition">
                        시작하기
                    </button>
                    <p class="text-center text-xs text-muted-foreground">
                        이 안내는 한 번만 표시됩니다.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    const startBtn = document.getElementById('start-game-btn');
    startBtn.addEventListener('click', () => {
        localStorage.setItem('balance-moim-warning-seen', 'true');
        gameStarted = true;
        loadQuestion();
    });
}

/**
 * 질문 로드
 */
async function loadQuestion() {
    const mainEl = document.getElementById('main');
    
    // 로딩 표시
    const loading = createLoading({ text: '질문을 불러오는 중...', fullScreen: false });
    mainEl.innerHTML = '';
    mainEl.appendChild(loading);
    
    try {
        // URL에서 태그 파라미터 가져오기
        const hash = window.location.hash;
        const queryString = hash.includes('?') ? hash.split('?')[1] : '';
        const params = parseQueryString(queryString);
        const tags = params.tags ? params.tags.split(',') : [];
        selectedTags = tags;
        
        const tagsParam = tags.length > 0 ? tags.join(',') : null;
        currentQuestion = await questionApi.getRandom(tagsParam);
        currentStats = null;
        
        renderQuestion();
    } catch(error) {
        console.error('질문 로드 오류:', error);
        showErrorToast('오류', error.message || '질문을 가져올 수 없습니다.');
        renderError(error.message || '질문을 가져올 수 없습니다.');
    }
}

/**
 * 질문 렌더링
 */
function renderQuestion() {
    if(!currentQuestion) return;
    
    const mainEl = document.getElementById('main');
    mainEl.innerHTML = `
        <div class="mx-auto max-w-4xl px-4 py-8">
            <!-- 태그 필터 -->
            <div class="mb-6" id="tag-filter-container"></div>
            
            <!-- 질문 카드 -->
            <div class="space-y-8">
                ${currentQuestion.tags && currentQuestion.tags.length > 0 ? `
                    <div class="flex flex-wrap gap-2 justify-center">
                        ${currentQuestion.tags.map(tag => `
                            <span class="inline-flex items-center rounded-full glass border-2 border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-apple">
                                #${tag.name}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- 질문 제목 -->
                <div class="rounded-3xl glass border-2 border-border p-8 shadow-apple-lg">
                    <h2 class="text-3xl font-bold text-center text-foreground sm:text-4xl">
                        ${currentQuestion.title}
                    </h2>
                </div>
                
                <!-- 선택지 버튼 -->
                <div class="relative grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                    <!-- VS 텍스트 -->
                    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <span class="text-3xl sm:text-4xl font-black text-foreground/60 drop-shadow-lg">VS</span>
                    </div>
                    
                    <!-- 선택지 A -->
                    <button id="option-a-btn" class="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 min-h-[120px] sm:min-h-[160px] glass border-2 border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 hover:shadow-apple-lg hover:border-primary smooth-transition focus:outline-none focus:ring-4 focus:ring-primary/30">
                        <div class="relative flex flex-col items-center gap-3 sm:gap-4">
                            <span class="text-3xl sm:text-4xl md:text-5xl font-black text-primary opacity-80 group-hover:opacity-100 smooth-transition">A</span>
                            <span class="text-lg sm:text-xl md:text-2xl font-bold text-foreground text-center break-words group-hover:text-primary smooth-transition">
                                ${currentQuestion.optionA}
                            </span>
                        </div>
                    </button>
                    
                    <!-- 선택지 B -->
                    <button id="option-b-btn" class="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 min-h-[120px] sm:min-h-[160px] glass border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/20 to-orange-500/10 hover:from-orange-500/30 hover:to-orange-500/20 hover:shadow-apple-lg hover:border-orange-500 smooth-transition focus:outline-none focus:ring-4 focus:ring-orange-500/30">
                        <div class="relative flex flex-col items-center gap-3 sm:gap-4">
                            <span class="text-3xl sm:text-4xl md:text-5xl font-black text-orange-600 dark:text-orange-400 opacity-80 group-hover:opacity-100 smooth-transition">B</span>
                            <span class="text-lg sm:text-xl md:text-2xl font-bold text-foreground text-center break-words group-hover:text-orange-600 dark:group-hover:text-orange-400 smooth-transition">
                                ${currentQuestion.optionB}
                            </span>
                        </div>
                    </button>
                </div>
                
                <!-- 안내 문구 -->
                <div class="text-center text-sm text-muted-foreground">
                    ⚠️ 선택 후에는 수정할 수 없습니다
                </div>
            </div>
        </div>
    `;
    
    // 태그 필터 렌더링
    renderTagFilter();
    
    // 선택지 버튼 이벤트
    const optionABtn = document.getElementById('option-a-btn');
    const optionBBtn = document.getElementById('option-b-btn');
    
    optionABtn.addEventListener('click', () => handleSelect('A'));
    optionBBtn.addEventListener('click', () => handleSelect('B'));
}

/**
 * 태그 필터 렌더링
 */
async function renderTagFilter() {
    const container = document.getElementById('tag-filter-container');
    if(!container) return;
    
    // 태그 필터는 간단하게 구현 (필요시 확장)
    container.innerHTML = '';
}

/**
 * 선택지 선택 핸들러
 */
async function handleSelect(option) {
    if(!currentQuestion) return;
    
    try {
        // 응답 제출
        await responseApi.create({
            questionId: currentQuestion.id,
            selectedOption: option
        });
        
        // 통계 가져오기
        currentStats = await questionApi.getStats(currentQuestion.id);
        currentStats.userSelection = option;
        
        showSuccessToast('응답 완료', '결과를 확인하세요!');
        renderResult();
    } catch(error) {
        console.error('응답 제출 오류:', error);
        showErrorToast('오류', error.message || '응답을 제출하는 중 오류가 발생했습니다.');
    }
}

/**
 * 결과 렌더링
 */
function renderResult() {
    if(!currentQuestion || !currentStats) return;
    
    const mainEl = document.getElementById('main');
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
            <div class="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
                <!-- 질문 제목 -->
                <div class="text-center">
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                        ${currentQuestion.title}
                    </h2>
                    <p class="text-sm sm:text-base text-muted-foreground">결과를 확인하세요</p>
                </div>
                
                <!-- 전체 통계 -->
                <div class="rounded-2xl sm:rounded-3xl glass border-2 border-border p-5 sm:p-6 md:p-8 shadow-apple-lg">
                    <h3 class="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
                        <span class="text-2xl">📊</span>
                        전체 통계
                        <span class="text-base font-normal text-muted-foreground ml-2">
                            (${currentStats.totalResponses.toLocaleString()}명 응답)
                        </span>
                    </h3>
                    
                    <div class="space-y-6">
                        <!-- 옵션 A -->
                        <div>
                            <div class="mb-3 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <span class="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-primary-foreground shadow-apple ${currentStats.userSelection === 'A' ? 'bg-primary ring-4 ring-primary/30 scale-110' : 'bg-primary/80'}">
                                        A
                                    </span>
                                    <div>
                                        <span class="font-semibold text-foreground block">
                                            ${currentQuestion.optionA}
                                        </span>
                                        ${currentStats.userSelection === 'A' ? `
                                            <span class="text-sm text-primary font-medium flex items-center gap-1 mt-1">
                                                <span>✓</span>
                                                내 선택
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                                <span class="text-2xl font-bold text-primary">
                                    ${currentStats.optionAPercentage}%
                                </span>
                            </div>
                            <div class="h-6 rounded-full bg-muted-foreground/20 overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500" style="width: ${currentStats.optionAPercentage}%"></div>
                            </div>
                            <p class="mt-2 text-sm text-muted-foreground">
                                ${currentStats.optionACount.toLocaleString()}명 선택
                            </p>
                        </div>
                        
                        <!-- 옵션 B -->
                        <div>
                            <div class="mb-3 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <span class="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-white shadow-apple ${currentStats.userSelection === 'B' ? 'bg-orange-500 ring-4 ring-orange-500/30 scale-110' : 'bg-orange-500/80'}">
                                        B
                                    </span>
                                    <div>
                                        <span class="font-semibold text-foreground block">
                                            ${currentQuestion.optionB}
                                        </span>
                                        ${currentStats.userSelection === 'B' ? `
                                            <span class="text-sm text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1 mt-1">
                                                <span>✓</span>
                                                내 선택
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                                <span class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    ${currentStats.optionBPercentage}%
                                </span>
                            </div>
                            <div class="h-6 rounded-full bg-muted-foreground/20 overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-orange-500/80 to-orange-500 rounded-full transition-all duration-500" style="width: ${currentStats.optionBPercentage}%"></div>
                            </div>
                            <p class="mt-2 text-sm text-muted-foreground">
                                ${currentStats.optionBCount.toLocaleString()}명 선택
                            </p>
                        </div>
                    </div>
                </div>
                
                ${currentStats.groupStats && currentStats.groupStats.length > 0 ? `
                    <!-- 모임별 통계 -->
                    <div>
                        <h3 class="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
                            <span class="text-2xl">👥</span>
                            내 모임별 통계
                        </h3>
                        <div class="space-y-4">
                            ${currentStats.groupStats.map(groupStat => `
                                <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple">
                                    <div class="mb-4 flex items-center justify-between">
                                        <h4 class="font-bold text-foreground text-lg">${groupStat.groupName}</h4>
                                        <span class="text-sm text-muted-foreground">
                                            ${groupStat.totalResponses}명 응답
                                        </span>
                                    </div>
                                    <div class="space-y-4">
                                        <div class="flex items-center gap-3">
                                            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-apple">A</span>
                                            <div class="flex-1 h-4 rounded-full bg-muted-foreground/20 overflow-hidden">
                                                <div class="h-full bg-primary rounded-full transition-all duration-500" style="width: ${groupStat.optionAPercentage}%"></div>
                                            </div>
                                            <span class="w-14 text-right text-sm font-bold text-primary">${groupStat.optionAPercentage}%</span>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white shadow-apple">B</span>
                                            <div class="flex-1 h-4 rounded-full bg-muted-foreground/20 overflow-hidden">
                                                <div class="h-full bg-orange-500 rounded-full transition-all duration-500" style="width: ${groupStat.optionBPercentage}%"></div>
                                            </div>
                                            <span class="w-14 text-right text-sm font-bold text-orange-600 dark:text-orange-400">${groupStat.optionBPercentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- 다음 질문 버튼 -->
                <div class="mt-8 flex flex-col items-center gap-4">
                    <button id="next-question-btn" class="px-12 py-6 text-lg font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple-lg hover:shadow-apple hover:bg-primary/90 smooth-transition">
                        다음 질문으로 →
                    </button>
                    <p class="text-sm text-muted-foreground">
                        계속해서 밸런스 게임을 즐겨보세요!
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // 다음 질문 버튼
    const nextBtn = document.getElementById('next-question-btn');
    nextBtn.addEventListener('click', () => {
        loadQuestion();
    });
}

/**
 * 에러 렌더링
 */
function renderError(message) {
    const mainEl = document.getElementById('main');
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
            <div class="text-center space-y-4">
                <div class="text-6xl">😕</div>
                <h2 class="text-2xl font-bold text-foreground">질문을 불러올 수 없습니다</h2>
                <p class="text-muted-foreground">${message}</p>
                <button id="retry-btn" class="px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                    다시 시도
                </button>
            </div>
        </div>
    `;
    
    const retryBtn = document.getElementById('retry-btn');
    retryBtn.addEventListener('click', () => {
        loadQuestion();
    });
}
