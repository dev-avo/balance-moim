# 환경 변수 설정 가이드

이 문서는 **밸런스 모임** 프로젝트의 환경 변수를 설정하는 방법을 안내합니다.

## 📋 필요한 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정해야 합니다:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 🔐 1. Google OAuth 설정

### Step 1: Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 새 프로젝트 생성

### Step 2: OAuth 동의 화면 설정
1. **API 및 서비스** → **OAuth 동의 화면**
2. **User Type**: 외부 선택
3. **앱 정보** 입력:
   - 앱 이름: `밸런스 moim`
   - 사용자 지원 이메일: 본인 이메일
   - 앱 로고: (선택사항)
4. **승인된 도메인**:
   - `pages.dev` (Cloudflare Pages)
   - 커스텀 도메인 (있는 경우)
5. **범위** 추가:
   - `email`
   - `profile`
   - `openid`
6. **테스트 사용자** 추가 (개발 중):
   - 본인 Gmail 주소 추가
7. **저장 후 계속**

### Step 3: OAuth 클라이언트 ID 생성
1. **API 및 서비스** → **사용자 인증 정보**
2. **사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
3. **애플리케이션 유형**: 웹 애플리케이션
4. **승인된 JavaScript 원본**:
   ```
   http://localhost:3000
   https://your-project.pages.dev
   ```
5. **승인된 리디렉션 URI**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-project.pages.dev/api/auth/callback/google
   ```
6. **만들기** 클릭
7. **클라이언트 ID**와 **클라이언트 보안 비밀** 복사

### Step 4: .env.local에 추가
```env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

## 🔑 2. NextAuth Secret 생성

### 방법 1: OpenSSL 사용 (Mac/Linux)
```bash
openssl rand -base64 32
```

### 방법 2: Node.js 사용
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 방법 3: 온라인 생성기
- [Vercel Secret Generator](https://generate-secret.vercel.app/32)

### .env.local에 추가
```env
NEXTAUTH_SECRET=생성된_32자_이상_문자열
```

## 🌐 3. NextAuth URL 설정

### 로컬 개발
```env
NEXTAUTH_URL=http://localhost:3000
```

### 프로덕션
```env
NEXTAUTH_URL=https://your-project.pages.dev
# 또는
NEXTAUTH_URL=https://your-custom-domain.com
```

## 📝 .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# 프로젝트 루트에서
touch .env.local
```

그리고 다음 내용을 입력:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_generated_secret_here_minimum_32_characters
NEXTAUTH_URL=http://localhost:3000
```

## ✅ 확인 사항

### 1. 파일 위치 확인
```bash
# 프로젝트 루트에 .env.local 파일이 있는지 확인
ls -la .env.local
```

### 2. .gitignore 확인
`.env.local` 파일이 Git에 커밋되지 않도록 `.gitignore`에 포함되어 있는지 확인:

```bash
cat .gitignore | grep .env.local
```

### 3. 환경 변수 로드 확인
개발 서버를 재시작하여 환경 변수가 로드되는지 확인:

```bash
npm run dev
```

터미널에 에러가 없으면 정상적으로 로드된 것입니다.

## 🚨 주의사항

1. **절대 커밋하지 마세요**
   - `.env.local` 파일은 절대 Git에 커밋하지 마세요
   - `.gitignore`에 이미 포함되어 있습니다

2. **프로덕션 환경 변수**
   - Cloudflare Pages 배포 시 대시보드에서 환경 변수를 별도로 설정해야 합니다
   - `.env.local`은 로컬 개발용입니다

3. **환경 변수 변경 후**
   - 개발 서버를 재시작해야 변경사항이 적용됩니다
   - `Ctrl + C`로 서버 종료 후 `npm run dev` 다시 실행

## 🔧 문제 해결

### 문제: "GOOGLE_CLIENT_ID is not defined"
**해결책**: `.env.local` 파일이 프로젝트 루트에 있는지 확인하고, 변수명이 정확한지 확인하세요.

### 문제: "NEXTAUTH_SECRET must be at least 32 characters"
**해결책**: `NEXTAUTH_SECRET`이 32자 이상인지 확인하세요.

### 문제: Google 로그인 실패 (Redirect URI mismatch)
**해결책**: Google Cloud Console에서 승인된 리디렉션 URI가 정확히 일치하는지 확인하세요.

## 📚 참고 자료

- [NextAuth.js 환경 변수](https://next-auth.js.org/configuration/options#environment-variables)
- [Google OAuth 설정 가이드](https://developers.google.com/identity/protocols/oauth2)
- [Cloudflare Pages 환경 변수](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)

---

**환경 변수 설정이 완료되면 `npm run dev`로 개발 서버를 시작하세요!** 🚀

