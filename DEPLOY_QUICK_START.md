# Cloudflare Pages 배포 빠른 시작 가이드

## 1단계: Git 저장소 준비

```bash
# 현재 변경사항 커밋
git add .
git commit -m "Convert to vanilla JS SPA"
git push origin main
```

## 2단계: Cloudflare Pages 프로젝트 생성

### 방법 A: Git 연동 (권장)

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. **Create a project** → **Connect to Git**
3. GitHub/GitLab 저장소 선택
4. **Configure build**:
   - **Framework preset**: `None`
   - **Build command**: (비워두기)
   - **Build output directory**: `/`
   - **Root directory**: (비워두기)

### 방법 B: 수동 업로드

```bash
# 프로젝트 압축 (필요한 파일만)
zip -r deploy.zip index.html css/ js/ public/ functions/ -x "*.git*" "node_modules/*"
```

1. Cloudflare Pages → **Create a project** → **Upload assets**
2. `deploy.zip` 업로드

## 3단계: 환경 변수 설정

**Settings > Environment variables** → **Add variable**:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `GOOGLE_CLIENT_ID` | `your_client_id` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | `your_client_secret` | Google OAuth Client Secret |
| `NEXTAUTH_SECRET` | `랜덤_문자열` | NextAuth 시크릿 (32자 이상) |
| `NEXTAUTH_URL` | `https://your-app.pages.dev` | 배포된 도메인 URL |

**NEXTAUTH_SECRET 생성:**
```bash
openssl rand -base64 32
```

## 4단계: D1 데이터베이스 설정

### 데이터베이스 생성

```bash
# Wrangler CLI로 생성 (또는 대시보드에서)
wrangler d1 create balance-moim-db-prod
```

### 데이터베이스 바인딩

**Pages 프로젝트 > Settings > Functions > D1 database bindings:**

- **Variable name**: `DB`
- **D1 database**: `balance-moim-db-prod` 선택
- **Save**

### 마이그레이션 실행

```bash
# 프로덕션 데이터베이스에 마이그레이션 적용
wrangler d1 migrations apply balance-moim-db-prod --remote
```

## 5단계: 배포 확인

1. **Deployments** 탭에서 배포 상태 확인
2. 배포 완료 후 URL 접속: `https://your-app.pages.dev`
3. 테스트:
   - `/#home` - 홈 페이지
   - `/#play` - 게임 플레이
   - Google 로그인 테스트

## 6단계: 커스텀 도메인 설정 (선택)

1. **Custom domains** → **Set up a custom domain**
2. 도메인 입력
3. DNS 설정 안내 따르기

## 체크리스트

배포 전 확인:

- [ ] `public/_redirects` 파일 존재 (SPA 라우팅)
- [ ] `public/_headers` 파일 존재 (보안 헤더)
- [ ] 환경 변수 모두 설정
- [ ] D1 데이터베이스 바인딩 완료
- [ ] 마이그레이션 실행 완료
- [ ] Functions 디렉토리 구조 확인 (기존 API 유지)

## 트러블슈팅

### 404 오류

- `public/_redirects` 파일 확인
- Functions 경로 확인

### 로그인 안 됨

- `NEXTAUTH_URL` 확인 (도메인과 일치해야 함)
- Google OAuth 설정 확인

### API 오류

- Functions 디렉토리 구조 확인
- D1 데이터베이스 바인딩 확인

## 추가 참고

자세한 내용은 `DEPLOY_SPA.md` 파일을 참고하세요.
