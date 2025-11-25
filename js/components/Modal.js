// 모달 컴포넌트

/**
 * 모달 열기
 * @param {Object} options - 모달 옵션
 * @param {string} options.title - 모달 제목
 * @param {string} options.content - 모달 내용 (HTML)
 * @param {Array} options.buttons - 버튼 배열 [{text, type, onClick}]
 * @param {Function} options.onClose - 닫기 콜백
 * @returns {HTMLElement} 모달 요소
 */
export function openModal(options = {}) {
  const {
    title = '',
    content = '',
    buttons = [],
    onClose = () => {},
  } = options;
  
  // 기존 모달 제거
  closeModal();
  
  // 오버레이 생성
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modalOverlay';
  
  // 모달 생성
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="modal-header">
        <h3 class="modal-title" id="modalTitle">${title}</h3>
        <button class="modal-close" id="modalClose" aria-label="닫기">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="4" x2="16" y2="16"></line>
            <line x1="16" y1="4" x2="4" y2="16"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body" id="modalBody">
        ${content}
      </div>
      ${buttons.length > 0 ? `
        <div class="modal-footer" id="modalFooter"></div>
      ` : ''}
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // 버튼 생성
  if (buttons.length > 0) {
    const footer = overlay.querySelector('#modalFooter');
    buttons.forEach((btn, index) => {
      const button = document.createElement('button');
      button.className = `btn ${btn.type || 'btn-secondary'}`;
      button.textContent = btn.text;
      button.addEventListener('click', () => {
        if (btn.onClick) {
          btn.onClick();
        }
        if (btn.closeOnClick !== false) {
          closeModal();
        }
      });
      footer.appendChild(button);
    });
  }
  
  // 닫기 버튼 이벤트
  const closeBtn = overlay.querySelector('#modalClose');
  closeBtn.addEventListener('click', () => {
    onClose();
    closeModal();
  });
  
  // 오버레이 클릭으로 닫기
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      onClose();
      closeModal();
    }
  });
  
  // ESC 키로 닫기
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      onClose();
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
  
  // 애니메이션을 위해 약간의 지연 후 open 클래스 추가
  requestAnimationFrame(() => {
    overlay.classList.add('open');
  });
  
  // 스크롤 방지
  document.body.style.overflow = 'hidden';
  
  return overlay;
}

/**
 * 모달 닫기
 */
export function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

/**
 * 확인 모달 (confirm 대체)
 * @param {string} title - 제목
 * @param {string} message - 메시지
 * @returns {Promise<boolean>} 확인 여부
 */
export function confirmModal(title, message) {
  return new Promise((resolve) => {
    openModal({
      title,
      content: `<p>${message}</p>`,
      buttons: [
        {
          text: '취소',
          type: 'btn-secondary',
          onClick: () => resolve(false),
        },
        {
          text: '확인',
          type: 'btn-primary',
          onClick: () => resolve(true),
        },
      ],
      onClose: () => resolve(false),
    });
  });
}

/**
 * 경고 모달 (alert 대체)
 * @param {string} title - 제목
 * @param {string} message - 메시지
 * @returns {Promise<void>}
 */
export function alertModal(title, message) {
  return new Promise((resolve) => {
    openModal({
      title,
      content: `<p>${message}</p>`,
      buttons: [
        {
          text: '확인',
          type: 'btn-primary',
          onClick: () => resolve(),
        },
      ],
      onClose: () => resolve(),
    });
  });
}
