# 밸런스 모임 (Balance Moim) - 개발 작업 목록

> 이 문서는 `01_balance_game_prd.md`를 기반으로 생성된 상세한 개발 작업 목록입니다.
> 
> **기술 스택**
> - 프론트엔드: HTML + CSS + JavaScript (ES6+)
> - 백엔드: Cloudflare Pages Functions (TypeScript)
> - 데이터베이스: Cloudflare D1
> - 배포: Cloudflare Pages + GitHub 연동
> 
> **API 설계 원칙**: 동적 경로(`:id`) 대신 쿼리 파라미터(`?id=xxx`) 사용
> 
> 총 17개 Epic, 약 120개 Task로 구성되어 있습니다.

---

## 1. 프로젝트 초기 설정 및 인프라 구축
- [x] 1.1 프로젝트 폴더 구조 설계
  ```
  /
  ├── index.html, home.html, play.html, settings.html ...  (HTML 페이지)
  ├── css/
  │   └── style.css                    (스타일시트)
  ├── js/
  │   ├── main.js                      (진입점)
  │   ├── components/                  (UI 컴포넌트)
  │   ├── pages/                       (페이지별 로직)
  │   ├── services/                    (API, 라우터)
  │   └── utils/                       (유틸리티)
  ├── functions/
  │   └── api/                         (Cloudflare Functions - TypeScript)
  │       ├── auth/
  │       ├── questions/
  │       ├── groups/
  │       ├── users/
  │       └── tags/
  ├── lib/                             (서버 공통 라이브러리 - TypeScript)
  │   ├── db/
  │   └── auth/
  └── drizzle/                         (DB 마이그레이션 SQL)
  ```
  
- [x] 1.2 package.json 생성 및 기본 설정
  - `npm init -y`
  - wrangler 설치: `npm install wrangler --save-dev`
  - TypeScript 설치: `npm install typescript @cloudflare/workers-types --save-dev`
  - 스크립트 추가: `dev`, `deploy`, `db:migrate`
  
- [x] 1.3 TypeScript 설정 (백엔드용)
  - `tsconfig.json` 생성
  - Cloudflare Workers 타입 설정
  - `lib/` 폴더 타입 정의
  
- [x] 1.4 Cloudflare D1 데이터베이스 설정
  - `wrangler.toml` 설정 파일 작성
  - D1 데이터베이스 생성: `wrangler d1 create balance-moim-db`
  - 로컬 개발 환경 바인딩 설정
  
- [x] 1.5 데이터베이스 스키마 SQL 작성
  - `/drizzle/schema.sql` 생성
  - 테이블 생성: `user`, `question`, `tag`, `question_tag`, `response`, `user_group`, `group_member`, `invite_link`
  - 인덱스 생성
  - Cloudflare D1 콘솔에서 직접 실행

---

## 2. 인증 시스템 구축 (Google OAuth 2.0)
- [x] 2.1 Google OAuth 설정 확인
  - Google Cloud Console에서 OAuth 2.0 클라이언트 확인
  - 승인된 JavaScript 원본: `http://localhost:8788`, 프로덕션 도메인
  - 승인된 리디렉션 URI: `/api/auth/callback`
  - `.dev.vars`에 환경변수 추가
  
- [x] 2.2 JWT 유틸리티 구현 (TypeScript)
  - `/lib/auth/jwt.ts` 생성
  - `signJWT(payload)` - JWT 생성
  - `verifyJWT(token)` - JWT 검증
  - jose 라이브러리 사용 (Cloudflare Workers 호환)
  
- [x] 2.3 세션 유틸리티 구현 (TypeScript)
  - `/lib/auth/session.ts` 생성
  - `getSession(request)` - 쿠키에서 JWT 추출 및 검증
  - `setSessionCookie(response, token)` - 쿠키 설정
  - `clearSessionCookie(response)` - 쿠키 삭제
  
- [x] 2.4 OAuth 콜백 API 구현
  - `/functions/api/auth/callback.ts` 생성
  - `?code=xxx` 파라미터로 인증 코드 수신
  - Google 토큰 교환 및 사용자 정보 조회
  - DB에 사용자 저장 (신규/기존 확인)
  - JWT 발급 및 httpOnly 쿠키 설정
  - 프론트엔드로 리다이렉트
  
