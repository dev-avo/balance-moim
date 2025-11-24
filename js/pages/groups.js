/**
 * 그룹 목록 페이지
 */

import { groupApi } from '../services/api.js';
import { checkAuth } from '../utils/auth.js';
import { showErrorToast } from '../components/Toast.js';
import { createLoading } from '../components/Loading.js';
import { createButton } from '../components/Button.js';

let groups = [];
let currentPage = 1;
let totalPages = 1;

/**
 * 그룹 목록 페이지 렌더링
 */
export async function renderGroups() {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    // 로그인 확인
    const isAuthenticated = await checkAuth();
    if(!isAuthenticated) {
        showErrorToast('로그인 필요', '모임을 보려면 로그인이 필요합니다.');
        window.location.href = '/home.html';
        return;
    }
    
    await loadGroups();
}

/**
 * 그룹 목록 로드
 */
async function loadGroups(page = 1) {
    const mainEl = document.getElementById('main');
    currentPage = page;
    
    // 로딩 표시
    const loading = createLoading({ text: '모임을 불러오는 중...', fullScreen: false });
    mainEl.innerHTML = '';
    mainEl.appendChild(loading);
    
    try {
        const data = await groupApi.getMy(page, 10);
        groups = data.groups || [];
        
        if(data.pagination) {
            totalPages = data.pagination.totalPages || 1;
        }
        
        renderGroupsList();
    } catch(error) {
        console.error('모임 목록 가져오기 오류:', error);
        showErrorToast('오류', error.message || '모임을 가져올 수 없습니다.');
        renderError(error.message || '모임을 가져올 수 없습니다.');
    }
}

/**
 * 그룹 목록 렌더링
 */
function renderGroupsList() {
    const mainEl = document.getElementById('main');
    
    mainEl.innerHTML = `
        <div class="mx-auto max-w-4xl py-8">
            <!-- 헤더 -->
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-foreground">내 모임</h1>
                    <p class="mt-2 text-muted-foreground">
                        참여 중인 모임 ${groups.length}개
                    </p>
                </div>
                <button id="create-group-btn" class="px-6 py-3 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                    + 새 모임 만들기
                </button>
            </div>
            
            <!-- 모임 목록 -->
            ${groups.length === 0 ? `
                <div class="rounded-2xl border-2 border-dashed border-border glass p-12 text-center">
                    <div class="text-6xl mb-4 opacity-80">👥</div>
                    <h3 class="text-xl font-bold text-foreground mb-2">
                        아직 참여한 모임이 없습니다
                    </h3>
                    <p class="text-muted-foreground mb-6">
                        첫 번째 모임을 만들거나 초대 링크로 참여해보세요!
                    </p>
                    <button id="create-group-empty-btn" class="px-6 py-3 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                        모임 만들기
                    </button>
                </div>
            ` : `
                <div class="grid gap-6 md:grid-cols-2">
                    ${groups.map(group => `
                        <a href="/groups/detail.html?id=${group.id}" class="block">
                            <div class="h-full rounded-2xl border-2 border-border glass p-6 shadow-apple smooth-transition hover:shadow-apple-lg hover:border-primary/50">
                                <div class="mb-4 flex items-start justify-between">
                                    <div class="flex-1">
                                        <h3 class="text-xl font-bold text-foreground mb-2">
                                            ${group.name}
                                        </h3>
                                        ${group.isCreator ? `
                                            <span class="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                                                👑 생성자
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                ${group.description ? `
                                    <p class="mb-4 text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
                                        ${group.description}
                                    </p>
                                ` : ''}
                                
                                <div class="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div class="flex items-center gap-1">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                                        </svg>
                                        <span>${group.memberCount}명</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
                                        </svg>
                                        <span>${group.responseCount}개 응답</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    `).join('')}
                </div>
                
                ${totalPages > 1 ? `
                    <!-- 페이지네이션 -->
                    <div class="mt-8 flex items-center justify-center gap-2">
                        ${currentPage > 1 ? `
                            <button class="pagination-prev px-4 py-2 text-sm font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent smooth-transition" data-page="${currentPage - 1}">
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
    const createBtn = document.getElementById('create-group-btn');
    const createEmptyBtn = document.getElementById('create-group-empty-btn');
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');
    
    if(createBtn) {
        createBtn.addEventListener('click', () => {
            window.location.href = '/groups/create.html';
        });
    }
    
    if(createEmptyBtn) {
        createEmptyBtn.addEventListener('click', () => {
            window.location.href = '/groups/create.html';
        });
    }
    
    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            loadGroups(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            loadGroups(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 해시 링크 처리 제거 - 일반 링크로 동작
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
        loadGroups(currentPage);
    });
}

// 페이지 로드 시 자동 렌더링
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGroups);
} else {
    renderGroups();
}
