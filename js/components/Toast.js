/**
 * Toast 알림 컴포넌트
 */

let toastContainer = null;

/**
 * Toast 초기화
 */
export function initToast() {
    toastContainer = document.getElementById('toast-container');
    if(!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-20 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }
}

/**
 * Toast 표시
 */
export function showToast({ title, description, variant = 'default', duration = 3000 }) {
    if(!toastContainer) initToast();
    
    const toast = document.createElement('div');
    toast.className = `glass border-2 border-border rounded-xl p-4 shadow-apple-lg min-w-[300px] max-w-[400px] animate-in`;
    
    const variantClasses = {
        default: 'border-primary/30 bg-primary/10',
        success: 'border-green-500/30 bg-green-500/10',
        error: 'border-destructive/30 bg-destructive/10',
        warning: 'border-yellow-500/30 bg-yellow-500/10'
    };
    
    toast.className += ` ${variantClasses[variant] || variantClasses.default}`;
    
    toast.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="flex-1">
                ${title ? `<h4 class="font-semibold text-foreground mb-1">${title}</h4>` : ''}
                ${description ? `<p class="text-sm text-muted-foreground">${description}</p>` : ''}
            </div>
            <button class="text-muted-foreground hover:text-foreground smooth-transition" aria-label="닫기">
                ×
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // 닫기 버튼
    const closeBtn = toast.querySelector('button');
    const close = () => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if(toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    };
    
    closeBtn.addEventListener('click', close);
    
    // 자동 닫기
    if(duration > 0) {
        setTimeout(close, duration);
    }
    
    return { close };
}

/**
 * 성공 Toast
 */
export function showSuccessToast(title, description) {
    return showToast({ title, description, variant: 'success' });
}

/**
 * 에러 Toast
 */
export function showErrorToast(title, description) {
    return showToast({ title, description, variant: 'error', duration: 5000 });
}

/**
 * 경고 Toast
 */
export function showWarningToast(title, description) {
    return showToast({ title, description, variant: 'warning' });
}
