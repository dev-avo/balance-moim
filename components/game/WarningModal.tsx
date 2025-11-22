'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

/**
 * WarningModal Component - Apple MacBook Style
 * 
 * Apple 스타일의 게임 시작 전 주의사항 모달입니다.
 * - Glassmorphism 효과
 * - 부드러운 애니메이션
 * - 다크모드 지원
 * 
 * ## 주요 기능
 * - 첫 방문 시에만 자동으로 표시
 * - localStorage를 사용하여 "다시 보지 않기" 상태 저장
 * - "한 번 선택한 답변은 수정할 수 없습니다" 안내
 */

interface WarningModalProps {
  /** 확인 버튼 클릭 시 콜백 */
  onConfirm: () => void;
}

const LOCAL_STORAGE_KEY = 'balance-moim-warning-seen';

export function WarningModal({ onConfirm }: WarningModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // localStorage에서 이전에 봤는지 확인
    const hasSeenWarning = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if(!hasSeenWarning) {
      // 처음 방문한 경우 모달 표시
      setIsOpen(true);
    } else {
      // 이미 본 경우 바로 게임 시작
      onConfirm();
    }
  }, [onConfirm]);

  const handleConfirm = () => {
    // localStorage에 저장
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setIsOpen(false);
    onConfirm();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if(!open) {
          handleConfirm();
        }
      }}
    >
      <ModalContent className="max-w-xl">
        <ModalHeader>
          <ModalTitle className="text-center">
            <div className="mb-4 text-6xl">🎯</div>
            밸런스 모임?
          </ModalTitle>
        </ModalHeader>

        <div className="space-y-6">
          {/* 서비스 설명 */}
          <div className="text-center space-y-2">
            <p className="text-base font-medium text-foreground">
              당신의 선택은 무엇인가요?
            </p>
            <p className="text-sm text-muted-foreground">
              밸런스 질문으로 취향을 나누고,
              <br />
              모임 친구들과 비교하며 서로를 알아가세요.
            </p>
          </div>

          {/* 주의사항 */}
          <div className="rounded-2xl border-2 border-yellow-500/30 glass bg-yellow-500/10 p-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground">
              <span className="text-2xl">⚠️</span>
              중요: 답변 수정 불가
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-yellow-600 dark:text-yellow-400">•</span>
                <span>
                  <strong className="text-foreground">한 번 선택한 답변은 수정할 수 없습니다.</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-yellow-600 dark:text-yellow-400">•</span>
                <span>신중하게 선택해주세요!</span>
              </li>
            </ul>
          </div>

          {/* 서비스 철학 */}
          <div className="rounded-2xl glass border-2 border-border p-5">
            <h4 className="mb-2 text-sm font-bold text-foreground">
              밸런스 모임 = 밸런스 질문 + 모임
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">•</span>
                <span>
                  둘 중 하나를 선택하는 <strong className="text-foreground">밸런스 질문</strong>으로 취향을 공유하고
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">•</span>
                <span>
                  같은 <strong className="text-foreground">모임</strong>에 있는 사람들의 답변을 비교해보세요!
                </span>
              </li>
            </ul>
          </div>

          {/* 확인 버튼 */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleConfirm}
              size="lg"
              className="w-full"
            >
              시작하기
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              이 안내는 한 번만 표시됩니다.
            </p>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
