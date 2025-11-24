# SPA에서 전통적인 HTML 페이지 방식으로 마이그레이션

## 변경 사항

### 1. 해시 라우팅 제거
- 기존: `#home`, `#play`, `#groups` 등 해시 기반 라우팅
- 변경: `/home.html`, `/play.html`, `/groups.html` 등 일반 HTML 파일

### 2. 각 페이지를 별도 HTML 파일로 분리
- `home.html` - 홈 페이지
- `play.html` - 플레이 페이지
- `groups.html` - 모임 목록 (생성 필요)
- `groups/create.html` - 모임 생성 (생성 필요)
- `groups/detail.html` - 모임 상세 (생성 필요)
- `groups/settings.html` - 모임 설정 (생성 필요)
- `questions/create.html` - 질문 생성 (생성 필요)
- `questions/my.html` - 내 질문 (생성 필요)
- `questions/edit.html` - 질문 수정 (생성 필요)
- `settings.html` - 설정 (생성 필요)
- `invite.html` - 초대 (생성 필요)

### 3. Header 컴포넌트 수정
- 해시 링크(`#home`) → 일반 링크(`/home.html`)
- 해시 라우팅 이벤트 리스너 제거

### 4. 각 페이지 JavaScript 수정
- `router.navigate()` 제거
- 일반 링크(`<a href>`) 사용
- URL 파라미터는 `URLSearchParams` 사용

### 5. _redirects 파일 수정
- SPA rewrite 제거
- 루트 경로를 `/home.html`로 리다이렉트

## 완료된 작업

- [x] `home.html` 생성
- [x] `play.html` 생성
- [x] `home.js` 수정 (해시 라우팅 제거)
- [x] `play.js` 수정 (URL 파라미터 처리 변경)
- [x] `Header.js` 수정 (일반 링크로 변경)
- [x] `_redirects` 수정

## 남은 작업

- [ ] `groups.html` 생성
- [ ] `groups/create.html` 생성
- [ ] `groups/detail.html` 생성
- [ ] `groups/settings.html` 생성
- [ ] `questions/create.html` 생성
- [ ] `questions/my.html` 생성
- [ ] `questions/edit.html` 생성
- [ ] `settings.html` 생성
- [ ] `invite.html` 생성
- [ ] 각 페이지 JavaScript 파일 수정 (해시 라우팅 제거)

## 참고

gate1253 프로젝트처럼 각 페이지를 별도 HTML 파일로 관리하여:
- SEO 최적화
- 브라우저 히스토리 관리 용이
- 전통적인 웹 페이지 구조
