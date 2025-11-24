# SPA → 전통적인 HTML 페이지 마이그레이션 요약

## 완료된 작업

### 1. 기본 구조 변경
- ✅ `index.html` → `home.html`로 리다이렉트
- ✅ `home.html` 생성 (홈 페이지)
- ✅ `play.html` 생성 (플레이 페이지)
- ✅ `groups.html` 생성 (모임 목록)

### 2. 해시 라우팅 제거
- ✅ `Header.js` - 해시 링크(`#home`) → 일반 링크(`/home.html`)
- ✅ `home.js` - `router.navigate()` 제거, 일반 링크 사용
- ✅ `play.js` - 해시 기반 URL 파라미터 → `URLSearchParams` 사용
- ✅ `groups.js` - 해시 라우팅 제거, 일반 링크 사용

### 3. _redirects 수정
- ✅ SPA rewrite 제거
- ✅ 루트 경로(`/`) → `/home.html` 리다이렉트

### 4. 각 페이지 자동 렌더링
- ✅ `home.js` - 페이지 로드 시 자동 렌더링
- ✅ `play.js` - 페이지 로드 시 자동 렌더링
- ✅ `groups.js` - 페이지 로드 시 자동 렌더링

## 남은 작업

### HTML 파일 생성 필요
- [ ] `groups/create.html` - 모임 생성
- [ ] `groups/detail.html` - 모임 상세 (쿼리 파라미터: `?id=xxx`)
- [ ] `groups/settings.html` - 모임 설정 (쿼리 파라미터: `?id=xxx`)
- [ ] `questions/create.html` - 질문 생성
- [ ] `questions/my.html` - 내 질문
- [ ] `questions/edit.html` - 질문 수정 (쿼리 파라미터: `?id=xxx`)
- [ ] `settings.html` - 설정
- [ ] `invite.html` - 초대 (쿼리 파라미터: `?code=xxx`)

### JavaScript 파일 수정 필요
각 페이지의 JavaScript 파일에서:
- [ ] `router.navigate()` 제거
- [ ] 해시 기반 URL 파라미터 → `URLSearchParams` 사용
- [ ] 페이지 로드 시 자동 렌더링 추가

## 변경된 경로 매핑

| 기존 (SPA) | 변경 후 (HTML) |
|-----------|---------------|
| `#home` | `/home.html` |
| `#play` | `/play.html` |
| `#groups` | `/groups.html` |
| `#groups/create` | `/groups/create.html` |
| `#groups/:id` | `/groups/detail.html?id=xxx` |
| `#groups/:id/settings` | `/groups/settings.html?id=xxx` |
| `#questions/create` | `/questions/create.html` |
| `#questions/my` | `/questions/my.html` |
| `#questions/:id/edit` | `/questions/edit.html?id=xxx` |
| `#settings` | `/settings.html` |
| `#invite/:code` | `/invite.html?code=xxx` |

## 참고사항

- gate1253 프로젝트처럼 각 페이지를 별도 HTML 파일로 관리
- 해시 라우팅(`#`) 완전 제거
- 전통적인 웹 페이지 구조로 변경
- SEO 최적화 및 브라우저 히스토리 관리 용이
