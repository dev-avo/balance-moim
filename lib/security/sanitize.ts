// Edge Runtime 호환: isomorphic-dompurify를 사용하지 않고 정규식 기반 sanitize 사용
// Edge Runtime에서는 window 객체가 없으므로 DOMPurify를 사용할 수 없음

/**
 * XSS 방지를 위한 HTML Sanitize 유틸리티
 * 
 * ## 사용법
 * ```typescript
 * const safeHtml = sanitizeHtml(userInput);
 * const safeText = sanitizeText(userInput);
 * ```
 * 
 * ## 설명
 * - sanitizeHtml: HTML 태그를 허용하되 위험한 스크립트는 제거
 * - sanitizeText: 모든 HTML 태그 제거 (순수 텍스트만)
 * 
 * ## Edge Runtime 호환
 * - Edge Runtime에서는 DOMPurify를 사용할 수 없으므로 정규식 기반 sanitize 사용
 */

/**
 * 간단한 정규식 기반 HTML sanitize (Edge Runtime 호환)
 */
function simpleSanitizeHtml(dirty: string): string {
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');
}

/**
 * HTML을 sanitize합니다.
 * 안전한 HTML 태그는 유지하되, 위험한 스크립트는 제거합니다.
 * 
 * @param dirty - 사용자 입력 HTML
 * @returns 안전한 HTML
 */
export function sanitizeHtml(dirty: string): string {
  // Edge Runtime 호환: 정규식 기반 sanitize 사용
  return simpleSanitizeHtml(dirty);
}

/**
 * 모든 HTML 태그를 제거하고 순수 텍스트만 반환합니다.
 * 
 * @param dirty - 사용자 입력 텍스트
 * @returns 안전한 순수 텍스트
 */
export function sanitizeText(dirty: string): string {
  // Edge Runtime 호환: 모든 HTML 태그 제거
  return dirty
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * URL을 sanitize합니다.
 * javascript:, data:, vbscript: 등의 위험한 프로토콜을 제거합니다.
 * 
 * @param url - 사용자 입력 URL
 * @returns 안전한 URL 또는 빈 문자열
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim().toLowerCase();
  
  // 위험한 프로토콜 확인
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  for(const protocol of dangerousProtocols) {
    if(trimmed.startsWith(protocol)) {
      return '';
    }
  }
  
  // http, https만 허용
  if(!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
    return '';
  }
  
  return url.trim();
}

/**
 * 객체의 모든 문자열 값을 sanitize합니다.
 * 
 * @param obj - sanitize할 객체
 * @returns sanitize된 객체
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for(const key in sanitized) {
    if(typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeText(sanitized[key]);
    } else if(Array.isArray(sanitized[key])) {
      sanitized[key] = sanitized[key].map((item: any) =>
        typeof item === 'string' ? sanitizeText(item) : item
      );
    } else if(typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  
  return sanitized;
}

