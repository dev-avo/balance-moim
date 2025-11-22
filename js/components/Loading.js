/**
 * Loading 컴포넌트
 */

/**
 * 로딩 스피너 생성
 */
export function createLoading({ text = '로딩 중...', fullScreen = false }) {
    const loading = document.createElement('div');
    
    if(fullScreen) {
        loading.className = 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm';
    } else {
        loading.className = 'flex items-center justify-center p-8';
    }
    
    loading.innerHTML = `
        <div class="text-center space-y-4">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            ${text ? `<p class="text-muted-foreground">${text}</p>` : ''}
        </div>
    `;
    
    return loading;
}

/**
 * 스켈레톤 로딩 (카드 형태)
 */
export function createSkeleton({ className = '' }) {
    const skeleton = document.createElement('div');
    skeleton.className = `animate-pulse ${className}`;
    skeleton.innerHTML = `
        <div class="space-y-4">
            <div class="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
            <div class="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
            <div class="h-32 bg-muted-foreground/20 rounded"></div>
        </div>
    `;
    return skeleton;
}
