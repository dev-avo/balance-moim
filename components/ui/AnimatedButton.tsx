'use client';

import { motion } from 'framer-motion';
import { buttonTap, buttonHover } from '@/lib/animations/variants';
import { Button, ButtonProps, buttonVariants } from './Button';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * 애니메이션이 적용된 버튼 컴포넌트
 * 
 * ## 기능
 * - 호버 시 약간 확대
 * - 클릭 시 약간 축소
 * - 기존 Button 컴포넌트의 모든 props 지원
 * 
 * ## 사용법
 * ```tsx
 * <AnimatedButton variant="primary">클릭</AnimatedButton>
 * ```
 */

export interface AnimatedButtonProps extends ButtonProps {
  /** 애니메이션 비활성화 */
  disableAnimation?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ disableAnimation = false, className, variant, size, asChild, ...props }, ref) => {
    // asChild가 true이거나 애니메이션이 비활성화된 경우 일반 Button 사용
    if(disableAnimation || asChild) {
      return <Button ref={ref} className={className} variant={variant} size={size} asChild={asChild} {...props} />;
    }

    // Framer Motion과 Button props의 충돌을 피하기 위해 motion.button 직접 사용
    // onDrag는 HTML button과 Framer Motion의 타입이 다르므로 제외
    const { onDrag, ...restProps } = props;

    return (
      <motion.button
        ref={ref}
        whileHover={buttonHover}
        whileTap={buttonTap}
        className={cn(buttonVariants({ variant, size, className }))}
        {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

