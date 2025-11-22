'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useCurrentUser();

  if(!isAuthenticated) {
    return null;
  }

  const links = [
    {
      href: '/',
      label: '홈',
      icon: '🎯',
    },
    {
      href: '/groups',
      label: '내 모임',
      icon: '👥',
    },
    {
      href: '/questions/create',
      label: '질문 만들기',
      icon: '➕',
    },
    {
      href: '/questions/my',
      label: '내가 만든 질문',
      icon: '📝',
    },
    {
      href: '/settings',
      label: '설정',
      icon: '⚙️',
    },
  ];

  if(isLoading) {
    return (
      <aside className={cn('w-64 border-r bg-gray-50 p-4', className)}>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className={cn('w-64 border-r bg-gray-50 p-4', className)}>
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              )}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

