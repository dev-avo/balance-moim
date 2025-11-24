# Functions 경로 매칭 문제 해결

## 문제 현상

Cloudflare Functions 로그를 보면:
- Functions가 실행되고 있음 (`outcome: ok`)
- 하지만 `response.status: 404`를 반환
- `/api/auth/session`과 `/api/auth/signin/google`이 404 반환

## 근본 원인

Cloudflare Pages Functions의 경로 매칭 우선순위:
1. 더 구체적인 경로가 우선순위가 높음
2. `functions/api/auth/session/onRequest.ts` → `/api/auth/session` (구체적)
3. `functions/api/auth/signin/google/onRequestGet.ts` → `/api/auth/signin/google` (구체적)
4. `functions/api/auth/onRequest.ts` → `/api/auth/*` (catch-all, 낮은 우선순위)

하지만 실제로는:
- Functions가 실행되고 있지만 (`outcome: ok`)
- 해당 경로를 처리하는 Function이 매칭되지 않아 404 반환

## 해결 방법

### 1. GET 요청을 위한 `onRequestGet.ts` 추가

`functions/api/auth/session/onRequest.ts`가 있지만, GET 요청을 명시적으로 처리하기 위해 `onRequestGet.ts`를 추가했습니다.

**파일 생성:**
- `functions/api/auth/session/onRequestGet.ts` - GET 요청 전용

### 2. `functions/api/auth/onRequest.ts` 수정

catch-all 로직에서 불필요한 경로 체크를 제거하고, 더 구체적인 경로가 자동으로 우선순위가 높다는 것을 명확히 했습니다.

## 변경 사항

### 추가된 파일
- `functions/api/auth/session/onRequestGet.ts` - GET 요청 전용 세션 핸들러

### 수정된 파일
- `functions/api/auth/onRequest.ts` - catch-all 로직 간소화

## 확인 사항

1. **Functions 파일 구조:**
   ```
   functions/
   ├── api/
   │   └── auth/
   │       ├── session/
   │       │   ├── onRequest.ts (모든 메서드)
   │       │   └── onRequestGet.ts (GET 전용) ✅ 새로 추가
   │       ├── signin/
   │       │   └── google/
   │       │       └── onRequestGet.ts ✅ 이미 존재
   │       └── onRequest.ts (catch-all)
   ```

2. **경로 매칭 우선순위:**
   - `/api/auth/session` → `functions/api/auth/session/onRequestGet.ts` (최우선)
   - `/api/auth/signin/google` → `functions/api/auth/signin/google/onRequestGet.ts` (최우선)
   - `/api/auth/*` (기타) → `functions/api/auth/onRequest.ts` (catch-all)

## 배포 후 확인

1. **변경사항 커밋 및 푸시:**
   ```bash
   git add functions/
   git commit -m "fix: Add onRequestGet for /api/auth/session to fix 404 routing"
   git push
   ```

2. **Cloudflare Pages 자동 재배포 대기** (1-2분)

3. **테스트:**
   - `/api/auth/session` - 200 OK 반환 확인
   - `/api/auth/signin/google` - 200 OK 반환 확인
   - `/api/questions/random` - 200 OK 반환 확인

## 예상 결과

재배포 후:
- ✅ `/api/auth/session` - 200 OK (세션 정보 반환)
- ✅ `/api/auth/signin/google` - 200 OK (Google 로그인 리다이렉트)
- ✅ `/api/questions/random` - 200 OK (랜덤 질문 반환)
- ❌ 404 오류 없음
