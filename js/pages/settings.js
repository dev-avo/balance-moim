/**
 * 설정 페이지
 */

import { userApi } from '../services/api.js';
import { checkAuth, signOut } from '../utils/auth.js';
import { showErrorToast, showSuccessToast, showWarningToast } from '../components/Toast.js';
import { createLoading } from '../components/Loading.js';
import { createModal } from '../components/Modal.js';

let userSettings = null;

/**
 * 설정 페이지 렌더링
 */
export async function renderSettings() {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    // 로그인 확인
    const isAuthenticated = await checkAuth();
    if(!isAuthenticated) {
        showErrorToast('로그인 필요', '설정을 변경하려면 로그인이 필요합니다.');
        window.location.href = '/home.html';
        return;
    }
    
    await loadSettings();
}

/**
 * 설정 로드
 */
async function loadSettings() {
    const mainEl = document.getElementById('main');
    
    // 로딩 표시
    const loading = createLoading({ text: '설정을 불러오는 중...', fullScreen: false });
    mainEl.innerHTML = '';
    mainEl.appendChild(loading);
    
    try {
        const [settingsResponse, profileResponse] = await Promise.all([
            fetch('/api/users/settings'),
            fetch('/api/users/me')
        ]);
        
        if(!settingsResponse.ok || !profileResponse.ok) {
            throw new Error('설정을 가져올 수 없습니다.');
        }
        
        const [settingsData, profileData] = await Promise.all([
            settingsResponse.json(),
            profileResponse.json()
        ]);
        
        userSettings = {
            email: profileData.email || '',
            displayName: profileData.name || settingsData.user?.displayName || '',
            customNickname: settingsData.user?.customNickname || null,
            useNickname: settingsData.user?.useNickname ?? false,
            createdGroupsCount: profileData.createdGroupsCount || 0
        };
        
        renderSettingsContent();
    } catch(error) {
        console.error('설정 가져오기 오류:', error);
        showErrorToast('오류', '설정을 가져오는 중 오류가 발생했습니다.');
        renderError(error.message || '설정을 가져올 수 없습니다.');
    }
}

/**
 * 설정 페이지 렌더링
 */