- [x] 2.5 세션 확인 API 구현
  - `/functions/api/auth/session.ts` 생성
  - GET: 현재 로그인 사용자 정보 반환
  - 비로그인 시 `{ user: null }` 반환
  
- [x] 2.6 로그아웃 API 구현
  - `/functions/api/auth/signout.ts` 생성
  - POST: httpOnly 쿠키 삭제
  
- [x] 2.7 프론트엔드 인증 유틸리티
  - `/js/utils/auth.js` 생성
  - `redirectToGoogleLogin()` - OAuth 로그인 리다이렉트
  - `checkSession()` - 세션 확인 API 호출
  - `logout()` - 로그아웃 API 호출
  - 로그인 상태 관리

---

## 3. CSS 디자인 시스템 및 공통 컴포넌트
- [x] 3.1 CSS 변수 및 기본 스타일
  - `/css/style.css` 생성
  - CSS Variables: 색상, 폰트, 간격, 그림자, 반경
  - 다크모드/라이트모드 변수 (prefers-color-scheme)
  - Reset CSS
  - 기본 타이포그래피
  
- [x] 3.2 공통 UI 스타일
  - 버튼: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
  - 입력: `.form-input`, `.form-textarea`, `.form-select`
  - 카드: `.card`, `.card-hover`
  - 배지: `.badge`, `.badge-primary`, `.badge-success`
  - 모달: `.modal`, `.modal-overlay`
  - 토스트: `.toast`, `.toast-success`, `.toast-error`
  
- [x] 3.3 JS 공통 컴포넌트
  - `/js/components/Header.js` - 네비게이션 헤더
  - `/js/components/Modal.js` - 모달 열기/닫기
  - `/js/components/Toast.js` - 알림 표시
  - `/js/components/Loading.js` - 로딩 스피너
  
- [x] 3.4 반응형 네비게이션
  - 모바일: 햄버거 메뉴
  - PC: 고정 헤더
  - 메뉴: 홈, 내 모임, 질문 만들기, 설정

---

## 4. API 서비스 및 페이지 구조
- [x] 4.1 API 서비스 모듈
  - `/js/services/api.js` 생성
  - `fetchAPI(endpoint, options)` - 기본 fetch 래퍼
  - 인증 헤더 자동 포함
  - 에러 핸들링
  
- [x] 4.2 HTML 페이지 생성
  - `index.html` - 랜딩/인트로
  - `home.html` - 게임 플레이
  - `settings.html` - 사용자 설정
  - `groups.html` - 모임 목록
  - `groups/create.html` - 모임 생성
  - `groups/detail.html` - 모임 상세 (`?id=xxx`)
  - `questions/create.html` - 질문 생성
  - `questions/my.html` - 내 질문
  - `invite.html` - 초대 처리 (`?code=xxx`)
  
- [x] 4.3 페이지 초기화 패턴
  - 각 HTML에서 해당 JS 모듈 import
  - 인라인 스크립트에서 초기화 함수 호출
  - URL 쿼리 파라미터 파싱

---

## 5. 밸런스 게임 플레이 기능 (핵심)
- [x] 5.1 랜딩 페이지 구현
  - `index.html` 레이아웃
  - 인라인 스크립트 로직
  - "밸런스 모임?" 소개 문구
  - [시작하기] 버튼 → `home.html`로 이동
  
- [x] 5.2 게임 플레이 페이지 구현
  - `home.html` 레이아웃
  - 인라인 스크립트 로직
  - 주의사항 모달 (첫 방문 시, localStorage 체크)
  - 질문 카드 UI
  - 선택지 버튼 (A, B)
  
- [x] 5.3 랜덤 질문 API (TypeScript)
  - `/functions/api/questions/random.ts` 생성
  - GET: 랜덤 질문 1개 반환
  - `?tags=음식,라면` 태그 필터
  - 로그인 사용자: 응답한 질문 제외
  - `deleted_at IS NULL` 조건
  
- [x] 5.4 응답 제출 API (TypeScript)
  - `/functions/api/responses.ts` 생성
  - POST: 응답 저장
  - Body: `{ questionId, selectedOption }`
  - 중복 응답 방지 (UNIQUE 제약)
  - 비로그인: user_id = NULL
  
