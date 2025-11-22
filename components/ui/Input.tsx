import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input Component - Apple MacBook Style
 * 
 * Apple 스타일의 입력 필드 컴포넌트입니다.
 * - 부드러운 테두리
 * - 다크모드 지원
 * - 포커스 효과
 */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border-2 border-border bg-input px-4 py-2 text-sm text-foreground smooth-transition',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'shadow-apple hover:shadow-apple-lg',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
