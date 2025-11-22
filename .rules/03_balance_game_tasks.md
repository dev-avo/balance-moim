# 밸런스 모임 (Balance Moim) - 개발 작업 목록

> 이 문서는 `02_balance_game_prd.md`를 기반으로 생성된 상세한 개발 작업 목록입니다.
> 총 17개 Epic, 약 150개 Task로 구성되어 있습니다.

---

## 1. 프로젝트 초기 설정 및 인프라 구축
- [x] 1.1 Next.js 14+ (App Router) 프로젝트 생성 및 TypeScript 설정
  - `npx create-next-app@latest` 실행
  - `tsconfig.json` 설정 확인
  - `.gitignore` 파일 확인
  
- [x] 1.2 Tailwind CSS 설치 및 설정
  - `tailwind.config.ts` 커스텀 설정 (색상, 폰트, 브레이크포인트)
  - `globals.css` 기본 스타일 정의
  
- [x] 1.3 프로젝트 폴더 구조 설계
  - `/app` (페이지 라우트)
  - `/components` (재사용 컴포넌트)
  - `/lib` (유틸리티, DB 설정)
  - `/types` (TypeScript 타입 정의)
  - `/hooks` (커스텀 훅)
  
- [x] 1.4 Cloudflare D1 데이터베이스 설정
  - Cloudflare 계정 생성 및 D1 데이터베이스 생성
  - `wrangler.toml` 설정 파일 작성
  - 로컬 개발 환경용 SQLite 데이터베이스 설정
  
- [x] 1.5 Drizzle ORM 설치 및 설정
  - `drizzle-orm`, `drizzle-kit` 설치
  - `/lib/db/schema.ts` 스키마 파일 생성
  - `drizzle.config.ts` 설정 파일 작성
  
- [x] 1.6 데이터베이스 스키마 정의
  - `user` 테이블 스키마 정의
  - `question` 테이블 스키마 정의
  - `tag` 테이블 스키마 정의
  - `question_tag` 테이블 스키마 정의
  - `response` 테이블 스키마 정의
  - `user_group` 테이블 스키마 정의
  - `group_member` 테이블 스키마 정의
  - `invite_link` 테이블 스키마 정의
  
- [x] 1.7 데이터베이스 마이그레이션 실행
  - `drizzle-kit generate` 실행
  - 로컬 및 Cloudflare D1에 마이그레이션 적용
  - 인덱스 생성 확인

---

## 2. 인증 시스템 구축 (Google OAuth)
- [x] 2.1 NextAuth.js v5 설치 및 설정
  - `next-auth@beta` 설치
  - `/auth.ts` 설정 파일 생성
  - Google OAuth Provider 설정
  
- [x] 2.2 Google OAuth 애플리케이션 등록
  - Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
  - 리디렉션 URI 설정
  - `.env.local`에 `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` 추가
  
- [x] 2.3 인증 API 라우트 구현
  - `/app/api/auth/[...nextauth]/route.ts` 생성
  - 세션 관리 로직 구현
  - JWT 전략 설정
  
- [x] 2.4 사용자 정보 저장 로직 구현
  - Google 로그인 시 `user` 테이블에 사용자 정보 저장
  - `google_id`, `email`, `display_name` 매핑
  - 기존 사용자 확인 로직
  
- [x] 2.5 인증 상태 관리
  - `SessionProvider` 설정
  - 클라이언트 컴포넌트에서 `useSession` 훅 사용
  - 서버 컴포넌트에서 `getServerSession` 사용
  
- [x] 2.6 사용자 설정 API 구현
  - `PATCH /api/users/settings` 엔드포인트 생성
  - 표시 이름 설정 로직 (구글 계정명 vs 익명 별명)
  - `use_nickname`, `custom_nickname` 업데이트
  
- [x] 2.7 회원 탈퇴 API 구현
  - `DELETE /api/users/me` 엔드포인트 생성
  - `status = -1`로 변경 (Soft Delete)
  - 생성한 모임 확인 및 경고 처리

---

