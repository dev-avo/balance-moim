# SPA 방식 구글 로그인 가이드

현재 프로젝트에서 구글 로그인을 SPA 방식으로 구현하는 방법과 개선 방안을 설명합니다.

## 현재 구현 상태

### 현재 방식: 서버 사이드 리다이렉트

현재 프로젝트는 NextAuth를 사용하여 구글 로그인을 구현하고 있으며, 다음과 같은 방식으로 작동합니다:

1. 사용자가 "구글 로그인" 버튼 클릭
2. `window.location.href = '/api/auth/signin/google'`로 서버로 이동
3. 서버에서 Google OAuth 페이지로 리다이렉트
4. Google 인증 완료 후 콜백 URL로 리다이렉트
5. 서버에서 세션 쿠키 설정 후 원래 페이지로 리다이렉트

**장점**:
- ✅ 구현이 간단함
- ✅ NextAuth의 표준 방식
- ✅ 보안이 강함 (서버 사이드 처리)

**단점**:
- ❌ 페이지 전체가 리다이렉트되어 SPA 경험이 깨짐
- ❌ 로그인 중에 페이지 상태가 초기화됨

## SPA 방식 개선 방안

### 방법 1: 팝업 창 사용 (권장)

팝업 창을 사용하여 로그인을 처리하면 SPA 경험을 유지할 수 있습니다.

#### 구현 방법

`js/utils/auth.js` 파일을 수정:

```javascript
/**
 * Google 로그인 (팝업 방식)
 */
export function signInWithGoogle() {
    // 현재 URL을 callback으로 저장
    const currentUrl = window.location.href;
    localStorage.setItem('auth_callback_url', currentUrl);
    
    // 팝업 창 열기
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
        '/api/auth/signin/google',
        'google-login',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
    
    // 팝업 창에서 메시지 수신 대기
    const messageListener = (event) => {
        // 보안을 위해 origin 확인
        if (event.origin !== window.location.origin) {
            return;
        }
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            // 팝업 닫기
            popup.close();
            window.removeEventListener('message', messageListener);
            
            // 페이지 새로고침하여 세션 정보 업데이트
            window.location.reload();
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
            // 에러 처리
            popup.close();
            window.removeEventListener('message', messageListener);
            console.error('Google 로그인 실패:', event.data.error);
        }
    };
    
    window.addEventListener('message', messageListener);
    
    // 팝업이 닫혔는지 확인 (사용자가 수동으로 닫은 경우)
    const checkClosed = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
        }
    }, 1000);
}
```

#### 콜백 페이지 수정

Google OAuth 콜백 후 성공 메시지를 부모 창에 전송하도록 수정이 필요합니다. 하지만 현재는 Cloudflare Pages Functions를 사용하므로, 콜백 후 리다이렉트 페이지를 만들어야 합니다.

**대안**: 콜백 후 특정 페이지로 리다이렉트하고, 그 페이지에서 부모 창에 메시지를 전송하는 방식:

1. 콜백 URL을 `/api/auth/callback/google?popup=true`로 설정
2. 콜백 처리 후 `/auth/callback-success.html`로 리다이렉트
3. `auth/callback-success.html`에서 부모 창에 메시지 전송

### 방법 2: 현재 방식 유지 (간단한 개선)

현재 방식을 유지하되, 로그인 후 원래 페이지로 돌아오도록 개선:

```javascript
/**
 * Google 로그인 (개선된 리다이렉트 방식)
 */
export function signInWithGoogle() {
    // 현재 URL을 callback으로 저장
    const currentUrl = window.location.href;
    localStorage.setItem('auth_callback_url', currentUrl);
    
    // Google 로그인 페이지로 이동
    window.location.href = '/api/auth/signin/google';
}
```

그리고 콜백 후 원래 페이지로 돌아오도록 `functions/api/auth/callback/google/onRequest.ts` 수정:

```typescript
// 콜백 처리 후 원래 페이지로 리다이렉트
const callbackUrl = request.headers.get('referer') || '/#home';
return Response.redirect(callbackUrl);
```

### 방법 3: OAuth 2.0 직접 구현 (고급)

NextAuth를 사용하지 않고 OAuth 2.0을 직접 구현하는 방법입니다. 이 방법은 더 많은 제어가 가능하지만 구현이 복잡합니다.

## 권장 사항

### 현재 프로젝트에 적합한 방식

**방법 1 (팝업 방식)**을 권장합니다:

1. **SPA 경험 유지**: 페이지가 리다이렉트되지 않음
2. **사용자 경험 향상**: 로그인 중에도 원래 페이지 상태 유지
3. **구현 복잡도**: 중간 정도 (팝업 창 관리 필요)

### 구현 단계

1. **팝업 방식 로그인 함수 구현** (`js/utils/auth.js`)
2. **콜백 성공 페이지 생성** (`auth/callback-success.html`)
3. **NextAuth 콜백 수정** (팝업 모드 감지 및 처리)
4. **테스트**: 로그인 플로우 전체 테스트

## 보안 고려사항

### 팝업 방식 보안

1. **Origin 확인**: `postMessage`에서 반드시 origin 확인
2. **CSRF 보호**: NextAuth의 기본 CSRF 보호 유지
3. **쿠키 설정**: `SameSite` 속성 확인 (NextAuth가 자동 처리)

### 리다이렉트 방식 보안

1. **콜백 URL 검증**: 허용된 도메인만 사용
2. **상태 파라미터**: CSRF 토큰 사용 (NextAuth가 자동 처리)

## 현재 코드 분석

### 현재 인증 플로우

```
사용자 클릭
  ↓
signInWithGoogle() 호출
  ↓
window.location.href = '/api/auth/signin/google'
  ↓
functions/api/auth/signin/google.ts 실행
  ↓
NextAuth handlers.GET 호출
  ↓
Google OAuth 페이지로 리다이렉트
  ↓
Google 인증 완료
  ↓
/api/auth/callback/google 호출
  ↓
functions/api/auth/callback/google/onRequest.ts 실행
  ↓
NextAuth 콜백 처리
  ↓
세션 쿠키 설정
  ↓
원래 페이지로 리다이렉트 (현재는 홈으로)
```

### 개선 포인트

1. **콜백 후 원래 페이지로 돌아가기**: `localStorage`에 저장한 URL 사용
2. **팝업 방식 추가**: SPA 경험 향상
3. **에러 처리 개선**: 로그인 실패 시 사용자에게 알림

## 결론

**질문: 구글 로그인을 SPA 방식으로 할 수 있나요?**

**답변: 네, 가능합니다!**

현재 구현은 이미 SPA에서 작동하지만, 페이지 리다이렉트가 발생합니다. 팝업 방식을 사용하면 완전한 SPA 경험을 제공할 수 있습니다.

**권장 사항**:
- 현재 방식 유지 + 콜백 후 원래 페이지로 돌아가기 (간단)
- 또는 팝업 방식 구현 (더 나은 UX)

둘 다 구현 가능하며, 프로젝트 요구사항에 따라 선택하시면 됩니다.
