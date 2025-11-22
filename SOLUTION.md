# 흰 화면 문제 해결 방법

## 문제 원인

콘솔 오류 분석:
- JavaScript 모듈 파일들이 HTML로 반환되고 있음
- `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"`

**원인:** `_redirects` 파일이 모든 경로(`/*`)를 `index.html`로 리다이렉트하고 있어서, JavaScript 파일(`/js/main.js` 등)도 `index.html`로 리다이렉트되고 있습니다.

## 해결 방법

### 1. _redirects 파일 수정

`public/_redirects` 파일을 수정하여 정적 파일을 명시적으로 제외했습니다:

```
# 정적 파일은 제외하고 나머지만 index.html로
/css/*    /css/*    200
/js/*     /js/*     200
/public/* /public/*  200
/*.css    /*.css     200
/*.js     /*.js      200
/*.json   /*.json    200
/*.svg    /*.svg     200
/*.png    /*.png     200
/*.jpg    /*.jpg     200
/*.jpeg   /*.jpeg    200
/*.gif    /*.gif     200
/*.ico    /*.ico     200

# 나머지 모든 경로는 index.html로
/*    /index.html   200
```

### 2. _routes.json 파일 추가

`public/_routes.json` 파일을 추가하여 Functions가 정적 파일에 적용되지 않도록 했습니다.

### 3. wrangler.toml 수정

`pages_build_output_dir = "."` 추가하여 빌드 출력 디렉토리를 명시했습니다.

## 적용 방법

### 1단계: 변경사항 커밋 및 푸시

```bash
git add .
git commit -m "Fix SPA routing - exclude static files from redirect"
git push origin main
```

### 2단계: 재배포 대기

Cloudflare Pages가 자동으로 재배포합니다 (1-2분 소요).

### 3단계: 확인

재배포 후 다음을 확인:

1. **파일 직접 접근:**
   - `https://balance-moim.pages.dev/js/main.js` → JavaScript 코드가 보여야 함 (HTML이 아님)
   - `https://balance-moim.pages.dev/css/style.css` → CSS 코드가 보여야 함

2. **홈 페이지 접속:**
   - `https://balance-moim.pages.dev/` → 정상 작동해야 함
   - `https://balance-moim.pages.dev/#home` → 홈 페이지 표시

3. **브라우저 콘솔:**
   - F12 → Console 탭
   - 에러가 없어야 함

## Functions 관련

**현재는 Functions가 필요 없습니다!**

배포 로그:
```
Note: No functions dir at /functions found. Skipping.
```

이것은 정상입니다. SPA는 정적 파일만으로 작동하므로 Functions가 없어도 됩니다.

**나중에 API가 필요하면:**
- `functions/` 디렉토리 생성
- 기존 Next.js API를 Functions로 변환
- 그때 다시 설정

## 추가 확인사항

만약 여전히 문제가 있다면:

1. **파일이 Git에 커밋되었는지 확인:**
```bash
git status
git log --oneline -5
```

2. **배포 로그 확인:**
   - Cloudflare Pages 대시보드
   - Deployments 탭
   - 최신 배포의 Build logs 확인

3. **캐시 문제일 수 있음:**
   - 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
   - 또는 시크릿 모드로 테스트

## 예상 결과

재배포 후:
- ✅ JavaScript 파일들이 정상적으로 로드됨
- ✅ 홈 페이지가 정상 표시됨
- ✅ 해시 라우팅 작동 (`#home`, `#play` 등)
- ✅ 브라우저 콘솔에 에러 없음
