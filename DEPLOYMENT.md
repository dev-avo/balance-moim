# 배포 가이드 (Deployment Guide)

이 문서는 **밸런스 모임**을 Cloudflare Pages에 배포하는 상세한 가이드입니다.

## 📋 사전 준비

### 1. 필수 계정

- ✅ [Cloudflare 계정](https://dash.cloudflare.com/sign-up)
- ✅ [Google Cloud Console 프로젝트](https://console.cloud.google.com/)
- ✅ GitHub 계정 (코드 저장소)

### 2. 로컬 환경 확인

\`\`\`bash
# Node.js 버전 확인 (22.13.1+ 권장)
node --version

# npm 버전 확인 (10+ 권장)
npm --version

# Git 버전 확인
git --version
\`\`\`

## 🔐 Google OAuth 설정

### 1. Google Cloud Console 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** → **OAuth 동의 화면** 설정
   - **User Type**: 외부
   - **앱 이름**: 밸런스 moim
   - **사용자 지원 이메일**: 본인 이메일
   - **승인된 도메인**: \`pages.dev\` (Cloudflare Pages 도메인)
   - **범위**: \`email\`, \`profile\`, \`openid\`

### 2. OAuth 클라이언트 ID 생성

1. **API 및 서비스** → **사용자 인증 정보**
2. **사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
3. **애플리케이션 유형**: 웹 애플리케이션
4. **승인된 JavaScript 원본**:
   - \`http://localhost:3000\` (로컬 개발)
   - \`https://your-project.pages.dev\` (프로덕션)
   - \`https://your-custom-domain.com\` (커스텀 도메인)
5. **승인된 리디렉션 URI**:
   - \`http://localhost:3000/api/auth/callback/google\` (로컬)
   - \`https://your-project.pages.dev/api/auth/callback/google\` (프로덕션)
6. **클라이언트 ID**와 **클라이언트 보안 비밀** 복사 (나중에 사용)

## 🗄️ Cloudflare D1 데이터베이스 설정

### 1. 프로덕션 데이터베이스 생성

\`\`\`bash
# Cloudflare에 로그인
npx wrangler login

# 프로덕션 D1 데이터베이스 생성
npx wrangler d1 create balance-moim-db-prod

# 출력된 database_id를 복사
# 예: database_id = "abc123-def456-ghi789"
\`\`\`

### 2. wrangler.toml 업데이트

\`\`\`toml
[[d1_databases]]
binding = "DB"
database_name = "balance-moim-db"
database_id = "로컬_DB_ID"  # 로컬 개발용

[[d1_databases.prod]]
binding = "DB"
database_name = "balance-moim-db-prod"
database_id = "프로덕션_DB_ID"  # 위에서 복사한 ID
\`\`\`

### 3. 프로덕션 DB 마이그레이션

\`\`\`bash
# 마이그레이션 실행
npm run db:migrate:prod

# 성공 메시지 확인
# ✅ Successfully applied 1 migration(s)!
\`\`\`

### 4. 프로덕션 DB 시딩

\`\`\`bash
# 시딩 스크립트를 프로덕션 환경에 맞게 수정 필요
# 또는 Cloudflare Workers에서 직접 실행

# 임시 방법: 로컬 DB를 시딩 후 SQL 추출
npm run db:seed

# D1 Studio에서 SQL 복사 후 프로덕션에 실행
# 또는 wrangler d1 execute 명령 사용
\`\`\`

## 🚀 Cloudflare Pages 배포

### 1. GitHub 저장소 준비

\`\`\`bash
# .gitignore 확인 (민감한 정보 제외)
cat .gitignore

# 확인할 내용:
# .env.local
# .env*.local
# .wrangler/

# Git 커밋 및 푸시
git add .
git commit -m "feat: Ready for production deployment"
git push origin main
\`\`\`

### 2. Cloudflare Pages 프로젝트 생성

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
2. **Workers & Pages** 선택
3. **Create application** 클릭
4. **Pages** 탭 선택
5. **Connect to Git** 클릭
6. GitHub 저장소 선택 및 권한 부여

### 3. 빌드 설정

\`\`\`
Production branch: main
Build command: npm run build
Build output directory: .next
Root directory: /
Framework preset: Next.js
Node.js version: 22.13.1
\`\`\`

### 4. 환경 변수 설정

**Settings** → **Environment variables** 메뉴에서 다음 변수 추가:

#### Production 환경

| 변수명 | 값 | 설명 |
|--------|------|------|
| \`GOOGLE_CLIENT_ID\` | \`your-client-id.apps.googleusercontent.com\` | Google OAuth 클라이언트 ID |
| \`GOOGLE_CLIENT_SECRET\` | \`GOCSPX-...\` | Google OAuth 클라이언트 보안 비밀 |
| \`NEXTAUTH_SECRET\` | \`openssl rand -base64 32\` 결과 | NextAuth 암호화 키 (32자 이상) |
| \`NEXTAUTH_URL\` | \`https://your-project.pages.dev\` | 배포된 URL |
| \`NODE_VERSION\` | \`22.13.1\` | Node.js 버전 |

#### Preview 환경 (선택사항)

- Production과 동일하게 설정
- \`NEXTAUTH_URL\`만 미리보기 URL로 변경

### 5. D1 바인딩 설정

Cloudflare Pages에서 D1 데이터베이스를 연결하려면:

1. **Settings** → **Functions** → **D1 database bindings**
2. **Add binding** 클릭
3. **Variable name**: \`DB\`
4. **D1 database**: \`balance-moim-db-prod\` 선택
5. **Save** 클릭

### 6. 배포 실행

1. **Deployments** 탭에서 **Create deployment** 클릭
2. 또는 GitHub에 푸시하면 자동으로 배포 시작
3. 빌드 로그 확인:
   - ✅ \`Cloning repository...\`
   - ✅ \`Installing dependencies...\`
   - ✅ \`Building application...\`
   - ✅ \`Deploying to Cloudflare's global network...\`
   - ✅ \`Success! Deployed to https://your-project.pages.dev\`

## ✅ 배포 후 확인 사항

### 1. 기본 기능 테스트

- [ ] 홈 페이지 접속
- [ ] Google 로그인 테스트
- [ ] 밸런스 게임 플레이
- [ ] 질문 응답 및 통계 확인
- [ ] 모임 생성 및 초대
- [ ] 태그 필터링
- [ ] 다크모드 전환
- [ ] 모바일/태블릿 반응형 확인

### 2. 데이터베이스 확인

\`\`\`bash
# 프로덕션 DB 확인
npx wrangler d1 execute balance-moim-db-prod --command "SELECT COUNT(*) as count FROM question"

# 출력 예시:
# count: 100 (시딩된 질문 수)
\`\`\`

### 3. Google OAuth 동작 확인

1. 로그인 버튼 클릭
2. Google 계정 선택 화면 표시 확인
3. 권한 동의 후 리디렉션 확인
4. 사용자 세션 유지 확인

### 4. 성능 확인

- [PageSpeed Insights](https://pagespeed.web.dev/)에서 점수 확인
- Lighthouse 감사 실행
- 목표: Performance 90+, Accessibility 95+

## 🔧 커스텀 도메인 설정 (선택사항)

### 1. 도메인 추가

1. Cloudflare Pages 프로젝트 → **Custom domains**
2. **Set up a custom domain** 클릭
3. 소유한 도메인 입력 (예: \`balancemoim.com\`)

### 2. DNS 설정

Cloudflare DNS에 다음 레코드 추가:

\`\`\`
Type: CNAME
Name: @ (또는 원하는 서브도메인)
Target: your-project.pages.dev
Proxy status: Proxied (주황색)
\`\`\`

### 3. SSL/TLS 설정

- Cloudflare가 자동으로 SSL 인증서 발급
- **SSL/TLS** → **Full (strict)** 모드 권장

### 4. 환경 변수 업데이트

\`NEXTAUTH_URL\`을 커스텀 도메인으로 변경:

\`\`\`
NEXTAUTH_URL=https://balancemoim.com
\`\`\`

### 5. Google OAuth 리디렉션 URI 업데이트

Google Cloud Console에서 승인된 리디렉션 URI 추가:

\`\`\`
https://balancemoim.com/api/auth/callback/google
\`\`\`

## 🐛 트러블슈팅

### 문제: 빌드 실패 (Module not found)

**해결책**:
\`\`\`bash
# 의존성 다시 설치
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Update dependencies"
git push
\`\`\`

### 문제: Google 로그인 실패 (Redirect URI mismatch)

**해결책**:
1. Google Cloud Console에서 리디렉션 URI 확인
2. Cloudflare Pages URL과 정확히 일치하는지 확인
3. \`/api/auth/callback/google\` 경로 포함 확인

### 문제: 데이터베이스 연결 오류

**해결책**:
\`\`\`bash
# D1 바인딩 확인
npx wrangler pages deployment list --project-name=your-project

# D1 데이터베이스 목록 확인
npx wrangler d1 list
\`\`\`

### 문제: 환경 변수 적용 안 됨

**해결책**:
1. Cloudflare Pages 대시보드에서 환경 변수 확인
2. 변수 이름 오타 확인
3. **Save** 후 재배포 필요
4. **Deployments** → **Retry deployment**

### 문제: 빌드 시간 초과

**해결책**:
\`\`\`json
// next.config.ts에 추가
experimental: {
  workerThreads: false,
  cpus: 1
}
\`\`\`

## 📊 모니터링 및 유지보수

### 1. 배포 로그 확인

- Cloudflare Pages 대시보드 → **Deployments** → 해당 배포 클릭
- 실시간 빌드 로그 확인

### 2. 에러 추적

- Cloudflare Workers Analytics 활용
- 또는 Sentry 등 외부 모니터링 도구 연동

### 3. 정기 업데이트

\`\`\`bash
# 의존성 업데이트 확인
npm outdated

# 보안 취약점 확인
npm audit

# 자동 수정
npm audit fix
\`\`\`

### 4. 데이터베이스 백업

\`\`\`bash
# 프로덕션 DB 백업 (SQL 덤프)
npx wrangler d1 export balance-moim-db-prod --output=backup.sql

# 백업 파일을 안전한 위치에 보관
\`\`\`

## 🎉 배포 완료!

축하합니다! 이제 **밸런스 모임**이 전 세계에 배포되었습니다.

- 🌐 프로덕션 URL: https://your-project.pages.dev
- 📊 Analytics: Cloudflare Dashboard
- 🔒 Security: SSL/TLS 자동 적용

---

**문제가 발생하면 GitHub Issues에 등록하거나 개발 팀에 문의하세요!**

