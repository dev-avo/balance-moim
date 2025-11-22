'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { progressBar } from '@/lib/animations/variants';

/**
 * 애니메이션 진행률 바 컴포넌트
 * 
 * ## 기능
 * - 부드러운 확장 애니메이션
 * - 뷰포트에 진입 시 자동 애니메이션
 * - 다크모드 지원
 * 
 * ## 사용법
 * ```tsx
 * <ProgressBar
 *   percentage={75}
 *   label="선택 A"
 *   color="bg-primary"
 * />
 * ```
 */

interface ProgressBarProps {
  /** 진행률 (0-100) */
  percentage: number;
  /** 라벨 텍스트 */
  label?: string;
  /** 바 색상 (Tailwind 클래스) */
  color?: string;
  /** 배경색 (Tailwind 클래스) */
  backgroundColor?: string;
  /** 높이 (Tailwind 클래스) */
  height?: string;
  /** 애니메이션 딜레이 (초) */
  delay?: number;
}

export function ProgressBar({
  percentage,
  label,
  color = 'bg-primary',
  backgroundColor = 'glass',
  height = 'h-8',
  delay = 0,
}: ProgressBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-sm font-bold text-primary">{percentage.toFixed(1)}%</span>
        </div>
      )}
      
      <div
        ref={ref}
        className={`relative w-full ${height} rounded-full overflow-hidden ${backgroundColor} border border-border`}
      >
        <motion.div
          className={`h-full ${color} rounded-full flex items-center justify-end px-3`}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={percentage}
          variants={progressBar}
          transition={{ delay }}
        >
          {percentage > 15 && (
            <span className="text-xs font-bold text-white drop-shadow-md">
              {percentage.toFixed(1)}%
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}

