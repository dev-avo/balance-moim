'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FieldError } from '@/components/ui/ErrorMessage';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Loading } from '@/components/ui/Loading';

/**
 * 모임 생성 페이지
 * 
 * ## 기능
 * - 모임 이름 입력 (필수, 최대 30자)
 * - 모임 설명 입력 (선택, 최대 200자)
 * - React Hook Form + Zod 검증
 */

const GroupFormSchema = z.object({
  name: z
    .string()
    .min(1, '모임 이름은 필수입니다.')
    .max(30, '모임 이름은 최대 30자까지 가능합니다.'),
  description: z
    .string()
    .max(200, '모임 설명은 최대 200자까지 가능합니다.')
    .optional(),
});

type GroupFormData = z.infer<typeof GroupFormSchema>;

export default function CreateGroupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isUserLoading } = useCurrentUser();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(GroupFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // 로그인 확인
  if(!isUserLoading && !isAuthenticated) {
    toast({
      title: '로그인 필요',
      description: '모임을 만들려면 로그인이 필요합니다.',
      variant: 'error',
    });
    router.push('/');
    return null;
  }

  const onSubmit = async (data: GroupFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if(!response.ok) {
        throw new Error(result.error || '모임 생성에 실패했습니다.');
      }

      toast({
        title: '모임 생성 완료',
        description: '모임이 성공적으로 생성되었습니다!',
        variant: 'success',
      });

      router.push('/groups');
    } catch(error) {
      console.error('모임 생성 오류:', error);
      toast({
        title: '생성 실패',
        description: error instanceof Error ? error.message : '모임을 생성하는 중 오류가 발생했습니다.',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if(isUserLoading) {
    return <Loading fullScreen text="로딩 중..." />;
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">새 모임 만들기</h1>
        <p className="mt-2 text-gray-600">
          친구, 동료, 팀원들과 함께 밸런스 게임을 즐겨보세요!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 모임 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            모임 이름 <span className="text-red-600">*</span>
          </label>
          <Input
            id="name"
            type="text"
            placeholder="예: 회사 동료, 대학 친구, 우리 팀"
            {...register('name')}
          />
          {errors.name && <FieldError message={errors.name.message!} />}
          <p className="mt-1 text-xs text-gray-500">
            최대 30자까지 입력 가능합니다.
          </p>
        </div>

        {/* 모임 설명 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            모임 설명 (선택)
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="모임에 대한 간단한 설명을 입력하세요"
            {...register('description')}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.description && <FieldError message={errors.description.message!} />}
          <p className="mt-1 text-xs text-gray-500">
            최대 200자까지 입력 가능합니다.
          </p>
        </div>

        {/* 안내 문구 */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            💡 모임 생성 후 할 수 있는 일
          </h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• 초대 링크를 생성하여 친구들을 초대</li>
            <li>• 모임 전용 밸런스 질문 만들기</li>
            <li>• 모임 멤버들의 답변 비교 및 통계 확인</li>
            <li>• 나와 취향이 비슷한 멤버 찾기</li>
          </ul>
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '생성 중...' : '모임 만들기'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}

