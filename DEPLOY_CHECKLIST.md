# 배포 체크리스트

## 배포 전 확인사항

### 1. 파일 구조 확인

- [ ] `index.html` 존재
- [ ] `css/style.css` 존재
- [ ] `js/` 디렉토리 및 모든 파일 존재
- [ ] `public/_redirects` 파일 존재
- [ ] `public/_headers` 파일 존재
- [ ] `functions/` 디렉토리 구조 확인 (기존 API)

### 2. 환경 변수 확인

- [ ] `GOOGLE_CLIENT_ID` 설정
- [ ] `GOOGLE_CLIENT_SECRET` 설정
- [ ] `NEXTAUTH_SECRET` 설정 (32자 이상)
- [ ] `NEXTAUTH_URL` 설정 (배포된 도메인과 일치)

### 3. 데이터베이스 확인

- [ ] D1 데이터베이스 생성 완료
- [ ] Pages 프로젝트에 D1 바인딩 완료
- [ ] 마이그레이션 실행 완료
- [ ] 시드 데이터 필요 시 실행

### 4. 빌드 설정 확인

- [ ] Framework preset: `None`
- [ ] Build command: (비워두기)
- [ ] Build output directory: `/`
- [ ] Root directory: (비워두기)

### 5. Functions 확인

- [ ] `functions/api/` 디렉토리 구조 확인
- [ ] 기존 Next.js API 라우트가 Functions로 변환되었는지 확인
- [ ] 인증 관련 Functions 확인

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
