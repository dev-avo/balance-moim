'use client';

import { cn } from '@/lib/utils';

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
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* 태그 */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          {question.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full glass border-2 border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-apple"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* 질문 제목 */}
      <div className="rounded-3xl glass border-2 border-border p-8 shadow-apple-lg animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
        <h2 className="text-3xl font-bold text-center text-foreground sm:text-4xl">
          {question.title}
        </h2>
      </div>

      {/* VS 아이콘 */}
      <div className="flex justify-center animate-in fade-in zoom-in duration-500 delay-200">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass border-2 border-primary bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-bold text-xl shadow-apple-lg">
          VS
        </div>
      </div>

      {/* 선택지 버튼 */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        {/* 선택지 A */}
        <button
          onClick={() => onSelect('A')}
          disabled={disabled}
          className={cn(
            'group relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 smooth-transition',
            'min-h-[120px] sm:min-h-[160px]',
            'glass border-2 border-primary/50 bg-gradient-to-br from-primary/20 to-primary/10',
            'hover:from-primary/30 hover:to-primary/20',
            'hover:shadow-apple-lg md:hover:scale-105 hover:border-primary',
            'active:scale-95',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
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
        </button>

        {/* 선택지 B */}
        <button
          onClick={() => onSelect('B')}
          disabled={disabled}
          className={cn(
            'group relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 smooth-transition',
            'min-h-[120px] sm:min-h-[160px]',
            'glass border-2 border-secondary/50 bg-gradient-to-br from-secondary/20 to-secondary/10',
            'hover:from-secondary/30 hover:to-secondary/20',
            'hover:shadow-apple-lg md:hover:scale-105 hover:border-secondary',
            'active:scale-95',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            'focus:outline-none focus:ring-4 focus:ring-secondary/30',
            'touch-manipulation'
          )}
          aria-label={`선택지 B: ${question.optionB}`}
        >
          {/* 배경 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/10 opacity-0 group-hover:opacity-100 smooth-transition" />
          
          {/* 선택지 레이블 */}
          <div className="relative flex flex-col items-center gap-3 sm:gap-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary-foreground opacity-80 group-hover:opacity-100 smooth-transition">B</span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground text-center break-words group-hover:text-secondary-foreground smooth-transition">
              {question.optionB}
            </span>
          </div>
        </button>
      </div>

      {/* 안내 문구 */}
      {!disabled && (
        <div className="text-center text-sm text-muted-foreground animate-in fade-in duration-500 delay-500">
          ⚠️ 선택 후에는 수정할 수 없습니다
        </div>
      )}
    </div>
  );
}
