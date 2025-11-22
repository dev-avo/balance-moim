'use client';

/**
 * Pagination Component - Apple MacBook Style
 * 
 * 페이지네이션 UI 컴포넌트입니다.
 * 
 * ## Props
 * - currentPage: 현재 페이지 번호
 * - totalPages: 전체 페이지 수
 * - onPageChange: 페이지 변경 콜백
 * - hasNext: 다음 페이지 존재 여부
 * - hasPrev: 이전 페이지 존재 여부
 * 
 * ## 디자인
 * - Glassmorphism 효과
 * - 다크모드 지원
 * - Apple 스타일 버튼
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNext = true,
  hasPrev = true,
}: PaginationProps) {
  if(totalPages <= 1) {
    return null;
  }

  // 표시할 페이지 번호 계산 (현재 페이지 기준 ±2)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if(totalPages <= maxVisible) {
      // 전체 페이지가 5개 이하면 모두 표시
      for(let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 많을 경우 현재 페이지 기준으로 표시
      if(currentPage <= 3) {
        // 앞쪽
        for(let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if(currentPage >= totalPages - 2) {
        // 뒤쪽
        pages.push(1);
        pages.push('...');
        for(let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 중간
        pages.push(1);
        pages.push('...');
        for(let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev || currentPage === 1}
        className="rounded-xl glass border-2 border-border px-4 py-2 text-sm font-semibold text-foreground smooth-transition hover:border-primary hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-transparent shadow-apple disabled:shadow-none"
        aria-label="이전 페이지"
      >
        ← 이전
      </button>

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if(page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-muted-foreground"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrent = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={isCurrent}
              className={`
                rounded-xl px-4 py-2 text-sm font-bold smooth-transition
                ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground shadow-apple-lg border-2 border-primary cursor-default'
                    : 'glass border-2 border-border text-foreground hover:border-primary hover:bg-accent shadow-apple'
                }
              `}
              aria-label={`${pageNum}페이지로 이동`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || currentPage === totalPages}
        className="rounded-xl glass border-2 border-border px-4 py-2 text-sm font-semibold text-foreground smooth-transition hover:border-primary hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-transparent shadow-apple disabled:shadow-none"
        aria-label="다음 페이지"
      >
        다음 →
      </button>
    </div>
  );
}

