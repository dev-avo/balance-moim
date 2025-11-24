# Cloudflare Pages 호환 Google OAuth 구현

## 개요

NextAuth 대신 Cloudflare Pages Functions에 최적화된 직접 Google OAuth 구현으로 변경했습니다.

## 구현된 기능

### 1. JWT 토큰 관리 (`lib/auth/jwt.ts`)
- `createJWT()` - JWT 토큰 생성 (HMAC-SHA256)
- `verifyJWT()` - JWT 토큰 검증 및 만료 확인
- Web Crypto API 사용 (Cloudflare Pages 환경 호환)

### 2. Google OAuth 로그인 (`functions/api/auth/signin/google.ts`)
- Google OAuth 인증 페이지로 리다이렉트
- CSRF 보호를 위한 state 생성 및 쿠키 저장
- OAuth 인증 URL 생성

### 3. Google OAuth 콜백 (`functions/api/auth/callback/google/onRequest.ts`)
- Google OAuth 코드를 access token으로 교환
- Google API로 사용자 정보 가져오기
- DB에 사용자 정보 저장/업데이트
- JWT 토큰 생성 및 세션 쿠키 설정
- 로그인 후 리다이렉트

### 4. 세션 확인 (`functions/api/auth/session.ts`)
- 세션 쿠키에서 JWT 토큰 읽기
- JWT 토큰 검증
- 사용자 정보 반환

### 5. 로그아웃 (`functions/api/auth/signout/onRequest.ts`)
- 세션 쿠키 삭제

### 6. 세션 유틸리티 (`lib/auth/session.ts`)
- `getCurrentUser()` - Request에서 현재 사용자 정보 가져오기
- `isAuthenticated()` - 로그인 여부 확인

## 로그인 플로우

1. 사용자가 "로그인" 버튼 클릭
2. `/api/auth/signin/google`로 리다이렉트
3. Google OAuth 인증 페이지로 이동 (state 쿠키 저장)
4. 사용자가 Google 로그인 완료
5. `/api/auth/callback/google?code=xxx&state=xxx`로 콜백
6. state 검증 (CSRF 보호)
7. Google OAuth 코드를 access token으로 교환
8. Google API로 사용자 정보 가져오기
9. DB에 사용자 정보 저장/업데이트
10. JWT 토큰 생성 및 세션 쿠키 설정
11. `/home.html`로 리다이렉트

## 세션 관리

- **JWT 토큰**: 사용자 정보를 포함한 JWT 토큰 생성
- **쿠키**: `session` 쿠키에 JWT 토큰 저장
  - `HttpOnly`: JavaScript에서 접근 불가 (XSS 보호)
  - `Secure`: HTTPS에서만 전송
  - `SameSite=Lax`: CSRF 보호
  - `Max-Age`: 30일

## 환경 변수

다음 환경 변수가 필요합니다:
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `NEXTAUTH_SECRET`: JWT 서명용 시크릿 (기존과 동일)
- `NEXTAUTH_URL`: 애플리케이션 URL (기존과 동일)

## 장점

1. **Cloudflare Pages 최적화**: NextAuth 의존성 제거
2. **간단한 구조**: 직접 구현으로 이해하기 쉬움
3. **안정성**: Cloudflare Pages Functions 환경에 최적화
4. **보안**: CSRF 보호 (state), JWT 토큰 검증, HttpOnly 쿠키

## 변경된 파일

### 새로 생성된 파일
- `lib/auth/jwt.ts` - JWT 토큰 생성/검증
- `lib/auth/session.ts` - 세션 관리 유틸리티 (수정)

### 수정된 파일
- `functions/api/auth/signin/google.ts` - 직접 OAuth 구현
- `functions/api/auth/callback/google/onRequest.ts` - 직접 콜백 처리
- `functions/api/auth/session.ts` - JWT 기반 세션 확인
- `functions/api/auth/signout/onRequest.ts` - 쿠키 삭제
- 모든 Functions 파일의 `getCurrentUser()` 호출 업데이트

### 제거 가능한 파일 (선택 사항)
- `auth.ts` - NextAuth 설정 파일 (더 이상 사용하지 않음)

## 다음 단계

1. **변경사항 커밋 및 푸시**
2. **Cloudflare Pages 자동 재배포 대기**
3. **테스트**:
   - `/api/auth/signin/google` 정상 작동 확인
   - `/api/auth/callback/google` 정상 작동 확인
   - `/api/auth/session` 정상 작동 확인
   - `/api/auth/signout` 정상 작동 확인
   - 구글 로그인 전체 플로우 테스트
