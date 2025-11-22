'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { MobileNav } from './MobileNav';

export function Header() {
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* 모바일 메뉴 + 로고 */}
        <div className="flex items-center space-x-2">
          <MobileNav />
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">🎯</span>
            <span className="text-xl font-bold">밸런스 모임</span>
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600">
            홈
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/groups" className="text-sm font-medium hover:text-blue-600">
                내 모임
              </Link>
              <Link href="/questions/create" className="text-sm font-medium hover:text-blue-600">
                질문 만들기
              </Link>
              <Link href="/questions/my" className="text-sm font-medium hover:text-blue-600">
                내 질문
              </Link>
              <Link href="/settings" className="text-sm font-medium hover:text-blue-600">
                설정
              </Link>
            </>
          )}
        </nav>

        {/* 사용자 메뉴 */}
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200" />
          ) : isAuthenticated && user ? (
            <>
              <span className="hidden lg:inline text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => signIn('google')}
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

