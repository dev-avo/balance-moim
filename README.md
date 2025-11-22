# 밸런스 모임 (Balance Moim)

**What's Your Balance?**

선택하기 어려운 두 가지 질문 중 하나를 고르는 밸런스 게임으로 모임 사람들과 취향을 공유하는 웹 서비스입니다.

## 📋 목차

- [기능 소개](#-기능-소개)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [배포](#-배포)
- [개발 가이드](#-개발-가이드)

## ✨ 기능 소개

### 🎮 밸런스 게임
- 100개의 다양한 밸런스 질문 제공
- 20개 카테고리별 태그 필터링
- 실시간 통계 확인 (전체 / 모임별)
- 비로그인 플레이 가능

### 👥 모임 기능
- Google OAuth 로그인
- 모임 생성 및 초대 링크 공유
- 모임 멤버 관리 (추방, 탈퇴)
- 모임별 응답 통계 비교

### 🔍 취향 분석
- 모임 내 취향 유사도 랭킹
- 사용자 간 1:1 비교
- 태그별 선택 비교

### ⚙️ 사용자 설정
- 표시 이름 설정 (Google 계정명 / 익명 별명)
- 내 질문 관리
- 회원 탈퇴

### 🎨 UI/UX
- Apple MacBook 스타일 디자인
- Glassmorphism 효과
- 다크모드 지원
- 반응형 디자인 (모바일/태블릿/PC)
- Framer Motion 애니메이션

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 16.0.1 (App Router, React 19.2.0)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Theme**: next-themes (다크모드)
- **Form**: React Hook Form + Zod

### Backend
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Auth**: NextAuth.js v5 (Google OAuth)

### Security
- **XSS Protection**: isomorphic-dompurify + CSP
- **CSRF Protection**: NextAuth 내장
- **Input Validation**: Zod schemas

### DevOps
- **Deployment**: Cloudflare Pages
- **Version Control**: Git

## 🚀 시작하기

### 필수 요구사항

- Node.js 22.13.1+ (nvm 사용 권장)
- npm 10+
- Cloudflare 계정 (D1 데이터베이스)
- Google Cloud Console 프로젝트 (OAuth)

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 입력하세요:

\`\`\`env
# Google OAuth (https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth (무작위 문자열 생성: openssl rand -base64 32)
NEXTAUTH_SECRET=your_nextauth_secret

# Application URL
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 설치 및 실행

\`\`\`bash
# 1. 의존성 설치
npm install

# 2. Cloudflare D1 데이터베이스 생성
npx wrangler d1 create balance-moim-db

# 3. wrangler.toml 파일의 database_id 업데이트
# (위 명령어 실행 시 출력된 database_id 복사)

# 4. 데이터베이스 마이그레이션
npm run db:migrate

# 5. 초기 데이터 시딩 (100개 질문 + 20개 태그)
npm run db:seed

# 6. 개발 서버 실행
npm run dev
\`\`\`

브라우저에서 http://localhost:3000을 열어 확인하세요.

## 📁 프로젝트 구조

\`\`\`
vibe/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # NextAuth 엔드포인트
│   │   ├── groups/          # 모임 관련 API
│   │   ├── questions/       # 질문 관련 API
│   │   ├── responses/       # 응답 관련 API
│   │   ├── tags/            # 태그 관련 API
│   │   └── users/           # 사용자 관련 API
│   ├── groups/              # 모임 페이지
│   ├── invite/              # 초대 페이지
│   ├── play/                # 게임 플레이 페이지
│   ├── questions/           # 질문 관리 페이지
│   ├── settings/            # 설정 페이지
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 홈 페이지
│
├── components/              # React 컴포넌트
│   ├── game/               # 게임 관련 컴포넌트
│   ├── groups/             # 모임 관련 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   └── ui/                 # UI 컴포넌트 (Button, Input 등)
│
├── lib/                     # 유틸리티 및 설정
│   ├── animations/         # Framer Motion variants
│   ├── auth/               # 인증 관련 (session, permissions)
│   ├── db/                 # 데이터베이스 설정 및 스키마
│   ├── security/           # 보안 (sanitize, validation)
│   └── utils.ts            # 공통 유틸리티
│
├── scripts/                 # 스크립트
│   ├── seed.ts             # 데이터 시딩 스크립트
│   └── seed-data.json      # 시딩 데이터 (100개 질문)
│
├── public/                  # 정적 파일
├── .rules/                  # 프로젝트 문서
│   ├── 02_balance_game_prd.md        # PRD
│   └── 03_balance_game_tasks.md      # 작업 목록
│
├── auth.ts                  # NextAuth 설정
├── drizzle.config.ts       # Drizzle 설정
├── middleware.ts           # Next.js 미들웨어
├── next.config.ts          # Next.js 설정
├── tailwind.config.ts      # Tailwind 설정
└── wrangler.toml           # Cloudflare 설정
\`\`\`

## 🌐 배포

### Cloudflare Pages 배포

#### 1. GitHub 저장소 연결

\`\`\`bash
# GitHub에 코드 푸시
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

#### 2. Cloudflare Pages 프로젝트 생성

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
2. **Workers & Pages** → **Create application** → **Pages**
3. GitHub 저장소 연결
4. 빌드 설정:
   - **Build command**: \`npm run build\`
   - **Build output directory**: \`.next\`
   - **Framework preset**: Next.js

#### 3. 환경 변수 설정

Cloudflare Pages 대시보드에서 **Settings** → **Environment variables** → 다음 변수 추가:

\`\`\`
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.pages.dev
\`\`\`

#### 4. 프로덕션 데이터베이스 마이그레이션

\`\`\`bash
# 프로덕션 DB 마이그레이션
npm run db:migrate:prod

# 프로덕션 DB 시딩 (wrangler CLI 필요)
# 로컬에서 시딩 후 프로덕션 DB를 복사하거나
# 프로덕션에서 직접 시딩 스크립트 실행
\`\`\`

#### 5. 배포 확인

- Git에 푸시하면 자동으로 배포됩니다
- Cloudflare Pages 대시보드에서 배포 상태 확인
- 배포된 URL로 접속하여 전체 기능 테스트

### 커스텀 도메인 연결 (선택사항)

1. Cloudflare Pages 대시보드 → **Custom domains**
2. 도메인 추가 및 DNS 설정
3. SSL/TLS 자동 적용

## 💻 개발 가이드

### 주요 명령어

\`\`\`bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# 데이터베이스 스키마 변경 생성
npm run db:generate

# 로컬 DB 마이그레이션
npm run db:migrate

# 프로덕션 DB 마이그레이션
npm run db:migrate:prod

# DB Studio (GUI)
npm run db:studio

# 데이터 시딩
npm run db:seed

# Cloudflare Workers 개발 서버
npm run cf:dev
\`\`\`

### 데이터베이스 스키마 수정

1. \`lib/db/schema.ts\` 파일 수정
2. \`npm run db:generate\` 실행 (마이그레이션 파일 생성)
3. \`npm run db:migrate\` 실행 (로컬 DB 적용)
4. \`npm run db:migrate:prod\` 실행 (프로덕션 DB 적용)

### 코드 컨벤션

- **TypeScript**: 엄격한 타입 체크
- **Naming**: camelCase (변수/함수), PascalCase (컴포넌트/타입)
- **Comments**: JSDoc 스타일 주석
- **Imports**: 절대 경로 사용 (\`@/...\`)

### 보안 가이드

- **XSS 방지**: 모든 사용자 입력은 \`sanitizeObject()\` 사용
- **Input Validation**: Zod 스키마로 서버/클라이언트 양쪽 검증
- **CSRF 방지**: NextAuth 자동 처리
- **환경 변수**: \`.env.local\`은 절대 커밋하지 않음 (\`.gitignore\`에 포함됨)

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 🙏 감사의 말

- [Next.js](https://nextjs.org/)
- [Cloudflare](https://www.cloudflare.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)

---

**Developed with ❤️ by Balance Moim Team**
