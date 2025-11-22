'use client';

import { cn } from '@/lib/utils';

/**
 * ResultCard Component - Apple MacBook Style
 * 
 * Apple 스타일의 결과 카드입니다.
 * - Glassmorphism 효과
 * - 부드러운 애니메이션
 * - 다크모드 지원
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
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 질문 제목 */}
      <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
          {question.title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">결과를 확인하세요</p>
      </div>

      {/* 전체 통계 */}
      <div className="rounded-2xl sm:rounded-3xl glass border-2 border-border p-5 sm:p-6 md:p-8 shadow-apple-lg animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
        <h3 className="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">📊</span>
          전체 통계
          <span className="text-base font-normal text-muted-foreground ml-2">
            ({stats.totalResponses.toLocaleString()}명 응답)
          </span>
        </h3>

        <div className="space-y-6">
          {/* 옵션 A */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-primary-foreground shadow-apple smooth-transition',
                    userSelection === 'A' 
                      ? 'bg-primary ring-4 ring-primary/30 scale-110' 
                      : 'bg-primary/80'
                  )}
                >
                  A
                </span>
                <div>
                  <span className="font-semibold text-foreground block">
                    {question.optionA}
                  </span>
                  {userSelection === 'A' && (
                    <span className="text-sm text-primary font-medium flex items-center gap-1 mt-1">
                      <span>✓</span>
                      내 선택
                    </span>
                  )}
                </div>
              </div>
              <span className="text-2xl font-bold text-primary">
                {stats.optionAPercentage}%
              </span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-full glass border border-border shadow-inner-apple">
              <div
                className="h-full bg-gradient-to-r from-primary/80 to-primary smooth-transition shadow-apple"
                style={{ 
                  width: `${stats.optionAPercentage}%`,
                  transition: 'width 0.8s ease-out'
                }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {stats.optionACount.toLocaleString()}명 선택
            </p>
          </div>

          {/* 옵션 B */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-secondary-foreground shadow-apple smooth-transition',
                    userSelection === 'B' 
                      ? 'bg-secondary ring-4 ring-secondary/30 scale-110' 
                      : 'bg-secondary/80'
                  )}
                >
                  B
                </span>
                <div>
                  <span className="font-semibold text-foreground block">
                    {question.optionB}
                  </span>
                  {userSelection === 'B' && (
                    <span className="text-sm text-secondary-foreground font-medium flex items-center gap-1 mt-1">
                      <span>✓</span>
                      내 선택
                    </span>
                  )}
                </div>
              </div>
              <span className="text-2xl font-bold text-secondary-foreground">
                {stats.optionBPercentage}%
              </span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-full glass border border-border shadow-inner-apple">
              <div
                className="h-full bg-gradient-to-r from-secondary/80 to-secondary smooth-transition shadow-apple"
                style={{ 
                  width: `${stats.optionBPercentage}%`,
                  transition: 'width 0.8s ease-out'
                }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {stats.optionBCount.toLocaleString()}명 선택
            </p>
          </div>
        </div>
      </div>

      {/* 모임별 통계 */}
      {stats.groupStats.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h3 className="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-2xl">👥</span>
            내 모임별 통계
          </h3>

          <div className="space-y-4">
            {stats.groupStats.map((groupStat, index) => (
              <div
                key={groupStat.groupId}
                className="rounded-2xl glass border-2 border-border p-6 shadow-apple smooth-transition hover:shadow-apple-lg animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-bold text-foreground text-lg">{groupStat.groupName}</h4>
                  <span className="text-sm text-muted-foreground">
                    {groupStat.totalResponses}명 응답
                  </span>
                </div>

                <div className="space-y-4">
                  {/* 모임 내 옵션 A */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-apple">
                      A
                    </span>
                    <div className="flex-1">
                      <div className="h-4 w-full overflow-hidden rounded-full glass border border-border shadow-inner-apple">
                        <div
                          className="h-full bg-primary smooth-transition"
                          style={{ 
                            width: `${groupStat.optionAPercentage}%`,
                            transition: 'width 0.8s ease-out'
                          }}
                        />
                      </div>
                    </div>
                    <span className="w-14 text-right text-sm font-bold text-primary">
                      {groupStat.optionAPercentage}%
                    </span>
                  </div>

                  {/* 모임 내 옵션 B */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground shadow-apple">
                      B
                    </span>
                    <div className="flex-1">
                      <div className="h-4 w-full overflow-hidden rounded-full glass border border-border shadow-inner-apple">
                        <div
                          className="h-full bg-secondary smooth-transition"
                          style={{ 
                            width: `${groupStat.optionBPercentage}%`,
                            transition: 'width 0.8s ease-out'
                          }}
                        />
                      </div>
                    </div>
                    <span className="w-14 text-right text-sm font-bold text-secondary-foreground">
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
        <div className="rounded-2xl glass border-2 border-primary/30 bg-primary/5 p-6 text-center shadow-apple animate-in fade-in slide-in-from-bottom duration-500 delay-300">
          <p className="text-base text-muted-foreground flex items-center justify-center gap-2">
            <span className="text-2xl">💡</span>
            <span>모임에 가입하면 친구들의 선택을 비교할 수 있어요!</span>
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * ResultCardSkeleton Component - Apple MacBook Style
 * 
 * 통계를 불러오는 동안 표시할 Apple 스타일 스켈레톤 UI입니다.
 */
export function ResultCardSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* 제목 스켈레톤 */}
      <div className="text-center">
        <div className="h-10 glass rounded-2xl mx-auto w-3/4 mb-2" />
        <div className="h-4 glass rounded-lg mx-auto w-1/4" />
      </div>

      {/* 전체 통계 스켈레톤 */}
      <div className="rounded-3xl glass border-2 border-border p-8 space-y-6">
        <div className="h-8 glass rounded-2xl w-1/3" />
        <div className="space-y-4">
          <div className="h-24 glass rounded-2xl" />
          <div className="h-24 glass rounded-2xl" />
        </div>
      </div>

      {/* 모임별 통계 스켈레톤 */}
      <div className="space-y-4">
        <div className="h-8 glass rounded-2xl w-1/3" />
        <div className="h-40 glass rounded-2xl border-2 border-border" />
      </div>
    </div>
  );
}
