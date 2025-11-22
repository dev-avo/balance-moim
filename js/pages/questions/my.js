/**
 * 내 질문 목록 페이지
 */

import { questionApi } from '../services/api.js';
import { checkAuth } from '../utils/auth.js';
import { router } from '../services/router.js';
import { showErrorToast, showSuccessToast } from '../components/Toast.js';
import { createLoading } from '../components/Loading.js';
import { showConfirmModal } from '../components/Modal.js';

let questions = [];
let currentPage = 1;
let totalPages = 1;

/**
 * 내 질문 목록 페이지 렌더링
 */
export async function renderMyQuestions() {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    // 로그인 확인
    const isAuthenticated = await checkAuth();
    if(!isAuthenticated) {
        showErrorToast('로그인 필요', '내 질문을 보려면 로그인이 필요합니다.');
        router.navigate('#home');
        return;
    }
    
    await loadQuestions();
}

/**
 * 질문 목록 로드
 */
async function loadQuestions(page = 1) {
    const mainEl = document.getElementById('main');
    currentPage = page;
    
    // 로딩 표시
    const loading = createLoading({ text: '질문을 불러오는 중...', fullScreen: false });
    mainEl.innerHTML = '';
    mainEl.appendChild(loading);
    
    try {
        const data = await questionApi.getMy(page, 10);
        questions = data.questions || [];
        
        if(data.pagination) {
            totalPages = data.pagination.totalPages || 1;
        }
        
        renderQuestionsList();
    } catch(error) {
        console.error('질문 목록 가져오기 오류:', error);
        showErrorToast('오류', error.message || '질문을 가져올 수 없습니다.');
        renderError(error.message || '질문을 가져올 수 없습니다.');
    }
}

/**
 * 질문 목록 렌더링
 */
