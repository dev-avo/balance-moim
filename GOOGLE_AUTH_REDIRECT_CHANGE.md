# 구글 로그인 팝업 방식 → 일반 리다이렉트 방식 변경

## 변경 사항

### 1. 클라이언트 사이드 (`js/utils/auth.js`)
- ✅ 팝업 방식 제거
- ✅ 일반 리다이렉트 방식으로 변경
- ✅ `signInWithGoogle()` 함수 간소화

**변경 전 (팝업 방식)**:
```javascript
export function signInWithGoogle() {
    const popup = window.open('/api/auth/signin/google?popup=true', ...);
    // 팝업 메시지 리스너 등록
    // 복잡한 팝업 처리 로직
}
```

**변경 후 (일반 리다이렉트)**:
```javascript
export function signInWithGoogle() {
    const currentUrl = window.location.href;
    localStorage.setItem('auth_callback_url', currentUrl);
    window.location.href = '/api/auth/signin/google';
}
```

### 2. 서버 사이드 (`functions/api/auth/callback/google/onRequest.ts`)
- ✅ 팝업 모드 감지 로직 제거
- ✅ 팝업 전용 리다이렉트 제거
- ✅ NextAuth 기본 리다이렉트 사용

**변경 전**:
- `popup=true` 파라미터 확인
- Referer 헤더에서 popup 파라미터 확인
- 팝업 모드일 경우 `/auth/callback-success`로 리다이렉트

**변경 후**:
- 팝업 관련 로직 완전 제거
- NextAuth가 설정한 기본 리다이렉트 사용

### 3. Cloudflare 설정

#### `_redirects` 파일
- ✅ 루트 경로(`/`) → `/home.html` 리다이렉트
- ✅ SPA rewrite 제거

#### `_routes.json` 파일
- ✅ `/api/*` 경로만 Functions로 처리
- ✅ 정적 파일(HTML, JS, CSS 등)은 Functions 제외

## 로그인 플로우

1. 사용자가 "로그인" 버튼 클릭
2. `signInWithGoogle()` 호출
3. 현재 URL을 `localStorage`에 저장
4. `/api/auth/signin/google`로 리다이렉트
5. Google OAuth 인증 페이지로 이동
6. 사용자가 Google 로그인 완료
7. `/api/auth/callback/google`로 콜백
8. NextAuth가 세션 생성 후 기본 리다이렉트 URL로 이동
9. (선택) 저장된 `auth_callback_url`로 리다이렉트 가능

## 제거된 파일 (선택 사항)

다음 파일들은 더 이상 사용되지 않지만, 삭제하지 않아도 됩니다:
- `auth/callback-success.html` - 팝업 성공 페이지
- `auth/callback-error.html` - 팝업 실패 페이지

## 장점

1. **간단한 구조**: 팝업 관련 복잡한 로직 제거
2. **전통적인 웹 방식**: 일반적인 OAuth 리다이렉트 플로우
3. **브라우저 호환성**: 팝업 차단 문제 없음
4. **유지보수 용이**: 코드가 더 단순하고 이해하기 쉬움
