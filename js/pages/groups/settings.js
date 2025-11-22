/**
 * 모임 설정 페이지 (생성자 전용)
 */

import { groupApi } from '../services/api.js';
import { checkAuth } from '../utils/auth.js';
import { router } from '../services/router.js';
import { showErrorToast, showSuccessToast } from '../components/Toast.js';
import { createLoading } from '../components/Loading.js';

let groupId = null;
let groupData = null;
let members = [];

/**
 * 모임 설정 페이지 렌더링
 */
export async function renderGroupSettings(route) {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    // groupId 추출 (#groups/123/settings -> 123)
    const match = route.match(/^groups\/(.+)\/settings$/);
    if(!match) {
        router.navigate('#404');
        return;
    }
    
    groupId = match[1];
    
    // 로그인 확인
    const isAuthenticated = await checkAuth();
    if(!isAuthenticated) {
        showErrorToast('로그인 필요', '로그인이 필요합니다.');
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
        members = data.members || [];
        
        // 생성자 권한 확인
        if(!groupData.isCreator) {
            showErrorToast('권한 없음', '모임 생성자만 접근할 수 있습니다.');
            router.navigate(`#groups/${groupId}`);
            return;
        }
        
        renderSettings();
    } catch(error) {
        console.error('모임 정보 가져오기 오류:', error);
        showErrorToast('오류', error.message || '모임을 찾을 수 없습니다.');
        renderError(error.message || '모임을 찾을 수 없습니다.');
    }
}

/**
 * 설정 페이지 렌더링
 */
