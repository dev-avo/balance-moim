'use client';

import { motion } from 'framer-motion';
import { buttonTap, buttonHover } from '@/lib/animations/variants';
import { Button, ButtonProps } from './Button';
import { forwardRef } from 'react';

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

const MotionButton = motion.create(Button);

export interface AnimatedButtonProps extends ButtonProps {
  /** 애니메이션 비활성화 */
  disableAnimation?: boolean;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ disableAnimation = false, ...props }, ref) => {
    if(disableAnimation) {
      return <Button ref={ref} {...props} />;
    }

    return (
      <MotionButton
        ref={ref}
        whileHover={buttonHover}
        whileTap={buttonTap}
        {...props}
      />
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

