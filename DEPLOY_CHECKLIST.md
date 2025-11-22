# 배포 체크리스트

## 배포 전 확인사항

### 1. 파일 구조 확인

- [x] `index.html` 존재
- [x] `css/style.css` 존재
- [x] `js/` 디렉토리 및 모든 파일 존재
- [x] `public/_redirects` 파일 존재
- [x] `public/_headers` 파일 존재
- [ ] `functions/` 디렉토리 구조 확인 (기존 API) - **나중에 처리 가능**

### 2. 환경 변수 확인

- [x] `GOOGLE_CLIENT_ID` 설정 ✅
- [x] `GOOGLE_CLIENT_SECRET` 설정 ✅
- [x] `NEXTAUTH_SECRET` 설정 (32자 이상) ✅
- [x] `NEXTAUTH_URL` 설정 (배포된 도메인과 일치) ✅

### 3. 데이터베이스 확인

- [x] D1 데이터베이스 생성 완료 ✅
- [x] Pages 프로젝트에 D1 바인딩 완료 (balance-moim-db-prod) ✅
- [x] 마이그레이션 실행 완료 (또는 기존 데이터 있음) ✅
- [x] 시드 데이터 있음 (태그, 질문) ✅

### 4. 빌드 설정 확인

- [x] Framework preset: `None` ✅
- [x] Build command: (비워두기) ✅
- [x] Build output directory: `/` ✅
- [x] Root directory: (비워두기) ✅

### 5. Functions 확인

- [x] Functions 디렉토리 없음 (SPA이므로 불필요) ✅
- [ ] **나중에 API 필요 시 Functions 설정** (현재는 불필요)

## 배포 후 테스트

### 기능 테스트

- [ ] 홈 페이지 로드 (`/#home`)
- [ ] 게임 플레이 페이지 로드 (`/#play`)
- [ ] Google 로그인 작동
- [ ] 모임 목록 페이지 로드 (`/#groups`)
- [ ] 질문 생성 페이지 로드 (`/#questions/create`)
- [ ] 설정 페이지 로드 (`/#settings`)

### API 테스트

- [ ] `/api/users/me` - 사용자 정보
- [ ] `/api/questions/random` - 랜덤 질문
- [ ] `/api/groups/my` - 내 모임 목록
- [ ] `/api/auth/signin/google` - Google 로그인

### 라우팅 테스트

- [ ] 해시 라우팅 작동 (`#home`, `#play` 등)
- [ ] 직접 URL 접근 시 리다이렉트 작동
- [ ] 404 페이지 작동
- [ ] **정적 파일(css, js)은 리다이렉트되지 않음** ⚠️ **수정 필요**

### 보안 테스트

- [ ] HTTPS 강제 적용
- [ ] 보안 헤더 적용 확인
- [ ] CORS 설정 확인

## 문제 발생 시

### 404 오류

1. `public/_redirects` 파일 확인
2. Functions 경로 확인
3. Cloudflare Pages 설정에서 리다이렉트 규칙 확인

### 로그인 오류

1. `NEXTAUTH_URL` 환경 변수 확인
2. Google OAuth 설정 확인
3. 콜백 URL 설정 확인

### API 오류

1. Functions 디렉토리 구조 확인
2. D1 데이터베이스 바인딩 확인
3. 환경 변수 확인
4. Cloudflare Pages Functions 로그 확인

### 성능 이슈

1. 캐싱 설정 확인
2. 파일 크기 확인
3. 불필요한 파일 제거

## 배포 후 모니터링

- [ ] Cloudflare Analytics 확인
- [ ] 에러 로그 모니터링
- [ ] 사용자 피드백 수집
