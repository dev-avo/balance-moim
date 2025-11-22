'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';

/**
 * Main Page - Apple MacBook Style
 * 
 * Apple 스타일의 홈 페이지입니다.
 * - Glassmorphism 효과
 * - 부드러운 애니메이션
 * - 다크모드 지원
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
      <div className="max-w-3xl px-4 sm:px-6 py-10 sm:py-16 text-center">
        {/* 로고 및 서비스명 */}
        <div className="mb-8 sm:mb-10 flex flex-col items-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl animate-bounce" role="img" aria-label="타겟">
            🎯
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-2 sm:mb-3">
              밸런스 모임?
            </h1>
            <p className="text-base sm:text-lg font-medium text-primary tracking-wide">
              Balance Moim
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground italic mt-1">
              What's Your Balance?
            </p>
          </div>
        </div>

        {/* 소개 문구 */}
        <div className="mb-10 sm:mb-12 space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <p className="font-semibold text-foreground text-xl sm:text-2xl">
            당신의 선택은 무엇인가요?
          </p>
          <p className="leading-relaxed text-muted-foreground">
            밸런스 질문으로 취향을 나누고,
            <br />
            모임 친구들과 비교하며 서로를 알아가세요.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link href="/play">
            <Button size="lg" className="px-10 sm:px-12 md:px-16 py-5 sm:py-6 md:py-7 text-base sm:text-lg shadow-apple-lg hover:shadow-apple">
              시작하기
            </Button>
          </Link>

          {/* 추가 안내 (비로그인 사용자) */}
          {!isAuthenticated && (
            <div className="rounded-xl glass border-2 border-border p-3 sm:p-4 max-w-md mx-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                💡 로그인하지 않아도 플레이할 수 있습니다.
                <br />
                <span className="text-[10px] sm:text-xs">
                  (단, 응답 기록은 저장되지 않으며 모임 기능을 사용할 수 없습니다)
                </span>
              </p>
            </div>
          )}
        </div>

        {/* 서비스 철학 설명 */}
        <div className="mt-12 sm:mt-16 md:mt-20 rounded-2xl glass border-2 border-primary/30 bg-primary/5 p-5 sm:p-6 md:p-8 text-left shadow-apple animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-foreground">
            밸런스 모임 = 밸런스 질문 + 모임
          </h2>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
            <li className="flex items-start gap-2 sm:gap-3">
              <span className="mt-0.5 sm:mt-1 text-primary text-lg sm:text-xl">•</span>
              <span>
                둘 중 하나를 선택하는 <strong className="text-foreground">밸런스 질문</strong>으로 취향을 공유하고
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <span className="mt-0.5 sm:mt-1 text-primary text-lg sm:text-xl">•</span>
              <span>
                나와 같은 <strong className="text-foreground">모임</strong>에 속한 사람들과 선택을 비교하며 친목을 도모합니다
              </span>
            </li>
          </ul>
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/40">
            <p className="text-xs sm:text-sm italic text-muted-foreground leading-relaxed">
              같은 모임에 속한 사람들이 수십, 수백 개의 질문에 답하며 서로의 취향을 알아가는 것은
              마치 사람들 간의 균형을 맞춰나가는 과정과 같습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
