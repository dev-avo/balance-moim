/**
 * 공통 유틸리티 함수
 */

/**
 * 클래스명을 조건부로 결합
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

/**
 * ID 생성 (간단한 UUID v4)
 */
export function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 디바운스 함수
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 스크롤을 부드럽게 이동
 */
export function smoothScrollTo(element, offset = 0) {
    if(!element) return;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * 로컬 스토리지 헬퍼
 */
export const storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch(error) {
            console.error('Storage set error:', error);
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch(error) {
            console.error('Storage remove error:', error);
        }
    }
};

/**
 * 날짜 포맷팅
 */
export function formatDate(date) {
    if(!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * 상대 시간 포맷팅 (예: "3일 전")
 */
export function formatRelativeTime(date) {
    if(!date) return '';
    const now = new Date();
    const d = new Date(date);
    const diff = now - d;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if(days > 0) return `${days}일 전`;
    if(hours > 0) return `${hours}시간 전`;
    if(minutes > 0) return `${minutes}분 전`;
    return '방금 전';
}

/**
 * 텍스트 자르기
 */
export function truncate(text, maxLength) {
    if(!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * URL 파라미터 파싱
 */
export function parseQueryString(queryString) {
    const params = {};
    if(!queryString) return params;
    
    queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if(key) {
            params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : true;
        }
    });
    
    return params;
}

/**
 * URL 파라미터 생성
 */
export function buildQueryString(params) {
    const pairs = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    
    return pairs.length > 0 ? '?' + pairs.join('&') : '';
}

/**
 * 해시에서 라우트 추출 (# 제거)
 */
export function getRouteFromHash() {
    const hash = window.location.hash;
    return hash ? hash.slice(1) : 'home';
}

/**
 * 에러 메시지 추출
 */
export function getErrorMessage(error) {
    if(typeof error === 'string') return error;
    if(error?.message) return error.message;
    if(error?.error) return error.error;
    return '알 수 없는 오류가 발생했습니다.';
}
