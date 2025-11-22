# Cloudflare Pages Functions 설정 완료

## 생성된 Functions

### 인증 API
- ✅ `/api/auth/[...nextauth]` - NextAuth 인증 (GET, POST)
  - Google 로그인
  - 로그아웃 (`/api/auth/signout`도 동일한 handlers로 처리)

### 사용자 API
- ✅ `/api/users/me` - 사용자 정보 조회 (GET), 회원 탈퇴 (DELETE)
- ✅ `/api/users/settings` - 사용자 설정 조회 (GET), 업데이트 (PATCH)

### 질문 API
- ✅ `/api/questions` - 질문 생성 (POST), 목록 조회 (GET)
- ✅ `/api/questions/random` - 랜덤 질문 조회 (GET)
- ✅ `/api/questions/my` - 내 질문 목록 (GET)
- ✅ `/api/questions/[questionId]` - 질문 상세 (GET), 삭제 (DELETE)

### 응답 API
- ✅ `/api/responses` - 응답 생성 (POST)

### 모임 API
- ✅ `/api/groups` - 모임 생성 (POST)
- ✅ `/api/groups/my` - 내 모임 목록 (GET)
- ✅ `/api/groups/[groupId]` - 모임 상세 (GET), 수정 (PATCH)
- ✅ `/api/groups/[groupId]/leave` - 모임 나가기 (DELETE)
- ✅ `/api/groups/[groupId]/invite` - 초대 링크 생성 (POST)
- ✅ `/api/groups/[groupId]/responses` - 모임 응답 통계 (GET)
- ✅ `/api/groups/[groupId]/similarity` - 취향 유사도 (GET)
- ✅ `/api/groups/join/[inviteCode]` - 초대 링크 정보 (GET), 참여 (POST)

### 태그 API
- ✅ `/api/tags` - 태그 목록 (GET)
- ✅ `/api/tags/search` - 태그 검색 (GET)

## 환경 변수 설정

Cloudflare Pages 대시보드에서 다음 환경 변수를 설정해야 합니다:

1. **Settings > Environment variables**에서:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (배포된 URL, 예: `https://balance-moim.pages.dev`)

2. **Settings > Functions > D1 database bindings**에서:
   - Variable name: `DB`
   - D1 database: `balance-moim-db-prod` 선택

## 디자인 설정

- ✅ Tailwind CSS Play CDN 추가
- ✅ 커스텀 CSS 변수 설정
- ✅ `css/style.css` 유지

## 다음 단계

1. 변경사항 커밋 및 푸시:
```bash
git add .
git commit -m "Add Cloudflare Pages Functions for all API endpoints"
git push origin main
```

2. 재배포 대기 (1-2분)

3. 환경 변수 확인:
   - Cloudflare Pages 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
   - D1 데이터베이스 바인딩이 올바르게 설정되었는지 확인

4. 테스트:
   - 로그인 버튼 클릭 → Google 로그인 페이지로 이동해야 함
   - 로그인 후 사용자 정보가 표시되어야 함
   - 디자인이 Next.js와 동일하게 표시되어야 함
