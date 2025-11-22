'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { InviteButton } from '@/components/groups/InviteButton';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useToast } from '@/hooks/use-toast';

/**
 * 모임 상세 페이지
 * 
 * ## 기능
 * - 모임 정보 표시 (이름, 설명)
 * - 멤버 목록 표시
 * - 통계 표시 (멤버 수, 응답 수)
 * - 초대 링크 생성 버튼 (멤버만)
 * - 설정 버튼 (생성자만)
 */

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  creatorId: string;
  isCreator: boolean;
  isMember: boolean;
  memberCount: number;
  responseCount: number;
  createdAt: Date | null;
}

interface MemberData {
  id: string;
  name: string | null;
  status: number;
  joinedAt: Date | null;
}

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isUserLoading } = useCurrentUser();

  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  // 모임 정보 가져오기
  useEffect(() => {
    if(groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/groups/${groupId}`);

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '모임을 찾을 수 없습니다.');
      }

      const data = await response.json();
      setGroupData(data.group);
      setMembers(data.members);
    } catch(err) {
      console.error('모임 정보 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if(!confirm(`정말 "${groupData?.name}" 모임에서 나가시겠습니까?`)) {
      return;
    }

    try {
      setIsLeaving(true);

      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.error || '모임 나가기에 실패했습니다.');
      }

      toast({
        title: '모임 나가기 완료',
        description: `${groupData?.name} 모임에서 나갔습니다.`,
        variant: 'success',
      });

      router.push('/groups');
    } catch(err) {
      console.error('모임 나가기 오류:', err);
      toast({
        title: '나가기 실패',
        description: err instanceof Error ? err.message : '모임에서 나가는 중 오류가 발생했습니다.',
        variant: 'error',
      });
    } finally {
      setIsLeaving(false);
    }
  };

  if(isLoading) {
    return <Loading fullScreen text="로딩 중..." />;
  }

  if(error || !groupData) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <ErrorMessage
          message={error || '모임을 찾을 수 없습니다.'}
          onRetry={fetchGroupData}
          fullScreen
        />
      </div>
    );
  }

  // 멤버가 아닌 경우
  if(!groupData.isMember && isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            모임 멤버만 볼 수 있습니다
          </h2>
          <p className="text-gray-600 mb-6">
            이 모임에 참여하려면 초대 링크가 필요합니다.
          </p>
          <Button onClick={() => router.push('/groups')}>내 모임으로 이동</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {groupData.name}
            </h1>
            {groupData.isCreator && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                👑 내가 만든 모임
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {groupData.isMember && (
              <InviteButton groupId={groupId} variant="outline">
                📋 초대 링크 생성
              </InviteButton>
            )}
            {groupData.isCreator && (
              <Link href={`/groups/${groupId}/settings`}>
                <Button variant="outline">⚙️ 설정</Button>
              </Link>
            )}
          </div>
        </div>

        {groupData.description && (
          <p className="text-gray-600">{groupData.description}</p>
        )}
      </div>

      {/* 통계 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
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
            </div>
            <div>
              <p className="text-sm text-gray-600">총 멤버</p>
              <p className="text-2xl font-bold text-gray-900">{groupData.memberCount}명</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
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
            </div>
            <div>
              <p className="text-sm text-gray-600">총 응답</p>
              <p className="text-2xl font-bold text-gray-900">{groupData.responseCount}개</p>
            </div>
          </div>
        </div>
      </div>

      {/* 모임 나가기 (생성자 아닌 경우만) */}
      {groupData.isMember && !groupData.isCreator && (
        <div className="mb-8">
          <Button
            variant="destructive"
            onClick={handleLeaveGroup}
            disabled={isLeaving}
          >
            {isLeaving ? '나가는 중...' : '모임 나가기'}
          </Button>
        </div>
      )}

      {/* 멤버 목록 */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          멤버 목록 ({members.length}명)
        </h2>

        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                  {member.name?.[0] || '?'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {member.name || '익명 사용자'}
                    {member.id === groupData.creatorId && (
                      <span className="ml-2 text-sm text-blue-600">👑</span>
                    )}
                  </p>
                  {member.status === -1 && (
                    <p className="text-sm text-gray-500">(탈퇴한 사용자)</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

