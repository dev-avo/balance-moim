# 밸런스 모임 (Balance Moim)

모임 기반 밸런스 게임 플랫폼 - 두 선택지 중 하나를 고르며 서로의 취향을 발견하세요!

## 🎯 소개

**밸런스 모임** = **밸런스** + **모임**

- 🎲 **밸런스**: 둘 중 하나를 선택하는 밸런스 게임
- 👥 **모임**: 함께하는 사람들과 선택을 비교하는 커뮤니티
- ❓ **밸런스 뭐임?**: "What's your balance?" - 당신의 선택은 무엇인가요?

회사, 동아리, 교회 등 다양한 모임에 속한 사람들이 재미있는 양자택일 질문을 통해 서로의 취향을 발견하고, 누가 나와 가장 비슷한 취향을 가졌는지 파악하여 친목을 도모할 수 있는 웹 서비스입니다.

## ✨ 주요 기능

| 기능 | 설명 | 로그인 필요 |
|------|------|:----------:|
| 🎲 밸런스 게임 | 둘 중 하나를 선택하는 질문에 응답 | ❌ |
| 📊 전체 통계 | 모든 사용자의 응답 비율 확인 | ❌ |
| 🎨 테마 설정 | 라이트/다크/시스템 테마 선택 | ❌ |
| 💾 응답 저장 | 내 응답 기록 저장 | ✅ |
| ✏️ 질문 만들기 | 새로운 밸런스 질문 등록 | ✅ |
| 👥 모임 생성 | 친구들과 함께하는 비공개 모임 | ✅ |
| 🔗 초대 링크 | 모임 초대 링크 생성 및 공유 | ✅ |
| 📈 모임 통계 | 모임 멤버들의 응답 비율 비교 | ✅ |
| 💕 취향 매칭 | 나와 취향이 가장 비슷한 사람 찾기 | ✅ |
| 🔍 상세 비교 | 특정 멤버와 질문별 선택 비교 | ✅ |

## 🛠 기술 스택

### 프론트엔드
- **HTML5 + CSS3 + JavaScript (ES6+ Modules)**
- Apple MacBook 스타일 UI/UX
- 반응형 디자인 (모바일/태블릿/PC)
- CSS 변수 기반 테마 시스템

### 백엔드
- **Cloudflare Pages Functions** (TypeScript)
- **Cloudflare D1** (SQLite 호환 데이터베이스)
- **Jose** (JWT 토큰 처리)

### 인증
- **Google OAuth 2.0** (팝업 방식)
- JWT 기반 세션 관리 (httpOnly 쿠키)

### 배포
- **Cloudflare Pages** + GitHub 연동
- 자동 배포 (Git push)

## 📁 프로젝트 구조

```
/
├── index.html                 # 랜딩 페이지
├── home.html                  # 게임 플레이
├── settings.html              # 사용자 설정 (테마, 표시이름)
├── groups.html                # 모임 목록
├── groups/
│   ├── create.html            # 모임 생성
│   └── detail.html            # 모임 상세 (통계, 멤버)
├── questions/
│   ├── create.html            # 질문 생성
│   └── my.html                # 내 질문 관리
├── invite.html                # 초대 링크 처리
├── 404.html                   # 404 페이지
│
├── css/
│   └── style.css              # 전체 스타일시트
│
├── js/
│   ├── components/            # UI 컴포넌트 (Header, Toast, Modal, Loading)
│   ├── services/
│   │   └── api.js             # API 호출 모듈
│   └── utils/
│       ├── auth.js            # 인증 유틸리티
│       └── theme.js           # 테마 관리
│
├── functions/api/             # Cloudflare Pages Functions
│   ├── auth/                  # 인증 API
│   ├── questions/             # 질문 API
│   ├── responses.ts           # 응답 API
│   ├── groups/                # 모임 API
│   └── tags/                  # 태그 API
│
├── lib/                       # 서버 공통 라이브러리
│   └── auth/
│       ├── jwt.ts             # JWT 유틸리티
│       └── session.ts         # 세션 관리
│
├── drizzle/
│   └── schema.sql             # DB 스키마
│
├── _headers                   # Cloudflare 헤더 설정
├── _routes.json               # API 라우팅 설정
└── wrangler.toml              # Cloudflare 설정
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- Cloudflare 계정
- Google Cloud 프로젝트 (OAuth 설정)

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/balance-moim.git
cd balance-moim
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

```bash
# 템플릿 복사
cp .dev.vars.example .dev.vars

