'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useToast } from '@/hooks/use-toast';

/**
 * 내가 속한 모임 목록 페이지
 * 
 * ## 기능
 * - 내가 속한 모임 목록 표시
 * - 모임별 멤버 수, 응답 수 통계
 * - 생성자 배지 표시
 * - [+ 새 모임 만들기] 버튼
 */

interface GroupItem {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  responseCount: number;
  isCreator: boolean;
  joinedAt: Date | null;
  createdAt: Date | null;
}

export default function GroupsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isUserLoading } = useCurrentUser();

  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 로그인 확인
  useEffect(() => {
    if(!isUserLoading && !isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '모임을 보려면 로그인이 필요합니다.',
        variant: 'error',
      });
      router.push('/');
    }
  }, [isAuthenticated, isUserLoading, router, toast]);

  // 모임 목록 가져오기
  useEffect(() => {
    if(isAuthenticated) {
      fetchMyGroups();
    }
  }, [isAuthenticated]);

  const fetchMyGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/groups/my');

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '모임을 가져올 수 없습니다.');
      }

      const data = await response.json();
      setGroups(data.groups);
    } catch(err) {
      console.error('모임 목록 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if(isUserLoading || (isLoading && groups.length === 0)) {
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
          onRetry={fetchMyGroups}
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
          <h1 className="text-3xl font-bold text-foreground">내 모임</h1>
          <p className="mt-2 text-muted-foreground">
            참여 중인 모임 {groups.length}개
          </p>
        </div>
        <Link href="/groups/create">
          <Button size="lg">+ 새 모임 만들기</Button>
        </Link>
      </div>

      {/* 모임 목록 */}
      {groups.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border glass p-12 text-center">
          <div className="text-6xl mb-4 opacity-80">👥</div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            아직 참여한 모임이 없습니다
          </h3>
          <p className="text-muted-foreground mb-6">
            첫 번째 모임을 만들거나 초대 링크로 참여해보세요!
          </p>
          <Link href="/groups/create">
            <Button>모임 만들기</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="block"
            >
              <div className="h-full rounded-2xl border-2 border-border glass p-6 shadow-apple smooth-transition hover:shadow-apple-lg hover:border-primary/50">
                {/* 모임 헤더 */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {group.name}
                    </h3>
                    {group.isCreator && (
                      <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                        👑 생성자
                      </span>
                    )}
                  </div>
                </div>

                {/* 모임 설명 */}
                {group.description && (
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {group.description}
                  </p>
                )}

                {/* 통계 */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    </svg>
                    <span>{group.memberCount}명</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                    <span>{group.responseCount}개 응답</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

