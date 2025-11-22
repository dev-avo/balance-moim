# Cloudflare Pages _redirects 파일 위치 문제

## 문제

에러 메시지를 보면 JavaScript 파일들이 여전히 HTML로 반환되고 있습니다. 이는 `_redirects` 파일이 제대로 작동하지 않거나, 파일 위치가 잘못되었을 수 있습니다.

## 해결 방법

### 방법 1: 루트에 _redirects 파일 배치

Cloudflare Pages는 다음 위치의 `_redirects` 파일을 인식합니다:
1. **프로젝트 루트** (우선순위 높음)
2. `public/` 디렉토리

**현재 상태:**
- `public/_redirects` ✅ (있음)
- `_redirects` ✅ (루트에도 추가함)

### 방법 2: _redirects 파일 내용 확인

현재 `public/_redirects` 파일 내용:
```
/*    /index.html   200
```

이것은 정상입니다. Cloudflare Pages는 정적 파일을 자동으로 인식해야 합니다.

### 방법 3: 파일이 실제로 배포되었는지 확인

**확인 방법:**
1. `https://balance-moim.pages.dev/_redirects` 직접 접속
2. 내용이 보이면 → 파일은 배포됨
3. 404면 → 파일이 배포되지 않음

### 방법 4: wrangler.toml 확인

`wrangler.toml`에 `pages_build_output_dir = "."`가 설정되어 있는지 확인했습니다.

## 추가 확인사항

### 1. Git에 파일이 커밋되었는지

```bash
git ls-files | grep _redirects
```

다음 파일들이 나와야 합니다:
- `_redirects`
- `public/_redirects`

### 2. 배포 로그 확인

Cloudflare Pages 대시보드에서:
- **Deployments** → 최신 배포 → **Build logs**
- `_redirects` 파일이 인식되었는지 확인

### 3. 파일 직접 접근 테스트

재배포 후:
- `https://balance-moim.pages.dev/js/main.js` 직접 접속
- JavaScript 코드가 보이면 → 성공
- HTML이 보이면 → 여전히 리다이렉트 문제

## 최종 해결책

만약 여전히 문제가 있다면:

1. **루트의 `_redirects` 파일 확인**
2. **Git에 커밋되었는지 확인**
3. **재배포**
4. **파일 직접 접근 테스트**
