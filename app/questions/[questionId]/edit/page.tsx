'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
 * 질문 수정 페이지
 * 
 * ## 기능
 * - 기존 질문 데이터 불러오기
 * - 질문 제목, 선택지 A/B 수정
 * - 태그 수정 (자동완성)
 * - 공개 설정 수정
 * - React Hook Form + Zod 검증
 */

const QuestionFormSchema = z.object({
  title: z
    .string()
    .min(1, '질문 제목은 필수입니다.')
    .max(100, '질문 제목은 최대 100자까지 가능합니다.'),
  optionA: z
    .string()
    .min(1, '선택지 A는 필수입니다.')
    .max(50, '선택지 A는 최대 50자까지 가능합니다.'),
  optionB: z
    .string()
    .min(1, '선택지 B는 필수입니다.')
    .max(50, '선택지 B는 최대 50자까지 가능합니다.'),
  tagInput: z.string(),
  visibility: z.enum(['public', 'group', 'private']),
});

type QuestionFormData = z.infer<typeof QuestionFormSchema>;

interface QuestionData {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  visibility: 'public' | 'group' | 'private';
  tags: Array<{ id: string; name: string }>;
}

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.questionId as string;
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isUserLoading } = useCurrentUser();
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<Array<{ id: string; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      title: '',
      optionA: '',
      optionB: '',
      tagInput: '',
      visibility: 'public',
    },
  });

  const tagInput = watch('tagInput');

  // 로그인 확인
  useEffect(() => {
    if(!isUserLoading && !isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '질문을 수정하려면 로그인이 필요합니다.',
        variant: 'error',
      });
      router.push('/');
    }
  }, [isAuthenticated, isUserLoading, router, toast]);

  // 질문 데이터 불러오기
  useEffect(() => {
    if(isAuthenticated && questionId) {
      fetchQuestion();
    }
  }, [isAuthenticated, questionId]);

  const fetchQuestion = async () => {
    try {
      setIsLoadingQuestion(true);
      const response = await fetch(`/api/questions/${questionId}`);

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '질문을 불러올 수 없습니다.');
      }

      const data = await response.json();
      setQuestionData(data.question);

      // 폼 데이터 설정
      reset({
        title: data.question.title,
        optionA: data.question.optionA,
        optionB: data.question.optionB,
        visibility: data.question.visibility,
        tagInput: '',
      });

      // 태그 설정
      setTags(data.question.tags.map((t: any) => t.name));
    } catch(error) {
      console.error('질문 불러오기 오류:', error);
      toast({
        title: '오류',
        description: error instanceof Error ? error.message : '질문을 불러올 수 없습니다.',
        variant: 'error',
      });
      router.push('/questions/my');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // 태그 자동완성
  useEffect(() => {
    if(tagInput && tagInput.length > 0) {
      fetchTagSuggestions(tagInput);
    } else {
      setTagSuggestions([]);
    }
  }, [tagInput]);

  const fetchTagSuggestions = async (query: string) => {
    try {
      const response = await fetch(`/api/tags/search?q=${encodeURIComponent(query)}&limit=5`);
      if(response.ok) {
        const data = await response.json();
        setTagSuggestions(data.tags);
      }
    } catch(error) {
      console.error('태그 검색 오류:', error);
    }
  };

  const addTag = (tagName: string) => {
    if(tags.length >= 5) {
      toast({
        title: '태그 개수 초과',
        description: '최대 5개까지 태그를 추가할 수 있습니다.',
        variant: 'warning',
      });
      return;
    }

    if(!tags.includes(tagName)) {
      setTags([...tags, tagName]);
      setValue('tagInput', '');
      setTagSuggestions([]);
    }
  };

  const removeTag = (tagName: string) => {
    setTags(tags.filter((t) => t !== tagName));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      const value = tagInput.trim();
      if(value) {
        addTag(value);
      }
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    if(tags.length === 0) {
      toast({
        title: '태그 필요',
        description: '최소 1개 이상의 태그를 추가해주세요.',
        variant: 'warning',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          optionA: data.optionA,
          optionB: data.optionB,
          tags,
          visibility: data.visibility,
        }),
      });

      const result = await response.json();

      if(!response.ok) {
        throw new Error(result.error || '질문 수정에 실패했습니다.');
      }

      toast({
        title: '수정 완료',
        description: '질문이 성공적으로 수정되었습니다!',
        variant: 'success',
      });

      router.push('/questions/my');
    } catch(error) {
      console.error('질문 수정 오류:', error);
      toast({
        title: '수정 실패',
        description: error instanceof Error ? error.message : '질문을 수정하는 중 오류가 발생했습니다.',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if(isUserLoading || isLoadingQuestion) {
    return <Loading fullScreen text="로딩 중..." />;
  }

  if(!isAuthenticated || !questionData) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">질문 수정하기</h1>
        <p className="mt-2 text-gray-600">
          질문 내용을 수정하세요.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 질문 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            질문 제목 <span className="text-red-600">*</span>
          </label>
          <Input
            id="title"
            type="text"
            placeholder="예: 더 맛있는 진라면은?"
            {...register('title')}
          />
          {errors.title && <FieldError message={errors.title.message!} />}
        </div>

        {/* 선택지 A */}
        <div>
          <label htmlFor="optionA" className="block text-sm font-medium text-gray-700 mb-2">
            선택지 A <span className="text-red-600">*</span>
          </label>
          <Input
            id="optionA"
            type="text"
            placeholder="예: 매운맛"
            {...register('optionA')}
          />
          {errors.optionA && <FieldError message={errors.optionA.message!} />}
        </div>

        {/* 선택지 B */}
        <div>
          <label htmlFor="optionB" className="block text-sm font-medium text-gray-700 mb-2">
            선택지 B <span className="text-red-600">*</span>
          </label>
          <Input
            id="optionB"
            type="text"
            placeholder="예: 순한맛"
            {...register('optionB')}
          />
          {errors.optionB && <FieldError message={errors.optionB.message!} />}
        </div>

        {/* 태그 입력 */}
        <div>
          <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 mb-2">
            태그 <span className="text-red-600">*</span>
            <span className="ml-2 text-xs text-gray-500">(최소 1개, 최대 5개)</span>
          </label>
          
          {/* 추가된 태그 목록 */}
          {tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 태그 입력 필드 */}
          <div className="relative">
            <Input
              id="tagInput"
              type="text"
              placeholder="태그 입력 후 Enter"
              {...register('tagInput')}
              onKeyDown={handleTagInputKeyDown}
              disabled={tags.length >= 5}
            />

            {/* 자동완성 제안 */}
            {tagSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                {tagSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => addTag(suggestion.name)}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    #{suggestion.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            태그를 입력하고 Enter를 누르세요. 기존 태그를 선택하거나 새로 만들 수 있습니다.
          </p>
        </div>

        {/* 공개 설정 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공개 설정
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="public"
                {...register('visibility')}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">전체 공개 - 모든 사용자가 볼 수 있습니다</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="private"
                {...register('visibility')}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">비공개 - 나만 볼 수 있습니다</span>
            </label>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '수정 중...' : '수정 완료'}
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

