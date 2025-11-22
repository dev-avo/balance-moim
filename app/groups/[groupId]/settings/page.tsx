'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useToast } from '@/hooks/use-toast';

/**
 * 모임 관리 페이지 (생성자 전용)
 * 
 * ## 기능
 * - 멤버 목록 표시
 * - 멤버 추방 기능
 * - 생성자만 접근 가능
 */

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  isCreator: boolean;
}

interface MemberData {
  id: string;
  name: string | null;
  status: number;
  joinedAt: Date | null;
}

export default function GroupSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isUserLoading } = useCurrentUser();

  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  // 모임 정보 가져오기
  useEffect(() => {
    if(!isUserLoading && !isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '로그인이 필요합니다.',
        variant: 'error',
      });
      router.push('/');
      return;
    }

    if(groupId && isAuthenticated) {
      fetchGroupData();
    }
  }, [groupId, isAuthenticated, isUserLoading]);

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
      
      // 생성자 권한 확인
      if(!data.group.isCreator) {
        toast({
          title: '권한 없음',
          description: '모임 생성자만 접근할 수 있습니다.',
          variant: 'error',
        });
        router.push(`/groups/${groupId}`);
        return;
      }

      setGroupData(data.group);
      setMembers(data.members);
    } catch(err) {
      console.error('모임 정보 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string | null) => {
    if(!confirm(`정말 "${memberName || '익명 사용자'}"를 모임에서 추방하시겠습니까?`)) {
      return;
    }

    try {
      setRemovingMemberId(memberId);

      const response = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.error || '멤버 추방에 실패했습니다.');
      }

      toast({
        title: '추방 완료',
        description: `${memberName || '익명 사용자'}가 모임에서 추방되었습니다.`,
        variant: 'success',
      });

      // 멤버 목록 새로고침
      fetchGroupData();
    } catch(err) {
      console.error('멤버 추방 오류:', err);
      toast({
        title: '추방 실패',
        description: err instanceof Error ? err.message : '멤버를 추방하는 중 오류가 발생했습니다.',
        variant: 'error',
      });
    } finally {
      setRemovingMemberId(null);
    }
  };

  if(isUserLoading || isLoading) {
    return <Loading fullScreen text="로딩 중..." />;
  }

  if(!isAuthenticated) {
    return null;
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

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              모임 관리
            </h1>
            <p className="text-gray-600">{groupData.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/groups/${groupId}`)}
          >
            ← 모임으로 돌아가기
          </Button>
        </div>
      </div>

      {/* 멤버 관리 */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          멤버 관리 ({members.length}명)
        </h2>

        <div className="space-y-2">
          {members.map((member) => {
            const isCreator = member.id === groupData.id;
            const isRemoving = removingMemberId === member.id;

            return (
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
                      {isCreator && (
                        <span className="ml-2 text-sm text-blue-600">👑 생성자</span>
                      )}
                    </p>
                    {member.status === -1 && (
                      <p className="text-sm text-gray-500">(탈퇴한 사용자)</p>
                    )}
                  </div>
                </div>

                {!isCreator && member.status !== -1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id, member.name)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? '추방 중...' : '추방'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-sm font-semibold text-yellow-900 mb-2">
          ⚠️ 주의사항
        </h3>
        <ul className="space-y-1 text-sm text-yellow-800">
          <li>• 추방된 멤버는 초대 링크를 통해 다시 참여할 수 있습니다.</li>
          <li>• 추방된 멤버의 기존 응답은 유지됩니다.</li>
          <li>• 생성자는 추방할 수 없습니다.</li>
        </ul>
      </div>
    </div>
  );
}

