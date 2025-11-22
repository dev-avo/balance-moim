/**
 * Modal 컴포넌트
 */

/**
 * 모달 생성
 */
export function createModal({ title, content, onConfirm, onCancel, confirmText = '확인', cancelText = '취소', showCancel = true }) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
    overlay.style.animation = 'fadeIn 0.2s ease-out';
    
    const modal = document.createElement('div');
    modal.className = 'glass border-2 border-border rounded-2xl p-6 shadow-apple-lg max-w-md w-full mx-4';
    modal.style.animation = 'scaleUp 0.2s ease-out';
    
    modal.innerHTML = `
        <div class="space-y-4">
            ${title ? `<h3 class="text-xl font-bold text-foreground">${title}</h3>` : ''}
            <div class="text-foreground">${content}</div>
            <div class="flex gap-3 justify-end">
                ${showCancel ? `
                    <button class="modal-cancel-btn px-4 py-2 text-sm font-semibold rounded-xl border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent hover:text-accent-foreground smooth-transition">
                        ${cancelText}
                    </button>
                ` : ''}
                <button class="modal-confirm-btn px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90 smooth-transition">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    const close = () => {
        overlay.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => {
            if(overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 200);
    };
    
    const confirmBtn = modal.querySelector('.modal-confirm-btn');
    const cancelBtn = modal.querySelector('.modal-cancel-btn');
    
    confirmBtn.addEventListener('click', () => {
        if(onConfirm) {
            onConfirm();
        }
        close();
    });
    
    if(cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if(onCancel) {
                onCancel();
            }
            close();
        });
    }
    
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) {
            if(onCancel) {
                onCancel();
            }
            close();
        }
    });
    
    return { close, modal, overlay };
}

/**
 * 확인 모달
 */
export function showConfirmModal({ title, message, onConfirm, onCancel }) {
    return createModal({
        title,
        content: `<p class="text-muted-foreground">${message}</p>`,
        onConfirm,
        onCancel,
        confirmText: '확인',
        cancelText: '취소'
    });
}