## 3. 디자인 시스템 및 공통 컴포넌트 구축
- [x] 3.1 Radix UI 설치 및 기본 컴포넌트 래핑
  - `@radix-ui/react-*` 필요한 패키지 설치
  - `/components/ui/Button.tsx` 생성
  - `/components/ui/Modal.tsx` 생성
  - `/components/ui/Input.tsx` 생성
  
- [x] 3.2 레이아웃 컴포넌트 구현
  - `/components/layout/Header.tsx` (로고, 로그인 버튼, 네비게이션)
  - `/components/layout/Sidebar.tsx` (모임 목록)
  - `/app/layout.tsx` 루트 레이아웃 설정
  
- [x] 3.3 반응형 네비게이션 구현
  - 모바일: 햄버거 메뉴
  - PC: 고정 사이드바
  - 네비게이션 메뉴 항목: 홈, 내 모임, 질문 만들기, 설정
  
- [x] 3.4 로딩 및 에러 상태 컴포넌트
  - `/components/ui/Loading.tsx` (스피너)
  - `/components/ui/ErrorMessage.tsx`
  - `/components/ui/Toast.tsx` (성공/에러 메시지)

---

## 4. 밸런스 게임 플레이 기능 (메인 기능)
- [x] 4.1 메인 페이지 및 첫 접속 문구 구현
  - `/app/page.tsx` 메인 페이지 생성
  - "밸런스 모임?" 소개 문구 표시
  - [시작하기] 버튼
  
- [x] 4.2 주의사항 모달 구현
  - `/components/game/WarningModal.tsx` 생성
  - "한 번 선택한 답변은 수정할 수 없습니다" 문구
  - 첫 방문 시만 표시 (localStorage 활용)
  
- [x] 4.3 랜덤 질문 가져오기 API
  - `GET /api/questions/random` 엔드포인트 생성
  - 태그 필터 쿼리 파라미터 지원
  - 로그인 사용자: 이미 응답한 질문 제외
  - `deleted_at IS NULL` 조건 적용
  
- [x] 4.4 질문 표시 컴포넌트 구현
  - `/components/game/QuestionCard.tsx` 생성
  - 질문 제목 표시
  - 2개 선택지 버튼 (A, B)
  - 태그 표시
  - 터치하기 쉬운 큰 버튼 디자인
  
- [x] 4.5 응답 제출 API 구현
  - `POST /api/responses` 엔드포인트 생성
  - `question_id`, `user_id`, `selected_option` 저장
  - UNIQUE 제약조건으로 중복 방지
  - 비로그인 사용자: `user_id = NULL`
  
- [x] 4.6 결과 표시 컴포넌트 구현
  - `/components/game/ResultCard.tsx` 생성
  - 전체 통계: 가로 막대 그래프 + 비율 표시
  - 모임별 통계 표시 (로그인 사용자만)
  - 애니메이션 효과 (슬라이드 업)
  
- [x] 4.7 통계 조회 API 구현
  - `GET /api/questions/[questionId]/stats` 엔드포인트 생성
  - 전체 통계 계산 (A/B 선택 비율)
  - 모임별 통계 계산 (사용자가 속한 모임들)
  
- [x] 4.8 다음 질문 로드 기능
  - "다음 질문" 버튼 클릭 시 새 질문 가져오기
  - 게임 플레이 통합 완료

---

## 5. 질문 관리 기능
- [x] 5.1 태그 검색 API 구현
  - `GET /api/tags/search?q=keyword` 엔드포인트 생성
  - LIKE 검색으로 자동완성 지원
  - 인기 태그 추천 로직
  
- [x] 5.2 태그 생성 API 구현
  - `POST /api/tags` 엔드포인트 생성
  - 중복 태그 확인 (UNIQUE 제약조건)
  
- [x] 5.3 질문 등록 폼 구현
  - `/app/questions/create/page.tsx` 페이지 생성
  - React Hook Form + Zod 유효성 검사
  - 질문 제목 입력 (필수, 최대 100자)
  - 선택지 A, B 입력 (필수, 최대 50자)
  - 태그 입력 (자동완성, 최소 1개)
  - 공개 설정 라디오 버튼 (전체 공개, 모임 전용, 비공개)
  
