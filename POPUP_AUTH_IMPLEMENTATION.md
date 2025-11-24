# 팝업 방식 구글 로그인 구현 완료

## 구현 내용

### 1. 클라이언트 사이드 (`js/utils/auth.js`)

`signInWithGoogle()` 함수를 팝업 방식으로 수정했습니다:

- 팝업 창으로 로그인 페이지 열기
- `postMessage` API를 사용하여 팝업과 부모 창 간 통신
- 로그인 성공 시 페이지 새로고침하여 세션 정보 업데이트
- 팝업 차단 시 기존 리다이렉트 방식으로 폴백

### 2. 콜백 처리 (`functions/api/auth/callback/google/onRequest.ts`)

- 팝업 모드 감지 (URL 파라미터 및 Referer 헤더 확인)
- 성공 시 `/auth/callback-success` 페이지로 리다이렉트
- 실패 시 `/auth/callback-error` 페이지로 리다이렉트

### 3. 성공/에러 페이지

- `auth/callback-success.html`: 로그인 성공 시 부모 창에 메시지 전송
- `auth/callback-error.html`: 로그인 실패 시 에러 표시

## 사용 방법

기존 코드에서 `signInWithGoogle()` 함수를 호출하면 자동으로 팝업 방식으로 작동합니다:

```javascript
import { signInWithGoogle } from '/js/utils/auth.js';

// 버튼 클릭 시
button.addEventListener('click', () => {
    signInWithGoogle();
});
```

## 작동 방식

1. 사용자가 "구글 로그인" 버튼 클릭
2. 팝업 창이 열리고 `/api/auth/signin/google?popup=true`로 이동
3. Google OAuth 인증 진행
4. 인증 완료 후 `/api/auth/callback/google`로 콜백
5. 콜백에서 팝업 모드 감지 후 `/auth/callback-success`로 리다이렉트
6. 성공 페이지에서 부모 창에 `GOOGLE_AUTH_SUCCESS` 메시지 전송
7. 부모 창에서 메시지 수신 후 페이지 새로고침

## 보안 고려사항

- `postMessage`에서 `origin` 확인하여 CSRF 공격 방지
- 팝업 차단 시 자동으로 리다이렉트 방식으로 폴백
- NextAuth의 기본 보안 기능 유지

## 장점

- ✅ SPA 경험 유지 (페이지 리다이렉트 없음)
- ✅ 로그인 중에도 원래 페이지 상태 유지
- ✅ 사용자 경험 향상
- ✅ 기존 코드와 호환 (함수 시그니처 동일)

## 주의사항

- 팝업이 차단된 경우 자동으로 리다이렉트 방식으로 전환됩니다
- 브라우저 팝업 차단 설정에 따라 팝업이 열리지 않을 수 있습니다
- 모바일 브라우저에서는 팝업 동작이 다를 수 있습니다

## 테스트 방법

1. 로그인 버튼 클릭
2. 팝업 창이 열리는지 확인
3. Google 로그인 진행
4. 로그인 성공 후 팝업이 자동으로 닫히는지 확인
5. 부모 창이 새로고침되어 로그인 상태가 반영되는지 확인
