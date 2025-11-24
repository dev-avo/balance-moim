# SPA 전환 후 폴더 구조 정리 가이드

## 현재 상황

프로젝트가 Next.js에서 SPA(바닐라 JavaScript)로 전환되었습니다. 이제 Next.js 관련 파일들은 더 이상 필요하지 않습니다.

## .gitignore 업데이트 완료

다음 파일/디렉토리가 `.gitignore`에 추가되었습니다:

- `/app/` - Next.js App Router
- `/components/` - React 컴포넌트
- `/hooks/` - Next.js용 React Hooks
- `/next.config.ts` - Next.js 설정
- `/open-next.config.ts` - OpenNext 설정
- `/postcss.config.mjs` - PostCSS 설정 (SPA에서는 Tailwind CDN 사용)
- `/types/next-auth.d.ts` - Next.js용 타입 정의

## Git에서 제거하기 (선택사항)

이미 Git에 추적되고 있는 파일들을 제거하려면:

```bash
# Git에서 제거 (로컬 파일은 유지)
git rm -r --cached app/ components/ hooks/
git rm --cached next.config.ts open-next.config.ts postcss.config.mjs
git rm --cached types/next-auth.d.ts

# 변경사항 커밋
git commit -m "chore: Remove Next.js files after SPA migration"
git push
```

**주의**: `--cached` 옵션을 사용하면 Git 추적만 제거되고 로컬 파일은 유지됩니다. 완전히 삭제하려면 `--cached` 없이 사용하세요.

## 현재 SPA 구조

### 사용 중인 파일/디렉토리

- `index.html` - SPA 진입점
- `js/` - 클라이언트 사이드 JavaScript
- `css/` - 스타일시트
- `functions/` - Cloudflare Pages Functions (API)
- `lib/` - Functions에서 사용하는 공통 라이브러리
- `auth.ts` - Functions에서 사용하는 인증 설정
- `drizzle/` - 데이터베이스 마이그레이션
- `drizzle.config.ts` - Drizzle ORM 설정
- `wrangler.toml` - Cloudflare 설정
- `tsconfig.json` - TypeScript 설정 (Functions용)
- `public/` - 정적 파일 (일부)
- `_redirects` - Cloudflare Pages 리다이렉트 설정
- `_routes.json` - Cloudflare Pages 라우팅 설정

### 더 이상 사용하지 않는 파일/디렉토리

- `app/` - Next.js App Router (SPA에서는 `js/pages/` 사용)
- `components/` - React 컴포넌트 (SPA에서는 `js/components/` 사용)
- `hooks/` - Next.js용 React Hooks
- `next.config.ts` - Next.js 설정
- `open-next.config.ts` - OpenNext 설정
- `postcss.config.mjs` - PostCSS 설정
- `types/next-auth.d.ts` - Next.js용 타입 정의

## 권장 사항

1. **로컬 백업**: Git에서 제거하기 전에 로컬 백업을 권장합니다.
2. **점진적 제거**: 한 번에 모든 파일을 제거하지 말고, 단계적으로 제거하는 것을 권장합니다.
3. **브랜치 생성**: 제거 작업 전에 새 브랜치를 만들어 작업하는 것을 권장합니다.

```bash
# 새 브랜치 생성
git checkout -b cleanup/remove-nextjs-files

# 파일 제거
git rm -r --cached app/ components/ hooks/
git rm --cached next.config.ts open-next.config.ts postcss.config.mjs
git rm --cached types/next-auth.d.ts

# 커밋
git commit -m "chore: Remove Next.js files after SPA migration"

# 확인 후 머지
git checkout main
git merge cleanup/remove-nextjs-files
git push
```