- [x] 5.4 질문 등록 API 구현
  - `POST /api/questions` 엔드포인트 생성
  - `question` 테이블에 삽입
  - `question_tag` 테이블에 태그 연결
  - 모임 전용일 경우 `group_id` 저장
  
- [x] 5.5 내가 만든 질문 목록 페이지 구현
  - `/app/questions/my/page.tsx` 페이지 생성
  - 질문 목록 카드 형식으로 표시
  - 공개 설정 배지 표시 (전체 공개, 모임 전용, 비공개)
  - 통계 표시 (응답 수, 선택지별 비율)
  - 편집/삭제 버튼
  
- [x] 5.6 내가 만든 질문 조회 API
  - `GET /api/questions/my` 엔드포인트 생성
  - `creator_id = 현재 사용자` 조건
  - `deleted_at IS NULL` 조건
  - 정렬: 최신순
  
- [x] 5.7 질문 수정 기능 구현
  - `/app/questions/[questionId]/edit/page.tsx` 페이지 생성
  - 기존 질문 데이터 불러오기
  - `PATCH /api/questions/[questionId]` 엔드포인트 생성
  - 제목, 선택지, 태그, 공개 설정 수정 가능
  
- [x] 5.8 질문 삭제 기능 구현 (Soft Delete)
  - `DELETE /api/questions/[questionId]` 엔드포인트 생성
  - `deleted_at = unixepoch()` 업데이트
  - 확인 모달 표시

---

## 6. 모임 기능 구축
- [x] 6.1 모임 생성 페이지 구현
  - `/app/groups/create/page.tsx` 페이지 생성
  - 모임 이름 입력 (필수, 최대 30자)
  - 모임 설명 입력 (선택, 최대 200자)
  - React Hook Form + Zod 유효성 검사
  
- [x] 6.2 모임 생성 API 구현
  - `POST /api/groups` 엔드포인트 생성
  - `user_group` 테이블에 삽입
  - `group_member` 테이블에 생성자 자동 추가
  - `creator_id` 저장
  
- [x] 6.3 내가 속한 모임 목록 페이지 구현
  - `/app/groups/page.tsx` 페이지 생성
  - 모임 카드 형식으로 표시
  - 멤버 수, 응답한 질문 수 표시
  - [+ 모임 생성] 버튼
  
- [x] 6.4 내가 속한 모임 조회 API
  - `GET /api/groups/my` 엔드포인트 생성
  - `group_member` 테이블 조인
  - `user_id = 현재 사용자` 조건
  
- [x] 6.5 초대 링크 생성 기능 구현
  - `/components/groups/InviteButton.tsx` 컴포넌트 생성
  - `POST /api/groups/[groupId]/invite` 엔드포인트 생성
  - UUID 기반 초대 코드 생성
  - `invite_link` 테이블에 삽입
  - `expires_at = 현재 시간 + 30일` 설정
  - 클립보드 복사 기능
  
- [x] 6.6 초대 링크를 통한 모임 참여 페이지 구현
  - `/app/invite/[inviteCode]/page.tsx` 페이지 생성
  - 초대 코드 유효성 확인 (만료 여부)
  - 모임 정보 표시 (이름, 설명, 멤버 수)
  - 로그인 체크 (비로그인 시 로그인 유도)
  
- [x] 6.7 모임 참여 API 구현
  - `POST /api/groups/join/[inviteCode]` 엔드포인트 생성
  - 초대 링크 유효성 검사
  - `group_member` 테이블에 추가
  - 중복 참여 방지
  
- [x] 6.8 모임 상세 페이지 구현
  - `/app/groups/[groupId]/page.tsx` 페이지 생성
  - 모임 통계 표시 (멤버 수, 응답한 질문 수)
  - [초대 링크 생성] 버튼
  - 생성자일 경우 ⚙️ 설정 버튼 표시
  
