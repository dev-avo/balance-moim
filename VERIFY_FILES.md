# 파일 배포 확인 가이드

## 문제 진단

에러 메시지를 보면 JavaScript 파일들이 HTML로 반환되고 있습니다. 이는 두 가지 가능성이 있습니다:

1. **파일이 실제로 배포되지 않음**
2. **_redirects가 정적 파일까지 리다이렉트함**

## 확인 방법

### 1단계: 파일 직접 접근 테스트

브라우저에서 다음 URL들을 직접 접속해보세요:

1. `https://balance-moim.pages.dev/index.html`
   - ✅ 정상: HTML 코드가 보임
   - ❌ 404: 파일이 배포되지 않음

2. `https://balance-moim.pages.dev/js/main.js`
   - ✅ 정상: JavaScript 코드가 보임
   - ❌ 404 또는 HTML: 파일이 배포되지 않거나 리다이렉트됨

3. `https://balance-moim.pages.dev/css/style.css`
   - ✅ 정상: CSS 코드가 보임
   - ❌ 404 또는 HTML: 파일이 배포되지 않거나 리다이렉트됨

### 2단계: Git에 파일이 있는지 확인

```bash
# 프로젝트 루트에서
ls -la js/main.js
ls -la css/style.css
ls -la index.html

# Git에 커밋되었는지 확인
git ls-files | grep -E "(index.html|js/|css/)"
```

### 3단계: 배포 로그 확인

Cloudflare Pages 대시보드에서:
1. **Deployments** 탭
2. 최신 배포 클릭
3. **Build logs** 확인
4. "Assets published!" 메시지 확인

## 해결 방법

### 방법 A: _redirects 파일 단순화

Cloudflare Pages는 정적 파일을 자동으로 인식합니다. `_redirects` 파일을 단순화했습니다:

```
/*    /index.html   200
```

이렇게 하면:
- 정적 파일(css, js 등)은 자동으로 서빙됨
- 나머지 경로만 index.html로 리다이렉트됨

### 방법 B: 파일 경로 확인

만약 파일이 404로 나온다면:
1. Git에 파일이 커밋되었는지 확인
2. 파일 경로가 올바른지 확인
3. 재배포

## 다음 단계

1. **변경사항 커밋:**
```bash
git add .
git commit -m "Simplify _redirects for SPA"
git push origin main
```

2. **재배포 대기** (1-2분)

3. **확인:**
   - `https://balance-moim.pages.dev/js/main.js` 직접 접속
   - JavaScript 코드가 보이면 성공
   - HTML이 보이면 다른 방법 시도 필요
