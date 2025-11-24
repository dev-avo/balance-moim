# Cloudflare Pages 설정 확인

## 현재 설정 상태

### ✅ `_redirects` 파일
**위치**: 루트 및 `public/` 폴더
**내용**:
```
/    /home.html   302
```
- 루트 경로(`/`)를 `/home.html`로 리다이렉트
- SPA rewrite 제거됨

### ✅ `_routes.json` 파일
**위치**: 루트 및 `public/` 폴더
**내용**:
```json
{
  "version": 1,
  "include": ["/api/*"],
  "exclude": [
    "/js/*",
    "/css/*",
    "/*.js",
    "/*.css",
    "/*.svg",
    "/*.ico",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.gif",
    "/*.webp",
    "/*.woff",
    "/*.woff2",
    "/*.ttf",
    "/*.eot",
    "/favicon.ico",
    "/robots.txt",
    "/index.html"
  ]
}
```

**설명**:
- `/api/*` 경로만 Cloudflare Pages Functions로 처리
- 정적 파일(HTML, JS, CSS, 이미지 등)은 Functions 제외
- HTML 파일들은 정적 파일로 서빙됨

## 확인 사항

### 1. HTML 파일 서빙
- ✅ 각 HTML 파일(`home.html`, `play.html` 등)이 정적 파일로 서빙됨
- ✅ `_routes.json`의 `exclude`에 HTML 파일이 명시적으로 포함되지 않아도 정상 작동
- ✅ Functions는 `/api/*` 경로만 처리하므로 HTML 파일은 자동으로 정적 파일로 서빙됨

### 2. API 엔드포인트
- ✅ `/api/*` 경로는 Functions로 처리됨
- ✅ `/api/auth/*` 경로 정상 작동

### 3. 리다이렉트
- ✅ 루트 경로(`/`) → `/home.html` 리다이렉트
- ✅ SPA rewrite 제거됨

## 추가 설정 필요 여부

### ❌ 추가 설정 불필요
현재 설정으로 충분합니다:
1. HTML 파일들이 정상적으로 서빙됨
2. API 엔드포인트가 Functions로 처리됨
3. 리다이렉트가 정상 작동함

### 참고사항
- Cloudflare Pages는 기본적으로 정적 파일을 자동으로 서빙합니다
- `_routes.json`의 `exclude`는 Functions를 제외할 파일을 명시하는 것이며, HTML 파일은 자동으로 정적 파일로 처리됩니다
- `_redirects` 파일은 Functions가 처리하지 않는 경로에만 적용됩니다

## 배포 후 확인 사항

1. **HTML 페이지 접속 확인**
   - `/home.html` 접속 가능한지 확인
   - `/play.html` 접속 가능한지 확인
   - 다른 HTML 페이지들도 확인

2. **API 엔드포인트 확인**
   - `/api/auth/session` 정상 작동 확인
   - `/api/auth/signin/google` 정상 작동 확인

3. **리다이렉트 확인**
   - 루트 경로(`/`) 접속 시 `/home.html`로 리다이렉트되는지 확인
