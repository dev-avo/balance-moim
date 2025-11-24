# SPA → 전통적인 HTML 페이지 마이그레이션 완료

## 완료된 작업

### 1. HTML 파일 생성
- ✅ `home.html` - 홈 페이지
- ✅ `play.html` - 플레이 페이지
- ✅ `groups.html` - 모임 목록
- ✅ `groups/create.html` - 모임 생성
- ✅ `groups/detail.html` - 모임 상세
- ✅ `groups/settings.html` - 모임 설정
- ✅ `questions/create.html` - 질문 생성
- ✅ `questions/my.html` - 내 질문
- ✅ `questions/edit.html` - 질문 수정
- ✅ `settings.html` - 설정
- ✅ `invite.html` - 초대
- ✅ `404.html` - 404 페이지

### 2. 해시 라우팅 제거
- ✅ 모든 `router.navigate()` → `window.location.href`로 변경
- ✅ 모든 해시 링크(`#home`) → 일반 링크(`/home.html`)로 변경
- ✅ 동적 라우트 파라미터 → URL 쿼리 파라미터로 변경
  - `#groups/:id` → `/groups/detail.html?id=xxx`
  - `#questions/:id/edit` → `/questions/edit.html?id=xxx`
  - `#invite/:code` → `/invite.html?code=xxx`

### 3. JavaScript 파일 수정
- ✅ `home.js` - 해시 라우팅 제거, 자동 렌더링 추가
- ✅ `play.js` - URL 파라미터 처리 변경, 자동 렌더링 추가
- ✅ `groups.js` - 해시 라우팅 제거, 자동 렌더링 추가
- ✅ `groups/create.js` - 해시 라우팅 제거, 자동 렌더링 추가
- ✅ `groups/detail.js` - 동적 라우트 → 쿼리 파라미터, 자동 렌더링 추가
- ✅ `groups/settings.js` - 동적 라우트 → 쿼리 파라미터, 자동 렌더링 추가
- ✅ `questions/create.js` - 해시 라우팅 제거, 자동 렌더링 추가
- ✅ `questions/my.js` - 해시 라우팅 제거, 자동 렌더링 추가
- ✅ `questions/edit.js` - 동적 라우트 → 쿼리 파라미터, 자동 렌더링 추가
- ✅ `settings.js` - 해시 라우팅 제거, 자동 렌더링 추가
- ✅ `invite.js` - 동적 라우트 → 쿼리 파라미터, 자동 렌더링 추가
- ✅ `404.js` - 해시 라우팅 제거, 자동 렌더링 추가

### 4. Header 컴포넌트 수정
- ✅ 모든 해시 링크를 일반 링크로 변경
- ✅ 해시 라우팅 이벤트 리스너 제거

### 5. _redirects 수정
- ✅ SPA rewrite 제거
- ✅ 루트 경로(`/`) → `/home.html` 리다이렉트

### 6. index.html 수정
- ✅ `home.html`로 리다이렉트하도록 변경

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

## 주요 변경 사항

### 1. 동적 라우트 파라미터 처리
**기존 (SPA)**:
```javascript
export async function renderGroupDetail(route) {
    const match = route.match(/^groups\/(.+)$/);
    groupId = match[1];
}
```

**변경 후 (HTML)**:
```javascript
export async function renderGroupDetail() {
    const url = new URL(window.location.href);
    groupId = url.searchParams.get('id');
}
```

### 2. 페이지 네비게이션
**기존 (SPA)**:
```javascript
router.navigate('#groups');
```

**변경 후 (HTML)**:
```javascript
window.location.href = '/groups.html';
```

### 3. 자동 렌더링
각 페이지 JavaScript 파일에 자동 렌더링 코드 추가:
```javascript
// 페이지 로드 시 자동 렌더링
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFunction);
} else {
    renderFunction();
}
```

## 장점

1. **SEO 최적화**: 각 페이지가 별도 HTML 파일로 존재하여 검색 엔진 크롤링 용이
2. **브라우저 히스토리**: 전통적인 페이지 네비게이션으로 브라우저 뒤로가기/앞으로가기 정상 작동
3. **직접 링크**: 특정 페이지로 직접 링크 가능
4. **간단한 구조**: 복잡한 라우터 없이 일반적인 웹 페이지 구조

## 참고

- gate1253 프로젝트처럼 각 페이지를 별도 HTML 파일로 관리
- 해시 라우팅(`#`) 완전 제거
- 전통적인 웹 페이지 구조로 변경
