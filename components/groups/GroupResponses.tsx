'use client';

import { useState, useEffect } from 'react';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

/**
 * GroupResponses 컴포넌트
 * 
 * 모임 멤버들의 응답 통계를 태그별로 필터링하여 표시합니다.
 * 
 * ## Props
 * - groupId: 모임 ID
 */

interface QuestionStats {
  questionId: string;
  title: string;
  optionA: string;
  optionB: string;
  totalResponses: number;
  optionACount: number;
  optionBCount: number;
  optionAPercentage: number;
  optionBPercentage: number;
  tags: string[];
}

interface GroupResponsesProps {
  groupId: string;
}

export function GroupResponses({ groupId }: GroupResponsesProps) {
  const [questions, setQuestions] = useState<QuestionStats[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    fetchResponses();
    fetchTags();
  }, [groupId]);

  useEffect(() => {
    fetchResponses();
  }, [selectedTag]);

  const fetchResponses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = selectedTag
        ? `/api/groups/${groupId}/responses?tag=${encodeURIComponent(selectedTag)}`
        : `/api/groups/${groupId}/responses`;

      const response = await fetch(url);

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '응답을 가져올 수 없습니다.');
      }

      const data = await response.json();
      setQuestions(data.questions || []);
      setTotalMembers(data.totalMembers || 0);
    } catch(err) {
      console.error('응답 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      
      if(!response.ok) return;

      const data = await response.json();
      setAvailableTags(data.tags.map((t: any) => t.name) || []);
    } catch(err) {
      console.error('태그 가져오기 오류:', err);
    }
  };

  if(isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <Loading text="응답 통계 조회 중..." />
      </div>
    );
  }

  if(error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ErrorMessage message={error} onRetry={fetchResponses} />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          📊 모임 응답 통계
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          전체 멤버 {totalMembers}명
        </p>
      </div>

      {/* 태그 필터 */}
      {availableTags.length > 0 && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            태그별 필터
          </label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">전체 질문</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 질문 목록 */}
      {questions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            응답이 없습니다
          </h3>
          <p className="text-gray-600">
            {selectedTag
              ? `"${selectedTag}" 태그의 질문에 응답이 없습니다.`
              : '모임 멤버들이 밸런스 게임에 참여하면 여기에 통계가 표시됩니다.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={q.questionId}
              className="rounded-lg border border-gray-200 bg-gray-50 p-5"
            >
              {/* 질문 제목 */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    질문 {index + 1}
                  </span>
                  <span className="text-sm text-gray-600">
                    {q.totalResponses}명 응답
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {q.title}
                </h3>
              </div>

              {/* 선택지 A */}
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {q.optionA}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {q.optionAPercentage}% ({q.optionACount}명)
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${q.optionAPercentage}%` }}
                  />
                </div>
              </div>

              {/* 선택지 B */}
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {q.optionB}
                  </span>
                  <span className="text-sm font-semibold text-purple-600">
                    {q.optionBPercentage}% ({q.optionBCount}명)
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
                    style={{ width: `${q.optionBPercentage}%` }}
                  />
                </div>
              </div>

              {/* 태그 */}
              {q.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {q.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-300"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