- [x] 6.9 모임 상세 조회 API 구현
  - `GET /api/groups/[groupId]` 엔드포인트 생성
  - 모임 정보 반환
  - 멤버 목록 반환 (탈퇴한 사용자 포함, status 확인)
  - 현재 사용자의 권한 확인 (생성자 여부)
  
- [x] 6.10 모임 관리 페이지 구현 (생성자 전용)
  - `/app/groups/[groupId]/settings/page.tsx` 페이지 생성
  - 멤버 목록 표시
  - 멤버 추방 버튼 구현
  
- [ ] 6.11 모임 수정 API 구현 (향후 추가 예정)
  - `PATCH /api/groups/:id` 엔드포인트 생성
  - 생성자 권한 확인
  - `name`, `description` 업데이트
  
- [x] 6.12 멤버 추방 API 구현
  - `DELETE /api/groups/[groupId]/members/[memberId]` 엔드포인트 생성
  - 생성자 권한 확인
  - `group_member` 테이블에서 삭제
  - 응답은 통계에 유지
  
- [x] 6.13 모임 나가기 기능 구현
  - `DELETE /api/groups/[groupId]/leave` 엔드포인트 생성
  - 생성자는 나가기 불가 경고
  - `group_member` 테이블에서 삭제
  - 모임 상세 페이지에 "모임 나가기" 버튼 추가

---

## 7. 모임 내 분석 기능 (취향 유사도)
- [x] 7.1 모임 멤버들의 응답 목록 표시
  - `/components/groups/GroupResponses.tsx` 컴포넌트 생성
  - 태그별 필터 드롭다운
  - 질문별 모임 내 선택 비율 표시
  - 막대 그래프로 시각화
  
- [x] 7.2 모임 응답 조회 API 구현
  - `GET /api/groups/:id/responses?tag=음식` 엔드포인트 생성
  - 태그 필터 지원
  - 해당 모임 멤버들의 응답 집계
  - 탈퇴한 사용자 포함
  
- [x] 7.3 취향 유사도 랭킹 컴포넌트 구현
  - `/components/groups/SimilarityRanking.tsx` 컴포넌트 생성
  - TOP 10 사용자 표시
  - 사용자 이름, 일치율 %, 공통 질문 수 표시
  - 프로필 클릭 시 상세 비교 페이지로 이동
  
- [x] 7.4 취향 유사도 계산 API 구현
  - `GET /api/groups/:id/similarity` 엔드포인트 생성
  - 현재 사용자와 모임 내 다른 사용자들의 공통 응답 계산
  - 일치율 = (동일한 선택 수 / 공통 질문 수) * 100
  - `status = 1`인 활성 사용자만 포함
  - 최소 5개 공통 질문 필요
  - 일치율 높은 순으로 정렬
  
- [x] 7.5 사용자 간 상세 비교 페이지 구현
  - `/app/groups/[groupId]/compare/[userId]/page.tsx` 페이지 생성
  - 질문별로 나의 선택 vs 상대 선택 나란히 표시
  - 일치하는 질문은 초록색, 다른 질문은 빨간색
  - 전체 일치율 표시
  
- [x] 7.6 사용자 간 상세 비교 API 구현
  - `GET /api/groups/[groupId]/compare/[userId]` 엔드포인트 생성
  - 두 사용자의 모든 공통 응답 조회
  - 질문별 선택 비교 데이터 반환
  - 태그 정보 포함

---

## 8. 사용자 설정 페이지
- [x] 8.1 설정 페이지 UI 구현
  - `/app/settings/page.tsx` 페이지 생성
  - 로그인 정보 표시 (이메일, 구글 계정명)
  - 표시 이름 설정 라디오 버튼
  - 구글 계정명 사용 / 익명 별명 사용
  - 익명 별명 입력 필드 (2~12자)
  - [저장하기] 버튼
  - 회원 탈퇴 버튼 (경고 포함)
  
- [x] 8.2 회원 탈퇴 확인 모달 구현
  - 생성한 모임 확인
  - "생성한 모임이 있습니다" 경고 및 탈퇴 차단
  - "탈퇴하기" 텍스트 입력 확인
  - 최종 확인 후 회원 탈퇴 처리

