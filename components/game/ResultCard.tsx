'use client';

import { cn } from '@/lib/utils';

/**
 * ResultCard 컴포넌트
 * 
 * 밸런스 질문의 결과를 표시합니다.
 * - 전체 통계 (선택 비율)
 * - 사용자가 선택한 옵션 하이라이팅
 * - 모임별 통계 (로그인 사용자)
 * 
 * ## Props
 * - question: 질문 데이터
 * - stats: 통계 데이터
 */

interface QuestionData {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
}

interface StatsData {
  totalResponses: number;
  optionACount: number;
  optionBCount: number;
  optionAPercentage: number;
  optionBPercentage: number;
  userSelection: 'A' | 'B' | null;
  groupStats: Array<{
    groupId: string;
    groupName: string;
    totalResponses: number;
    optionACount: number;
    optionBCount: number;
    optionAPercentage: number;
    optionBPercentage: number;
  }>;
}

interface ResultCardProps {
  question: QuestionData;
  stats: StatsData;
}

export function ResultCard({ question, stats }: ResultCardProps) {
  const { userSelection } = stats;

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* 질문 제목 */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {question.title}
        </h2>
      </div>

      {/* 전체 통계 */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          📊 전체 통계 ({stats.totalResponses.toLocaleString()}명 응답)
        </h3>

        <div className="space-y-4">
          {/* 옵션 A */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white',
                    userSelection === 'A' ? 'bg-blue-600 ring-4 ring-blue-200' : 'bg-blue-500'
                  )}
                >
                  A
                </span>
                <span className="font-medium text-gray-900">
                  {question.optionA}
                  {userSelection === 'A' && (
                    <span className="ml-2 text-sm text-blue-600">✓ 내 선택</span>
                  )}
                </span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {stats.optionAPercentage}%
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${stats.optionAPercentage}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {stats.optionACount.toLocaleString()}명
            </p>
          </div>

          {/* 옵션 B */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white',
                    userSelection === 'B' ? 'bg-purple-600 ring-4 ring-purple-200' : 'bg-purple-500'
                  )}
                >
                  B
                </span>
                <span className="font-medium text-gray-900">
                  {question.optionB}
                  {userSelection === 'B' && (
                    <span className="ml-2 text-sm text-purple-600">✓ 내 선택</span>
                  )}
                </span>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {stats.optionBPercentage}%
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                style={{ width: `${stats.optionBPercentage}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {stats.optionBCount.toLocaleString()}명
            </p>
          </div>
        </div>
      </div>

      {/* 모임별 통계 */}
      {stats.groupStats.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            👥 내 모임별 통계
          </h3>

          <div className="space-y-4">
            {stats.groupStats.map((groupStat) => (
              <div
                key={groupStat.groupId}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{groupStat.groupName}</h4>
                  <span className="text-sm text-gray-600">
                    {groupStat.totalResponses}명 응답
                  </span>
                </div>

                <div className="space-y-3">
                  {/* 모임 내 옵션 A */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                      A
                    </span>
                    <div className="flex-1">
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${groupStat.optionAPercentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right text-sm font-semibold text-blue-600">
                      {groupStat.optionAPercentage}%
                    </span>
                  </div>

                  {/* 모임 내 옵션 B */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                      B
                    </span>
                    <div className="flex-1">
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-purple-500 transition-all duration-500"
                          style={{ width: `${groupStat.optionBPercentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right text-sm font-semibold text-purple-600">
                      {groupStat.optionBPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 모임이 없을 때 안내 */}
      {stats.groupStats.length === 0 && userSelection && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
          <p className="text-sm text-blue-800">
            💡 모임에 가입하면 친구들의 선택을 비교할 수 있어요!
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * ResultCardSkeleton 컴포넌트
 * 
 * 통계를 불러오는 동안 표시할 스켈레톤 UI입니다.
 */
export function ResultCardSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 animate-pulse">
      {/* 제목 스켈레톤 */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded mx-auto w-3/4" />
      </div>

      {/* 전체 통계 스켈레톤 */}
      <div className="mb-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="space-y-3">
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>

      {/* 모임별 통계 스켈레톤 */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-32 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

