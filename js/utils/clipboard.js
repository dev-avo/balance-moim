// 클립보드 유틸리티
// 다양한 환경(PC, 모바일, HTTP/HTTPS)에서 안정적인 클립보드 복사 지원

/**
 * 클립보드에 텍스트 복사 (다양한 환경 지원)
 * @param {string} text - 복사할 텍스트
 * @returns {Promise<boolean>} 복사 성공 여부
 */
export async function copyToClipboard(text) {
  // 1. 먼저 navigator.clipboard API 시도 (최신 브라우저)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API 실패, fallback 시도:', err);
    }
  }
  
  // 2. Fallback: execCommand 사용 (구형 브라우저, HTTP 환경)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 화면 밖으로 배치
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // iOS 대응
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, text.length);
    } else {
      textArea.select();
    }
    
    const result = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return result;
  } catch (err) {
    console.error('Fallback 복사 실패:', err);
    return false;
  }
}

/**
 * 클립보드 복사 시도 후 실패 시 prompt로 표시
 * @param {string} text - 복사할 텍스트
 * @param {string} promptMessage - prompt에 표시할 메시지
 * @returns {Promise<boolean>} 복사 성공 여부
 */
export async function copyWithFallbackPrompt(text, promptMessage = '아래 링크를 복사하세요:') {
  const success = await copyToClipboard(text);
  
  if (!success) {
    // 복사 실패 시 prompt로 수동 복사 유도
    prompt(promptMessage, text);
  }
  
  return success;
}

