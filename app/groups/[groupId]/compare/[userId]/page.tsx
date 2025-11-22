'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage, NotFound } from '@/components/ui/ErrorMessage';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';

/**
 * 사용자 간 상세 비교 페이지
 * 
 * 모임 내에서 나와 다른 사용자의 응답을 질문별로 상세 비교합니다.
 * 
 * ## 기능
 * - 질문별 선택 비교
 * - 일치하는 질문은 초록색, 다른 질문은 빨간색
 * - 전체 일치율 표시
 */

interface ComparisonQuestion {
  questionId: string;
  title: string;
  optionA: string;
  optionB: string;
  myChoice: 'A' | 'B';
  theirChoice: 'A' | 'B';
  isMatch: boolean;
  tags: string[];
}

interface ComparisonData {
  targetUser: {
    id: string;
    name: string | null;
  };
  matchPercentage: number;
  commonQuestions: number;
  matchedAnswers: number;
  questions: ComparisonQuestion[];
}

export default function CompareUserPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isUserLoading } = useCurrentUser();

  const groupId = params?.groupId as string;
  const userId = params?.userId as string;

  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 로그인 확인
  useEffect(() => {
    if(!isUserLoading && !isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '비교를 보려면 로그인이 필요합니다.',
        variant: 'error',
      });
      router.push('/');
    }
  }, [isAuthenticated, isUserLoading, router, toast]);

  // 비교 데이터 가져오기
  useEffect(() => {
    if(isAuthenticated && groupId && userId) {
      fetchComparison();
    }
  }, [isAuthenticated, groupId, userId]);

  const fetchComparison = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/groups/${groupId}/compare/${userId}`);

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '비교 데이터를 가져올 수 없습니다.');
      }

      const data = await response.json();
      setComparison(data.comparison);
    } catch(err) {
      console.error('비교 데이터 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if(isUserLoading || isLoading) {
    return <Loading fullScreen text="비교 분석 중..." />;
  }

  if(error) {
    return (
      <div className="mx-auto max-w-4xl py-8">
        <ErrorMessage message={error} onRetry={fetchComparison} />
      </div>
    );
  }

  if(!comparison) {
    return <NotFound message="비교 데이터를 찾을 수 없습니다." />;
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/groups/${groupId}`)}
          className="mb-4"
        >
          ← 모임으로 돌아가기
        </Button>

        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <span className="text-4xl">🎯</span>
          취향 비교
        </h1>
        <p className="mt-2 text-muted-foreground">
          나 vs <strong className="text-foreground">{comparison.targetUser.name || '익명 사용자'}</strong>
        </p>
      </div>

      {/* 일치율 요약 */}
      <div className="mb-8 rounded-2xl glass border-2 border-border p-6 shadow-apple-lg bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-semibold">전체 일치율</p>
            <p className="text-5xl font-bold text-primary">
              {comparison.matchPercentage}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-semibold">공통 질문</p>
            <p className="text-3xl font-bold text-foreground">
              {comparison.commonQuestions}개
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              일치 <span className="font-bold text-green-700 dark:text-green-400">{comparison.matchedAnswers}</span> 
              {' / '}
              불일치 <span className="font-bold text-red-700 dark:text-red-400">{comparison.commonQuestions - comparison.matchedAnswers}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 질문별 비교 */}
      {comparison.questions.length === 0 ? (
        <div className="rounded-2xl glass border-2 border-border p-8 text-center shadow-apple">
          <div className="text-6xl mb-4 opacity-80">🤔</div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            공통 응답이 없습니다
          </h3>
          <p className="text-muted-foreground">
            같은 질문에 응답하면 비교할 수 있어요!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              질문별 선택 비교
            </h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500 shadow-apple"></div>
                <span className="text-muted-foreground font-semibold">일치</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-600 dark:bg-red-500 shadow-apple"></div>
                <span className="text-muted-foreground font-semibold">불일치</span>
              </div>
            </div>
          </div>

          {comparison.questions.map((q, index) => (
            <div
              key={q.questionId}
              className={`rounded-2xl glass border-2 p-6 smooth-transition shadow-apple ${
                q.isMatch
                  ? 'border-green-600/50 bg-green-600/10 dark:border-green-500/50 dark:bg-green-500/5'
                  : 'border-red-600/50 bg-red-600/10 dark:border-red-500/50 dark:bg-red-500/5'
              }`}
            >
              {/* 질문 번호 및 일치 표시 */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">
                  질문 {index + 1}
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-apple ${
                    q.isMatch
                      ? 'bg-green-700 text-white dark:bg-green-600'
                      : 'bg-red-700 text-white dark:bg-red-600'
                  }`}
                >
                  {q.isMatch ? '✓ 일치' : '✗ 불일치'}
                </span>
              </div>

              {/* 질문 제목 */}
              <h3 className="mb-4 text-lg font-bold text-foreground">
                {q.title}
              </h3>

              {/* 선택 비교 */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* 나의 선택 */}
                <div className="rounded-xl glass border-2 border-border p-4 shadow-apple">
                  <p className="mb-2 text-sm font-bold text-muted-foreground">
                    나의 선택
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {q.myChoice === 'A' ? q.optionA : q.optionB}
                  </p>
                </div>

                {/* 상대 선택 */}
                <div className="rounded-xl glass border-2 border-border p-4 shadow-apple">
                  <p className="mb-2 text-sm font-bold text-muted-foreground">
                    상대 선택
                  </p>
                  <p className="text-lg font-bold text-secondary-foreground">
                    {q.theirChoice === 'A' ? q.optionA : q.optionB}
                  </p>
                </div>
              </div>

              {/* 태그 */}
              {q.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {q.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full glass border border-border px-2.5 py-1 text-xs font-semibold text-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

