# Google OAuth 콜백 404 에러 수정

## 문제

구글 로그인 후 `/api/auth/callback/google` 경로에서 404 에러가 발생했습니다.

## 원인

Cloudflare Pages Functions의 라우팅 구조 불일치:
- `functions/api/auth/signin/google.ts` - 파일 구조 (정상 작동)
- `functions/api/auth/callback/google/onRequest.ts` - 디렉토리 구조 (404 발생)

Cloudflare Pages Functions는 파일 기반 라우팅을 사용하므로, 일관된 구조가 필요합니다.

## 해결 방법

### 변경 전
```
functions/api/auth/callback/google/onRequest.ts
```

### 변경 후
```
functions/api/auth/callback/google.ts
```

파일 구조를 `signin/google.ts`와 동일하게 맞춰서 일관성을 확보했습니다.

## 수정된 파일

- ✅ `functions/api/auth/callback/google.ts` 생성 (새 파일)
- ❌ `functions/api/auth/callback/google/onRequest.ts` 삭제 (기존 디렉토리 구조)

## Import 경로 수정

디렉토리 구조가 변경되어 import 경로도 수정되었습니다:
- 기존: `../../../../../lib/db` (6단계 상위)
- 수정: `../../../../lib/db` (5단계 상위)

## 다음 단계

1. 변경사항 커밋 및 푸시
2. Cloudflare Pages 자동 재배포 대기
3. 구글 로그인 테스트:
   - `/api/auth/signin/google` 정상 작동 확인
   - `/api/auth/callback/google` 404 해결 확인
   - 로그인 후 리다이렉트 정상 작동 확인
