# 다음 단계 가이드

## ✅ 이미 완료된 항목

1. ✅ 환경 변수 4가지 설정 완료
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL

2. ✅ D1 데이터베이스 바인딩 완료
   - 데이터베이스 이름: `balance-moim-db-prod`
   - Variable name: `DB`
   - 초기 데이터 있음 (태그, 질문)

3. ✅ 빌드 설정 올바름
   - Framework preset: None
   - Build command: (비워두기)
   - Build output directory: /

## 🔴 지금 바로 해야 할 것 (흰 화면 해결)

### 1단계: 브라우저 콘솔 확인 (가장 중요!) ⚠️

1. `https://balance-moim.pages.dev/` 접속
2. **F12** 키 누르기 (개발자 도구 열기)
3. **Console** 탭 클릭
4. **빨간색 에러 메시지** 확인

**확인할 내용:**
- 에러 메시지 전체 복사
- 스크린샷 촬영

**예상 에러:**
- `Failed to load resource: /js/main.js` → 파일 경로 문제
- `CORS policy` → Functions 설정 문제
- `Uncaught SyntaxError` → JavaScript 문법 오류
- `Module not found` → 모듈 경로 문제

**⚠️ 이 단계가 가장 중요합니다! 에러 메시지를 알려주세요.**

### 2단계: 파일 직접 접근 테스트 ⚠️

브라우저 주소창에 직접 입력하여 접근:

1. `https://balance-moim.pages.dev/index.html`
   - ✅ 정상: HTML 내용이 보임
   - ❌ 404: 파일이 배포되지 않음

2. `https://balance-moim.pages.dev/js/main.js`
   - ✅ 정상: JavaScript 코드가 보임
   - ❌ 404: 파일이 배포되지 않음

3. `https://balance-moim.pages.dev/css/style.css`
   - ✅ 정상: CSS 코드가 보임
   - ❌ 404: 파일이 배포되지 않음

**각 파일의 접근 결과를 알려주세요!**

### 3단계: Network 탭 확인

1. **F12** → **Network** 탭
2. 페이지 새로고침 (F5)
3. 다음 파일들이 로드되는지 확인:
   - `index.html` → Status: 200?
   - `main.js` → Status: 200?
   - `style.css` → Status: 200?

**실패한 파일(빨간색)이 있으면 알려주세요!**

### 4단계: Git 커밋 확인

파일이 Git에 커밋되었는지 확인:

```bash
git status
```

**커밋되지 않은 파일이 있으면:**
```bash
git add .
git commit -m "Add SPA files"
git push origin main
```

## 🟡 다음 단계 (흰 화면 해결 후)

### 5단계: 기본 기능 테스트

흰 화면이 해결되면:

1. **홈 페이지**: `https://balance-moim.pages.dev/#home`
2. **게임 플레이**: `https://balance-moim.pages.dev/#play`
3. **Google 로그인**: 로그인 버튼 클릭

### 6단계: 기본 기능 테스트

흰 화면이 해결되면:

1. **홈 페이지**: `https://balance-moim.pages.dev/#home`
2. **게임 플레이**: `https://balance-moim.pages.dev/#play`
3. **Google 로그인**: 로그인 버튼 클릭

## 🟢 나중에 할 것

### 7단계: Functions 설정 (API 필요 시)

현재는 정적 파일만 배포했으므로, API가 필요하면:

1. `functions/` 디렉토리 생성
2. 기존 Next.js API를 Functions로 변환
3. 재배포

**참고:** API 없이도 정적 페이지는 작동합니다. 로그인 등이 필요하면 Functions 설정이 필요합니다.

### 8단계: 시드 데이터 (선택)

테스트 데이터가 필요하면:

```bash
npm run db:seed:prod
```

## 문제 해결 우선순위

### 우선순위 1: 흰 화면 해결
1. 브라우저 콘솔 에러 확인
2. 파일 접근 테스트
3. 빌드 설정 확인
4. 재배포

### 우선순위 2: 기본 기능 확인
1. 마이그레이션 실행
2. 홈 페이지 접속 확인
3. 기본 라우팅 확인

### 우선순위 3: API 기능
1. Functions 설정
2. 로그인 테스트
3. API 엔드포인트 테스트

## 도움이 필요하면

**에러 메시지를 알려주세요:**
- 브라우저 콘솔 에러
- 파일 접근 테스트 결과
- 빌드 로그 에러

이 정보를 주시면 정확한 해결 방법을 알려드릴 수 있습니다!