- [x] 5.5 통계 조회 API (TypeScript)
  - `/functions/api/questions/stats.ts` 생성
  - GET: `?id=xxx`
  - 전체 통계: A/B 선택 수, 비율
  - 모임별 통계: 사용자가 속한 모임들
  
- [x] 5.6 결과 화면 UI
  - 선택 후 결과 표시
  - 가로 막대 그래프 (CSS)
  - 비율 퍼센트 표시
  - 모임별 통계 (로그인 사용자만)
  - "다음 질문" 버튼
  
- [x] 5.7 애니메이션 효과
  - 선택지 버튼 클릭 효과
  - 결과 슬라이드 업
  - 막대 그래프 애니메이션

---

## 6. 질문 관리 기능
- [x] 6.1 태그 API (TypeScript)
  - `/functions/api/tags.ts` 생성
  - GET: 전체 태그 목록
  - POST: 태그 생성 (중복 확인)
  
- [x] 6.2 태그 검색 API (TypeScript)
  - `/functions/api/tags/search.ts` 생성
  - GET: `?q=keyword`
  - LIKE 검색 자동완성
  
- [x] 6.3 질문 등록 페이지
  - `questions/create.html` 레이아웃
  - 인라인 스크립트 로직
  - 폼: 제목 (100자), 선택지 A/B (50자), 태그 (자동완성), 공개 설정
  - 클라이언트 유효성 검사
  
- [x] 6.4 질문 등록 API (TypeScript)
  - `/functions/api/questions.ts` 생성
  - POST: 질문 생성
  - `question` 테이블 삽입
  - `question_tag` 연결
  - 서버 유효성 검사
  
- [x] 6.5 내 질문 목록 페이지
  - `questions/my.html` 레이아웃
  - 인라인 스크립트 로직
  - 질문 카드 목록
  - 공개 설정 배지
  - 통계, 편집/삭제 버튼
  
- [x] 6.6 내 질문 조회 API (TypeScript)
  - `/functions/api/questions/my.ts` 생성
  - GET: `creator_id = 현재 사용자`
  - 페이지네이션: `?page=1&limit=10`
  
- [x] 6.7 질문 수정/삭제 API
  - `/functions/api/questions/[questionId].ts` 생성
  - `questions/edit.html` 레이아웃
  - `/js/pages/questions/edit.js` 로직
  - `?id=xxx`로 질문 로드
  - 수정 폼
  
- [ ] 6.8 질문 상세/수정/삭제 API (TypeScript)
  - `/functions/api/questions/detail.ts` 생성
  - GET: `?id=xxx` 질문 상세
  - PATCH: `?id=xxx` 질문 수정
  - DELETE: `?id=xxx` Soft Delete (`deleted_at` 설정)
  - 작성자 권한 확인

---

## 7. 모임 기능
- [x] 7.1 모임 생성 페이지
  - `groups/create.html` 레이아웃
  - 인라인 스크립트 로직
  
- [x] 7.2 모임 생성 API (TypeScript)
  - `/functions/api/groups.ts` 생성
  - POST: 모임 생성
  
- [x] 7.3 내 모임 목록 페이지
  - `groups.html` 레이아웃
  - 인라인 스크립트 로직
  
- [x] 7.4 내 모임 조회 API (TypeScript)
  - `/functions/api/groups/my.ts` 생성
  - GET: 사용자가 속한 모임 목록
  
- [x] 7.5 모임 상세 페이지
  - `groups/detail.html` 레이아웃
  - 인라인 스크립트 로직
  
- [x] 7.6 모임 상세 API (TypeScript)
  - `/functions/api/groups/[groupId].ts` 생성
  - GET/PATCH/DELETE
  
- [x] 7.7 초대 링크 API (TypeScript)
  - `/functions/api/groups/invite.ts` 생성
  - POST: 초대 링크 생성 (7일 만료)
  
- [x] 7.8 모임 참여 API (TypeScript)
  - `/functions/api/groups/join.ts` 생성
  - GET: 초대 정보 조회
  - POST: 모임 참여
  
- [x] 7.9 초대 처리 페이지
  - `invite.html` 레이아웃
  - 인라인 스크립트 로직
  
- [x] 7.10 취향 유사도 API (TypeScript)
  - `/functions/api/groups/similarity.ts` 생성
  
- [x] 7.11 모임 응답 목록 API (TypeScript)
  - `/functions/api/groups/responses.ts` 생성
  
