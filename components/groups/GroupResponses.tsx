'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';

/**
 * GroupResponses Component - Apple MacBook Style
 * 
 * 모임 멤버들의 응답 통계를 태그별로 필터링하여 표시합니다.
 * - Glassmorphism 효과
 * - 다크모드 완벽 지원
 * - Apple 스타일 디자인
 */

interface QuestionStats {
  questionId: string;
  title: string;
  optionA: string;
  optionB: string;
  totalResponses: number;
  optionACount: number;
  optionBCount: number;
  optionAPercentage: number;
  optionBPercentage: number;
  tags: string[];
}

interface GroupResponsesProps {
  groupId: string;
}

export function GroupResponses({ groupId }: GroupResponsesProps) {
  const [questions, setQuestions] = useState<QuestionStats[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    fetchResponses();
    fetchTags();
  }, [groupId]);

  useEffect(() => {
    fetchResponses();
  }, [selectedTag]);

  const fetchResponses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = selectedTag
        ? `/api/groups/${groupId}/responses?tag=${encodeURIComponent(selectedTag)}`
        : `/api/groups/${groupId}/responses`;

      const response = await fetch(url);

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '응답을 가져올 수 없습니다.');
      }

      const data = await response.json();
      setQuestions(data.questions || []);
      setTotalMembers(data.totalMembers || 0);
    } catch(err) {
      console.error('응답 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      
      if(!response.ok) return;

      const data = await response.json();
      setAvailableTags(data.tags.map((t: any) => t.name) || []);
    } catch(err) {
      console.error('태그 가져오기 오류:', err);
    }
  };

  if(isLoading) {
    return (
      <div className="rounded-2xl glass border-2 border-border p-6 shadow-apple">
        <Loading text="응답 통계 조회 중..." />
      </div>
    );
  }

  if(error) {
    return (
      <div className="rounded-2xl glass border-2 border-border p-6 shadow-apple">
        <ErrorMessage message={error} onRetry={fetchResponses} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass border-2 border-border p-6 shadow-apple">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">📊</span>
          모임 응답 통계
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          전체 멤버 {totalMembers}명
        </p>
      </div>

      {/* 태그 필터 */}
      {availableTags.length > 0 && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            태그별 필터
          </label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full rounded-xl glass border-2 border-border bg-card text-foreground px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-inner-apple"
          >
            <option value="">전체 질문</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 질문 목록 */}
      {questions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4 opacity-80">📭</div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            응답이 없습니다
          </h3>
          <p className="text-muted-foreground">
            {selectedTag
              ? `"${selectedTag}" 태그의 질문에 응답이 없습니다.`
              : '모임 멤버들이 밸런스 게임에 참여하면 여기에 통계가 표시됩니다.'}
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {questions.map((q, index) => (
            <motion.div
              key={q.questionId}
              variants={staggerItem}
              className="rounded-2xl glass border-2 border-border p-5 shadow-apple"
            >
              {/* 질문 제목 */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    질문 {index + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {q.totalResponses}명 응답
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {q.title}
                </h3>
              </div>

              {/* 선택지 A */}
              <div className="mb-4">
                <ProgressBar
                  percentage={q.optionAPercentage}
                  label={q.optionA}
                  color="bg-primary"
                  height="h-3"
                  delay={index * 0.1}
                />
                <div className="mt-1 text-right">
                  <span className="text-xs text-muted-foreground">
                    {q.optionACount}명
                  </span>
                </div>
              </div>

              {/* 선택지 B */}
              <div className="mb-4">
                <ProgressBar
                  percentage={q.optionBPercentage}
                  label={q.optionB}
                  color="bg-orange-500"
                  height="h-3"
                  delay={index * 0.1 + 0.1}
                />
                <div className="mt-1 text-right">
                  <span className="text-xs text-muted-foreground">
                    {q.optionBCount}명
                  </span>
                </div>
              </div>

              {/* 태그 */}
              {q.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {q.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="rounded-full glass border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground smooth-transition hover:border-primary hover:bg-accent hover:text-accent-foreground shadow-apple-sm"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
