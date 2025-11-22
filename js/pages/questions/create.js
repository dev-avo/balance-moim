/**
 * 질문 생성 페이지
 */

import { questionApi, tagApi } from '../../services/api.js';
import { checkAuth } from '../../utils/auth.js';
import { router } from '../../services/router.js';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../components/Toast.js';
import { createLoading } from '../../components/Loading.js';

let tags = [];
let tagSuggestions = [];
let isComposing = false;

/**
 * 질문 생성 페이지 렌더링
 */
export async function renderCreateQuestion() {
    const mainEl = document.getElementById('main');
    if(!mainEl) return;
    
    // 로그인 확인
    const isAuthenticated = await checkAuth();
    if(!isAuthenticated) {
        showErrorToast('로그인 필요', '질문을 등록하려면 로그인이 필요합니다.');
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
    let formData = {
        title: '',
        optionA: '',
        optionB: '',
        visibility: 'public',
        tagInput: ''
    };
    
    mainEl.innerHTML = `
        <div class="mx-auto max-w-2xl py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-foreground">새 질문 만들기</h1>
                <p class="mt-2 text-muted-foreground">
                    재미있는 밸런스 질문을 만들어 친구들과 공유하세요!
                </p>
            </div>
            
            <form id="question-form" class="space-y-6">
                <!-- 질문 제목 -->
                <div>
                    <label for="title" class="block text-sm font-medium text-foreground mb-2">
                        질문 제목 <span class="text-destructive">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="예: 더 맛있는 진라면은?"
                        maxlength="100"
                        required
                        class="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple"
                    />
                    <p id="title-error" class="mt-1 text-xs text-destructive hidden"></p>
                </div>
                
                <!-- 선택지 A -->
                <div>
                    <label for="optionA" class="block text-sm font-medium text-foreground mb-2">
                        선택지 A <span class="text-destructive">*</span>
                    </label>
                    <input
                        id="optionA"
                        type="text"
                        placeholder="예: 매운맛"
                        maxlength="50"
                        required
                        class="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple"
                    />
                    <p id="optionA-error" class="mt-1 text-xs text-destructive hidden"></p>
                </div>
                
                <!-- 선택지 B -->
                <div>
                    <label for="optionB" class="block text-sm font-medium text-foreground mb-2">
                        선택지 B <span class="text-destructive">*</span>
                    </label>
                    <input
                        id="optionB"
                        type="text"
                        placeholder="예: 순한맛"
                        maxlength="50"
                        required
                        class="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple"
                    />
                    <p id="optionB-error" class="mt-1 text-xs text-destructive hidden"></p>
                </div>
                
                <!-- 태그 입력 -->
                <div>
                    <label for="tagInput" class="block text-sm font-medium text-foreground mb-2">
                        태그 <span class="text-destructive">*</span>
                        <span class="ml-2 text-xs text-muted-foreground">(최소 1개, 최대 5개)</span>
                    </label>
                    
                    <!-- 추가된 태그 목록 -->
                    <div id="tags-container" class="mb-3 flex flex-wrap gap-2"></div>
                    
                    <!-- 태그 입력 필드 -->
                    <div class="relative">
                        <input
                            id="tagInput"
                            type="text"
                            placeholder="태그 입력 후 Enter"
                            class="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple"
                        />
                        
                        <!-- 자동완성 제안 -->
                        <div id="tag-suggestions" class="absolute z-10 mt-1 w-full rounded-2xl glass border-2 border-border shadow-apple-lg hidden"></div>
                    </div>
                    <p class="mt-1 text-xs text-muted-foreground">
                        태그를 입력하고 Enter를 누르세요. 기존 태그를 선택하거나 새로 만들 수 있습니다.
                    </p>
                </div>
                
                <!-- 공개 설정 -->
                <div>
                    <label class="block text-sm font-medium text-foreground mb-2">
                        공개 설정
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="visibility"
                                value="public"
                                checked
                                class="h-4 w-4 text-primary accent-primary"
                            />
                            <span class="text-sm text-foreground">전체 공개 - 모든 사용자가 볼 수 있습니다</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="visibility"
                                value="private"
                                class="h-4 w-4 text-primary accent-primary"
                            />
                            <span class="text-sm text-foreground">비공개 - 나만 볼 수 있습니다</span>
                        </label>
                    </div>
                </div>
                
                <!-- 제출 버튼 -->
                <div class="flex gap-4">
                    <button
                        type="submit"
                        id="submit-btn"
                        class="flex-1 px-8 py-6 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        질문 등록하기
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
    
    const form = document.getElementById('question-form');
    const titleInput = document.getElementById('title');
    const optionAInput = document.getElementById('optionA');
    const optionBInput = document.getElementById('optionB');
    const tagInput = document.getElementById('tagInput');
    const tagsContainer = document.getElementById('tags-container');
    const tagSuggestionsEl = document.getElementById('tag-suggestions');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // 입력 이벤트
    titleInput.addEventListener('input', (e) => {
        formData.title = e.target.value;
    });
    
    optionAInput.addEventListener('input', (e) => {
        formData.optionA = e.target.value;
    });
    
    optionBInput.addEventListener('input', (e) => {
        formData.optionB = e.target.value;
    });
    
    // 태그 입력 이벤트
    tagInput.addEventListener('input', async (e) => {
        formData.tagInput = e.target.value;
        
        if(formData.tagInput && formData.tagInput.length > 0) {
            try {
                const data = await tagApi.search(formData.tagInput, 5);
                tagSuggestions = data.tags || [];
                renderTagSuggestions();
            } catch(error) {
                console.error('태그 검색 오류:', error);
            }
        } else {
            tagSuggestions = [];
            tagSuggestionsEl.classList.add('hidden');
        }
    });
    
    tagInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            const value = formData.tagInput.trim();
            if(value) {
                addTag(value);
            }
        }
    });
    
    // 태그 추가
    function addTag(tagName) {
        if(tags.length >= 5) {
            showWarningToast('태그 개수 초과', '최대 5개까지 태그를 추가할 수 있습니다.');
            return;
        }
        
        if(!tags.includes(tagName)) {
            tags.push(tagName);
            renderTags();
            tagInput.value = '';
            formData.tagInput = '';
            tagSuggestionsEl.classList.add('hidden');
        }
    }
    
    // 태그 제거
    function removeTag(tagName) {
        tags = tags.filter(t => t !== tagName);
        renderTags();
    }
    
    // 태그 렌더링
    function renderTags() {
        tagsContainer.innerHTML = tags.map(tag => `
            <span class="inline-flex items-center gap-2 rounded-full glass border-2 border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-apple">
                #${tag}
                <button
                    type="button"
                    data-tag="${tag}"
                    class="remove-tag-btn text-primary hover:text-primary-foreground smooth-transition"
                >
                    ×
                </button>
            </span>
        `).join('');
        
        // 제거 버튼 이벤트
        tagsContainer.querySelectorAll('.remove-tag-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                removeTag(btn.getAttribute('data-tag'));
            });
        });
    }
    
    // 태그 제안 렌더링
    function renderTagSuggestions() {
        if(tagSuggestions.length === 0) {
            tagSuggestionsEl.classList.add('hidden');
            return;
        }
        
        tagSuggestionsEl.classList.remove('hidden');
        tagSuggestionsEl.innerHTML = tagSuggestions.map(suggestion => `
            <button
                type="button"
                data-tag="${suggestion.name}"
                class="block w-full px-4 py-2.5 text-left text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl smooth-transition first:rounded-t-2xl last:rounded-b-2xl"
            >
                #${suggestion.name}
            </button>
        `).join('');
        
        // 제안 클릭 이벤트
        tagSuggestionsEl.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                addTag(btn.getAttribute('data-tag'));
            });
        });
    }
    
    // 폼 제출
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if(isSubmitting) return;
        
        // 유효성 검사
        if(!formData.title || formData.title.trim().length === 0) {
            showErrorToast('오류', '질문 제목은 필수입니다.');
            return;
        }
        
        if(formData.title.length > 100) {
            showErrorToast('오류', '질문 제목은 최대 100자까지 가능합니다.');
            return;
        }
        
        if(!formData.optionA || formData.optionA.trim().length === 0) {
            showErrorToast('오류', '선택지 A는 필수입니다.');
            return;
        }
        
        if(formData.optionA.length > 50) {
            showErrorToast('오류', '선택지 A는 최대 50자까지 가능합니다.');
            return;
        }
        
        if(!formData.optionB || formData.optionB.trim().length === 0) {
            showErrorToast('오류', '선택지 B는 필수입니다.');
            return;
        }
        
        if(formData.optionB.length > 50) {
            showErrorToast('오류', '선택지 B는 최대 50자까지 가능합니다.');
            return;
        }
        
        if(tags.length === 0) {
            showWarningToast('태그 필요', '최소 1개 이상의 태그를 추가해주세요.');
            return;
        }
        
        const visibility = form.querySelector('input[name="visibility"]:checked')?.value || 'public';
        
        try {
            isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.textContent = '등록 중...';
            
            await questionApi.create({
                title: formData.title.trim(),
                optionA: formData.optionA.trim(),
                optionB: formData.optionB.trim(),
                tags,
                visibility
            });
            
            showSuccessToast('질문 등록 완료', '질문이 성공적으로 등록되었습니다!');
            router.navigate('#questions/my');
        } catch(error) {
            console.error('질문 등록 오류:', error);
            showErrorToast('등록 실패', error.message || '질문을 등록하는 중 오류가 발생했습니다.');
        } finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = '질문 등록하기';
        }
    });
    
    // 취소 버튼
    cancelBtn.addEventListener('click', () => {
        router.navigate('#questions/my');
    });
}
