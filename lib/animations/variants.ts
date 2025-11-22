/**
 * Framer Motion 애니메이션 변형(Variants)
 * 
 * ## 기능
 * - 페이지 전환 애니메이션
 * - 페이드 효과
 * - 슬라이드 효과
 * - 스케일 효과
 * - 스태거 효과 (순차 애니메이션)
 * 
 * ## 사용법
 * ```tsx
 * import { fadeIn, slideUp } from '@/lib/animations/variants';
 * 
 * <motion.div variants={fadeIn} initial="hidden" animate="visible">
 *   내용
 * </motion.div>
 * ```
 */

import { Variants } from 'framer-motion';

/**
 * 페이드 인 애니메이션
 * 투명 → 불투명
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * 페이드 인 (느림)
 * 부드러운 전환에 적합
 */
export const fadeInSlow: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * 슬라이드 업 애니메이션
 * 아래 → 위
 */
export const slideUp: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

/**
 * 슬라이드 다운 애니메이션
 * 위 → 아래
 */
export const slideDown: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * 슬라이드 인 (좌 → 우)
 */
export const slideInFromLeft: Variants = {
  hidden: {
    x: -50,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * 슬라이드 인 (우 → 좌)
 */
export const slideInFromRight: Variants = {
  hidden: {
    x: 50,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * 스케일 업 애니메이션
 * 작게 → 크게
 */
export const scaleUp: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1], // easeOutBack
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * 스케일 다운 애니메이션
 * 크게 → 작게
 */
export const scaleDown: Variants = {
  hidden: {
    scale: 1.05,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

/**
 * 버튼 탭 애니메이션
 * 클릭 시 약간 줄어드는 효과
 */
export const buttonTap = {
  scale: 0.95,
  transition: {
    duration: 0.1,
    ease: 'easeInOut',
  },
};

/**
 * 버튼 호버 애니메이션
 * 호버 시 약간 커지는 효과
 */
export const buttonHover = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: 'easeOut',
  },
};

/**
 * 스태거 컨테이너
 * 자식 요소들이 순차적으로 나타나도록 함
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * 스태거 컨테이너 (빠름)
 */
export const staggerContainerFast: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

/**
 * 스태거 아이템
 * staggerContainer의 자식 요소에 사용
 */
export const staggerItem: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * 페이지 전환 애니메이션
 * 페이지 간 부드러운 전환
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

/**
 * 막대 그래프 애니메이션
 * 0% → 실제 너비로 확장
 */
export const progressBar: Variants = {
  hidden: {
    width: 0,
  },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2,
    },
  }),
};

/**
 * 숫자 카운트업 애니메이션을 위한 설정
 */
export const countUp = {
  duration: 1,
  ease: 'easeOut',
};

/**
 * 모달 배경 애니메이션
 */
export const modalBackdrop: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * 모달 콘텐츠 애니메이션
 */
export const modalContent: Variants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
    y: 20,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1], // easeOutBack
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * 카드 호버 애니메이션
 */
export const cardHover = {
  y: -5,
  transition: {
    duration: 0.2,
    ease: 'easeOut',
  },
};

/**
 * 플립 애니메이션
 * 카드 뒤집기 효과
 */
export const flip: Variants = {
  front: {
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  back: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

/**
 * 쉐이크 애니메이션
 * 에러 표시에 적합
 */
export const shake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: 0.5,
    ease: 'easeInOut',
  },
};

/**
 * 펄스 애니메이션
 * 주의 끌기에 적합
 */
export const pulse: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