function renderSettings() {
    if(!groupData) return;
    
    const mainEl = document.getElementById('main');
    let isSavingInfo = false;
    let removingMemberId = null;
    
    mainEl.innerHTML = `
        <div class="mx-auto max-w-4xl py-8 space-y-8">
            <!-- 헤더 -->
            <div>
                <div class="mb-4 flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-foreground mb-2">
                            모임 관리
                        </h1>
                        <p class="text-muted-foreground">${groupData.name}</p>
                    </div>
                    <a href="#groups/${groupId}" class="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent hover:text-accent-foreground smooth-transition">
                        ← 모임으로 돌아가기
                    </a>
                </div>
            </div>
            
            <!-- 모임 정보 수정 -->
            <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple">
                <h2 class="mb-4 text-xl font-bold text-foreground">
                    모임 정보
                </h2>
                
                <form id="group-info-form" class="space-y-4">
                    <!-- 모임 이름 -->
                    <div>
                        <label for="name" class="block text-sm font-medium text-foreground mb-2">
                            모임 이름 <span class="text-destructive">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="모임 이름 (2~50자)"
                            value="${groupData.name}"
                            required
                            minlength="2"
                            maxlength="50"
                            class="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple"
                        />
                        <p id="name-error" class="mt-1 text-xs text-destructive hidden"></p>
                    </div>
                    
                    <!-- 모임 설명 -->
                    <div>
                        <label for="description" class="block text-sm font-medium text-foreground mb-2">
                            모임 설명
                        </label>
                        <textarea
                            id="description"
                            placeholder="모임에 대한 설명을 입력하세요 (최대 500자)"
                            maxlength="500"
                            class="w-full rounded-xl glass border-2 border-border bg-card text-foreground px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple min-h-[100px] resize-y"
                        >${groupData.description || ''}</textarea>
                        <p id="description-error" class="mt-1 text-xs text-destructive hidden"></p>
                    </div>
                    
                    <!-- 저장 버튼 -->
                    <div class="flex justify-end">
                        <button
                            type="submit"
                            id="save-info-btn"
                            class="px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            변경사항 저장
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- 멤버 관리 -->
            <div class="rounded-2xl glass border-2 border-border p-6 shadow-apple">
                <h2 class="mb-4 text-xl font-bold text-foreground">
                    멤버 관리 (${members.length}명)
                </h2>
                
                <div class="space-y-3" id="members-list">
                    ${members.map(member => {
                        const isCreator = member.id === groupData.creatorId;
                        return `
                            <div class="flex items-center justify-between rounded-2xl glass border-2 border-border p-4 shadow-apple">
                                <div class="flex items-center gap-3">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-full glass border border-border text-foreground font-semibold">
                                        ${member.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p class="font-semibold text-foreground">
                                            ${member.name || '익명 사용자'}
                                            ${isCreator ? '<span class="ml-2 text-sm text-primary font-semibold">👑 생성자</span>' : ''}
                                        </p>
                                        ${member.status === -1 ? '<p class="text-sm text-muted-foreground">(탈퇴한 사용자)</p>' : ''}
                                    </div>
                                </div>
                                
                                ${!isCreator && member.status !== -1 ? `
                                    <button
                                        data-member-id="${member.id}"
                                        data-member-name="${member.name || '익명 사용자'}"
                                        class="remove-member-btn px-4 py-2 text-sm font-semibold rounded-xl bg-destructive text-destructive-foreground shadow-apple hover:shadow-apple-lg hover:bg-destructive/90 smooth-transition disabled:opacity-50"
                                    >
                                        추방
                                    </button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- 안내 문구 -->
            <div class="mt-8 rounded-2xl glass border-2 border-yellow-500/30 bg-yellow-500/10 p-6 shadow-apple">
                <h3 class="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                    <span class="text-2xl">⚠️</span>
                    주의사항
                </h3>
                <ul class="space-y-2 text-sm text-muted-foreground">
                    <li class="flex items-start gap-2">
                        <span class="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                        <span>추방된 멤버는 초대 링크를 통해 다시 참여할 수 있습니다.</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                        <span>추방된 멤버의 기존 응답은 유지됩니다.</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                        <span>생성자는 추방할 수 없습니다.</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
    
    // 이벤트 리스너
    const form = document.getElementById('group-info-form');
    const saveBtn = document.getElementById('save-info-btn');
    const removeBtns = document.querySelectorAll('.remove-member-btn');
    
    // 모임 정보 저장
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if(isSavingInfo) return;
        
        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');
        const nameError = document.getElementById('name-error');
        const descriptionError = document.getElementById('description-error');
        
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        
        // 유효성 검사
        if(!name || name.length < 2) {
            nameError.textContent = '모임 이름은 2자 이상이어야 합니다.';
            nameError.classList.remove('hidden');
            return;
        }
        
        if(name.length > 50) {
            nameError.textContent = '모임 이름은 최대 50자까지 가능합니다.';
            nameError.classList.remove('hidden');
            return;
        }
        
        try {
            isSavingInfo = true;
            saveBtn.disabled = true;
            saveBtn.textContent = '저장 중...';
            
            await groupApi.update(groupId, {
                name,
                description: description || null
            });
            
            showSuccessToast('저장 완료', '모임 정보가 수정되었습니다.');
            loadGroupData();
        } catch(error) {
            console.error('모임 정보 수정 오류:', error);
            showErrorToast('저장 실패', error.message || '모임 정보를 수정하는 중 오류가 발생했습니다.');
        } finally {
            isSavingInfo = false;
            saveBtn.disabled = false;
            saveBtn.textContent = '변경사항 저장';
        }
    });
    
    // 멤버 추방
    removeBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const memberId = btn.getAttribute('data-member-id');
            const memberName = btn.getAttribute('data-member-name');
            
            if(!confirm(`정말 "${memberName}"를 모임에서 추방하시겠습니까?`)) {
                return;
            }
            
            try {
                removingMemberId = memberId;
                btn.disabled = true;
                btn.textContent = '추방 중...';
                
                await fetch(`/api/groups/${groupId}/members/${memberId}`, {
                    method: 'DELETE'
                });
                
                showSuccessToast('추방 완료', `${memberName}가 모임에서 추방되었습니다.`);
                loadGroupData();
            } catch(error) {
                console.error('멤버 추방 오류:', error);
                showErrorToast('추방 실패', error.message || '멤버를 추방하는 중 오류가 발생했습니다.');
            } finally {
                removingMemberId = null;
            }
        });
    });
    
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
        loadGroupData();
    });
}
