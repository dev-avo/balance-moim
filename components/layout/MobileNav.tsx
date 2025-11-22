'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

/**
 * MobileNav 컴포넌트
 * 
 * 모바일 화면에서 사용되는 햄버거 메뉴 네비게이션입니다.
 * - 햄버거 아이콘 클릭 시 전체 화면 메뉴 표시
 * - 현재 페이지 하이라이팅
 * - 로그인 상태에 따른 메뉴 항목 표시
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useCurrentUser();

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

  return (
    <>
      {/* 햄버거 메뉴 버튼 (모바일에서만 표시) */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
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

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 (클릭 시 메뉴 닫기) */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={handleLinkClick}
            aria-hidden="true"
          />

          {/* 슬라이드 메뉴 */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl md:hidden overflow-y-auto">
            {/* 메뉴 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-bold">메뉴</span>
              <button
                type="button"
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
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
            <nav className="flex flex-col p-4 space-y-2">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      'px-4 py-3 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