---

## 9. 태그별 질문 필터링
- [x] 9.1 태그 필터 컴포넌트 구현
  - `/components/game/TagFilter.tsx` 컴포넌트 생성
  - 칩 형태의 다중 선택 UI
  - 선택한 태그를 URL 쿼리 파라미터로 관리
  - 게임 플레이 페이지에 통합
  
- [x] 9.2 태그별 질문 조회 로직 추가
  - `GET /api/questions/random?tags=음식,라면` 쿼리 파라미터 지원 (이미 구현됨)
  - `question_tag` 테이블 조인
  - 해당 태그를 가진 질문만 필터링
  - 태그 변경 시 자동으로 새 질문 로드

---

## 10. 성능 최적화 ✅ (완료)
- [ ] 10.1 Next.js 이미지 최적화 적용
  - `next/image` 컴포넌트 사용
  - WebP 자동 변환 설정
  - (현재 이미지 사용하지 않아 보류)
  
- [x] 10.2 API 응답 캐싱 설정 ✅
  - 질문 통계: 5분간 캐싱 (`revalidate = 300`) ✅
  - 태그 목록: 1시간 캐싱 (`revalidate = 3600`) ✅
  - Next.js Route Handler `revalidate` 옵션 활용 ✅
  
- [x] 10.3 페이지네이션 구현 ✅
  - API 레벨 페이지네이션 구현 완료 ✅
  - `LIMIT`, `OFFSET` 쿼리 적용 ✅
  - 내 질문 목록 API: page, limit 쿼리 파라미터 지원 ✅
  - 내 모임 목록 API: page, limit 쿼리 파라미터 지원 ✅
  - 페이지네이션 메타데이터 (total, page, limit, totalPages, hasNext, hasPrev) 제공 ✅
  - 프론트엔드 UI 구현 완료 ✅
    - Pagination 컴포넌트 (Apple 스타일, Glassmorphism, 다크모드 지원) ✅
    - 내 질문 페이지 페이지네이션 적용 ✅
    - 내 모임 페이지 페이지네이션 적용 ✅
    - 페이지 변경 시 스크롤 상단 이동 ✅
  
- [x] 10.4 Prefetching 구현 ✅
  - Next.js Link 컴포넌트의 prefetch 기본 활성화됨 ✅
  - 자동으로 뷰포트에 보이는 링크를 미리 가져옴 ✅

---

## 11. 보안 강화 ✅ (완료)
- [x] 11.1 CSRF 방지 ✅
  - NextAuth.js 내장 CSRF 토큰 확인 완료 ✅
  - NextAuth.js가 자동으로 모든 POST/PUT/DELETE 요청에 CSRF 보호 제공 ✅
  
- [x] 11.2 XSS 방지 ✅
  - isomorphic-dompurify 설치 완료 ✅
  - `/lib/security/sanitize.ts` 생성 (sanitizeHtml, sanitizeText, sanitizeUrl, sanitizeObject) ✅
  - CSP 헤더 설정 완료 (`next.config.ts`) ✅
    - Content-Security-Policy
    - X-Frame-Options: DENY
    - X-Content-Type-Options: nosniff
    - Referrer-Policy: strict-origin-when-cross-origin
    - Permissions-Policy
  
- [ ] 11.3 Rate Limiting 구현
  - Cloudflare Workers로 IP별 제한
  - 질문 등록: 분당 10회
  - 응답 제출: 분당 30회
  
- [x] 11.4 입력 유효성 검사 강화 ✅
  - `/lib/security/validation.ts` 생성 ✅
  - 강화된 공통 Zod 스키마 정의 ✅
    - safeString (XSS 패턴 검증)
    - emailSchema
    - urlSchema
    - questionTitleSchema, optionSchema, tagNameSchema
    - groupNameSchema, groupDescriptionSchema
    - nicknameSchema, uuidSchema
    - paginationSchema, visibilitySchema, choiceSchema
  - 질문 생성 API에 sanitize + 강화된 검증 적용 완료 ✅
  - 에러 메시지 포맷팅 함수 (formatZodError) ✅
  
