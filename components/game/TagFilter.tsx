'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * TagFilter 컴포넌트
 * 
 * 태그별로 질문을 필터링할 수 있는 UI를 제공합니다.
 * 선택한 태그는 URL 쿼리 파라미터로 관리됩니다.
 * 
 * ## Props
 * - onTagChange (optional): 태그가 변경될 때 호출되는 콜백
 */

interface Tag {
  id: string;
  name: string;
}

interface TagFilterProps {
  onTagChange?: (tags: string[]) => void;
}

export function TagFilter({ onTagChange }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL에서 선택된 태그 로드
  useEffect(() => {
    const tagsParam = searchParams.get('tags');
    if(tagsParam) {
      setSelectedTags(tagsParam.split(','));
    }
  }, [searchParams]);

  // 태그 목록 가져오기
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tags');
      
      if(!response.ok) {
        throw new Error('태그를 가져올 수 없습니다.');
      }

      const data = await response.json();
      setTags(data.tags || []);
    } catch(err) {
      console.error('태그 가져오기 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tagName: string) => {
    let newSelectedTags: string[];
    
    if(selectedTags.includes(tagName)) {
      // 태그 제거
      newSelectedTags = selectedTags.filter(t => t !== tagName);
    } else {
      // 태그 추가
      newSelectedTags = [...selectedTags, tagName];
    }

    setSelectedTags(newSelectedTags);

    // URL 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if(newSelectedTags.length > 0) {
      params.set('tags', newSelectedTags.join(','));
    } else {
      params.delete('tags');
    }

    router.push(`?${params.toString()}`, { scroll: false });

    // 콜백 실행
    if(onTagChange) {
      onTagChange(newSelectedTags);
    }
  };

  const handleClearAll = () => {
    setSelectedTags([]);
    
    // URL에서 tags 파라미터 제거
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tags');
    router.push(`?${params.toString()}`, { scroll: false });

    // 콜백 실행
    if(onTagChange) {
      onTagChange([]);
    }
  };

  if(isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600">태그 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if(tags.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          🏷️ 태그 필터
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:underline"
          >
            모두 해제
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          
          return (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag.name)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isSelected && '✓ '}#{tag.name}
            </button>
          );
        })}
      </div>

      {selectedTags.length > 0 && (
        <div className="mt-3 rounded-md bg-blue-50 p-2 text-sm text-blue-800">
          <strong>{selectedTags.length}개 태그</strong> 선택됨: {selectedTags.map(t => `#${t}`).join(', ')}
        </div>
      )}
    </div>
  );
}

