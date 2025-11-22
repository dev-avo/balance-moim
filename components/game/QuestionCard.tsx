'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem, buttonHover, buttonTap } from '@/lib/animations/variants';

/**
 * QuestionCard Component - Apple MacBook Style
 * 
 * Apple 스타일의 밸런스 질문 카드입니다.
 * - Glassmorphism 효과
 * - 부드러운 애니메이션
 * - 다크모드 지원
 */

interface Question {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  tags?: Array<{ id: string; name: string }>;
}

interface QuestionCardProps {
  question: Question;
  onSelect: (option: 'A' | 'B') => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onSelect, disabled = false }: QuestionCardProps) {
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* 태그 */}
      {question.tags && question.tags.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2 justify-center"
          variants={staggerItem}
        >
          {question.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full glass border-2 border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-apple"
            >
              #{tag.name}
            </span>
          ))}
        </motion.div>
      )}

      {/* 질문 제목 */}
      <motion.div
        className="rounded-3xl glass border-2 border-border p-8 shadow-apple-lg"
        variants={staggerItem}
      >
        <h2 className="text-3xl font-bold text-center text-foreground sm:text-4xl">
          {question.title}
        </h2>
      </motion.div>

      {/* 선택지 버튼 */}
      <motion.div
        className="relative grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
        variants={staggerItem}
      >
        {/* VS 텍스트 (선택지 사이 중앙) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <span className="text-3xl sm:text-4xl font-black text-foreground/60 drop-shadow-lg">VS</span>
        </div>
        {/* 선택지 A */}
        <motion.button
          onClick={() => onSelect('A')}
          disabled={disabled}
          whileHover={!disabled ? buttonHover : undefined}
          whileTap={!disabled ? buttonTap : undefined}
          className={cn(
            'group relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 smooth-transition',
            'min-h-[120px] sm:min-h-[160px]',
            'glass border-2 border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10',
            'hover:from-primary/30 hover:to-primary/20',
            'hover:shadow-apple-lg hover:border-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-4 focus:ring-primary/30',
            'touch-manipulation'
          )}
          aria-label={`선택지 A: ${question.optionA}`}
        >
          {/* 배경 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 smooth-transition" />
          
          {/* 선택지 레이블 */}
          <div className="relative flex flex-col items-center gap-3 sm:gap-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-primary opacity-80 group-hover:opacity-100 smooth-transition">A</span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground text-center break-words group-hover:text-primary smooth-transition">
              {question.optionA}
            </span>
          </div>
        </motion.button>

        {/* 선택지 B */}
        <motion.button
          onClick={() => onSelect('B')}
          disabled={disabled}
          whileHover={!disabled ? buttonHover : undefined}
          whileTap={!disabled ? buttonTap : undefined}
          className={cn(
            'group relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 smooth-transition',
            'min-h-[120px] sm:min-h-[160px]',
            'glass border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/20 to-orange-500/10',
            'hover:from-orange-500/30 hover:to-orange-500/20',
            'hover:shadow-apple-lg hover:border-orange-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-4 focus:ring-orange-500/30',
            'touch-manipulation'
          )}
          aria-label={`선택지 B: ${question.optionB}`}
        >
          {/* 배경 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 smooth-transition" />
          
          {/* 선택지 레이블 */}
          <div className="relative flex flex-col items-center gap-3 sm:gap-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-orange-600 dark:text-orange-400 opacity-80 group-hover:opacity-100 smooth-transition">B</span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground text-center break-words group-hover:text-orange-600 dark:group-hover:text-orange-400 smooth-transition">
              {question.optionB}
            </span>
          </div>
        </motion.button>
      </motion.div>

      {/* 안내 문구 */}
      {!disabled && (
        <motion.div
          className="text-center text-sm text-muted-foreground"
          variants={staggerItem}
        >
          ⚠️ 선택 후에는 수정할 수 없습니다
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * QuestionCard Skeleton - 로딩 상태 표시
 */
export function QuestionCardSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* 태그 스켈레톤 */}
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="h-8 w-20 rounded-full glass border-2 border-border" />
        <div className="h-8 w-24 rounded-full glass border-2 border-border" />
      </div>

      {/* 질문 제목 스켈레톤 */}
      <div className="rounded-3xl glass border-2 border-border p-8 shadow-apple-lg">
        <div className="space-y-3">
          <div className="h-8 bg-muted-foreground/20 rounded-lg mx-auto w-3/4" />
          <div className="h-8 bg-muted-foreground/20 rounded-lg mx-auto w-1/2" />
        </div>
      </div>

      {/* VS 아이콘 스켈레톤 */}
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-2xl glass border-2 border-border shadow-apple-lg" />
      </div>

      {/* 선택지 버튼 스켈레톤 */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* 선택지 A 스켈레톤 */}
        <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 min-h-[120px] sm:min-h-[160px] glass border-2 border-border shadow-apple">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="h-12 w-12 bg-muted-foreground/20 rounded-full" />
            <div className="h-6 w-32 bg-muted-foreground/20 rounded-lg" />
          </div>
        </div>

        {/* 선택지 B 스켈레톤 */}
        <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 min-h-[120px] sm:min-h-[160px] glass border-2 border-border shadow-apple">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="h-12 w-12 bg-muted-foreground/20 rounded-full" />
            <div className="h-6 w-32 bg-muted-foreground/20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* 안내 문구 스켈레톤 */}
      <div className="flex justify-center">
        <div className="h-4 w-48 bg-muted-foreground/20 rounded-lg" />
      </div>
    </div>
  );
}

// QuestionData 타입 export
export type QuestionData = Question;
