'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

/**
 * MobileNav Component - Apple MacBook Style
 * 
 * Apple 스타일의 모바일 네비게이션입니다.
 * - Glassmorphism 효과
 * - 부드러운 슬라이드 애니메이션
 * - 다크모드 지원
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useCurrentUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 메뉴 항목 정의
  const navItems = [
    { href: '/', label: '홈', requireAuth: false },
    { href: '/groups', label: '내 모임', requireAuth: true },
    { href: '/questions/create', label: '질문 만들기', requireAuth: true },
    { href: '/questions/my', label: '내 질문', requireAuth: true },
    { href: '/settings', label: '설정', requireAuth: true },
  ];

  // 인증 상태에 따라 표시할 메뉴 항목 필터링
  const filteredNavItems = navItems.filter(
    (item) => !item.requireAuth || isAuthenticated
  );

  // 메뉴 열기/닫기 토글
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // 링크 클릭 시 메뉴 닫기
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // 모바일 메뉴 오버레이 (Portal로 렌더링)
  const mobileMenu = mounted && isOpen ? createPortal(
    <>
      {/* 배경 오버레이 (클릭 시 메뉴 닫기) */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden smooth-transition animate-in fade-in"
        onClick={handleLinkClick}
        aria-hidden="true"
      />

      {/* 슬라이드 메뉴 */}
      <div className="fixed inset-y-0 left-0 z-[70] w-72 glass border-r border-border shadow-apple-lg lg:hidden overflow-y-auto smooth-transition animate-in slide-in-from-left flex flex-col">
            {/* 메뉴 헤더 */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-border/40 shrink-0">
              <span className="text-lg font-bold text-foreground">메뉴</span>
              <button
                type="button"
                className="p-2 rounded-lg text-foreground hover:text-primary hover:bg-accent smooth-transition"
                onClick={handleLinkClick}
                aria-label="메뉴 닫기"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 메뉴 항목 */}
            <nav className="flex flex-col p-6 space-y-2">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      'px-4 py-3.5 rounded-xl text-sm font-semibold smooth-transition',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-apple'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>,
        document.body
      ) : null;

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <button
        type="button"
        className="inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:text-primary hover:bg-accent smooth-transition focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
        onClick={toggleMenu}
        aria-label="메뉴 열기"
      >
        {/* 햄버거 아이콘 */}
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          {isOpen ? (
            // X 아이콘 (닫기)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            // 햄버거 아이콘 (열기)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* 모바일 메뉴 (Portal로 body에 렌더링) */}
      {mobileMenu}
    </>
  );
}
