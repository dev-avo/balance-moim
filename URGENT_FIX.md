# 긴급 수정 - 흰 화면 문제 해결

## 문제 원인

에러 메시지를 보면:
- `/js/pages/services/api.js` - 잘못된 경로!
- 실제로는 `/js/services/api.js`여야 함

**원인:** `_redirects` 파일이 모든 경로를 `index.html`로 리다이렉트하고 있어서, JavaScript 파일 요청도 HTML로 반환되고 있습니다.

## 즉시 해결 방법

### 1. _redirects 파일을 루트에 배치

Cloudflare Pages는 루트의 `_redirects` 파일을 우선적으로 인식합니다.

**현재 상태:**
- ✅ `_redirects` (루트) - 있음
- ✅ `public/_redirects` - 있음

### 2. index.html에 base 태그 추가

`index.html`에 `<base href="/">`를 추가했습니다. 이렇게 하면 상대 경로가 올바르게 해석됩니다.

### 3. _redirects 파일 단순화

Cloudflare Pages는 정적 파일을 자동으로 인식해야 합니다. 하지만 확실하게 하기 위해:

**옵션 A: 현재 방식 (단순화)**
```
/*    /index.html   200
```

**옵션 B: 명시적 제외 (시도해볼 수 있음)**
```
/js/*    200
/css/*   200
/public/* 200
/*.js    200
/*.css   200
/*    /index.html   200
```

## 적용 방법

### 1단계: 변경사항 커밋

```bash
git add .
git commit -m "Fix: Add base tag and ensure _redirects works"
git push origin main
```

### 2단계: 재배포 대기

자동 재배포 (1-2분)

### 3단계: 확인

1. **파일 직접 접근:**
   - `https://balance-moim.pages.dev/js/main.js`
   - JavaScript 코드가 보여야 함

2. **홈 페이지:**
   - `https://balance-moim.pages.dev/`
   - 정상 작동해야 함

## 만약 여전히 문제가 있다면

### 대안: _redirects 파일 내용 변경

`public/_redirects` 파일을 다음과 같이 변경:

```
/js/*    /js/*    200
/css/*   /css/*   200
/public/* /public/* 200
/*.js    /*.js    200
/*.css   /*.css   200
/*       /index.html 200
```

**주의:** 이 방법은 Cloudflare Pages의 `:splat` 문법을 사용하지 않습니다. 대신 명시적으로 정적 파일 경로를 지정합니다.

## Functions 관련

**현재는 Functions가 필요 없습니다!**

나중에 API가 필요하면:
- `functions/` 디렉토리 생성
- 기존 Next.js API를 Functions로 변환
