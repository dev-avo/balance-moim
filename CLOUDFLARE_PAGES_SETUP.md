# Cloudflare Pages 프로젝트 생성 가이드

이 문서는 Cloudflare Pages에 프로젝트를 배포하기 위한 단계별 가이드를 제공합니다.

## 📋 사전 준비 완료 확인

✅ 다음 항목들이 완료되었는지 확인하세요:
- [x] GitHub 저장소에 코드 푸시 완료
- [x] Cloudflare D1 프로덕션 데이터베이스 생성 완료
- [x] 프로덕션 DB 마이그레이션 완료

## 🚀 Cloudflare Pages 프로젝트 생성

### Step 1: Cloudflare Dashboard 접속

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
2. 로그인 (계정이 없으면 회원가입)

### Step 2: Pages 프로젝트 생성

1. 왼쪽 사이드바에서 **Workers & Pages** 클릭
2. **Create application** 버튼 클릭
3. **Pages** 탭 선택
4. **Connect to Git** 버튼 클릭

### Step 3: GitHub 저장소 연결

1. **GitHub** 선택
2. GitHub 계정으로 로그인 (권한 요청 시 승인)
3. 저장소 목록에서 **vibe** (또는 프로젝트 이름) 선택
4. **Begin setup** 클릭

### Step 4: 빌드 설정

다음 설정을 입력하세요:

| 항목 | 값 |
|------|------|
| **Project name** | `balance-moim` (또는 원하는 이름) |
| **Production branch** | `master` |
| **Framework preset** | `Next.js` |
| **Build command** | `npm run build:cloudflare` |
| **Build output directory** | `.open-next` |
| **Root directory** | `/` (기본값) |
| **Node.js version** | `22.13.1` |

**⚠️ 중요**: 
- Framework preset을 **반드시 `Next.js`로 선택**해야 합니다
- Build command는 **반드시 `npm run build`**여야 합니다 (❌ `npx wrangler deploy` 아님)
- `wrangler.toml` 파일이 있어도 Next.js 빌드에는 영향을 주지 않습니다
- `.cloudflareignore` 파일이 `wrangler.toml`을 빌드에서 제외합니다

**빌드 최적화**: 
- 타입 체크와 린트는 빌드 단계에서 제외되어 빌드 시간이 단축됩니다
- 타입 에러와 린트 에러는 로컬에서 확인 후 푸시하세요
- 빌드 타임아웃(20분)을 방지하기 위해 최적화 설정이 적용되어 있습니다

### Step 4-1: Framework preset 설정 방법 (프로젝트 생성 후)

프로젝트를 생성한 후 Framework preset을 설정하려면:

1. Cloudflare Dashboard에서 프로젝트 선택
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Builds & deployments** 클릭
4. **Build configuration** 섹션에서:
   - **Framework preset** 드롭다운에서 **Next.js** 선택
   - **Build command**가 `npm run build`인지 확인
   - **Build output directory**를 **비워두기** (Framework preset이 Next.js이면 자동으로 처리됨)
5. **Save** 버튼 클릭

**참고**: Framework preset을 Next.js로 선택하면 Build command와 Build output directory가 자동으로 설정됩니다.

### Step 4-2: 빌드 명령어가 잘못된 경우 수정 방법

만약 Build command가 `npx wrangler deploy`로 되어 있다면:

1. **Settings** → **Builds & deployments** 이동
2. **Build configuration** 섹션에서:
   - **Framework preset**을 **Next.js**로 변경
   - 또는 **Build command**를 직접 `npm run build`로 수정
3. **Save** 버튼 클릭
4. **Deployments** 탭으로 이동하여 **Retry deployment** 클릭

**Wrangler 에러 발생 시 확인 사항**:
- ✅ Framework preset이 `Next.js`로 설정되어 있는지
- ✅ Build command가 `npm run build`인지 (❌ `npx wrangler deploy` 아님)
- ✅ Build output directory가 `.next`인지

### Step 5: 환경 변수 설정 (나중에)

이 단계는 프로젝트 생성 후 URL을 확인한 다음 진행합니다.

### Step 6: 프로젝트 생성 완료

1. **Save and Deploy** 클릭
2. 첫 배포가 시작됩니다 (약 3-5분 소요)
3. 배포 완료 후 **배포 URL 확인**:
   - 예: `https://balance-moim-xxxxx.pages.dev`
   - 또는 커스텀 도메인

## 📝 배포 URL 확인

프로젝트 생성 후 다음 위치에서 배포 URL을 확인할 수 있습니다:

1. **Deployments** 탭
2. 최신 배포의 **Visit site** 버튼 옆 URL
3. 또는 **Settings** → **Custom domains** 섹션

**예시 URL**: `https://balance-moim-xxxxx.pages.dev`

## ⚙️ D1 데이터베이스 바인딩 설정

### Step 1: Functions 설정 열기

1. 프로젝트 대시보드에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Functions** 클릭
3. **D1 database bindings** 섹션 찾기

### Step 2: D1 바인딩 추가

1. **Add binding** 버튼 클릭
2. 다음 정보 입력:
   - **Variable name**: `DB`
   - **D1 database**: `balance-moim-db-prod` 선택
3. **Save** 클릭

**중요**: Variable name은 반드시 `DB`여야 합니다. (코드에서 `DB`로 참조)

## 🔐 환경 변수 설정

