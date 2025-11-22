/**
 * 모임 생성 페이지
 */

import { groupApi } from '../services/api.js';
import { checkAuth } from '../utils/auth.js';
import { router } from '../services/router.js';
import { showErrorToast, showSuccessToast } from '../components/Toast.js';
import { createLoading } from '../components/Loading.js';
import { createInput, createTextarea } from '../components/Input.js';
import { createButton } from '../components/Button.js';

let formData = {
    name: '',
    description: ''
};

/**
 * 모임 생성 페이지 렌더링
 */
export async function renderCreateGroup() {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    // 로그인 확인
    const isAuthenticated = await checkAuth();
    if(!isAuthenticated) {
        showErrorToast('로그인 필요', '모임을 만들려면 로그인이 필요합니다.');
        router.navigate('#home');
        return;
    }
    
    renderForm();
}

/**
 * 폼 렌더링
 */
function renderForm() {
    const mainEl = document.getElementById('main');
    let isSubmitting = false;
    
    mainEl.innerHTML = `
        <div class="mx-auto max-w-2xl py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-foreground">새 모임 만들기</h1>
                <p class="mt-2 text-muted-foreground">
                    친구, 동료, 팀원들과 함께 밸런스 게임을 즐겨보세요!
                </p>
            </div>
            
            <form id="group-form" class="space-y-6">
                <!-- 모임 이름 -->
                <div>
                    <label for="name" class="block text-sm font-medium text-foreground mb-2">
                        모임 이름 <span class="text-destructive">*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder="예: 회사 동료, 대학 친구, 우리 팀"
                        maxlength="30"
                        required
                        class="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple"
                    />
                    <p class="mt-1 text-xs text-muted-foreground">
                        최대 30자까지 입력 가능합니다.
                    </p>
                    <p id="name-error" class="mt-1 text-xs text-destructive hidden"></p>
                </div>
                
                <!-- 모임 설명 -->
                <div>
                    <label for="description" class="block text-sm font-medium text-foreground mb-2">
                        모임 설명 (선택)
                    </label>
                    <textarea
                        id="description"
                        rows="4"
                        placeholder="모임에 대한 간단한 설명을 입력하세요"
                        maxlength="200"
                        class="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple resize-y"
                    ></textarea>
                    <p class="mt-1 text-xs text-muted-foreground">
                        최대 200자까지 입력 가능합니다.
                    </p>
                    <p id="description-error" class="mt-1 text-xs text-destructive hidden"></p>
                </div>
                
                <!-- 안내 문구 -->
                <div class="rounded-2xl border-2 border-primary/30 glass bg-primary/5 p-6">
                    <h3 class="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                        <span class="text-xl">💡</span>
                        모임 생성 후 할 수 있는 일
                    </h3>
                    <ul class="space-y-2 text-sm text-muted-foreground">
                        <li class="flex items-start gap-2">
                            <span class="text-primary mt-0.5">•</span>
                            <span>초대 링크를 생성하여 친구들을 초대</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-primary mt-0.5">•</span>
                            <span>모임 전용 밸런스 질문 만들기</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-primary mt-0.5">•</span>
                            <span>모임 멤버들의 답변 비교 및 통계 확인</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-primary mt-0.5">•</span>
                            <span>나와 취향이 비슷한 멤버 찾기</span>
                        </li>
                    </ul>
                </div>
                
                <!-- 제출 버튼 -->
                <div class="flex gap-4">
                    <button
                        type="submit"
                        id="submit-btn"
                        class="flex-1 px-8 py-6 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        모임 만들기
                    </button>
                    <button
                        type="button"
                        id="cancel-btn"
                        class="px-8 py-6 text-base font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent hover:text-accent-foreground smooth-transition"
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    `;
    
    const form = document.getElementById('group-form');
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const nameError = document.getElementById('name-error');
    const descriptionError = document.getElementById('description-error');
    
    // 입력 이벤트
    nameInput.addEventListener('input', (e) => {
        formData.name = e.target.value;
        nameError.classList.add('hidden');
    });
    
    descriptionInput.addEventListener('input', (e) => {
        formData.description = e.target.value;
        descriptionError.classList.add('hidden');
    });
    
    // 폼 제출
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if(isSubmitting) return;
        
        // 유효성 검사
        if(!formData.name || formData.name.trim().length === 0) {
            nameError.textContent = '모임 이름은 필수입니다.';
            nameError.classList.remove('hidden');
            return;
        }
        
        if(formData.name.length > 30) {
            nameError.textContent = '모임 이름은 최대 30자까지 가능합니다.';
            nameError.classList.remove('hidden');
            return;
        }
        
        if(formData.description && formData.description.length > 200) {
            descriptionError.textContent = '모임 설명은 최대 200자까지 가능합니다.';
            descriptionError.classList.remove('hidden');
            return;
        }
        
        try {
            isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.textContent = '생성 중...';
            
            const data = await groupApi.create({
                name: formData.name.trim(),
                description: formData.description?.trim() || null
            });
            
            showSuccessToast('모임 생성 완료', '모임이 성공적으로 생성되었습니다!');
            router.navigate('#groups');
        } catch(error) {
            console.error('모임 생성 오류:', error);
            showErrorToast('생성 실패', error.message || '모임을 생성하는 중 오류가 발생했습니다.');
        } finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = '모임 만들기';
        }
    });
    
    // 취소 버튼
    cancelBtn.addEventListener('click', () => {
        router.navigate('#groups');
    });
}