- [x] 11.5 권한 체크 미들웨어 구현 ✅
  - `/lib/auth/permissions.ts` 생성 완료 ✅
  - 제공 함수:
    - `checkIsGroupCreator` - 모임 생성자 확인 ✅
    - `checkIsGroupMember` - 모임 멤버 확인 ✅
    - `checkIsQuestionCreator` - 질문 작성자 확인 ✅
    - `checkGroupExists` - 모임 존재 확인 ✅
    - `checkQuestionExists` - 질문 존재 확인 ✅
    - `checkIsGroupCreatorOrMember` - 생성자 또는 멤버 확인 ✅
    - `checkCanModifyGroup` - 모임 수정 권한 확인 ✅
    - `checkCanModifyQuestion` - 질문 수정 권한 확인 ✅
    - `checkCanViewGroupResponses` - 모임 응답 조회 권한 확인 ✅
  - 모임 수정 API에 권한 체크 적용 완료 ✅

---

## 12. 반응형 디자인 완성
- [x] 12.1 모바일 화면 최적화 (< 768px)
  - 세로 스크롤 레이아웃 ✅
  - 선택지 세로 배치 ✅
  - 햄버거 메뉴 (Portal 기반, 전체 화면) ✅
  - 터치 영역 충분히 확보 (min-h, touch-manipulation) ✅
  - 폰트 크기 모바일 최적화 (text-sm, text-base, text-lg) ✅
  - 패딩/여백 모바일 최적화 (p-5, p-6, gap-4) ✅
  
- [x] 12.2 태블릿 화면 최적화 (768px ~ 1024px)
  - 선택지 가로 배치 (md:grid-cols-2) ✅
  - 적절한 중간 크기 폰트 (sm:text-xl, md:text-2xl) ✅
  - 적절한 패딩 (sm:p-6, md:p-8) ✅
  
- [x] 12.3 PC 화면 최적화 (≥ 1024px)
  - 더 넓은 컨텐츠 영역 (max-w-4xl) ✅
  - 호버 효과 (hover:scale-105, hover:shadow-apple-lg) ✅
  - 큰 폰트 크기 (lg:text-9xl, md:text-6xl) ✅

---

## 13. 애니메이션 구현 (Framer Motion) ✅ (완료)
- [x] 13.1 Framer Motion 설치 및 설정 ✅
  - `framer-motion` 설치 완료 ✅
  - 기본 애니메이션 변형(variants) 정의 완료 ✅
  - `/lib/animations/variants.ts` 생성 ✅
    - fadeIn, fadeInSlow ✅
    - slideUp, slideDown, slideInFromLeft, slideInFromRight ✅
    - scaleUp, scaleDown ✅
    - buttonTap, buttonHover ✅
    - staggerContainer, staggerItem ✅
    - progressBar ✅
    - modalBackdrop, modalContent ✅
    - cardHover, flip, shake, pulse ✅
  
- [x] 13.2 페이지 전환 애니메이션 ✅
  - 페이드 인/아웃 완료 ✅
  - 슬라이드 효과 완료 ✅
  - pageTransition variant 정의 ✅
  - 게임 플레이 페이지 전환 애니메이션 적용 완료 ✅
    - 주의사항 모달 → 질문 → 결과 부드러운 전환 ✅
    - AnimatePresence로 exit 애니메이션 ✅
  
- [x] 13.3 버튼 클릭 애니메이션 ✅
  - Scale 효과 완료 ✅
  - AnimatedButton 컴포넌트 생성 ✅
  - whileHover, whileTap 효과 적용 ✅
  - QuestionCard 선택지 버튼에 애니메이션 적용 ✅
  - "다음 질문으로" 버튼 애니메이션 적용 ✅
  
