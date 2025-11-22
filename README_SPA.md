# 밸런스 모임 - 바닐라 JavaScript SPA

노빌드 바닐라 JavaScript로 구현된 Single Page Application입니다.

## 프로젝트 구조

```
vibe/
├── index.html           # 단 하나의 HTML 파일
├── css/
│   └── style.css        # 모든 스타일
├── js/
│   ├── components/      # UI 컴포넌트
│   │   ├── Header.js
│   │   ├── Button.js
│   │   ├── Modal.js
│   │   ├── Toast.js
│   │   └── Loading.js
│   ├── pages/           # 페이지별 콘텐츠
│   │   ├── home.js
│   │   ├── play.js
│   │   ├── groups.js
│   │   └── 404.js
│   ├── services/         # API, 데이터 처리
│   │   ├── api.js
│   │   └── router.js    # 페이지 전환 관리
│   ├── utils/           # 공통 함수
│   │   ├── helpers.js
│   │   ├── auth.js
│   │   └── theme.js
│   └── main.js          # 앱 시작점
└── functions/           # Cloudflare Pages Functions (기존 API 유지)
    └── api/
        └── ...
```

## 주요 특징

- **해시 라우팅**: URL 해시 (#home, #play 등)를 사용한 페이지 전환
- **ES6 모듈**: 모든 JavaScript 파일은 ES6 모듈로 작성
- **노빌드**: 빌드 과정 없이 바로 사용 가능
- **기존 디자인 유지**: Apple MacBook 스타일의 디자인과 기능 모두 유지
- **SPA**: 페이지 전환 시 새로고침 없음

## 사용 방법

### 로컬 개발

1. 정적 파일 서버 실행 (예: Python)

```bash
# Python 3
python3 -m http.server 8000

# 또는 Node.js (http-server)
npx http-server -p 8000
```

2. 브라우저에서 `http://localhost:8000` 접속

### Cloudflare Pages 배포

1. Cloudflare Pages 프로젝트 생성
2. 빌드 설정:
   - **Framework preset**: None
   - **Build command**: (비워두기)
   - **Build output directory**: `/` (루트)
3. 배포

## 라우팅

- `#home` - 홈 페이지
- `#play` - 밸런스 게임 플레이
- `#groups` - 내 모임 목록
- `#groups/[groupId]` - 모임 상세 (추가 구현 필요)
- `#questions/create` - 질문 만들기 (추가 구현 필요)
- `#404` - 404 페이지

## API 엔드포인트

기존 Next.js API 라우트는 Cloudflare Pages Functions로 유지됩니다.

- `/api/users/me` - 현재 사용자 정보
- `/api/questions/random` - 랜덤 질문 가져오기
- `/api/questions/[id]/stats` - 질문 통계
- `/api/responses` - 응답 제출
- `/api/groups/my` - 내 모임 목록
- 기타 API는 기존 구조 유지

## 브라우저 호환성

- ES6 모듈을 지원하는 최신 브라우저
- Chrome, Firefox, Safari, Edge (최신 버전)

## 주의사항

1. **API 엔드포인트**: 기존 Next.js API 라우트를 Cloudflare Pages Functions로 변환해야 할 수 있습니다.
2. **인증**: NextAuth 세션 쿠키가 제대로 작동하는지 확인이 필요합니다.
3. **추가 페이지**: groups/[groupId], questions/create 등은 필요에 따라 추가 구현이 필요합니다.

## 개발 팁

- 브라우저 개발자 도구의 Network 탭에서 API 호출 확인
- Console에서 JavaScript 오류 확인
- 해시 라우팅은 `window.location.hash`로 확인 가능
