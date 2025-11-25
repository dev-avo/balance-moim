// 토스트 알림 컴포넌트

// 토스트 컨테이너 ID
const CONTAINER_ID = 'toastContainer';

// 토스트 타입
export const ToastType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * 토스트 컨테이너 생성/가져오기
 */
function getContainer() {
  let container = document.getElementById(CONTAINER_ID);
  
  if (!container) {
    container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  return container;
}

/**
 * 토스트 표시
 * @param {string} message - 메시지
 * @param {string} type - 타입 (success, error, warning, info)
 * @param {number} duration - 표시 시간 (ms)
 * @returns {HTMLElement} 토스트 요소
 */
export function showToast(message, type = ToastType.INFO, duration = 3000) {
  const container = getContainer();
  
  // 토스트 생성
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // 아이콘 설정
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // 자동 제거
  const timeoutId = setTimeout(() => {
    removeToast(toast);
  }, duration);
  
  // 클릭으로 제거
  toast.addEventListener('click', () => {
    clearTimeout(timeoutId);
    removeToast(toast);
  });
  
  return toast;
}

/**
 * 토스트 제거
 */
function removeToast(toast) {
  toast.style.animation = 'slideOut 0.3s ease forwards';
  setTimeout(() => {
    toast.remove();
  }, 300);
}

/**
 * 성공 토스트
 */
export function toastSuccess(message, duration) {
  return showToast(message, ToastType.SUCCESS, duration);
}

/**
 * 에러 토스트
 */
export function toastError(message, duration) {
  return showToast(message, ToastType.ERROR, duration);
}

/**
 * 경고 토스트
 */
export function toastWarning(message, duration) {
  return showToast(message, ToastType.WARNING, duration);
}

/**
 * 정보 토스트
 */
export function toastInfo(message, duration) {
  return showToast(message, ToastType.INFO, duration);
}

// CSS에 slideOut 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
