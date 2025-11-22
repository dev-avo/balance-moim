'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Theme Provider
 * 
 * next-themes를 사용하여 다크모드를 지원합니다.
 * - 시스템 설정 자동 감지
 * - localStorage에 사용자 선택 저장
 * - 부드러운 테마 전환
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

