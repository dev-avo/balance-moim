import { cn } from '@/lib/utils';

/**
 * Loading Component - Apple MacBook Style
 * 
 * Apple 스타일의 로딩 인디케이터입니다.
 * - 부드러운 애니메이션
 * - 다크모드 지원
 * 
 * @example
 * ```tsx
 * <Loading /> // 기본 크기
 * <Loading size="sm" /> // 작은 크기
 * <Loading size="lg" /> // 큰 크기
 * <Loading fullScreen /> // 전체 화면 로딩
 * ```
 */

interface LoadingProps {
  /** 스피너 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 전체 화면 로딩 여부 */
  fullScreen?: boolean;
  /** 로딩 텍스트 */
  text?: string;
  /** 추가 클래스명 */
  className?: string;
}

export function Loading({
  size = 'md',
  fullScreen = false,
  text,
  className,
}: LoadingProps) {
  // 크기별 스피너 사이즈
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-primary border-t-transparent smooth-transition',
          sizeClasses[size]
        )}
        role="status"
        aria-label="로딩 중"
      />
      {text && <p className="text-sm font-medium text-muted-foreground">{text}</p>}
    </div>
  );

  // 전체 화면 로딩
  if(fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md smooth-transition">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * LoadingOverlay 컴포넌트
 * 
 * 특정 영역 위에 로딩 오버레이를 표시합니다.
 * 
 * @example
 * ```tsx
 * <div className="relative">
 *   <YourContent />
 *   {isLoading && <LoadingOverlay />}
 * </div>
 * ```
 */
export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
      <Loading text={text} />
    </div>
  );
}

/**
 * LoadingDots 컴포넌트
 * 
 * 점 3개가 애니메이션되는 로딩 인디케이터입니다.
 * 작은 공간에 적합합니다.
 * 
 * @example
 * ```tsx
 * <button disabled>
 *   저장 중 <LoadingDots />
 * </button>
 * ```
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex gap-1', className)}>
      <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="h-1 w-1 animate-bounce rounded-full bg-current" />
    </span>
  );
}

