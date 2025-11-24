# Cloudflare Pages Git 자동 배포 가이드 (D1 사용)

이 가이드는 Cloudflare Pages에서 Git 저장소를 연결하여 자동 배포를 설정하는 방법을 설명합니다.

## 📋 사전 준비

### 1. GitHub 저장소 준비
- [ ] 코드가 GitHub 저장소에 푸시되어 있어야 합니다
- [ ] `master` 또는 `main` 브랜치가 있어야 합니다

### 2. Cloudflare D1 데이터베이스 생성
- [ ] Cloudflare Dashboard에서 D1 데이터베이스 생성 완료
- [ ] 데이터베이스 이름 확인 (예: `balance-moim-db-prod`)
- [ ] 데이터베이스 ID 확인 (선택사항)

## 🚀 Cloudflare Pages 프로젝트 생성 및 Git 연결

### Step 1: Cloudflare Dashboard 접속

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
2. 로그인

### Step 2: Pages 프로젝트 생성

1. 왼쪽 사이드바에서 **Workers & Pages** 클릭
2. **Create application** 버튼 클릭
3. **Pages** 탭 선택
4. **Connect to Git** 버튼 클릭

### Step 3: GitHub 저장소 연결

1. **GitHub** 선택
2. GitHub 계정으로 로그인 (권한 요청 시 승인)
3. 저장소 목록에서 프로젝트 저장소 선택 (예: `vibe`)
4. **Begin setup** 클릭

### Step 4: 빌드 설정

**중요**: SPA 프로젝트이므로 빌드가 필요 없습니다.

다음 설정을 입력하세요:

| 항목 | 값 |
|------|------|
| **Project name** | `balance-moim` (또는 원하는 이름) |
| **Production branch** | `master` (또는 `main`) |
| **Framework preset** | `None` 또는 비워두기 |
| **Build command** | (비워두기) |
| **Build output directory** | `/` (루트 디렉토리) |
| **Root directory** | `/` (기본값) |

**⚠️ 중요**: 
- Framework preset을 **반드시 `None`으로 선택**하거나 비워두세요
- Build command는 **비워두세요** (빌드 불필요)
- Build output directory는 **`/` (루트)**로 설정

### Step 5: 프로젝트 생성 완료

1. **Save and Deploy** 클릭
2. 첫 배포가 시작됩니다 (약 1-2분 소요)
3. 배포 완료 후 **배포 URL 확인**:
   - 예: `https://balance-moim-xxxxx.pages.dev`

## ⚙️ D1 데이터베이스 바인딩 설정

### Step 1: Functions 설정 열기

1. 프로젝트 대시보드에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Functions** 클릭
3. **D1 database bindings** 섹션 찾기

### Step 2: D1 바인딩 추가

1. **Add binding** 버튼 클릭
2. 다음 정보 입력:
   - **Variable name**: `DB` (반드시 `DB`여야 함)
   - **D1 database**: 생성한 데이터베이스 선택 (예: `balance-moim-db-prod`)
3. **Save** 클릭

**중요**: Variable name은 반드시 `DB`여야 합니다. (코드에서 `DB`로 참조)

### Step 3: 마이그레이션 실행

로컬에서 프로덕션 데이터베이스에 마이그레이션을 적용합니다:

```bash
# 프로덕션 데이터베이스에 마이그레이션 적용
npm run db:migrate:prod
```

또는 Wrangler CLI 직접 사용:

```bash
wrangler d1 migrations apply balance-moim-db-prod --remote
```

## 🔐 환경 변수 설정

### Step 1: 환경 변수 메뉴 열기

1. 프로젝트 대시보드에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment variables** 클릭

### Step 2: 환경 변수 추가

**Production** 환경에 다음 변수들을 추가하세요:

