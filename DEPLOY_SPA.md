# Cloudflare Pages 배포 가이드 (SPA 버전)

바닐라 JavaScript SPA를 Cloudflare Pages에 배포하는 방법입니다.

## 1. Cloudflare Pages 프로젝트 생성

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. **Pages** 메뉴 선택
3. **Create a project** 클릭
4. **Connect to Git** 또는 **Upload assets** 선택

## 2. 빌드 설정

### Git 연동 시

**Build settings:**
- **Framework preset**: `None` (또는 비워두기)
- **Build command**: (비워두기 - 빌드 불필요)
- **Build output directory**: `/` (루트 디렉토리)
- **Root directory**: (프로젝트 루트, 보통 비워두기)

### 수동 업로드 시

1. 프로젝트 루트의 모든 파일을 압축
2. Cloudflare Pages에서 **Upload assets** 선택
3. 압축 파일 업로드

## 3. 환경 변수 설정

**Settings > Environment variables**에서 다음 변수들을 설정:

### Production 환경

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.pages.dev
```

### Preview 환경 (선택사항)

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-branch.pages.dev
```

**참고:**
- `NEXTAUTH_SECRET`: 랜덤 문자열 생성 (예: `openssl rand -base64 32`)
- `NEXTAUTH_URL`: 배포된 도메인 URL

## 4. D1 데이터베이스 설정

### 데이터베이스 생성

1. **Workers & Pages > D1** 메뉴로 이동
2. **Create database** 클릭
3. 데이터베이스 이름 입력 (예: `balance-moim-db-prod`)
4. **Create** 클릭

### 데이터베이스 바인딩

1. Pages 프로젝트의 **Settings > Functions**로 이동
2. **D1 database bindings** 섹션에서:
   - **Variable name**: `DB`
   - **D1 database**: 생성한 데이터베이스 선택
   - **Save** 클릭

### 마이그레이션 실행

로컬에서 마이그레이션 실행:

```bash
# 프로덕션 데이터베이스에 마이그레이션 적용
npm run db:migrate:prod
```

또는 Wrangler CLI 사용:

```bash
wrangler d1 migrations apply balance-moim-db-prod --remote
```

## 5. Functions 디렉토리 구조

기존 Next.js API 라우트를 Cloudflare Pages Functions로 변환해야 합니다.

### Functions 디렉토리 구조

```
functions/
├── api/
│   ├── auth/
│   │   └── [...nextauth].js
│   ├── groups/
│   │   ├── [groupId].js
│   │   ├── my.js
│   │   └── ...
│   ├── questions/
│   │   ├── [questionId].js
│   │   ├── random.js
│   │   └── ...
│   └── ...
```

### Functions 예시 (auth)

`functions/api/auth/[...nextauth].js`:

```javascript
import { handlers } from '../../../../auth';

export const onRequest = handlers;
```

**참고:** 기존 Next.js API 라우트를 Functions로 변환하는 작업이 필요합니다.

## 6. SPA 라우팅 설정

### `_redirects` 파일 생성

프로젝트 루트에 `public/_redirects` 파일 생성 (또는 `_redirects` 파일):

```
/*    /index.html   200
```

또는 `wrangler.toml`에 추가:

```toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### `_headers` 파일 생성 (선택사항)

`public/_headers` 파일:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

## 7. 커스텀 도메인 설정

1. Pages 프로젝트의 **Custom domains** 섹션으로 이동
2. **Set up a custom domain** 클릭
3. 도메인 입력 및 DNS 설정 안내 따르기

## 8. 배포 확인 사항

### 체크리스트

- [ ] 환경 변수 설정 완료
- [ ] D1 데이터베이스 바인딩 완료
- [ ] 마이그레이션 실행 완료
- [ ] Functions 디렉토리 구조 확인
- [ ] SPA 리다이렉트 설정 완료
- [ ] 커스텀 도메인 설정 (선택)

### 테스트

1. **홈 페이지**: `https://your-domain.pages.dev/#home`
2. **로그인**: Google 로그인 버튼 클릭
3. **API 엔드포인트**: `/api/users/me` 등 테스트
4. **라우팅**: 해시 라우팅이 정상 작동하는지 확인

## 9. 트러블슈팅

### 404 오류 발생 시

- `_redirects` 파일이 루트에 있는지 확인
- Functions 경로가 올바른지 확인

### API 오류 발생 시

- Functions 디렉토리 구조 확인
- D1 데이터베이스 바인딩 확인
- 환경 변수 설정 확인

### 로그인 오류 발생 시

- `NEXTAUTH_URL`이 올바른지 확인
- `NEXTAUTH_SECRET`이 설정되어 있는지 확인
- Google OAuth 설정 확인

## 10. 추가 최적화

### 캐싱 설정

`_headers` 파일에 추가:

```
/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

### 압축 설정

Cloudflare Pages는 자동으로 압축을 처리합니다.

## 참고 자료

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Cloudflare Functions 문서](https://developers.cloudflare.com/pages/platform/functions/)
- [D1 데이터베이스 문서](https://developers.cloudflare.com/d1/)
