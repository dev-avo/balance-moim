'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';

/**
 * 메인 페이지 (홈)
 * 
 * "밸런스 모임?" 서비스 소개 및 첫 접속 문구를 표시합니다.
 * 
 * ## 구성 요소
 * - 서비스 로고 (🎯)
 * - 서비스명 "밸런스 모임?"
 * - 소개 문구
 * - [시작하기] 버튼 → 밸런스 게임 플레이 페이지로 이동
 * 
 * ## 디자인 철학
 * "밸런스 모임?"이라는 이름 자체가 질문입니다.
 * 처음 듣는 사람들이 "밸런스 모임이 뭐야?"라고 궁금해하는
 * 그 순간부터 서비스가 시작됩니다.
 */
export default function Home() {
  const { isAuthenticated } = useCurrentUser();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="max-w-2xl px-4 py-16 text-center">
        {/* 로고 및 서비스명 */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="text-7xl sm:text-8xl" role="img" aria-label="타겟">
            🎯
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            밸런스 모임?
          </h1>
        </div>

        {/* 소개 문구 */}
        <div className="mb-12 space-y-4 text-lg text-gray-700 sm:text-xl">
          <p className="font-semibold text-gray-900">
            당신의 선택은 무엇인가요?
          </p>
          <p className="leading-relaxed">
            밸런스 질문으로 취향을 나누고,
            <br />
            모임 친구들과 비교하며 서로를 알아가세요.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/play">
            <Button size="lg" className="px-12 py-6 text-lg">
              시작하기
            </Button>
          </Link>

          {/* 추가 안내 (비로그인 사용자) */}
          {!isAuthenticated && (
            <p className="text-sm text-gray-500">
              로그인하지 않아도 플레이할 수 있습니다.
              <br />
              단, 응답 기록은 저장되지 않으며 모임 기능을 사용할 수 없습니다.
            </p>
          )}
        </div>

        {/* 서비스 철학 설명 */}
        <div className="mt-16 rounded-lg bg-blue-50 p-6 text-left">
          <h2 className="mb-3 text-lg font-semibold text-blue-900">
            밸런스 모임 = 밸런스 질문 + 모임
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>
                둘 중 하나를 선택하는 <strong>밸런스 질문</strong>으로 취향을 공유하고
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>
                나와 같은 <strong>모임</strong>에 속한 사람들과 선택을 비교하며 친목을 도모합니다
              </span>
            </li>
          </ul>
          <p className="mt-4 text-sm italic text-blue-700">
            같은 모임에 속한 사람들이 수십, 수백 개의 질문에 답하며 서로의 취향을 알아가는 것은
            마치 사람들 간의 균형을 맞춰나가는 과정과 같습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
