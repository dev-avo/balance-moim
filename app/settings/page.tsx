'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FieldError } from '@/components/ui/ErrorMessage';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Loading } from '@/components/ui/Loading';
import { signOut } from 'next-auth/react';

/**
 * 사용자 설정 페이지
 * 
 * ## 기능
 * - 로그인 정보 표시
 * - 표시 이름 설정 (구글 계정명 / 익명 별명)
 * - 회원 탈퇴
 */

const SettingsFormSchema = z.object({
  useNickname: z.boolean(),
  customNickname: z
    .string()
    .min(2, '별명은 최소 2자 이상이어야 합니다.')
    .max(12, '별명은 최대 12자까지 가능합니다.')
    .regex(/^[가-힣a-zA-Z0-9_]+$/, '별명은 한글, 영문, 숫자, _만 사용 가능합니다.')
    .optional(),
});

type SettingsFormData = z.infer<typeof SettingsFormSchema>;

interface UserSettings {
  email: string;
  displayName: string | null;
  customNickname: string | null;
  useNickname: boolean;
  createdGroupsCount: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isUserLoading, user } = useCurrentUser();

  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      useNickname: false,
      customNickname: '',
    },
  });

  const useNickname = watch('useNickname');

  // 로그인 확인
  useEffect(() => {
    if(!isUserLoading && !isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '설정을 변경하려면 로그인이 필요합니다.',
        variant: 'error',
      });
      router.push('/');
    }
  }, [isAuthenticated, isUserLoading, router, toast]);

  // 사용자 설정 가져오기
  useEffect(() => {
    if(isAuthenticated) {
      fetchUserSettings();
    }
  }, [isAuthenticated]);

  const fetchUserSettings = async () => {
    try {
      setIsLoading(true);

      const [settingsResponse, profileResponse] = await Promise.all([
        fetch('/api/users/settings'),
        fetch('/api/users/me'),
      ]);

      if(!settingsResponse.ok || !profileResponse.ok) {
        throw new Error('설정을 가져올 수 없습니다.');
      }

      const [settingsData, profileData] = await Promise.all([
        settingsResponse.json(),
        profileResponse.json(),
      ]);

      const settings = {
        email: user?.email || '',
        displayName: user?.name || settingsData.displayName || '',
        customNickname: settingsData.customNickname,
        useNickname: settingsData.useNickname,
        createdGroupsCount: profileData.createdGroupsCount,
      };

      setUserSettings(settings);

      // 폼 초기값 설정
      reset({
        useNickname: settings.useNickname,
        customNickname: settings.customNickname || '',
      });
    } catch(err) {
      console.error('설정 가져오기 오류:', err);
      toast({
        title: '오류',
        description: '설정을 가져오는 중 오류가 발생했습니다.',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/users/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useNickname: data.useNickname,
          customNickname: data.useNickname ? data.customNickname : null,
        }),
      });

      const result = await response.json();

      if(!response.ok) {
        throw new Error(result.error || '설정 저장에 실패했습니다.');
      }

      toast({
        title: '저장 완료',
        description: '설정이 저장되었습니다.',
        variant: 'success',
      });

      fetchUserSettings();
    } catch(err) {
      console.error('설정 저장 오류:', err);
      toast({
        title: '저장 실패',
        description: err instanceof Error ? err.message : '설정을 저장하는 중 오류가 발생했습니다.',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if(deleteConfirm !== '탈퇴하기') {
      toast({
        title: '확인 필요',
        description: '"탈퇴하기"를 정확히 입력해주세요.',
        variant: 'warning',
      });
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch('/api/users/me', {
        method: 'DELETE',
      });

      const result = await response.json();

      if(!response.ok) {
        throw new Error(result.error || '회원 탈퇴에 실패했습니다.');
      }

      toast({
        title: '회원 탈퇴 완료',
        description: '이용해주셔서 감사합니다.',
        variant: 'success',
      });

      // 로그아웃 및 홈으로 이동
      await signOut({ callbackUrl: '/' });
    } catch(err) {
      console.error('회원 탈퇴 오류:', err);
      toast({
        title: '탈퇴 실패',
        description: err instanceof Error ? err.message : '회원 탈퇴 중 오류가 발생했습니다.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if(isUserLoading || isLoading) {
    return <Loading fullScreen text="로딩 중..." />;
  }

  if(!isAuthenticated || !userSettings) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">설정</h1>
        <p className="mt-2 text-muted-foreground">계정 정보 및 설정을 관리합니다.</p>
      </div>

      {/* 계정 정보 */}
      <div className="mb-8 rounded-2xl border-2 border-border glass p-6 shadow-apple">
        <h2 className="mb-4 text-lg font-semibold text-foreground">계정 정보</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">이메일</p>
            <p className="font-medium text-foreground">{userSettings.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">구글 계정명</p>
            <p className="font-medium text-foreground">{userSettings.displayName || '없음'}</p>
          </div>
        </div>
      </div>

      {/* 표시 이름 설정 */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="rounded-2xl border-2 border-border glass p-6 shadow-apple">
          <h2 className="mb-4 text-lg font-semibold text-foreground">표시 이름 설정</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            다른 사용자에게 어떻게 표시될지 선택하세요.
          </p>

          <div className="space-y-4">
            {/* 구글 계정명 사용 */}
            <label className="flex items-start gap-3 rounded-xl border-2 border-border p-4 cursor-pointer hover:border-primary smooth-transition bg-card">
              <input
                type="radio"
                value="false"
                {...register('useNickname')}
                checked={!useNickname}
                onChange={() => reset({ useNickname: false, customNickname: '' })}
                className="mt-1 h-4 w-4 text-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">구글 계정명 사용</p>
                <p className="text-sm text-muted-foreground">
                  {userSettings.displayName || '계정명이 없습니다'}
                </p>
              </div>
            </label>

            {/* 익명 별명 사용 */}
            <label className="flex items-start gap-3 rounded-xl border-2 border-border p-4 cursor-pointer hover:border-primary smooth-transition bg-card">
              <input
                type="radio"
                value="true"
                {...register('useNickname')}
                checked={useNickname}
                onChange={() => reset({ useNickname: true, customNickname: userSettings.customNickname || '' })}
                className="mt-1 h-4 w-4 text-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">익명 별명 사용</p>
                <p className="text-sm text-muted-foreground mb-3">
                  다른 사용자에게 별명으로 표시됩니다
                </p>
                {useNickname && (
                  <div>
                    <Input
                      type="text"
                      placeholder="별명 입력 (2~12자)"
                      {...register('customNickname')}
                    />
                    {errors.customNickname && (
                      <FieldError message={errors.customNickname.message!} />
                    )}
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>
      </form>

      {/* 회원 탈퇴 */}
      <div className="rounded-2xl border-2 border-destructive/30 glass bg-destructive/10 p-6 shadow-apple">
        <h2 className="mb-2 text-lg font-semibold text-foreground">회원 탈퇴</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          탈퇴 시 모든 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          회원 탈퇴
        </Button>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>⚠️ 회원 탈퇴 확인</ModalTitle>
          </ModalHeader>
          <div className="space-y-4">
          {userSettings.createdGroupsCount > 0 && (
            <div className="rounded-xl border-2 border-yellow-500/30 bg-yellow-500/10 p-4">
              <p className="text-sm font-semibold text-foreground">
                ⚠️ 생성한 모임이 {userSettings.createdGroupsCount}개 있습니다
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                생성자가 탈퇴하면 모임이 남아있지만 관리할 수 없습니다.
                먼저 다른 멤버에게 관리자 권한을 위임하거나 모임을 삭제해주세요.
              </p>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-2 text-foreground">탈퇴 시 삭제되는 정보:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>계정 정보</li>
              <li>작성한 질문 (통계에는 유지됩니다)</li>
              <li>모임 멤버십</li>
              <li>응답 데이터 (통계에는 "탈퇴한 사용자"로 표시됩니다)</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              확인을 위해 "<strong>탈퇴하기</strong>"를 입력하세요
            </label>
            <Input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="탈퇴하기"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirm !== '탈퇴하기' || userSettings.createdGroupsCount > 0}
              className="flex-1"
            >
              {isDeleting ? '탈퇴 중...' : '회원 탈퇴'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirm('');
              }}
              disabled={isDeleting}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </div>
        </ModalContent>
      </Modal>
    </div>
  );
}

