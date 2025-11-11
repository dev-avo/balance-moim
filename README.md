# 밸런스 모임 (Balance Moim)

모임 기반 밸런스 게임 플랫폼

## 프로젝트 소개

"밸런스 모임?"은 회사, 동아리, 교회 등 다양한 모임에 속한 사람들이 재미있는 양자택일 질문을 통해 서로의 취향을 발견하고, 누가 나와 가장 비슷한 취향을 가졌는지 파악하여 친목을 도모할 수 있는 웹 서비스입니다.

## 기술 스택

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Auth**: NextAuth.js v5 (Google OAuth)
- **Deployment**: Cloudflare Pages

## 로컬 개발 환경 설정

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd vibe
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력합니다:

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_DATABASE_ID=your-database-id
```

### 3. Cloudflare D1 데이터베이스 생성

```bash
# Cloudflare에 로그인
npx wrangler login

# D1 데이터베이스 생성
npx wrangler d1 create balance-moim-db

# 생성된 database_id를 wrangler.toml에 입력
```

### 4. 데이터베이스 마이그레이션

```bash
# 로컬 개발용
npm run db:migrate

# 프로덕션용
npm run db:migrate:prod
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인합니다.

## 주요 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린팅
npm run lint

# 데이터베이스 마이그레이션 생성
npm run db:generate

# 로컬 마이그레이션 적용
npm run db:migrate

# 프로덕션 마이그레이션 적용
npm run db:migrate:prod

# Drizzle Studio 실행 (DB GUI)
npm run db:studio

# Cloudflare Workers 개발 서버
npm run cf:dev
```

## 프로젝트 구조

```
vibe/
├── app/                    # Next.js App Router 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── game/             # 게임 관련 컴포넌트
│   └── groups/           # 모임 관련 컴포넌트
├── lib/                   # 유틸리티 함수
│   ├── db/               # 데이터베이스 설정
│   └── auth/             # 인증 관련
├── types/                 # TypeScript 타입 정의
├── hooks/                 # 커스텀 React 훅
├── scripts/              # 유틸리티 스크립트
├── drizzle/              # 데이터베이스 마이그레이션
└── public/               # 정적 파일
```

## 개발 로드맵

현재 진행 상황은 `.rules/03_balance_game_tasks.md` 파일에서 확인할 수 있습니다.

- [x] Sprint 1: 프로젝트 초기 설정 및 인프라 구축
- [ ] Sprint 2: 질문 플레이 기능
- [ ] Sprint 3: 모임 기능
- [ ] Sprint 4: 질문 관리
- [ ] Sprint 5: 취향 유사도 분석
- [ ] Sprint 6: 배포 및 마무리

## 라이선스

이 프로젝트는 개인 학습 목적으로 제작되었습니다.

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.
