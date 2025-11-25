// 로딩 컴포넌트

const OVERLAY_ID = 'loadingOverlay';

/**
 * 전체 화면 로딩 표시
 * @param {string} message - 로딩 메시지 (선택)
 */
export function showLoading(message = '') {
  // 기존 로딩 제거
  hideLoading();
  
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.className = 'loading-overlay';
  
  overlay.innerHTML = `
    <div class="flex flex-col items-center gap-lg">
      <div class="loading-spinner"></div>
      ${message ? `<p class="text-secondary">${message}</p>` : ''}
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

/**
 * 전체 화면 로딩 숨기기
 */
export function hideLoading() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
}

/**
 * 인라인 로딩 스피너 HTML
 * @param {string} size - 크기 (sm, md)
 * @returns {string} HTML 문자열
 */
export function loadingSpinner(size = 'md') {
  const className = size === 'sm' ? 'loading-spinner loading-spinner-sm' : 'loading-spinner';
  return `<div class="${className}"></div>`;
}

/**
 * 버튼 로딩 상태
 * @param {HTMLButtonElement} button - 버튼 요소
 * @param {boolean} loading - 로딩 상태
 */
export function setButtonLoading(button, loading) {
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `${loadingSpinner('sm')} 처리 중...`;
  } else {
    button.disabled = false;
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  }
}
