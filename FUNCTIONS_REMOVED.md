# Functions 제거 안내

## 현재 상황

Cloudflare Pages Functions가 npm 의존성을 번들링하지 못하는 문제가 발생했습니다.

## 조치 사항

Functions 디렉토리를 제거하여 SPA로만 배포합니다.

## 영향

- ❌ 로그인 기능이 작동하지 않음 (API 엔드포인트 없음)
- ✅ 정적 파일(HTML, CSS, JS)은 정상 작동
- ✅ 디자인은 Tailwind CSS CDN으로 표시됨

## 다음 단계

Functions를 다시 추가하려면:

1. **빌드 설정 수정 필요**
   - Cloudflare Pages 설정에서 빌드 명령어를 `npm install`로 설정
   - 또는 Functions를 번들링하는 빌드 스크립트 추가

2. **대안: 외부 API 서버 사용**
   - 별도의 서버에 API 배포
   - SPA에서 외부 API 호출

3. **대안: Cloudflare Workers 사용**
   - Functions 대신 Workers 사용
   - Workers는 더 나은 의존성 관리 지원

## 현재 배포 상태

- ✅ SPA 정적 파일 배포
- ❌ API Functions 없음 (로그인 불가)