function renderSettingsContent() {
    if(!userSettings) return;
    
    const mainEl = document.getElementById('main');
    let isSaving = false;
    let useNickname = userSettings.useNickname;
    let customNickname = userSettings.customNickname || '';
    
    mainEl.innerHTML = `
        <div class="mx-auto max-w-2xl py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-foreground">설정</h1>
                <p class="mt-2 text-muted-foreground">계정 정보 및 설정을 관리합니다.</p>
            </div>
            
            <!-- 계정 정보 -->
            <div class="mb-8 rounded-2xl border-2 border-border glass p-6 shadow-apple">
                <h2 class="mb-4 text-lg font-semibold text-foreground">계정 정보</h2>
                <div class="space-y-3">
                    <div>
                        <p class="text-sm text-muted-foreground">이메일</p>
                        <p class="font-medium text-foreground">${userSettings.email}</p>
                    </div>
                    <div>
                        <p class="text-sm text-muted-foreground">구글 계정명</p>
                        <p class="font-medium text-foreground">${userSettings.displayName || '없음'}</p>
                    </div>
                </div>
            </div>
            
            <!-- 표시 이름 설정 -->
            <form id="settings-form" class="mb-8">
                <div class="rounded-2xl border-2 border-border glass p-6 shadow-apple">
                    <h2 class="mb-4 text-lg font-semibold text-foreground">표시 이름 설정</h2>
                    <p class="mb-4 text-sm text-muted-foreground">
                        다른 사용자에게 어떻게 표시될지 선택하세요.
                    </p>
                    
                    <div class="space-y-4">
                        <!-- 구글 계정명 사용 -->
                        <label class="flex items-start gap-3 rounded-xl border-2 border-border p-4 cursor-pointer hover:border-primary smooth-transition bg-card">
                            <input
                                type="radio"
                                name="displayNameOption"
                                value="google"
                                ${!useNickname ? 'checked' : ''}
                                class="mt-1 h-4 w-4 text-primary accent-primary"
                            />
                            <div class="flex-1">
                                <p class="font-medium text-foreground">구글 계정명 사용</p>
                                <p class="text-sm text-muted-foreground">
                                    ${userSettings.displayName || '계정명이 없습니다'}
                                </p>
                            </div>
                        </label>
                        
                        <!-- 익명 별명 사용 -->
                        <label class="flex items-start gap-3 rounded-xl border-2 border-border p-4 cursor-pointer hover:border-primary smooth-transition bg-card">
                            <input
                                type="radio"
                                name="displayNameOption"
                                value="nickname"
                                ${useNickname ? 'checked' : ''}
                                class="mt-1 h-4 w-4 text-primary accent-primary"
                            />
                            <div class="flex-1">
                                <p class="font-medium text-foreground">익명 별명 사용</p>
                                <p class="text-sm text-muted-foreground mb-3">
                                    다른 사용자에게 별명으로 표시됩니다
                                </p>
                                <div id="nickname-input-container" class="${useNickname ? '' : 'hidden'}">
                                    <input
                                        id="customNickname"
                                        type="text"
                                        placeholder="별명 입력 (2~12자)"
                                        value="${customNickname}"
                                        maxlength="12"
                                        class="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple"
                                    />
                                    <p id="nickname-error" class="mt-1 text-xs text-destructive hidden"></p>
                                </div>
                            </div>
                        </label>
                    </div>
                    
                    <div class="mt-6">
                        <button
                            type="submit"
                            id="save-btn"
                            class="px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            저장하기
                        </button>
                    </div>
                </div>
            </form>
            
            <!-- 회원 탈퇴 -->
            <div class="rounded-2xl border-2 border-destructive/30 glass bg-destructive/10 p-6 shadow-apple">
                <h2 class="mb-2 text-lg font-semibold text-foreground">회원 탈퇴</h2>
                <p class="mb-4 text-sm text-muted-foreground">
                    탈퇴 시 모든 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
                <button
                    id="delete-account-btn"
                    class="px-6 py-3 text-sm font-semibold rounded-xl bg-destructive text-destructive-foreground shadow-apple hover:shadow-apple-lg hover:bg-destructive/90 smooth-transition"
                >
                    회원 탈퇴
                </button>
            </div>
        </div>
    `;
    
    const form = document.getElementById('settings-form');
    const displayNameOptions = form.querySelectorAll('input[name="displayNameOption"]');
    const nicknameInput = document.getElementById('customNickname');
    const nicknameContainer = document.getElementById('nickname-input-container');
    const nicknameError = document.getElementById('nickname-error');
    const saveBtn = document.getElementById('save-btn');
    const deleteBtn = document.getElementById('delete-account-btn');
    
    // 표시 이름 옵션 변경
    displayNameOptions.forEach(option => {
        option.addEventListener('change', () => {
            useNickname = option.value === 'nickname';
            if(useNickname) {
                nicknameContainer.classList.remove('hidden');
            } else {
                nicknameContainer.classList.add('hidden');
            }
        });
    });
    
    // 별명 입력
    nicknameInput.addEventListener('input', (e) => {
        customNickname = e.target.value;
        nicknameError.classList.add('hidden');
    });
    
    // 폼 제출
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if(isSaving) return;
        
        // 유효성 검사
        if(useNickname) {
            if(!customNickname || customNickname.trim().length < 2) {
                nicknameError.textContent = '별명은 2자 이상이어야 합니다.';
                nicknameError.classList.remove('hidden');
                return;
            }
            
            if(customNickname.length > 12) {
                nicknameError.textContent = '별명은 최대 12자까지 가능합니다.';
                nicknameError.classList.remove('hidden');
                return;
            }
            
            if(!/^[가-힣a-zA-Z0-9_]+$/.test(customNickname)) {
                nicknameError.textContent = '별명은 한글, 영문, 숫자, _만 사용 가능합니다.';
                nicknameError.classList.remove('hidden');
                return;
            }
        }
        
        try {
            isSaving = true;
            saveBtn.disabled = true;
            saveBtn.textContent = '저장 중...';
            
            await userApi.updateSettings({
                useNickname,
                customNickname: useNickname ? customNickname.trim() : null
            });
            
            showSuccessToast('저장 완료', '설정이 저장되었습니다.');
            loadSettings();
        } catch(error) {
            console.error('설정 저장 오류:', error);
            showErrorToast('저장 실패', error.message || '설정을 저장하는 중 오류가 발생했습니다.');
        } finally {
            isSaving = false;
            saveBtn.disabled = false;
            saveBtn.textContent = '저장하기';
        }
    });
    
    // 회원 탈퇴
    deleteBtn.addEventListener('click', () => {
        showDeleteModal();
    });
    
    function showDeleteModal() {
        let deleteConfirm = '';
        
        const modal = createModal({
            title: '⚠️ 회원 탈퇴 확인',
            content: `
                ${userSettings.createdGroupsCount > 0 ? `
                    <div class="rounded-xl border-2 border-yellow-500/30 bg-yellow-500/10 p-4 mb-4">
                        <p class="text-sm font-semibold text-foreground">
                            ⚠️ 생성한 모임이 ${userSettings.createdGroupsCount}개 있습니다
                        </p>
                        <p class="mt-1 text-sm text-muted-foreground">
                            생성자가 탈퇴하면 모임이 남아있지만 관리할 수 없습니다.
                            먼저 다른 멤버에게 관리자 권한을 위임하거나 모임을 삭제해주세요.
                        </p>
                    </div>
                ` : ''}
                
                <div class="text-sm text-muted-foreground mb-4">
                    <p class="font-semibold mb-2 text-foreground">탈퇴 시 삭제되는 정보:</p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>계정 정보</li>
                        <li>작성한 질문 (통계에는 유지됩니다)</li>
                        <li>모임 멤버십</li>
                        <li>응답 데이터 (통계에는 "탈퇴한 사용자"로 표시됩니다)</li>
                    </ul>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-foreground mb-2">
                        확인을 위해 "<strong>탈퇴하기</strong>"를 입력하세요
                    </label>
                    <input
                        id="delete-confirm-input"
                        type="text"
                        placeholder="탈퇴하기"
                        class="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple"
                    />
                </div>
            `,
            onConfirm: async () => {
                const input = document.getElementById('delete-confirm-input');
                if(!input || input.value !== '탈퇴하기') {
                    showWarningToast('확인 필요', '"탈퇴하기"를 정확히 입력해주세요.');
                    return;
                }
                
                if(userSettings.createdGroupsCount > 0) {
                    showErrorToast('오류', '생성한 모임이 있어 탈퇴할 수 없습니다.');
                    return;
                }
                
                try {
                    const response = await fetch('/api/users/me', {
                        method: 'DELETE'
                    });
                    
                    if(!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || '회원 탈퇴에 실패했습니다.');
                    }
                    
                    showSuccessToast('회원 탈퇴 완료', '이용해주셔서 감사합니다.');
                    await signOut();
                } catch(error) {
                    console.error('회원 탈퇴 오류:', error);
                    showErrorToast('탈퇴 실패', error.message || '회원 탈퇴 중 오류가 발생했습니다.');
                }
            },
            confirmText: '회원 탈퇴',
            cancelText: '취소'
        });
    }
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
        loadSettings();
    });
}

// 페이지 로드 시 자동 렌더링
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSettings);
} else {
    renderSettings();
}