| 변수명 | 값 | 설명 |
|--------|------|------|
| `GOOGLE_CLIENT_ID` | `your_google_client_id` | Google OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | `your_google_client_secret` | Google OAuth 클라이언트 Secret |
| `NEXTAUTH_SECRET` | `your_nextauth_secret` | NextAuth 암호화 키 (32자 이상) |
| `NEXTAUTH_URL` | `https://your-project.pages.dev` | **배포된 URL** (위에서 확인한 URL) |

**추가 방법:**
1. **Add variable** 버튼 클릭
2. **Variable name** 입력
3. **Value** 입력
4. **Save** 클릭
5. 각 변수마다 반복

**NEXTAUTH_SECRET 생성 방법:**

```bash
# 터미널에서 실행
openssl rand -base64 32
```

### Step 3: Preview 환경 변수 (선택사항)

Preview 환경에도 동일한 변수를 추가할 수 있습니다:
- **Environment** 드롭다운에서 **Preview** 선택
- 동일한 변수 추가 (NEXTAUTH_URL은 Preview URL로 변경)

## 🔄 자동 배포 확인

### Git 푸시 시 자동 배포

이제 GitHub에 코드를 푸시하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "Update code"
git push origin master
```

### 배포 상태 확인

1. Cloudflare Dashboard → 프로젝트 선택
2. **Deployments** 탭에서 배포 상태 확인
3. 최신 배포의 상태 확인:
   - ✅ **Success** (성공)
   - ⏳ **Building** (빌드 중)
   - ❌ **Failed** (실패)

### 배포 로그 확인

배포가 실패한 경우:
1. **Deployments** 탭에서 실패한 배포 클릭
2. 빌드 로그 확인
3. 에러 메시지 확인 후 수정
4. **Retry deployment** 클릭 또는 새 커밋 푸시

## ✅ 확인 사항

배포 완료 후 다음을 확인하세요:

- [ ] 배포 URL 접속 가능
- [ ] 홈 페이지 정상 표시 (`/#home`)
- [ ] API 엔드포인트 작동 확인 (`/api/auth/session`)
- [ ] 환경 변수 로드 확인 (브라우저 콘솔 에러 없음)
- [ ] D1 데이터베이스 연결 확인

## 📚 다음 단계

환경 변수 설정이 완료되면:

1. **프로덕션 DB 시딩** (필요한 경우)
2. **Google OAuth 리디렉션 URI 업데이트**
   - Google Cloud Console에서 승인된 리디렉션 URI에 배포 URL 추가
   - 예: `https://your-project.pages.dev/api/auth/callback/google`
3. **전체 기능 테스트**

## 🐛 트러블슈팅

### 문제: 빌드 실패

**증상**: 배포가 실패하고 빌드 로그에 에러가 표시됨

**해결 방법**:
1. 빌드 로그 확인
2. 에러 메시지 확인
3. Framework preset이 `None`인지 확인
4. Build command가 비어있는지 확인

### 문제: 404 에러

**증상**: 배포 URL 접속 시 404 에러

**해결 방법**:
1. `_routes.json` 파일이 루트에 있는지 확인
2. `index.html` 파일이 루트에 있는지 확인
3. Functions 경로가 올바른지 확인 (`/api/*`)

### 문제: API 엔드포인트 작동 안 함

**증상**: `/api/*` 엔드포인트가 404 또는 500 에러

**해결 방법**:
1. `functions/` 디렉토리 구조 확인
2. D1 데이터베이스 바인딩 확인
3. 환경 변수 설정 확인
4. Functions 로그 확인 (Cloudflare Dashboard → Logs)

### 문제: 환경 변수가 로드되지 않음

**증상**: 환경 변수를 사용하는 코드에서 `undefined` 에러

**해결 방법**:
1. Cloudflare Dashboard에서 환경 변수 설정 확인
2. 변수명이 정확한지 확인 (대소문자 구분)
3. 재배포 실행 (환경 변수 추가 후)

## 📖 참고 자료

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Cloudflare Functions 문서](https://developers.cloudflare.com/pages/platform/functions/)
- [D1 데이터베이스 문서](https://developers.cloudflare.com/d1/)
