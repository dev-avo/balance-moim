# 흰 화면 문제 해결 방법

## 문제 원인

콘솔 오류를 보면 JavaScript 모듈 파일들이 HTML로 반환되고 있습니다:
- `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"`

**원인:** `_redirects` 파일이 모든 경로(`/*`)를 `index.html`로 리다이렉트하고 있어서, JavaScript 파일(`/js/main.js` 등)도 `index.html`로 리다이렉트되고 있습니다.

## 해결 방법

### 방법 1: _redirects 파일 수정 (권장)

`public/_redirects` 파일을 수정하여 정적 파일은 제외:

```
# 정적 파일은 그대로 서빙
/css/*    /css/:splat    200
/js/*     /js/:splat     200
/public/* /public/:splat 200

# 나머지 모든 경로는 index.html로
/*    /index.html   200
```

### 방법 2: 루트에 _redirects 파일 추가

프로젝트 루트에도 `_redirects` 파일을 추가했습니다. Cloudflare Pages는 루트의 `_redirects` 파일을 우선적으로 인식합니다.

### 방법 3: wrangler.toml에 redirects 추가

`wrangler.toml` 파일에 redirects 규칙을 추가했습니다.

## 적용 방법

1. **변경사항 커밋 및 푸시:**

```bash
git add .
git commit -m "Fix SPA routing - exclude static files from redirect"
git push origin main
```

2. **재배포 대기**

Cloudflare Pages가 자동으로 재배포합니다 (1-2분 소요).

3. **확인**

재배포 후:
- `https://balance-moim.pages.dev/js/main.js` 직접 접속 → JavaScript 코드가 보여야 함
- `https://balance-moim.pages.dev/` 접속 → 정상 작동해야 함

## Functions 관련

**현재는 Functions가 필요 없습니다!**

배포 로그를 보면:
```
Note: No functions dir at /functions found. Skipping.
```

이것은 정상입니다. SPA는 정적 파일만으로 작동하므로 Functions가 없어도 됩니다.

**나중에 API가 필요하면:**
- `functions/` 디렉토리 생성
- 기존 Next.js API를 Functions로 변환
- 그때 다시 설정

## 확인 체크리스트

재배포 후 확인:

- [ ] `https://balance-moim.pages.dev/js/main.js` → JavaScript 코드가 보임 (HTML이 아님)
- [ ] `https://balance-moim.pages.dev/css/style.css` → CSS 코드가 보임
- [ ] `https://balance-moim.pages.dev/` → 홈 페이지가 정상 표시됨
- [ ] 브라우저 콘솔에 에러 없음
- [ ] `/#home` 라우팅 작동
