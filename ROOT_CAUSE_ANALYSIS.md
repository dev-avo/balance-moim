# 근본 원인 분석

## 문제 현상

1. `/api/auth/session` 404 에러
2. `/api/questions/random` 404 에러
3. 모든 API 엔드포인트가 404를 반환

## 근본 원인

### 1. Cloudflare Pages 처리 순서

Cloudflare Pages는 다음 순서로 요청을 처리합니다:

1. **정적 파일 확인** - 요청된 경로에 정적 파일이 있는지 확인
2. **Functions 확인** - `functions/` 디렉토리에서 매칭되는 Function이 있는지 확인
3. **_redirects 적용** - `_redirects` 파일의 규칙 적용

### 2. 현재 문제

`_redirects` 파일에 `/* /index.html 200` 규칙이 있어서:
- 모든 경로(`/*`)가 `index.html`로 rewrite됨
- Functions가 실행되기 전에 rewrite될 수 있음
- 또는 Functions가 실행되지 않음

### 3. Functions 경로 매칭

Cloudflare Pages Functions는 파일 시스템 구조로 경로를 매칭합니다:

- `functions/api/auth/session/onRequest.ts` → `/api/auth/session`
- `functions/api/questions/random/onRequestGet.ts` → `/api/questions/random`

이것은 올바르게 설정되어 있습니다.

## 해결 방법

### 방법 1: `_routes.json`으로 Functions 우선순위 보장 (권장)

`_routes.json`에서 API 경로를 명시적으로 include하여 Functions가 실행되도록 보장:

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
    "/robots.txt"
  ]
}
```

### 방법 2: `_redirects`에서 API 경로 제외

`_redirects` 파일에서 API 경로를 명시적으로 제외:

```
# API 경로는 Functions로 처리되므로 제외
/api/*  /api/*  200

# 나머지 경로만 index.html로 rewrite
/*    /index.html   200
```

하지만 이것은 중복될 수 있으므로 방법 1을 권장합니다.

## 확인 사항

1. **Functions 파일 존재 확인**
   - ✅ `functions/api/auth/session/onRequest.ts` 존재
   - ✅ `functions/api/questions/random/onRequestGet.ts` 존재

2. **Functions export 확인**
   - ✅ `export const onRequest` 또는 `export const onRequestGet` 올바름

3. **배포 확인**
   - Cloudflare Pages 대시보드 > Deployments > Build logs
   - "Functions detected" 메시지 확인 필요

4. **환경 변수 확인**
   - Cloudflare Pages 대시보드 > Settings > Environment variables
   - 모든 필수 환경 변수 설정 확인

5. **D1 데이터베이스 바인딩 확인**
   - Cloudflare Pages 대시보드 > Settings > Functions > D1 database bindings
   - `DB` 바인딩 확인

## 예상 원인

가장 가능성 높은 원인:
1. **Functions가 배포되지 않음** - 빌드 로그에서 확인 필요
2. **경로 매칭 문제** - Functions 파일 구조 확인 필요
3. **_redirects와 Functions 충돌** - `_routes.json`으로 해결
