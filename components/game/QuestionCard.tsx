'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * QuestionCard 컴포넌트
 * 
 * 밸런스 질문과 2개의 선택지를 표시합니다.
 * 
 * ## 디자인 요구사항
 * - 질문 제목을 명확히 표시
 * - 2개의 선택지를 큰 버튼으로 표시 (터치하기 쉽게)
 * - 태그 표시
 * - 모바일 친화적인 UI
 * 
 * ## Props
 * - question: 질문 데이터 (제목, 선택지, 태그)
 * - onSelect: 선택지 클릭 핸들러
 * - disabled: 버튼 비활성화 여부
 */

export interface QuestionData {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  tags: Array<{ id: string; name: string }>;
}

interface QuestionCardProps {
  question: QuestionData;
  onSelect: (option: 'A' | 'B') => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onSelect, disabled = false }: QuestionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* 태그 */}
      {question.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          {question.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* 질문 제목 */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-900 sm:text-3xl">
          {question.title}
        </h2>
      </div>

      {/* VS 아이콘 */}
      <div className="flex justify-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg">
          VS
        </div>
      </div>

      {/* 선택지 버튼 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 선택지 A */}
        <button
          onClick={() => onSelect('A')}
          disabled={disabled}
          className={cn(
            'group relative overflow-hidden rounded-xl p-8 transition-all duration-200',
            'bg-gradient-to-br from-blue-500 to-blue-600',
            'hover:from-blue-600 hover:to-blue-700',
            'hover:shadow-xl hover:scale-105',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            'focus:outline-none focus:ring-4 focus:ring-blue-300'
          )}
          aria-label={`선택지 A: ${question.optionA}`}
        >
          {/* 배경 효과 */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          
          {/* 선택지 레이블 */}
          <div className="relative flex flex-col items-center gap-3">
            <span className="text-4xl font-bold text-white opacity-80">A</span>
            <span className="text-xl font-semibold text-white text-center break-words">
              {question.optionA}
            </span>
          </div>
        </button>

        {/* 선택지 B */}
        <button
          onClick={() => onSelect('B')}
          disabled={disabled}
          className={cn(
            'group relative overflow-hidden rounded-xl p-8 transition-all duration-200',
            'bg-gradient-to-br from-purple-500 to-purple-600',
            'hover:from-purple-600 hover:to-purple-700',
            'hover:shadow-xl hover:scale-105',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            'focus:outline-none focus:ring-4 focus:ring-purple-300'
          )}
          aria-label={`선택지 B: ${question.optionB}`}
        >
          {/* 배경 효과 */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          
          {/* 선택지 레이블 */}
          <div className="relative flex flex-col items-center gap-3">
            <span className="text-4xl font-bold text-white opacity-80">B</span>
            <span className="text-xl font-semibold text-white text-center break-words">
              {question.optionB}
            </span>
          </div>
        </button>
      </div>

      {/* 안내 문구 */}
      <p className="mt-6 text-center text-sm text-gray-500">
        💡 한 번 선택하면 수정할 수 없습니다. 신중하게 선택해주세요!
      </p>
    </div>
  );
}

/**
 * QuestionCardSkeleton 컴포넌트
 * 
 * 질문을 불러오는 동안 표시할 스켈레톤 UI입니다.
 */
export function QuestionCardSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-pulse">
      {/* 태그 스켈레톤 */}
      <div className="mb-4 flex gap-2 justify-center">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>

      {/* 질문 스켈레톤 */}
      <div className="mb-8 rounded-lg bg-gray-100 p-6 shadow-md">
        <div className="h-8 bg-gray-200 rounded mx-auto w-3/4" />
      </div>

      {/* VS 아이콘 */}
      <div className="flex justify-center mb-8">
        <div className="h-12 w-12 bg-gray-200 rounded-full" />
      </div>

      {/* 선택지 스켈레톤 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