배포 URL을 확인한 후 환경 변수를 설정하세요.

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
| `NEXTAUTH_URL` | `https://balance-moim.shw5326.workers.dev` | **배포된 URL** (위에서 확인한 URL) |
| `NODE_VERSION` | `22.13.1` | Node.js 버전 |

**추가 방법:**
1. **Add variable** 버튼 클릭
2. **Variable name** 입력
3. **Value** 입력
4. **Save** 클릭
5. 각 변수마다 반복

### Step 3: Preview 환경 변수 (선택사항)

Preview 환경에도 동일한 변수를 추가할 수 있습니다:
- **Environment** 드롭다운에서 **Preview** 선택
- 동일한 변수 추가 (NEXTAUTH_URL은 Preview URL로 변경)

## 🔄 재배포

환경 변수를 추가한 후:

1. **Deployments** 탭으로 이동
2. 최신 배포 옆 **Retry deployment** 클릭
3. 또는 GitHub에 새로운 커밋 푸시

## ✅ 확인 사항

배포 완료 후 다음을 확인하세요:

- [ ] 배포 URL 접속 가능
- [ ] 홈 페이지 정상 표시
- [ ] 환경 변수 로드 확인 (브라우저 콘솔 에러 없음)

## 📚 다음 단계

환경 변수 설정이 완료되면:

1. **프로덕션 DB 시딩** (100개 질문 + 20개 태그)
2. **Google OAuth 리디렉션 URI 업데이트**
3. **전체 기능 테스트**

---

## 🐛 트러블슈팅

### 문제: 빌드 명령어가 `npx wrangler deploy`로 되어 있음

**증상**: 
- 빌드 로그에 "If are uploading a directory of assets..." 에러
- Wrangler 관련 에러 메시지

**해결 방법**:
1. Cloudflare Dashboard → 프로젝트 선택
2. **Settings** → **Builds & deployments**
3. **Build configuration** 섹션에서:
   - **Framework preset**을 **Next.js**로 변경
   - **Build command**를 `npm run build`로 수정
   - **Build output directory**를 `.next`로 설정
4. **Save** 클릭
5. **Deployments** 탭에서 **Retry deployment** 클릭

### 문제: Framework preset 설정 위치를 모르겠음

**해결 방법**:
1. Cloudflare Dashboard → 프로젝트 선택
2. **Settings** 탭 클릭 (왼쪽 상단)
3. 왼쪽 메뉴에서 **Builds & deployments** 클릭
4. **Build configuration** 섹션에서 **Framework preset** 드롭다운 찾기
5. **Next.js** 선택 후 **Save**

**참고**: Framework preset을 설정하면 Build command와 Build output directory가 자동으로 설정됩니다.

### 문제: 빌드 실패 (기타)

**해결 방법**:
- Cloudflare Pages 빌드 로그 확인
- `DEPLOYMENT.md`의 트러블슈팅 섹션 참고
- Cloudflare Support에 문의

### 문제: 404 에러 (페이지를 찾을 수 없음)

**증상**: 
- `https://balance-moim.pages.dev` 접속 시 404 에러
- "HTTP ERROR 404" 메시지

**원인**:
- 실제 배포 URL이 다를 수 있음 (Cloudflare Pages는 `프로젝트명-랜덤문자열.pages.dev` 형식 사용)
- 배포가 실패했을 수 있음
- 커스텀 도메인 설정이 잘못되었을 수 있음

**해결 방법**:
1. **실제 배포 URL 확인**:
   - Cloudflare Dashboard → 프로젝트 선택
   - **Deployments** 탭 클릭
   - 최신 배포의 **Visit site** 버튼 옆 URL 확인
   - 예: `https://balance-moim-abc123.pages.dev`

2. **배포 상태 확인**:
   - **Deployments** 탭에서 최신 배포 상태 확인
   - ✅ **Success** (성공)인지 확인
   - ❌ **Failed** (실패)인 경우 빌드 로그 확인

3. **빌드 로그 확인**:
   - 최신 배포 클릭 → 빌드 로그 확인
   - 에러 메시지가 있으면 수정 후 재배포

4. **재배포**:
   - 배포가 실패한 경우: **Retry deployment** 클릭
   - 또는 GitHub에 새 커밋 푸시하여 자동 배포 트리거

**참고**: 
- Cloudflare Pages는 프로젝트 생성 시 자동으로 `프로젝트명-랜덤문자열.pages.dev` 형식의 URL을 생성합니다
- `balance-moim.pages.dev`는 커스텀 도메인처럼 보이지만, 실제 배포 URL은 다를 수 있습니다
- Dashboard에서 확인한 실제 URL을 사용하세요

5. **빌드 output directory 확인**:
   - **Settings** → **Builds & deployments** 이동
   - **Build configuration** 섹션에서 **Build output directory** 확인
   - Framework preset이 **Next.js**로 설정되어 있다면, **Build output directory를 비워두는 것**이 권장됩니다
   - **Build output directory**를 **비워두기**로 설정 (Framework preset이 Next.js이면 자동으로 처리됨)
   - **Deployments** 탭에서 **Retry deployment** 클릭

**추가 확인 사항**:
- 빌드 로그에서 `Success: Assets published!` 메시지가 있는지 확인
- 빌드 로그에서 `Route (app)` 섹션에 모든 라우트가 나열되어 있는지 확인
- API 라우트(`ƒ` 표시)와 정적 페이지(`○` 표시)가 모두 빌드되었는지 확인

