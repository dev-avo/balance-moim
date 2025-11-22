'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

/**
 * WarningModal 컴포넌트
 * 
 * 밸런스 게임 시작 전 주의사항을 표시하는 모달입니다.
 * 
 * ## 주요 기능
 * - 첫 방문 시에만 자동으로 표시
 * - localStorage를 사용하여 "다시 보지 않기" 상태 저장
 * - "한 번 선택한 답변은 수정할 수 없습니다" 안내
 * 
 * ## 사용 예시
 * ```tsx
 * <WarningModal onConfirm={() => startGame()} />
 * ```
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
      title="⚠️ 주의사항"
    >
      <div className="space-y-6">
        {/* 주의사항 내용 */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-4">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="mb-2 font-semibold text-yellow-900">
                중요: 답변 수정 불가
              </h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    <strong>한 번 선택한 답변은 수정할 수 없습니다.</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>신중하게 선택해주세요!</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>왜 수정할 수 없나요?</strong>
            </p>
            <p>
              밸런스 게임의 재미는 <strong>솔직한 첫 반응</strong>에서 나옵니다.
              고민 끝에 선택한 답이 모임 친구들과 얼마나 비슷한지 비교하는 것이 
              이 서비스의 핵심입니다.
            </p>
          </div>
        </div>

        {/* 확인 버튼 */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleConfirm}
            size="lg"
            className="w-full"
          >
            확인했습니다. 시작할게요!
          </Button>
          <p className="text-center text-xs text-gray-500">
            이 안내는 한 번만 표시됩니다.
          </p>
        </div>
      </div>
    </Modal>
  );
}

