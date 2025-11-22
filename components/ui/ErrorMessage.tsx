import { cn } from '@/lib/utils';

/**
 * ErrorMessage 컴포넌트
 * 
 * 에러 메시지를 표시합니다.
 * API 호출 실패, 폼 검증 오류 등에 사용됩니다.
 * 
 * @example
 * ```tsx
 * <ErrorMessage message="로그인에 실패했습니다." />
 * <ErrorMessage 
 *   title="오류 발생" 
 *   message="네트워크 연결을 확인해주세요." 
 *   onRetry={() => refetch()} 
 * />
 * ```
 */

interface ErrorMessageProps {
  /** 에러 제목 */
  title?: string;
  /** 에러 메시지 */
  message: string;
  /** 재시도 버튼 클릭 핸들러 */
  onRetry?: () => void;
  /** 추가 클래스명 */
  className?: string;
  /** 전체 화면 표시 여부 */
  fullScreen?: boolean;
}

export function ErrorMessage({
  title = '오류',
  message,
  onRetry,
  className,
  fullScreen = false,
}: ErrorMessageProps) {
  const content = (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-4',
        fullScreen && 'max-w-md',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* 에러 아이콘 */}
        <svg
          className="h-5 w-5 flex-shrink-0 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>

        <div className="flex-1">
          {/* 제목 */}
          <h3 className="text-sm font-semibold text-red-800">{title}</h3>
          {/* 메시지 */}
          <p className="mt-1 text-sm text-red-700">{message}</p>

          {/* 재시도 버튼 */}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-red-800 hover:text-red-900 underline"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // 전체 화면 에러
  if(fullScreen) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * FieldError 컴포넌트
 * 
 * 폼 필드의 검증 오류를 표시합니다.
 * 
 * @example
 * ```tsx
 * <input type="email" />
 * {errors.email && <FieldError message={errors.email.message} />}
 * ```
 */
export function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}

/**
 * NotFound 컴포넌트
 * 
 * 리소스를 찾을 수 없을 때 표시하는 컴포넌트입니다.
 * 
 * @example
 * ```tsx
 * {!data && <NotFound message="질문을 찾을 수 없습니다." />}
 * ```
 */
export function NotFound({
  message = '페이지를 찾을 수 없습니다.',
  backUrl = '/',
  backLabel = '홈으로 이동',
}: {
  message?: string;
  backUrl?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="text-6xl">🔍</div>
      <h2 className="text-2xl font-bold text-gray-900">404</h2>
      <p className="text-gray-600">{message}</p>
      <a
        href={backUrl}
        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {backLabel}
      </a>
    </div>
  );
}

