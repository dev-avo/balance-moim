# 에러 메시지 이해하기

## 에러 내용

```
Failed to load module script: Expected a JavaScript-or-Wasm module script 
but the server responded with a MIME type of "text/html". 
Strict MIME type checking is enforced for module scripts per HTML spec.
```

## 의미

이 에러는 **JavaScript 파일을 요청했는데, 서버가 HTML을 반환했다**는 의미입니다.

### 정상적인 경우:
- 브라우저: `/js/main.js` 파일 요청
- 서버: JavaScript 코드 반환 (MIME type: `application/javascript`)
- 브라우저: ✅ 정상 로드

### 문제가 있는 경우:
- 브라우저: `/js/main.js` 파일 요청
- 서버: `index.html` 반환 (MIME type: `text/html`)
- 브라우저: ❌ 에러 발생 (JavaScript가 아닌 HTML을 받았으므로)

## 왜 이런 일이 발생하나?

### 원인 1: _redirects 파일이 모든 경로를 리다이렉트

`_redirects` 파일에 다음과 같은 규칙이 있으면:

```
/*    /index.html   200
```

이것은 **모든 경로**를 `index.html`로 리다이렉트합니다. 따라서:
- `/js/main.js` 요청 → `index.html` 반환 ❌
- `/css/style.css` 요청 → `index.html` 반환 ❌

### 원인 2: 파일이 실제로 배포되지 않음

파일이 Git에 커밋되지 않았거나 배포되지 않았을 수 있습니다.

## 해결 방법

### 해결책 1: _redirects 파일 단순화 (시도 중)

Cloudflare Pages는 정적 파일을 자동으로 인식합니다. 따라서 `_redirects` 파일을 단순화했습니다:

```
/*    /index.html   200
```

이렇게 하면:
- Cloudflare Pages가 자동으로 정적 파일(css, js 등)을 인식하여 서빙
- 나머지 경로만 `index.html`로 리다이렉트

### 해결책 2: _routes.json으로 정적 파일 제외

`_routes.json` 파일을 사용하여 정적 파일을 Functions에서 제외했습니다.

### 해결책 3: 파일 경로 확인

만약 여전히 문제가 있다면:
1. 파일이 실제로 배포되었는지 확인
2. 파일 경로가 올바른지 확인

## 확인 방법

### 1. 파일 직접 접근

브라우저에서 직접 접속:
- `https://balance-moim.pages.dev/js/main.js`
  - ✅ JavaScript 코드가 보임 → 파일은 있지만 리다이렉트 문제
  - ❌ 404 또는 HTML → 파일이 배포되지 않음

### 2. Network 탭 확인

1. F12 → Network 탭
2. 페이지 새로고침
3. `main.js` 파일 클릭
4. **Response** 탭 확인:
   - ✅ JavaScript 코드 → 정상
   - ❌ HTML 코드 → 리다이렉트 문제

## 다음 단계

1. **변경사항 커밋 및 푸시**
2. **재배포 대기**
3. **파일 직접 접근 테스트**
4. **결과에 따라 추가 조치**
