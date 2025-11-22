'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Pagination } from '@/components/ui/Pagination';
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
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

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
      fetchMyQuestions(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  const fetchMyQuestions = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/questions/my?page=${page}&limit=10`);

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '질문을 가져올 수 없습니다.');
      }

      const data = await response.json();
      setQuestions(data.questions);
      
      // 페이지네이션 정보 업데이트
      if(data.pagination) {
        setTotalPages(data.pagination.totalPages);
        setHasNext(data.pagination.hasNext);
        setHasPrev(data.pagination.hasPrev);
        setTotalCount(data.pagination.total);
      }
    } catch(err) {
      console.error('질문 목록 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      fetchMyQuestions(currentPage);
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
          onRetry={() => fetchMyQuestions(currentPage)}
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
          <h1 className="text-3xl font-bold text-foreground">내 질문</h1>
          <p className="mt-2 text-muted-foreground">
            내가 만든 질문 {questions.length}개
          </p>
        </div>
        <Link href="/questions/create">
          <Button size="lg">+ 새 질문 만들기</Button>
        </Link>
      </div>

      {/* 질문 목록 */}
      {questions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border glass p-12 text-center">
          <div className="text-6xl mb-4 opacity-80">📝</div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            아직 만든 질문이 없습니다
          </h3>
          <p className="text-muted-foreground mb-6">
            첫 번째 밸런스 질문을 만들어보세요!
          </p>
          <Link href="/questions/create">
            <Button>질문 만들기</Button>
          </Link>
        </div>
      ) : (
        <>
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
                  className="rounded-2xl glass border-2 border-border p-6 shadow-apple hover:shadow-apple-lg smooth-transition"
                >
                  {/* 질문 헤더 */}
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {question.title}
                      </h3>
                      
                      {/* 태그 */}
                      {question.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {question.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center rounded-full glass border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 공개 설정 배지 */}
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-apple',
                          question.visibility === 'public' && 'glass border-2 border-border text-muted-foreground',
                          question.visibility === 'private' && 'glass border-2 border-border text-muted-foreground',
                          question.visibility === 'group' && 'bg-secondary/30 text-secondary-foreground border-2 border-secondary/50'
                        )}
                      >
                        {question.visibility === 'public' && '🌍 전체 공개'}
                        {question.visibility === 'private' && '🔒 비공개'}
                        {question.visibility === 'group' && '👥 모임 전용'}
                      </span>
                    </div>
                  </div>

                  {/* 선택지 및 통계 */}
                  <div className="mb-5 space-y-4">
                    {/* 선택지 A */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          A. {question.optionA}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {question.stats.optionACount}명 ({optionAPercentage}%)
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full glass border border-border shadow-inner-apple">
                        <div
                          className="h-full bg-primary smooth-transition"
                          style={{ width: `${optionAPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* 선택지 B */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          B. {question.optionB}
                        </span>
                        <span className="text-sm font-bold text-secondary-foreground">
                          {question.stats.optionBCount}명 ({optionBPercentage}%)
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full glass border border-border shadow-inner-apple">
                        <div
                          className="h-full bg-secondary smooth-transition"
                          style={{ width: `${optionBPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 통계 요약 */}
                  <div className="mb-4 text-sm text-muted-foreground pt-4 border-t border-border/40">
                    총 <strong className="text-foreground">{question.stats.totalResponses}명</strong>이 응답했습니다
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-3">
                    <Link href={`/questions/${question.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        수정
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                      className="flex-1"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {questions.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasNext={hasNext}
              hasPrev={hasPrev}
            />
          )}
        </>
      )}
    </div>
  );
}

