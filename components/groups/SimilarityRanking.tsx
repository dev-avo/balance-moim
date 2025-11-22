'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

/**
 * SimilarityRanking Component - Apple MacBook Style
 * 
 * 모임 내에서 나와 취향이 비슷한 사람들의 랭킹을 표시합니다.
 * - Glassmorphism 효과
 * - 다크모드 완벽 지원
 * - Apple 스타일 디자인
 */

interface SimilarityData {
  userId: string;
  userName: string | null;
  matchPercentage: number;
  commonQuestions: number;
  matchedAnswers: number;
}

interface SimilarityRankingProps {
  groupId: string;
}

export function SimilarityRanking({ groupId }: SimilarityRankingProps) {
  const [similarities, setSimilarities] = useState<SimilarityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myResponsesCount, setMyResponsesCount] = useState(0);

  useEffect(() => {
    fetchSimilarities();
  }, [groupId]);

  const fetchSimilarities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/groups/${groupId}/similarity`);

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '유사도를 가져올 수 없습니다.');
      }

      const data = await response.json();
      setSimilarities(data.similarities || []);
      setMyResponsesCount(data.myResponsesCount || 0);
    } catch(err) {
      console.error('유사도 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading) {
    return (
      <div className="rounded-2xl glass border-2 border-border p-6 shadow-apple">
        <Loading text="유사도 분석 중..." />
      </div>
    );
  }

  if(error) {
    return (
      <div className="rounded-2xl glass border-2 border-border p-6 shadow-apple">
        <ErrorMessage message={error} onRetry={fetchSimilarities} />
      </div>
    );
  }

  // 응답이 없는 경우
  if(myResponsesCount === 0) {
    return (
      <div className="rounded-2xl glass border-2 border-border p-6 text-center shadow-apple">
        <div className="text-6xl mb-4 opacity-80">📊</div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          아직 응답이 없습니다
        </h3>
        <p className="text-muted-foreground">
          밸런스 게임에 참여하면 취향이 비슷한 멤버를 찾을 수 있어요!
        </p>
      </div>
    );
  }

  // 유사도 데이터가 없는 경우
  if(similarities.length === 0) {
    return (
      <div className="rounded-2xl glass border-2 border-border p-6 text-center shadow-apple">
        <div className="text-6xl mb-4 opacity-80">🤔</div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          비교할 멤버가 없습니다
        </h3>
        <p className="text-muted-foreground">
          다른 멤버들이 더 많은 질문에 응답하면 비교할 수 있어요!
          <br />
          (최소 5개 공통 질문 필요)
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass border-2 border-border p-6 shadow-apple">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            나와 취향이 비슷한 사람들
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            TOP {Math.min(similarities.length, 10)}명 · 내 응답 {myResponsesCount}개
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {similarities.slice(0, 10).map((similarity, index) => (
          <Link
            key={similarity.userId}
            href={`/groups/${groupId}/compare/${similarity.userId}`}
            className="block"
          >
            <div className="flex items-center gap-4 rounded-2xl glass border-2 border-border p-4 smooth-transition hover:border-primary hover:shadow-apple-lg">
              {/* 순위 */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-primary-foreground shadow-apple">
                {index + 1}
              </div>

              {/* 사용자 정보 */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">
                  {similarity.userName || '익명 사용자'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {similarity.commonQuestions}개 공통 질문 중 {similarity.matchedAnswers}개 일치
                </p>
              </div>

              {/* 일치율 */}
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-primary">
                  {similarity.matchPercentage}%
                </div>
                <div className="text-xs text-muted-foreground">일치율</div>
              </div>

              {/* 화살표 */}
              <div className="flex-shrink-0 text-muted-foreground">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 안내 문구 */}
      <div className="mt-6 rounded-2xl glass border-2 border-primary/30 bg-primary/5 p-4 shadow-inner-apple">
        <p className="text-sm text-foreground">
          💡 <strong>클릭</strong>하면 질문별 선택을 자세히 비교할 수 있어요!
        </p>
      </div>
    </div>
  );
}