- [x] 13.4 결과 표시 애니메이션 ✅
  - 슬라이드 업 완료 ✅
  - 막대 그래프 애니메이션 완료 ✅
  - ProgressBar 컴포넌트 생성 ✅
  - 뷰포트 진입 시 자동 애니메이션 ✅
  - GroupResponses에 적용 완료 ✅
  - ResultCard에 적용 완료 ✅
  - 순차 애니메이션 (stagger) 적용 ✅
  - 모임별 통계 순차 등장 애니메이션 ✅
  
- [x] 13.5 게임 플레이 페이지 애니메이션 적용 ✅
  - QuestionCard 전체 순차 애니메이션 ✅
  - ResultCard 전체 순차 애니메이션 ✅
  - QuestionCardSkeleton export 추가 ✅
  - 로딩/에러 상태 페이드 인 애니메이션 ✅

---

## 14. 초기 데이터 시딩 ✅ (완료)
- [x] 14.1 샘플 질문 100개 작성 ✅
  - 다양한 카테고리 (음식, 연애, 취미, 직장생활, MBTI, 여행, 패션, 운동, 영화, 음악, 게임, 일상, 관계, 가치관, 습관, 건강, 돈, 라이프스타일, 자기계발, SNS) ✅
  - JSON 파일로 준비 (`scripts/seed-data.json`) ✅
  - 100개 질문 완성 ✅
  
- [x] 14.2 태그 데이터 준비 ✅
  - 주요 태그 20개 선정 완료 ✅
  - 모든 태그 DB에 삽입 완료 ✅
  
- [x] 14.3 시딩 스크립트 작성 ✅
  - `/scripts/seed.ts` 생성 완료 ✅
  - Drizzle ORM으로 데이터 삽입 구현 ✅
  - 중복 체크 로직 포함 ✅
  - `npm run db:seed` 명령어로 실행 가능 ✅
  - 로컬 환경 완전 지원 ✅
  - 100개 질문 + 20개 태그 시딩 완료 ✅
  
- [ ] 14.4 시딩 실행 및 확인
  - `npm run seed` 실행
  - 데이터 삽입 확인

---

## 15. Cloudflare Pages 배포 설정 ✅ (문서 완성)
- [x] 15.1 배포 문서 작성 ✅
  - README.md 생성 완료 ✅
  - DEPLOYMENT.md 상세 가이드 작성 완료 ✅
  - 프로젝트 구조 문서화 ✅
  - 개발 가이드 작성 ✅
  
- [ ] 15.2 Google OAuth 설정 (수동)
  - Google Cloud Console에서 OAuth 클라이언트 생성
  - 프로덕션 도메인 승인된 JavaScript 원본에 추가
  - 리디렉션 URI 설정
  
- [ ] 15.3 Cloudflare D1 프로덕션 DB 설정 (수동)
  - `npx wrangler d1 create balance-moim-db-prod` 실행
  - `wrangler.toml`에 프로덕션 DB ID 추가
  - `npm run db:migrate:prod` 실행
  - 프로덕션 DB 시딩
  
- [ ] 15.4 Cloudflare Pages 프로젝트 생성 (수동)
  - GitHub 저장소 연결
  - 빌드 설정: `npm run build`, `.next`
  - D1 바인딩 설정 (Variable: DB)
  - 환경 변수 설정:
    - GOOGLE_CLIENT_ID
    - GOOGLE_CLIENT_SECRET
    - NEXTAUTH_SECRET
    - NEXTAUTH_URL
    - NODE_VERSION=22.13.1
  
- [ ] 15.5 첫 배포 실행 (수동)
  - Git push로 자동 배포 트리거
  - 빌드 로그 확인
  - 배포 성공 확인
  
- [ ] 15.6 배포 후 테스트 (수동)
  - 홈 페이지 접속
  - Google 로그인 테스트
  - 밸런스 게임 플레이
  - 모임 생성 및 초대
  - 다크모드 전환
  - 모바일/태블릿 반응형 확인
  
- [ ] 15.7 커스텀 도메인 설정 (선택사항)
  - Cloudflare Pages에서 커스텀 도메인 추가
  - DNS 레코드 설정 (CNAME)
  - SSL/TLS 설정 확인
  - Google OAuth 리디렉션 URI 업데이트

