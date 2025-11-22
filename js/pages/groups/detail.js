/**
 * 모임 상세 페이지
 */

import { groupApi } from '../../services/api.js';
import { checkAuth } from '../../utils/auth.js';
import { router } from '../../services/router.js';
import { showErrorToast, showSuccessToast } from '../../components/Toast.js';
import { createLoading } from '../../components/Loading.js';
import { createModal, showConfirmModal } from '../../components/Modal.js';

let groupId = null;
let groupData = null;

/**
 * 모임 상세 페이지 렌더링
 */
export async function renderGroupDetail(route) {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    // groupId 추출 (#groups/123 -> 123)
    const match = route.match(/^groups\/(.+)$/);
    if(!match) {
        router.navigate('#404');
        return;
    }
    
    groupId = match[1];
    
    // 로그인 확인
    const isAuthenticated = await checkAuth();
    if(!isAuthenticated) {
        showErrorToast('로그인 필요', '모임을 보려면 로그인이 필요합니다.');
        router.navigate('#home');
        return;
    }
    
    await loadGroupData();
}

/**
 * 모임 데이터 로드
 */
async function loadGroupData() {
    const mainEl = document.getElementById('main');
    
    // 로딩 표시
    const loading = createLoading({ text: '모임 정보를 불러오는 중...', fullScreen: false });
    mainEl.innerHTML = '';
    mainEl.appendChild(loading);
    
    try {
        const data = await groupApi.getById(groupId);
        groupData = data.group;
        
        // 멤버가 아닌 경우
        if(!groupData.isMember && groupData) {
            renderNotMember();
            return;
        }
        
        renderGroupDetail();
    } catch(error) {
        console.error('모임 정보 가져오기 오류:', error);
        showErrorToast('오류', error.message || '모임을 찾을 수 없습니다.');
        renderError(error.message || '모임을 찾을 수 없습니다.');
    }
}

/**
 * 모임 상세 렌더링
 */
