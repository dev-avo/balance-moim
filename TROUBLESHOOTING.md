# 트러블슈팅 가이드 - 흰 화면 문제

## 현재 완료된 항목 체크

✅ **완료된 항목:**
- [x] 환경 변수 4가지 설정 (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL)
- [x] D1 데이터베이스 바인딩 (balance-moim-db-prod)

## 흰 화면 문제 해결

### 1단계: 브라우저 콘솔 확인

1. `https://balance-moim.pages.dev/` 접속
2. **F12** 또는 **우클릭 > 검사** 열기
3. **Console** 탭에서 에러 확인
4. **Network** 탭에서 파일 로드 실패 확인

**확인할 에러:**
- `Failed to load resource: /js/main.js` → 파일 경로 문제
- `CORS error` → Functions 설정 문제
- `Module not found` → 파일 구조 문제

### 2단계: 파일 경로 확인

**문제 가능성:**
- `index.html`에서 `/js/main.js`를 참조하는데, 실제 파일이 다른 위치에 있을 수 있음
- Cloudflare Pages는 루트 디렉토리를 기준으로 파일을 서빙함

**해결 방법:**
1. 배포된 사이트에서 직접 파일 접근 시도:
   - `https://balance-moim.pages.dev/js/main.js`
   - `https://balance-moim.pages.dev/css/style.css`
   - `https://balance-moim.pages.dev/index.html`

2. 404가 나오면 → 파일이 배포되지 않음
3. 200이 나오면 → 파일은 있지만 로딩 문제

### 3단계: 빌드 출력 디렉토리 확인

**Cloudflare Pages 설정 확인:**

1. **Pages 프로젝트 > Settings > Builds & deployments**
2. 다음 설정 확인:
   - **Build output directory**: `/` 또는 비워두기
   - **Root directory**: 비워두기

**문제:** 빌드 출력 디렉토리가 잘못 설정되면 파일이 배포되지 않음

### 4단계: _redirects 파일 위치 확인

`public/_redirects` 파일이 루트에 배포되어야 합니다.

**확인:**
- Git 저장소에 `public/_redirects` 파일이 있는지 확인
- 배포 후 `https://balance-moim.pages.dev/_redirects` 접속 시 내용이 보여야 함

**문제:** `_redirects` 파일이 없으면 SPA 라우팅이 작동하지 않음

### 5단계: 즉시 해결 방법

#### 방법 A: 파일 구조 확인

프로젝트 루트에 다음 파일들이 있는지 확인:

```
vibe/
├── index.html          ← 필수
├── css/
│   └── style.css      ← 필수
├── js/
│   └── main.js        ← 필수
└── public/
    ├── _redirects     ← 필수
    └── _headers       ← 선택
```

#### 방법 B: 수동 배포 테스트

1. 로컬에서 정적 파일 서버 실행:
```bash
cd /Users/sjudy/dev/vibe
python3 -m http.server 8000
```

2. `http://localhost:8000` 접속하여 정상 작동 확인

3. 정상 작동하면 → 배포 설정 문제
4. 작동 안 하면 → 코드 문제

#### 방법 C: 빌드 로그 확인

1. **Pages 프로젝트 > Deployments**
2. 최신 배포 클릭
3. **Build logs** 확인
4. 에러 메시지 확인

## 다음 단계 (우선순위)

### 🔴 긴급 (지금 바로)

1. **브라우저 콘솔 에러 확인**
   - F12 → Console 탭
   - 에러 메시지 스크린샷 또는 복사

2. **파일 접근 테스트**
   - `https://balance-moim.pages.dev/index.html` 직접 접속
   - `https://balance-moim.pages.dev/js/main.js` 직접 접속

3. **빌드 로그 확인**
   - Pages 대시보드에서 배포 로그 확인

### 🟡 중요 (오늘 중)

4. **마이그레이션 실행**
```bash
wrangler d1 migrations apply balance-moim-db-prod --remote
```

5. **Functions 디렉토리 확인**
   - 기존 Next.js API가 Functions로 변환되었는지 확인
   - API가 필요 없으면 일단 생략 가능 (정적 파일만 먼저 확인)

### 🟢 나중에

6. **성능 최적화**
7. **에러 모니터링 설정**

## 빠른 체크리스트

배포 후 즉시 확인:

- [ ] `https://balance-moim.pages.dev/index.html` 접속 가능?
- [ ] `https://balance-moim.pages.dev/js/main.js` 접속 가능?
- [ ] `https://balance-moim.pages.dev/css/style.css` 접속 가능?
- [ ] 브라우저 콘솔에 에러 없음?
- [ ] Network 탭에서 모든 파일 200 응답?

**하나라도 실패하면 → 해당 항목의 해결 방법 적용**
