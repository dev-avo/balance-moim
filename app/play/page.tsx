'use client';

import { useState, useEffect } from 'react';
import { WarningModal } from '@/components/game/WarningModal';
import { QuestionCard, QuestionCardSkeleton, QuestionData } from '@/components/game/QuestionCard';
import { ResultCard, ResultCardSkeleton } from '@/components/game/ResultCard';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';

/**
 * 밸런스 게임 플레이 페이지
 * 
 * ## 게임 흐름
 * 1. 주의사항 모달 표시 (첫 방문 시)
 * 2. 랜덤 질문 가져오기
 * 3. 질문 표시 및 선택
 * 4. 응답 제출
 * 5. 결과 표시 (전체 통계 + 모임별 통계)
 * 6. 다음 질문으로 이동
 */

type GameState = 'loading' | 'question' | 'submitting' | 'result' | 'error';

interface StatsData {
  totalResponses: number;
  optionACount: number;
  optionBCount: number;
  optionAPercentage: number;
  optionBPercentage: number;
  userSelection: 'A' | 'B' | null;
  groupStats: Array<{
    groupId: string;
    groupName: string;
    totalResponses: number;
    optionACount: number;
    optionBCount: number;
    optionAPercentage: number;
    optionBPercentage: number;
  }>;
}

export default function PlayPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>('loading');
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // 랜덤 질문 가져오기
  const fetchRandomQuestion = async () => {
    try {
      setGameState('loading');
      setError(null);

      const response = await fetch('/api/questions/random');

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '질문을 가져올 수 없습니다.');
      }

      const question = await response.json();
      setCurrentQuestion(question);
      setGameState('question');
      setStats(null);
    } catch(err) {
      console.error('질문 가져오기 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setGameState('error');
    }
  };

  // 주의사항 모달 확인 후 게임 시작
  const handleStart = () => {
    setGameStarted(true);
    fetchRandomQuestion();
  };

  // 선택지 선택 핸들러
  const handleSelect = async (option: 'A' | 'B') => {
    if(!currentQuestion) return;

    try {
      setGameState('submitting');

      // 응답 제출
      const submitResponse = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedOption: option,
        }),
      });

      if(!submitResponse.ok) {
        const data = await submitResponse.json();
        throw new Error(data.error || '응답을 제출할 수 없습니다.');
      }

      // 통계 가져오기
      const statsResponse = await fetch(`/api/questions/${currentQuestion.id}/stats`);

      if(!statsResponse.ok) {
        const data = await statsResponse.json();
        throw new Error(data.error || '통계를 가져올 수 없습니다.');
      }

      const statsData = await statsResponse.json();
      setStats(statsData);
      setGameState('result');

      toast({
        title: '응답 완료',
        description: '결과를 확인하세요!',
        variant: 'success',
      });
    } catch(err) {
      console.error('응답 제출 오류:', err);
      toast({
        title: '오류',
        description: err instanceof Error ? err.message : '응답을 제출하는 중 오류가 발생했습니다.',
        variant: 'error',
      });
      setGameState('question');
    }
  };

  // 다음 질문으로 이동
  const handleNextQuestion = () => {
    fetchRandomQuestion();
  };

  // 주의사항 모달 표시 중
  if(!gameStarted) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <WarningModal onConfirm={handleStart} />
        <Loading text="준비 중..." />
      </div>
    );
  }

  // 로딩 중
  if(gameState === 'loading') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <QuestionCardSkeleton />
      </div>
    );
  }

  // 에러 발생
  if(gameState === 'error' || !currentQuestion) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <ErrorMessage
          title="질문을 불러올 수 없습니다"
          message={error || '알 수 없는 오류가 발생했습니다.'}
          onRetry={fetchRandomQuestion}
          fullScreen
        />
      </div>
    );
  }

  // 질문 표시
  if(gameState === 'question' || gameState === 'submitting') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <QuestionCard
          question={currentQuestion}
          onSelect={handleSelect}
          disabled={gameState === 'submitting'}
        />
      </div>
    );
  }

  // 결과 표시
  if(gameState === 'result' && stats) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
        <ResultCard question={currentQuestion} stats={stats} />

        {/* 다음 질문 버튼 */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button size="lg" onClick={handleNextQuestion} className="px-12">
            다음 질문으로 →
          </Button>
          <p className="text-sm text-gray-600">
            계속해서 밸런스 게임을 즐겨보세요!
          </p>
        </div>
      </div>
    );
  }

  return null;
}
