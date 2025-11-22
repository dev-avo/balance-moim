# 흰 화면 문제 디버깅 가이드

## ✅ 확인 완료된 항목

- [x] 빌드 설정 올바름 (Framework preset: None)
- [x] DB에 초기 데이터 있음 (태그, 질문)

## 🔍 지금 확인해야 할 것

### 1단계: 브라우저 콘솔 확인 (필수!)

1. `https://balance-moim.pages.dev/` 접속
2. **F12** 키 누르기
3. **Console** 탭 확인
4. **빨간색 에러 메시지** 확인

**확인할 에러 유형:**
- `Failed to load resource: /js/main.js` → 파일 경로 문제
- `Uncaught SyntaxError` → JavaScript 문법 오류
- `CORS policy` → Functions 설정 문제
- `Module not found` → 모듈 경로 문제

**에러 메시지를 복사해서 알려주세요!**

### 2단계: 파일 직접 접근 테스트

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

**결과를 알려주세요!**

### 3단계: Network 탭 확인

1. **F12** → **Network** 탭
2. 페이지 새로고침 (F5)
3. 다음 파일들이 로드되는지 확인:
   - `index.html` → Status: 200?
   - `main.js` → Status: 200?
   - `style.css` → Status: 200?

**실패한 파일(빨간색)이 있으면 알려주세요!**

### 4단계: _redirects 파일 확인

1. `https://balance-moim.pages.dev/_redirects` 접속
2. 내용이 보이는지 확인:
   ```
   /*    /index.html   200
   ```

**확인 결과:**
- ✅ 내용이 보임 → _redirects 파일은 배포됨
- ❌ 404 → _redirects 파일이 배포되지 않음

## 🔧 가능한 해결 방법

### 문제 A: 파일이 404로 나옴

**원인:** 파일이 Git에 커밋되지 않았거나 배포되지 않음

**해결:**
```bash
# Git에 모든 파일이 커밋되었는지 확인
git status

# 커밋되지 않은 파일이 있으면
git add .
git commit -m "Add SPA files"
git push origin main
```

### 문제 B: JavaScript 파일은 있지만 에러 발생

**원인:** 모듈 경로 문제 또는 문법 오류

**확인:**
- 브라우저 콘솔의 정확한 에러 메시지
- `main.js` 파일 내용 확인

### 문제 C: _redirects 파일이 작동하지 않음

**원인:** 파일 위치가 잘못됨

**확인:**
- `public/_redirects` 파일이 Git에 있는지 확인
- 파일 내용이 올바른지 확인

## 📋 체크리스트

다음 정보를 알려주시면 정확한 해결 방법을 제시할 수 있습니다:

- [ ] 브라우저 콘솔 에러 메시지 (전체)
- [ ] `index.html` 직접 접근 결과 (200/404)
- [ ] `js/main.js` 직접 접근 결과 (200/404)
- [ ] `css/style.css` 직접 접근 결과 (200/404)
- [ ] Network 탭에서 실패한 파일 목록
- [ ] `_redirects` 파일 접근 결과

## 🚀 빠른 테스트

로컬에서 먼저 테스트:

```bash
cd /Users/sjudy/dev/vibe
python3 -m http.server 8000
```

그 다음 `http://localhost:8000` 접속하여:
- ✅ 정상 작동 → 배포 설정 문제
- ❌ 작동 안 함 → 코드 문제

**결과를 알려주세요!**
