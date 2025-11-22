'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

/**
 * SimilarityRanking 컴포넌트
 * 
 * 모임 내에서 나와 취향이 비슷한 사람들의 랭킹을 표시합니다.
 * 
 * ## Props
 * - groupId: 모임 ID
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
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <Loading text="유사도 분석 중..." />
      </div>
    );
  }

  if(error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ErrorMessage message={error} onRetry={fetchSimilarities} />
      </div>
    );
  }

  // 응답이 없는 경우
  if(myResponsesCount === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          아직 응답이 없습니다
        </h3>
        <p className="text-gray-600">
          밸런스 게임에 참여하면 취향이 비슷한 멤버를 찾을 수 있어요!
        </p>
      </div>
    );
  }

  // 유사도 데이터가 없는 경우
  if(similarities.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <div className="text-5xl mb-4">🤔</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          비교할 멤버가 없습니다
        </h3>
        <p className="text-gray-600">
          다른 멤버들이 더 많은 질문에 응답하면 비교할 수 있어요!
          <br />
          (최소 5개 공통 질문 필요)
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            🎯 나와 취향이 비슷한 사람들
          </h2>
          <p className="mt-1 text-sm text-gray-600">
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
            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md">
              {/* 순위 */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                {index + 1}
              </div>

              {/* 사용자 정보 */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {similarity.userName || '익명 사용자'}
                </p>
                <p className="text-sm text-gray-600">
                  {similarity.commonQuestions}개 공통 질문 중 {similarity.matchedAnswers}개 일치
                </p>
              </div>

              {/* 일치율 */}
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {similarity.matchPercentage}%
                </div>
                <div className="text-xs text-gray-500">일치율</div>
              </div>

              {/* 화살표 */}
              <div className="flex-shrink-0 text-gray-400">
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
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>클릭</strong>하면 질문별 선택을 자세히 비교할 수 있어요!
        </p>
      </div>
    </div>
  );
}