function renderGroupDetail() {
    if(!groupData) return;
    
    const mainEl = document.getElementById('main');
    
    mainEl.innerHTML = `
        <div class="mx-auto max-w-4xl py-8">
            <!-- 헤더 -->
            <div class="mb-8">
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-foreground mb-2">
                            ${groupData.name}
                        </h1>
                        ${groupData.isCreator ? `
                            <span class="inline-flex items-center rounded-full glass border border-primary/30 bg-primary/20 px-3 py-1 text-sm font-semibold text-primary shadow-apple">
                                👑 내가 만든 모임
                            </span>
                        ` : ''}
                    </div>
                    <div class="flex gap-2">
                        ${groupData.isMember ? `
                            <button id="invite-btn" class="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent hover:text-accent-foreground smooth-transition">
                                📋 초대 링크 생성
                            </button>
                        ` : ''}
                        ${groupData.isCreator ? `
                            <a href="#groups/${groupId}/settings" class="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent hover:text-accent-foreground smooth-transition">
                                ⚙️ 설정
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                ${groupData.description ? `
                    <p class="text-muted-foreground whitespace-pre-line">${groupData.description}</p>
                ` : ''}
            </div>
            
            <!-- 통계 -->
            <div class="mb-8 grid gap-4 sm:grid-cols-2">
                <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple">
                    <div class="flex items-center gap-3">
                        <div class="flex h-12 w-12 items-center justify-center rounded-full glass border border-primary/30 bg-primary/20">
                            <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">총 멤버</p>
                            <p class="text-2xl font-bold text-foreground">${groupData.memberCount}명</p>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple">
                    <div class="flex items-center gap-3">
                        <div class="flex h-12 w-12 items-center justify-center rounded-full glass border border-secondary/30 bg-secondary/20">
                            <svg class="h-6 w-6 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">총 응답</p>
                            <p class="text-2xl font-bold text-foreground">${groupData.responseCount}개</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 취향 유사도 랭킹 -->
            ${groupData.isMember ? `
                <div class="mb-8" id="similarity-container">
                    <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple">
                        <h2 class="mb-4 text-xl font-bold text-foreground">취향 유사도 랭킹</h2>
                        <div class="text-center text-muted-foreground py-8">
                            로딩 중...
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <!-- 모임 응답 통계 -->
            ${groupData.isMember ? `
                <div class="mb-8" id="responses-container">
                    <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple">
                        <h2 class="mb-4 text-xl font-bold text-foreground">모임 응답 통계</h2>
                        <div class="text-center text-muted-foreground py-8">
                            로딩 중...
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <!-- 모임 나가기 (생성자 아닌 경우만) -->
            ${groupData.isMember && !groupData.isCreator ? `
                <div class="mb-8">
                    <button id="leave-btn" class="px-6 py-3 text-sm font-semibold rounded-xl bg-destructive text-destructive-foreground shadow-apple hover:shadow-apple-lg hover:bg-destructive/90 smooth-transition">
                        모임 나가기
                    </button>
                </div>
            ` : ''}
            
            <!-- 멤버 목록 -->
            <div>
                <h2 class="mb-4 text-xl font-bold text-foreground">
                    멤버 목록 (${groupData.members?.length || 0}명)
                </h2>
                <div class="space-y-2" id="members-list">
                    ${groupData.members ? groupData.members.map(member => `
                        <div class="flex items-center justify-between rounded-2xl glass border-2 border-border p-4 shadow-apple">
                            <div class="flex items-center gap-3">
                                <div class="flex h-10 w-10 items-center justify-center rounded-full glass border border-border text-foreground font-bold">
                                    ${member.name?.[0] || '?'}
                                </div>
                                <div>
                                    <p class="font-bold text-foreground">
                                        ${member.name || '익명 사용자'}
                                        ${member.id === groupData.creatorId ? '<span class="ml-2 text-sm">👑</span>' : ''}
                                    </p>
                                    ${member.status === -1 ? '<p class="text-sm text-muted-foreground">(탈퇴한 사용자)</p>' : ''}
                                </div>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
            </div>
        </div>
    `;
    
    // 이벤트 리스너
    const inviteBtn = document.getElementById('invite-btn');
    const leaveBtn = document.getElementById('leave-btn');
    
    if(inviteBtn) {
        inviteBtn.addEventListener('click', async () => {
            try {
                const data = await groupApi.createInvite(groupId);
                const inviteUrl = `${window.location.origin}/#invite/${data.inviteCode}`;
                
                // 클립보드에 복사
                await navigator.clipboard.writeText(inviteUrl);
                showSuccessToast('초대 링크 생성 완료', '클립보드에 복사되었습니다!');
            } catch(error) {
                showErrorToast('오류', error.message || '초대 링크를 생성할 수 없습니다.');
            }
        });
    }
    
    if(leaveBtn) {
        leaveBtn.addEventListener('click', async () => {
            const confirmed = confirm(`정말 "${groupData.name}" 모임에서 나가시겠습니까?`);
            if(!confirmed) return;
            
            try {
                await groupApi.leave(groupId);
                showSuccessToast('모임 나가기 완료', `${groupData.name} 모임에서 나갔습니다.`);
                router.navigate('#groups');
            } catch(error) {
                showErrorToast('나가기 실패', error.message || '모임에서 나가는 중 오류가 발생했습니다.');
            }
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
    
    // 취향 유사도 및 응답 통계 로드
    if(groupData.isMember) {
        loadSimilarity();
        loadResponses();
    }
}

/**
 * 취향 유사도 로드
 */
async function loadSimilarity() {
    try {
        const data = await groupApi.getSimilarity(groupId);
        const container = document.getElementById('similarity-container');
        if(container && data.ranking) {
            container.innerHTML = `
                <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple">
                    <h2 class="mb-4 text-xl font-bold text-foreground">취향 유사도 랭킹</h2>
                    <div class="space-y-3">
                        ${data.ranking.slice(0, 10).map((item, index) => `
                            <div class="flex items-center justify-between rounded-xl glass border border-border p-3">
                                <div class="flex items-center gap-3">
                                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                                        ${index + 1}
                                    </span>
                                    <span class="font-medium text-foreground">${item.name || '익명 사용자'}</span>
                                </div>
                                <span class="text-sm font-bold text-primary">${item.similarity}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    } catch(error) {
        console.error('취향 유사도 로드 오류:', error);
    }
}

/**
 * 응답 통계 로드
 */
async function loadResponses() {
    try {
        const data = await groupApi.getResponses(groupId);
        const container = document.getElementById('responses-container');
        if(container && data.responses) {
            container.innerHTML = `
                <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple">
                    <h2 class="mb-4 text-xl font-bold text-foreground">모임 응답 통계</h2>
                    <div class="space-y-4">
                        ${data.responses.slice(0, 5).map(response => `
                            <div class="rounded-xl glass border border-border p-4">
                                <h3 class="font-semibold text-foreground mb-2">${response.questionTitle}</h3>
                                <div class="space-y-2">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm font-medium text-foreground">A. ${response.optionA}</span>
                                        <span class="text-sm font-bold text-primary">${response.optionACount}명 (${response.optionAPercentage}%)</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm font-medium text-foreground">B. ${response.optionB}</span>
                                        <span class="text-sm font-bold text-orange-600 dark:text-orange-400">${response.optionBCount}명 (${response.optionBPercentage}%)</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    } catch(error) {
        console.error('응답 통계 로드 오류:', error);
    }
}

/**
 * 멤버가 아닌 경우 렌더링
 */
function renderNotMember() {
    const mainEl = document.getElementById('main');
    mainEl.innerHTML = `
        <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div class="max-w-md text-center glass rounded-2xl border-2 border-border p-8 shadow-apple">
                <div class="text-6xl mb-4">🔒</div>
                <h2 class="text-2xl font-bold text-foreground mb-2">
                    모임 멤버만 볼 수 있습니다
                </h2>
                <p class="text-muted-foreground mb-6">
                    이 모임에 참여하려면 초대 링크가 필요합니다.
                </p>
                <button id="go-groups-btn" class="px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                    내 모임으로 이동
                </button>
            </div>
        </div>
    `;
    
    const goGroupsBtn = document.getElementById('go-groups-btn');
    goGroupsBtn.addEventListener('click', () => {
        router.navigate('#groups');
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
        loadGroupData();
    });
}
