'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useToast } from '@/hooks/use-toast';
import { signIn } from 'next-auth/react';

/**
 * 초대 링크를 통한 모임 참여 페이지
 * 
 * ## 기능
 * - 초대 코드 유효성 확인
 * - 모임 정보 표시 (이름, 설명, 멤버 수)
 * - 로그인 체크 (비로그인 시 로그인 유도)
 * - [모임 참여하기] 버튼
 */

interface InviteData {
  groupId: string;
  groupName: string;
  groupDescription: string | null;
  memberCount: number;
  expiresAt: number | null;
  isExpired: boolean;
}

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const inviteCode = params.inviteCode as string;
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isUserLoading } = useCurrentUser();

  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  // 초대 링크 정보 가져오기
  useEffect(() => {
    if(inviteCode) {
      fetchInviteData();
    }
  }, [inviteCode]);

  const fetchInviteData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/groups/join/${inviteCode}`);

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '초대 링크를 찾을 수 없습니다.');
      }

      const data = await response.json();
      setInviteData(data);
    } catch(err) {
      console.error('초대 링크 정보 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if(!isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '모임에 참여하려면 로그인이 필요합니다.',
        variant: 'warning',
      });
      signIn('google');
      return;
    }

    try {
      setIsJoining(true);

      const response = await fetch(`/api/groups/join/${inviteCode}`, {
        method: 'POST',
      });

      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.error || '모임 참여에 실패했습니다.');
      }

      toast({
        title: '모임 참여 완료',
        description: `${inviteData?.groupName} 모임에 참여했습니다!`,
        variant: 'success',
      });

      router.push(`/groups/${data.groupId}`);
    } catch(err) {
      console.error('모임 참여 오류:', err);
      toast({
        title: '참여 실패',
        description: err instanceof Error ? err.message : '모임 참여 중 오류가 발생했습니다.',
        variant: 'error',
      });
    } finally {
      setIsJoining(false);
    }
  };

  if(isLoading) {
    return <Loading fullScreen text="초대 링크 확인 중..." />;
  }

  if(error || !inviteData) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <ErrorMessage
          title="초대 링크 오류"
          message={error || '초대 링크를 찾을 수 없습니다.'}
          fullScreen
        />
      </div>
    );
  }

  // 만료된 초대 링크
  if(inviteData.isExpired) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            초대 링크가 만료되었습니다
          </h2>
          <p className="text-gray-600 mb-6">
            이 초대 링크는 더 이상 유효하지 않습니다.
            <br />
            모임 관리자에게 새로운 초대 링크를 요청해주세요.
          </p>
          <Button onClick={() => router.push('/')}>홈으로 이동</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="max-w-md w-full px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
          {/* 초대 아이콘 */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
              👋
            </div>
          </div>

          {/* 모임 정보 */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {inviteData.groupName}
            </h1>
            {inviteData.groupDescription && (
              <p className="text-gray-600 mb-4">{inviteData.groupDescription}</p>
            )}
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
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
              <span>{inviteData.memberCount}명 참여 중</span>
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              이 모임에 참여하면 밸런스 질문에 함께 응답하고,
              다른 멤버들의 선택과 비교할 수 있습니다.
            </p>
          </div>

          {/* 참여 버튼 */}
          {isUserLoading ? (
            <div className="flex justify-center">
              <Loading text="로딩 중..." />
            </div>
          ) : !isAuthenticated ? (
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => signIn('google')}
              >
                Google 로그인하고 참여하기
              </Button>
              <p className="text-center text-xs text-gray-500">
                로그인하면 모임에 참여할 수 있습니다
              </p>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full"
              onClick={handleJoinGroup}
              disabled={isJoining}
            >
              {isJoining ? '참여 중...' : '모임 참여하기'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