function renderQuestionsList() {
    const mainEl = document.getElementById('main');
    
    mainEl.innerHTML = `
        <div class="mx-auto max-w-4xl py-8">
            <!-- 헤더 -->
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-foreground">내 질문</h1>
                    <p class="mt-2 text-muted-foreground">
                        내가 만든 질문 ${questions.length}개
                    </p>
                </div>
                <button id="create-question-btn" class="px-6 py-3 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                    + 새 질문 만들기
                </button>
            </div>
            
            <!-- 질문 목록 -->
            ${questions.length === 0 ? `
                <div class="rounded-2xl border-2 border-dashed border-border glass p-12 text-center">
                    <div class="text-6xl mb-4 opacity-80">📝</div>
                    <h3 class="text-xl font-bold text-foreground mb-2">
                        아직 만든 질문이 없습니다
                    </h3>
                    <p class="text-muted-foreground mb-6">
                        첫 번째 밸런스 질문을 만들어보세요!
                    </p>
                    <button id="create-question-empty-btn" class="px-6 py-3 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                        질문 만들기
                    </button>
                </div>
            ` : `
                <div class="space-y-4">
                    ${questions.map(question => {
                        const optionAPercentage = question.stats.totalResponses > 0
                            ? Math.round((question.stats.optionACount / question.stats.totalResponses) * 100)
                            : 0;
                        const optionBPercentage = question.stats.totalResponses > 0
                            ? Math.round((question.stats.optionBCount / question.stats.totalResponses) * 100)
                            : 0;
                        
                        return `
                            <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple hover:shadow-apple-lg smooth-transition">
                                <!-- 질문 헤더 -->
                                <div class="mb-5 flex items-start justify-between">
                                    <div class="flex-1">
                                        <h3 class="text-xl font-bold text-foreground mb-3">
                                            ${question.title}
                                        </h3>
                                        
                                        <!-- 태그 -->
                                        ${question.tags && question.tags.length > 0 ? `
                                            <div class="mb-3 flex flex-wrap gap-2">
                                                ${question.tags.map(tag => `
                                                    <span class="inline-flex items-center rounded-full glass border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                        #${tag.name}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                        
                                        <!-- 공개 설정 배지 -->
                                        <span class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-apple glass border-2 border-border text-muted-foreground">
                                            ${question.visibility === 'public' ? '🌍 전체 공개' : ''}
                                            ${question.visibility === 'private' ? '🔒 비공개' : ''}
                                            ${question.visibility === 'group' ? '👥 모임 전용' : ''}
                                        </span>
                                    </div>
                                </div>
                                
                                <!-- 선택지 및 통계 -->
                                <div class="mb-5 space-y-4">
                                    <!-- 선택지 A -->
                                    <div>
                                        <div class="mb-2 flex items-center justify-between">
                                            <span class="text-sm font-semibold text-foreground">
                                                A. ${question.optionA}
                                            </span>
                                            <span class="text-sm font-bold text-primary">
                                                ${question.stats.optionACount}명 (${optionAPercentage}%)
                                            </span>
                                        </div>
                                        <div class="h-3 w-full overflow-hidden rounded-full glass border border-border shadow-apple">
                                            <div class="h-full bg-primary smooth-transition" style="width: ${optionAPercentage}%"></div>
                                        </div>
                                    </div>
                                    
                                    <!-- 선택지 B -->
                                    <div>
                                        <div class="mb-2 flex items-center justify-between">
                                            <span class="text-sm font-semibold text-foreground">
                                                B. ${question.optionB}
                                            </span>
                                            <span class="text-sm font-bold text-orange-600 dark:text-orange-400">
                                                ${question.stats.optionBCount}명 (${optionBPercentage}%)
                                            </span>
                                        </div>
                                        <div class="h-3 w-full overflow-hidden rounded-full glass border border-border shadow-apple">
                                            <div class="h-full bg-orange-500 smooth-transition" style="width: ${optionBPercentage}%"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 통계 요약 -->
                                <div class="mb-4 text-sm text-muted-foreground pt-4 border-t border-border/40">
                                    총 <strong class="text-foreground">${question.stats.totalResponses}명</strong>이 응답했습니다
                                </div>
                                
                                <!-- 액션 버튼 -->
                                <div class="flex gap-3">
                                    <a href="#questions/${question.id}/edit" class="flex-1">
                                        <button class="w-full px-4 py-2 text-sm font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent hover:text-accent-foreground smooth-transition">
                                            수정
                                        </button>
                                    </a>
                                    <button
                                        data-question-id="${question.id}"
                                        class="delete-question-btn flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-destructive text-destructive-foreground shadow-apple hover:shadow-apple-lg hover:bg-destructive/90 smooth-transition"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${totalPages > 1 ? `
                    <!-- 페이지네이션 -->
                    <div class="mt-8 flex items-center justify-center gap-2">
                        ${currentPage > 1 ? `
                            <button class="pagination-prev px-4 py-2 text-sm font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent smooth-transition">
                                이전
                            </button>
                        ` : ''}
                        <span class="text-sm text-muted-foreground">
                            ${currentPage} / ${totalPages}
                        </span>
                        ${currentPage < totalPages ? `
                            <button class="pagination-next px-4 py-2 text-sm font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent smooth-transition">
                                다음
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
            `}
        </div>
    `;
    
    // 이벤트 리스너
    const createBtn = document.getElementById('create-question-btn');
    const createEmptyBtn = document.getElementById('create-question-empty-btn');
    const deleteBtns = document.querySelectorAll('.delete-question-btn');
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');
    
    if(createBtn) {
        createBtn.addEventListener('click', () => {
            router.navigate('#questions/create');
        });
    }
    
    if(createEmptyBtn) {
        createEmptyBtn.addEventListener('click', () => {
            router.navigate('#questions/create');
        });
    }
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const questionId = btn.getAttribute('data-question-id');
            
            const confirmed = confirm('정말 이 질문을 삭제하시겠습니까?');
            if(!confirmed) return;
            
            try {
                btn.disabled = true;
                btn.textContent = '삭제 중...';
                
                await questionApi.delete(questionId);
                
                showSuccessToast('삭제 완료', '질문이 삭제되었습니다.');
                loadQuestions(currentPage);
            } catch(error) {
                console.error('질문 삭제 오류:', error);
                showErrorToast('삭제 실패', error.message || '질문을 삭제하는 중 오류가 발생했습니다.');
                btn.disabled = false;
                btn.textContent = '삭제';
            }
        });
    });
    
    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            loadQuestions(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            loadQuestions(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 링크 클릭 이벤트
    const links = mainEl.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if(href) {
                router.navigate(href);
            }
        });
    });
}

/**
 * 에러 렌더링
 */
function renderError(message) {
    const mainEl = document.getElementById('main');
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div class="text-center space-y-4">
                <div class="text-6xl">😕</div>
                <h2 class="text-2xl font-bold text-foreground">오류가 발생했습니다</h2>
                <p class="text-muted-foreground">${message}</p>
                <button id="retry-btn" class="px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                    다시 시도
                </button>
            </div>
        </div>
    `;
    
    const retryBtn = document.getElementById('retry-btn');
    retryBtn.addEventListener('click', () => {
        loadQuestions(currentPage);
    });
}
