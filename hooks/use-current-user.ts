'use client';

import { useSession } from 'next-auth/react';

/**
 * 클라이언트 컴포넌트에서 현재 로그인한 사용자 정보를 가져오는 훅
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}