---

## 16. 테스트 및 버그 수정
- [ ] 16.1 비로그인 사용자 플로우 테스트
  - 질문 플레이
  - 통계 표시 (모임별 통계 미표시 확인)
  - 로그인 유도 문구 확인
  
- [ ] 16.2 로그인 사용자 플로우 테스트
  - 질문 플레이 및 기록 저장
  - 질문 등록
  - 모임 생성/참여
  - 취향 유사도 확인
  
- [ ] 16.3 모임 관리자 플로우 테스트
  - 모임 수정
  - 멤버 퇴출
  - 초대 링크 생성
  
- [ ] 16.4 엣지 케이스 테스트
  - 중복 응답 방지 확인
  - 재응답 불가 확인
  - 만료된 초대 링크 처리
  - 탈퇴한 사용자 표시 확인
  - Soft Delete 동작 확인
  
- [ ] 16.5 접근성 테스트
  - 키보드 네비게이션
  - 스크린 리더 호환성
  - 색상 대비 확인 (WCAG AA)
  
- [ ] 16.6 성능 테스트
  - Lighthouse 점수 확인
  - 로딩 속도 측정
  - 최적화 필요 부분 개선
  
- [ ] 16.7 크로스 브라우저 테스트
  - Chrome, Safari, Firefox, Edge
  - 모바일 브라우저 (iOS Safari, Android Chrome)
  
- [ ] 16.8 발견된 버그 수정
  - 버그 목록 작성
  - 우선순위 설정
  - 순차적으로 수정

---

## 17. 문서화 및 마무리
- [ ] 17.1 README.md 작성
  - 프로젝트 소개
  - 로컬 개발 환경 설정 방법
  - 환경 변수 목록
  - 빌드 및 배포 방법
  
- [ ] 17.2 API 문서 작성
  - 모든 엔드포인트 목록
  - 요청/응답 예시
  - 에러 코드
  
- [ ] 17.3 코드 주석 추가
  - 복잡한 로직에 주석
  - 함수/컴포넌트 JSDoc 추가
  
- [ ] 17.4 Git 커밋 메시지 정리
  - Conventional Commits 규칙 준수
  - 의미있는 커밋 메시지

---

## 작업 진행 가이드

### 권장 작업 순서
1. **1번 → 2번 → 3번**: 기본 인프라 구축 (필수 선행)
2. **4번**: 핵심 기능 (가장 중요)
3. **5번 → 6번 → 7번**: 주요 기능 구현
4. **8번 → 9번**: 부가 기능
5. **10번 → 11번 → 12번 → 13번**: 최적화 및 개선
6. **14번 → 15번**: 데이터 준비 및 배포
7. **16번 → 17번**: 테스트 및 마무리

### 병렬 작업 가능 항목
- 3번 (디자인 시스템)과 2번 (인증) 일부는 동시 진행 가능
- 5번, 6번, 7번은 API와 UI를 나눠서 동시 작업 가능
- 12번 (반응형)과 13번 (애니메이션)은 UI 구현 후 병렬 진행 가능

### 예상 소요 시간 (1인 풀타임 기준)
- **Sprint 1 (1주)**: 1번 ~ 3번
- **Sprint 2 (1주)**: 4번
- **Sprint 3 (1.5주)**: 6번
- **Sprint 4 (1주)**: 5번 + 9번
- **Sprint 5 (0.5주)**: 7번
- **Sprint 6 (1주)**: 8번 + 10번 + 11번 + 12번 + 13번 + 14번 + 15번 + 16번 + 17번

**총 예상 기간: 4~6주**

---

## 체크리스트 사용 방법

1. 각 작업 완료 시 `[ ]`를 `[x]`로 변경
2. 진행 상황을 정기적으로 업데이트
3. 막히는 부분은 이슈로 등록
4. 우선순위가 높은 작업부터 진행

---

**작성일**: 2025-11-11  
**기준 문서**: `02_balance_game_prd.md`  
**총 Epic 수**: 17개  
**총 Task 수**: 약 150개