# .dev.vars 파일 편집
```

필요한 환경 변수:

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 시크릿 | `GOCSPX-xxx` |
| `JWT_SECRET` | JWT 서명용 시크릿 (32자 이상) | `openssl rand -base64 32` |

### 4. 데이터베이스 설정

```bash
# D1 데이터베이스 생성 (최초 1회)
wrangler d1 create balance-moim-db

# 로컬 D1에 스키마 적용
wrangler d1 execute DB --local --file=./drizzle/schema.sql
```

### 5. 로컬 개발 서버 실행

```bash
npm run dev
```

http://localhost:8788 에서 확인

## ☁️ Cloudflare Pages 배포

### 1. Cloudflare 계정 설정

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인
2. **Workers & Pages** → **Pages** 선택

### 2. GitHub 연결

1. **Create a project** 클릭
2. **Connect to Git** 선택
3. GitHub 계정 연결 및 저장소 선택
4. 빌드 설정:
   - **Build command**: (비워두기)
   - **Build output directory**: `/`

### 3. 환경 변수 설정

**Settings** → **Environment variables** 에서 추가:

| 변수명 | 설명 |
|--------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 |
| `JWT_SECRET` | JWT 서명용 시크릿 (32자 이상) |

### 4. D1 데이터베이스 바인딩

1. **Settings** → **Functions** → **D1 database bindings**
2. **Add binding** 클릭
3. Variable name: `DB`
4. D1 database 선택 (없으면 먼저 생성)

### 5. 프로덕션 DB 설정

```bash
# D1 데이터베이스 생성
wrangler d1 create balance-moim-db

# wrangler.toml에 database_id 업데이트 후
# 스키마 적용
wrangler d1 execute DB --file=./drizzle/schema.sql
```

### 6. Google OAuth 리디렉션 URI 설정

[Google Cloud Console](https://console.cloud.google.com) → **API 및 서비스** → **사용자 인증 정보**:

- **승인된 JavaScript 원본**: `https://your-project.pages.dev`
- **승인된 리디렉션 URI**: `https://your-project.pages.dev/api/auth/callback`

### 7. 배포

```bash
# Git push → 자동 배포
git push origin main
```

## 📡 API 엔드포인트

### 인증
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/auth/callback` | OAuth 콜백 |
| GET | `/api/auth/session` | 세션 확인 |
| POST | `/api/auth/signout` | 로그아웃 |

### 사용자
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/users/me` | 내 정보 |
| PATCH | `/api/users/me` | 정보 수정 |
| DELETE | `/api/users/me` | 회원 탈퇴 |

### 질문
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/questions/random` | 랜덤 질문 |
| GET | `/api/questions/my` | 내 질문 목록 |
| POST | `/api/questions` | 질문 생성 |
| GET | `/api/questions/[id]` | 질문 상세 |
| PATCH | `/api/questions/[id]` | 질문 수정 |
| DELETE | `/api/questions/[id]` | 질문 삭제 |
| GET | `/api/questions/stats?id=` | 질문 통계 |

### 응답
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/responses` | 응답 제출 |

### 모임
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/groups/my` | 내 모임 목록 |
| POST | `/api/groups` | 모임 생성 |
| GET | `/api/groups/[id]` | 모임 상세 |
| PATCH | `/api/groups/[id]` | 모임 수정 |
| DELETE | `/api/groups/[id]` | 모임 삭제 |
| POST | `/api/groups/invite?id=` | 초대 링크 생성 |
| GET/POST | `/api/groups/join?code=` | 모임 참여 |
| POST | `/api/groups/leave?id=` | 모임 탈퇴 |
| GET | `/api/groups/similarity?id=` | 유사도 랭킹 |
| GET | `/api/groups/compare?groupId=&userId=` | 사용자 비교 |

### 태그
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/tags` | 태그 목록 |
| POST | `/api/tags` | 태그 생성 |
| GET | `/api/tags/search?q=` | 태그 검색 |

## 📚 문서

- [PRD (제품 요구사항)](./docs/01_balance_game_prd.md)
- [개발 작업 목록](./docs/02_balance_game_tasks.md)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - [LICENSE](./LICENSE) 파일 참조

## 📞 문의

- 이슈 등록: [GitHub Issues](https://github.com/your-username/balance-moim/issues)
