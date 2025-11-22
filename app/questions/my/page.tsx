'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/**
 * 내가 만든 질문 목록 페이지
 * 
 * ## 기능
 * - 내가 등록한 질문 목록 표시
 * - 질문별 통계 (응답 수, 선택 비율)
 * - 공개 설정 배지
 * - 편집/삭제 버튼
 */

interface QuestionItem {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  visibility: 'public' | 'group' | 'private';
  createdAt: Date | null;
  tags: Array<{ id: string; name: string }>;
  stats: {
    totalResponses: number;
    optionACount: number;
    optionBCount: number;
  };
}

export default function MyQuestionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isUserLoading } = useCurrentUser();

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 로그인 확인
  useEffect(() => {
    if(!isUserLoading && !isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '내 질문을 보려면 로그인이 필요합니다.',
        variant: 'error',
      });
      router.push('/');
    }
  }, [isAuthenticated, isUserLoading, router, toast]);

  // 질문 목록 가져오기
  useEffect(() => {
    if(isAuthenticated) {
      fetchMyQuestions();
    }
  }, [isAuthenticated]);

  const fetchMyQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/questions/my');

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '질문을 가져올 수 없습니다.');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch(err) {
      console.error('질문 목록 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if(!confirm('정말 이 질문을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '질문을 삭제할 수 없습니다.');
      }

      toast({
        title: '삭제 완료',
        description: '질문이 삭제되었습니다.',
        variant: 'success',
      });

      fetchMyQuestions();
    } catch(err) {
      console.error('질문 삭제 오류:', err);
      toast({
        title: '삭제 실패',
        description: err instanceof Error ? err.message : '질문을 삭제하는 중 오류가 발생했습니다.',
        variant: 'error',
      });
    }
  };

  if(isUserLoading || (isLoading && questions.length === 0)) {
    return <Loading fullScreen text="로딩 중..." />;
  }

  if(!isAuthenticated) {
    return null;
  }

  if(error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <ErrorMessage
          message={error}
          onRetry={fetchMyQuestions}
          fullScreen
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">내 질문</h1>
          <p className="mt-2 text-gray-600">
            내가 만든 질문 {questions.length}개
          </p>
        </div>
        <Link href="/questions/create">
          <Button size="lg">+ 새 질문 만들기</Button>
        </Link>
      </div>

      {/* 질문 목록 */}
      {questions.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            아직 만든 질문이 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            첫 번째 밸런스 질문을 만들어보세요!
          </p>
          <Link href="/questions/create">
            <Button>질문 만들기</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => {
            const optionAPercentage =
              question.stats.totalResponses > 0
                ? Math.round((question.stats.optionACount / question.stats.totalResponses) * 100)
                : 0;
            const optionBPercentage =
              question.stats.totalResponses > 0
                ? Math.round((question.stats.optionBCount / question.stats.totalResponses) * 100)
                : 0;

            return (
              <div
                key={question.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 질문 헤더 */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {question.title}
                    </h3>
                    
                    {/* 태그 */}
                    {question.tags.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {question.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 공개 설정 배지 */}
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                        question.visibility === 'public' && 'bg-green-100 text-green-800',
                        question.visibility === 'private' && 'bg-gray-100 text-gray-800',
                        question.visibility === 'group' && 'bg-purple-100 text-purple-800'
                      )}
                    >
                      {question.visibility === 'public' && '🌍 전체 공개'}
                      {question.visibility === 'private' && '🔒 비공개'}
                      {question.visibility === 'group' && '👥 모임 전용'}
                    </span>
                  </div>
                </div>

                {/* 선택지 및 통계 */}
                <div className="mb-4 space-y-3">
                  {/* 선택지 A */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        A. {question.optionA}
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        {question.stats.optionACount}명 ({optionAPercentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${optionAPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* 선택지 B */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        B. {question.optionB}
                      </span>
                      <span className="text-sm font-semibold text-purple-600">
                        {question.stats.optionBCount}명 ({optionBPercentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${optionBPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 통계 요약 */}
                <div className="mb-4 text-sm text-gray-600">
                  총 <strong>{question.stats.totalResponses}명</strong>이 응답했습니다
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <Link href={`/questions/${question.id}/edit`}>
                    <Button variant="outline" size="sm">
                      수정
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(question.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