- [x] 7.12 모임 나가기 API (TypeScript)
  - `/functions/api/groups/leave.ts` 생성

---

## 8. 모임 분석 기능 (취향 유사도)
- [x] 8.1 모임 응답 API (TypeScript)
  - `/functions/api/groups/responses.ts` 생성
  - GET: `?id=xxx&tag=음식`
  
- [x] 8.2 취향 유사도 API (TypeScript)
  - `/functions/api/groups/similarity.ts` 생성
  - GET: `?id=xxx`
  
- [x] 8.3 사용자 비교 API (TypeScript)
  - `/functions/api/groups/compare.ts` 생성
  - GET: `?groupId=xxx&userId=xxx`
  
- [x] 8.4 모임 응답 UI
  - 모임 상세 페이지에 응답 섹션
  
- [x] 8.5 취향 유사도 UI
  - "나와 가장 비슷한 사람" 섹션
  - TOP 5 사용자 목록
  
- [x] 8.6 상세 비교 모달
  - 사용자 클릭 시 상세 비교
  - 질문별 나 vs 상대 선택
  - 일치/불일치 색상 구분

---

## 9. 사용자 설정
- [x] 9.1 설정 페이지 UI
  - `settings.html` 레이아웃
  - 인라인 스크립트 로직
  - 로그인 정보 (이메일)
  - 표시 이름: 구글 계정명 / 익명 별명
  - 별명 입력 (2~12자)
  - [저장하기] 버튼
  - 회원 탈퇴 버튼
  
- [x] 9.2 사용자 정보 API (TypeScript)
  - `/functions/api/users/me.ts` 생성
  - GET: 내 정보 조회
  - PATCH: 표시 이름 수정
  - DELETE: 회원 탈퇴
  
- [x] 9.3 회원 탈퇴 모달
  - 생성한 모임 경고
  - "탈퇴하기" 입력 확인
  - 최종 확인 후 API 호출

---

## 10. 태그 필터링
- [x] 10.1 태그 필터 UI
  - 플레이 페이지에 태그 칩
  - 클릭하여 필터 선택/해제
  - 선택한 태그로 질문 필터
  
- [x] 10.2 태그 자동완성
  - 질문 등록 시 태그 입력
  - 검색 API 호출
  - 드롭다운 목록 표시

---

## 11. 성능 최적화
- [x] 11.1 캐싱 설정
  - `_headers` 파일 생성
  - CSS/JS: `Cache-Control: max-age=31536000`
  - HTML: `Cache-Control: no-cache`
  
- [x] 11.2 API 캐싱
  - 태그 목록: 1시간
  - 통계: 5분
  - Cloudflare Cache API 활용
  
- [x] 11.3 페이지네이션
  - 질문 목록 페이지 페이지네이션 UI
  - 모임 목록 페이지 페이지네이션 UI
  - `?page=1&limit=10` 파라미터

---

## 12. 보안 강화
- [x] 12.1 JWT 보안
  - httpOnly, Secure, SameSite 쿠키 (lib/auth/session.ts)
  - 토큰 만료 시간 설정 (7일)
  
- [x] 12.2 XSS 방지
  - `escapeHtml()` 함수 사용
  - CSP 헤더 (`_headers` 파일)
  
- [x] 12.3 입력 검증
  - 서버 측 모든 입력 검증
  - SQL Injection 방지 (Prepared Statements)
  - 길이 제한 확인
  
- [x] 12.4 권한 체크
  - 모든 수정/삭제 API에서 권한 확인

---

## 13. 반응형 디자인
- [x] 13.1 모바일 (< 768px)
  - 세로 레이아웃
  - 선택지 세로 배치
  - 햄버거 메뉴
  - 충분한 터치 영역
  
- [x] 13.2 태블릿 (768px ~ 1024px)
  - 선택지 가로 배치
  - 적절한 여백
  
- [x] 13.3 PC (≥ 1024px)
  - max-width 제한
  - 호버 효과

---

## 14. CSS 애니메이션
- [x] 14.1 버튼 효과
  - hover: scale, 색상 변화
  - active: scale 축소
  - transition 설정
  
- [x] 14.2 결과 애니메이션
  - 막대 그래프: width transition
  - 결과 카드: slideUp
  
- [x] 14.3 페이지 전환
  - fadeIn 효과
  - 로딩 스피너 (keyframes)
  
