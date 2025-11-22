import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 빌드 최적화 설정
  typescript: {
    // 빌드 시 타입 체크 제외 (빌드 시간 단축)
    // 타입 에러는 로컬에서 확인 후 푸시
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint 체크 제외 (빌드 시간 단축)
    // 린트 에러는 로컬에서 확인 후 푸시
    ignoreDuringBuilds: true,
  },
  // 빌드 최적화
  swcMinify: true,
  // 실험적 기능 (빌드 성능 향상)
  experimental: {
    // Turbopack 사용 (Next.js 16에서 기본)
    // optimizePackageImports: ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
  // 컴파일러 옵션
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval/unsafe-inline
              "style-src 'self' 'unsafe-inline'", // Tailwind CSS requires unsafe-inline
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com",
              "frame-src 'self' https://accounts.google.com",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
