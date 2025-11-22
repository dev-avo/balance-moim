'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';

/**
 * InviteButton 컴포넌트
 * 
 * 모임 초대 링크를 생성하고 클립보드에 복사하는 버튼입니다.
 * 
 * ## Props
 * - groupId: 모임 ID
 * - variant: 버튼 스타일
 * - size: 버튼 크기
 * - children: 버튼 텍스트
 */

interface InviteButtonProps {
  groupId: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function InviteButton({
  groupId,
  variant = 'default',
  size = 'default',
  children = '초대 링크 생성',
}: InviteButtonProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateInvite = async () => {
    try {
      setIsCreating(true);

      const response = await fetch(`/api/groups/${groupId}/invite`, {
        method: 'POST',
      });

      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.error || '초대 링크 생성에 실패했습니다.');
      }

      // 클립보드에 복사
      await navigator.clipboard.writeText(data.inviteUrl);

      toast({
        title: '초대 링크 생성 완료',
        description: '링크가 클립보드에 복사되었습니다!',
        variant: 'success',
      });
    } catch(error) {
      console.error('초대 링크 생성 오류:', error);
      toast({
        title: '생성 실패',
        description: error instanceof Error ? error.message : '초대 링크를 생성하는 중 오류가 발생했습니다.',
        variant: 'error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCreateInvite}
      disabled={isCreating}
    >
      {isCreating ? '생성 중...' : children}
    </Button>
  );
}

