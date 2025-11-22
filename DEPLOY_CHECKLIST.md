# 배포 체크리스트 (Deployment Checklist)

배포 전에 다음 항목들을 확인하세요.

## ✅ 사전 준비

### 1. 코드 준비
- [x] 모든 변경사항 커밋 완료
- [ ] `git push origin master` 실행
- [ ] GitHub 저장소에 코드 푸시 확인

### 2. 환경 변수 준비
- [ ] Google OAuth 클라이언트 ID 생성 완료
- [ ] Google OAuth 클라이언트 Secret 생성 완료
- [ ] NextAuth Secret 생성 (`openssl rand -base64 32`)
- [ ] 프로덕션 URL 확인 (예: `https://your-project.pages.dev`)

### 3. 데이터베이스 준비
- [x] Cloudflare D1 프로덕션 데이터베이스 생성 ✅
  - 데이터베이스 이름: `balance-moim-db-prod`
  - 데이터베이스 ID: `891a9ed9-3cd7-4183-8368-0beeb57f2727`
- [x] `wrangler.toml`에 프로덕션 DB ID 추가 ✅
- [x] 프로덕션 DB 마이그레이션 실행 ✅
  ```bash
  npm run db:migrate:prod
  ```
- [ ] 프로덕션 DB 시딩 (100개 질문 + 20개 태그) - Cloudflare Pages URL 확인 후 진행

## 🚀 Cloudflare Pages 배포

### 1. 프로젝트 생성
- [ ] [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
- [ ] **Workers & Pages** → **Create application** → **Pages**
- [ ] GitHub 저장소 연결
- [ ] 저장소 선택 및 권한 부여

### 2. 빌드 설정
- [ ] **Production branch**: `master`
- [ ] **Build command**: `npm run build`
- [ ] **Build output directory**: `.next`
- [ ] **Framework preset**: Next.js
- [ ] **Node.js version**: 22.13.1

### 3. 환경 변수 설정
**Settings** → **Environment variables** → **Add variable**

| 변수명 | 값 | 예시 |
|--------|------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 Secret | `GOCSPX-...` |
| `NEXTAUTH_SECRET` | NextAuth 암호화 키 | `openssl rand -base64 32` 결과 |
| `NEXTAUTH_URL` | 배포된 URL | `https://your-project.pages.dev` |
| `NODE_VERSION` | Node.js 버전 | `22.13.1` |

### 4. D1 바인딩 설정
- [ ] **Settings** → **Functions** → **D1 database bindings**
- [ ] **Add binding** 클릭
- [ ] **Variable name**: `DB`
- [ ] **D1 database**: `balance-moim-db-prod` 선택
- [ ] **Save** 클릭

### 5. 배포 실행
- [ ] **Deployments** 탭에서 **Create deployment** 클릭
- [ ] 또는 GitHub에 푸시하여 자동 배포 트리거
- [ ] 빌드 로그 확인 (약 3-5분 소요)
- [ ] 배포 성공 확인

## ✅ 배포 후 확인

### 1. 기본 기능 테스트
- [ ] 홈 페이지 접속 (`https://your-project.pages.dev`)
- [ ] Google 로그인 테스트
- [ ] 밸런스 게임 플레이
- [ ] 질문 응답 및 통계 확인
- [ ] 모임 생성 및 초대 링크 생성
- [ ] 태그 필터링
- [ ] 다크모드 전환

### 2. 반응형 테스트
- [ ] 모바일 (375px, 414px)
- [ ] 태블릿 (768px, 1024px)
- [ ] PC (1280px, 1920px)

### 3. 데이터베이스 확인
```bash
# 프로덕션 DB 확인
npx wrangler d1 execute balance-moim-db-prod --command "SELECT COUNT(*) as count FROM question"
# 예상 결과: count: 100

npx wrangler d1 execute balance-moim-db-prod --command "SELECT COUNT(*) as count FROM tag"
# 예상 결과: count: 20
```

### 4. Google OAuth 확인
- [ ] Google Cloud Console에서 승인된 JavaScript 원본 확인
- [ ] 승인된 리디렉션 URI 확인
- [ ] 프로덕션 URL과 일치하는지 확인

## 🔧 커스텀 도메인 (선택사항)

- [ ] Cloudflare Pages에서 커스텀 도메인 추가
- [ ] DNS 레코드 설정 (CNAME)
- [ ] SSL/TLS 자동 적용 확인
- [ ] Google OAuth 리디렉션 URI 업데이트

## 📊 모니터링 설정

- [ ] Cloudflare Analytics 확인
- [ ] 에러 로그 모니터링 설정
- [ ] 성능 메트릭 확인

---

## 🎉 배포 완료!

모든 체크리스트를 완료했다면 배포가 성공적으로 완료된 것입니다!

**문제가 발생하면:**
1. `DEPLOYMENT.md`의 트러블슈팅 섹션 참고
2. Cloudflare Pages 빌드 로그 확인
3. 브라우저 콘솔 에러 확인

---

**배포 URL**: https://your-project.pages.dev

