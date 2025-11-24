/**
 * 초대 링크 페이지
 */

import { groupApi } from '../services/api.js';
import { checkAuth, signInWithGoogle } from '../utils/auth.js';
import { showErrorToast, showSuccessToast, showWarningToast } from '../components/Toast.js';
import { createLoading } from '../components/Loading.js';

let inviteCode = null;
let inviteData = null;

/**
 * 초대 링크 페이지 렌더링
 */
export async function renderInvite() {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    // inviteCode 추출 (URL 쿼리 파라미터에서)
    const url = new URL(window.location.href);
    inviteCode = url.searchParams.get('code');
    
    if(!inviteCode) {
        window.location.href = '/404.html';
        return;
    }
    
    await loadInviteData();
}

/**
 * 초대 링크 데이터 로드
 */
async function loadInviteData() {
    const mainEl = document.getElementById('main');
    
    // 로딩 표시
    const loading = createLoading({ text: '초대 링크 확인 중...', fullScreen: false });
    mainEl.innerHTML = '';
    mainEl.appendChild(loading);
    
    try {
        const response = await fetch(`/api/groups/join/${inviteCode}`);
        
        if(!response.ok) {
            const data = await response.json();
            throw new Error(data.error || '초대 링크를 찾을 수 없습니다.');
        }
        
        inviteData = await response.json();
        
        // 만료 확인
        if(inviteData.isExpired) {
            renderExpired();
            return;
        }
        
        renderInviteContent();
    } catch(error) {
        console.error('초대 링크 정보 가져오기 오류:', error);
        showErrorToast('오류', error.message || '초대 링크를 찾을 수 없습니다.');
        renderError(error.message || '초대 링크를 찾을 수 없습니다.');
    }
}

/**
 * 초대 페이지 렌더링
 */
function renderInviteContent() {
    if(!inviteData) return;
    
    const mainEl = document.getElementById('main');
    
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
            <div class="max-w-md w-full px-4">
                <div class="rounded-2xl glass border-2 border-border p-8 shadow-apple-lg">
                    <!-- 초대 아이콘 -->
                    <div class="mb-6 flex justify-center">
                        <div class="flex h-16 w-16 items-center justify-center rounded-full glass border-2 border-primary/30 bg-primary/10 text-3xl shadow-apple">
                            👋
                        </div>
                    </div>
                    
                    <!-- 모임 정보 -->
                    <div class="mb-6 text-center">
                        <h1 class="text-2xl font-bold text-foreground mb-2">
                            ${inviteData.groupName}
                        </h1>
                        ${inviteData.groupDescription ? `
                            <p class="text-muted-foreground mb-4">${inviteData.groupDescription}</p>
                        ` : ''}
                        <div class="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                            </svg>
                            <span class="font-semibold">${inviteData.memberCount}명 참여 중</span>
                        </div>
                    </div>
                    
                    <!-- 안내 문구 -->
                    <div class="mb-6 rounded-xl glass border-2 border-primary/30 bg-primary/5 p-4 shadow-apple">
                        <p class="text-sm text-foreground">
                            이 모임에 참여하면 밸런스 질문에 함께 응답하고,
                            다른 멤버들의 선택과 비교할 수 있습니다.
                        </p>
                    </div>
                    
                    <!-- 참여 버튼 -->
                    <div id="join-container">
                        <div class="flex justify-center">
                            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 로그인 상태 확인 및 버튼 렌더링
    checkAuthAndRenderButton();
}

/**
 * 로그인 상태 확인 및 버튼 렌더링
 */
async function checkAuthAndRenderButton() {
    const container = document.getElementById('join-container');
    const isAuthenticated = await checkAuth();
    
    if(!isAuthenticated) {
        container.innerHTML = `
            <div class="space-y-3">
                <button
                    id="sign-in-btn"
                    class="w-full px-8 py-6 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple-lg hover:shadow-apple hover:bg-primary/90 smooth-transition"
                >
                    Google 로그인하고 참여하기
                </button>
                <p class="text-center text-xs text-muted-foreground">
                    로그인하면 모임에 참여할 수 있습니다
                </p>
            </div>
        `;
        
        const signInBtn = document.getElementById('sign-in-btn');
        signInBtn.addEventListener('click', () => {
            signInWithGoogle();
        });
    } else {
        container.innerHTML = `
            <button
                id="join-btn"
                class="w-full px-8 py-6 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple-lg hover:shadow-apple hover:bg-primary/90 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                모임 참여하기
            </button>
        `;
        
        const joinBtn = document.getElementById('join-btn');
        joinBtn.addEventListener('click', async () => {
            await handleJoinGroup();
        });
    }
}

/**
 * 모임 참여 처리
 */
async function handleJoinGroup() {
    const joinBtn = document.getElementById('join-btn');
    
    try {
        joinBtn.disabled = true;
        joinBtn.textContent = '참여 중...';
        
        const response = await fetch(`/api/groups/join/${inviteCode}`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if(!response.ok) {
            throw new Error(data.error || '모임 참여에 실패했습니다.');
        }
        
        showSuccessToast('모임 참여 완료', `${inviteData.groupName} 모임에 참여했습니다!`);
        window.location.href = `/groups/detail.html?id=${data.groupId}`;
    } catch(error) {
        console.error('모임 참여 오류:', error);
        showErrorToast('참여 실패', error.message || '모임 참여 중 오류가 발생했습니다.');
        joinBtn.disabled = false;
        joinBtn.textContent = '모임 참여하기';
    }
}

/**
 * 만료된 초대 링크 렌더링
 */
function renderExpired() {
    const mainEl = document.getElementById('main');
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div class="max-w-md text-center glass rounded-2xl border-2 border-border p-8 shadow-apple">
                <div class="text-6xl mb-4 opacity-80">⏰</div>
                <h2 class="text-2xl font-bold text-foreground mb-2">
                    초대 링크가 만료되었습니다
                </h2>
                <p class="text-muted-foreground mb-6">
                    이 초대 링크는 더 이상 유효하지 않습니다.<br>
                    모임 관리자에게 새로운 초대 링크를 요청해주세요.
                </p>
                <button id="go-home-btn" class="px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                    홈으로 이동
                </button>
            </div>
        </div>
    `;
    
    const goHomeBtn = document.getElementById('go-home-btn');
    goHomeBtn.addEventListener('click', () => {
        window.location.href = '/home.html';
    });
}

// 페이지 로드 시 자동 렌더링
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderInvite);
} else {
    renderInvite();
}

/**
 * 에러 렌더링
 */
function renderError(message) {
    const mainEl = document.getElementById('main');
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div class="text-center space-y-4 glass rounded-2xl border-2 border-border p-8 shadow-apple">
                <div class="text-6xl">😕</div>
                <h2 class="text-2xl font-bold text-foreground">초대 링크 오류</h2>
                <p class="text-muted-foreground">${message}</p>
                <button id="retry-btn" class="px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                    다시 시도
                </button>
            </div>
        </div>
    `;
    
    const retryBtn = document.getElementById('retry-btn');
    retryBtn.addEventListener('click', () => {
        loadInviteData();
    });
}