- [x] 14.4 404 페이지
  - `404.html` 생성

---

## 15. 초기 데이터 시딩
- [ ] 15.1 시드 데이터 준비
  - `/scripts/seed-data.json` 생성
  - 100개 질문 (다양한 카테고리)
  - 20개 태그
  
- [ ] 15.2 시딩 SQL 생성
  - `/scripts/seed.sql` 생성
  - INSERT 문 작성
  
- [ ] 15.3 시딩 실행
  - 로컬: `wrangler d1 execute DB --local --file=./scripts/seed.sql`
  - 프로덕션: `wrangler d1 execute DB --file=./scripts/seed.sql`

---

## 16. Cloudflare Pages 배포
- [x] 16.1 라우팅 설정
  - `_routes.json` 생성
  ```json
  {
    "version": 1,
    "include": ["/api/*"],
    "exclude": ["/js/*", "/css/*", "/*.html"]
  }
  ```
  
- [x] 16.2 환경 변수 설정
  - Cloudflare Dashboard에서 설정
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `JWT_SECRET`
  - D1 바인딩: `DB`
  
- [x] 16.3 GitHub 연동
  - Cloudflare Pages 프로젝트 생성
  - GitHub 저장소 연결
  - 빌드 설정: Output directory = `/`
  
- [x] 16.4 배포 테스트
  - README.md에 배포 가이드 추가

---

## 17. 테스트 및 문서화
- [ ] 17.1 기능 테스트
  - 비로그인 플레이
  - 로그인 플레이
  - 질문 등록/수정/삭제
  - 모임 생성/참여/관리
  
- [ ] 17.2 엣지 케이스
  - 중복 응답 방지
  - 만료된 초대 링크
  - 탈퇴한 사용자 표시
  
- [ ] 17.3 크로스 브라우저
  - Chrome, Safari, Firefox, Edge
  - 모바일 브라우저
  
- [x] 17.4 README.md 작성
  - 프로젝트 소개
  - 주요 기능 목록
  - 기술 스택
  - 프로젝트 구조
  - 로컬 개발 환경
  - 배포 방법
  - API 엔드포인트

---

## 작업 순서 가이드

### 권장 순서
1. **1번 → 2번 → 3번 → 4번**: 기본 인프라 (1주)
2. **5번**: 핵심 게임 플레이 (1주)
3. **6번 → 7번**: 질문/모임 기능 (1.5주)
4. **8번 → 9번 → 10번**: 분석/설정 (0.5주)
5. **11번 → 12번 → 13번 → 14번**: 최적화 (0.5주)
6. **15번 → 16번 → 17번**: 배포/테스트 (0.5주)

**총 예상 기간: 4~5주**

---

## API 엔드포인트 요약

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/auth/callback` | GET | OAuth 콜백 |
| `/api/auth/session` | GET | 세션 확인 |
| `/api/auth/signout` | POST | 로그아웃 |
| `/api/users/me` | GET/PATCH/DELETE | 사용자 정보 |
| `/api/questions` | POST | 질문 생성 |
| `/api/questions/random` | GET | 랜덤 질문 |
| `/api/questions/my` | GET | 내 질문 목록 |
| `/api/questions/detail` | GET/PATCH/DELETE | 질문 상세 |
| `/api/questions/stats` | GET | 질문 통계 |
| `/api/responses` | POST | 응답 제출 |
| `/api/groups` | POST | 모임 생성 |
| `/api/groups/my` | GET | 내 모임 목록 |
| `/api/groups/detail` | GET/PATCH/DELETE | 모임 상세 |
| `/api/groups/invite` | POST | 초대 생성 |
| `/api/groups/join` | POST | 모임 참여 |
| `/api/groups/leave` | POST | 모임 나가기 |
| `/api/groups/members` | DELETE | 멤버 추방 |
| `/api/groups/responses` | GET | 모임 응답 |
| `/api/groups/similarity` | GET | 유사도 랭킹 |
| `/api/groups/compare` | GET | 사용자 비교 |
| `/api/tags` | GET/POST | 태그 목록/생성 |
| `/api/tags/search` | GET | 태그 검색 |

---

**작성일**: 2025-11-25  
**기준 문서**: `01_balance_game_prd.md`  
**총 Epic 수**: 17개  
**총 Task 수**: 약 120개
