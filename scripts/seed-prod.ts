/**
 * 프로덕션 데이터 시딩 가이드
 * 
 * ## 사용법
 * 
 * 프로덕션 DB 시딩은 다음 방법 중 하나를 사용하세요:
 * 
 * ### 방법 1: Cloudflare D1 Studio 사용 (가장 간단) ⭐
 * 
 * 1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
 * 2. **Workers & Pages** → **D1** → `balance-moim-db-prod` 선택
 * 3. **Open D1 Studio** 클릭
 * 4. SQL 편집기에서 `scripts/seed-prod.sql` 파일의 SQL 실행
 * 
 * ### 방법 2: wrangler CLI 사용
 * 
 * ```bash
 * # wrangler 로그인 확인
 * npx wrangler whoami
 * 
 * # 프로덕션 DB에 시딩 SQL 실행
 * npx wrangler d1 execute balance-moim-db-prod --remote --file=scripts/seed-prod.sql
 * ```
 * 
 * ## 상세 가이드
 * 
 * `scripts/SEED_PROD.md` 파일을 참고하세요.
 */

console.log('📖 프로덕션 DB 시딩 가이드\n');
console.log('이 스크립트는 직접 실행할 수 없습니다.');
console.log('대신 다음 방법 중 하나를 사용하세요:\n');
console.log('1. Cloudflare D1 Studio 사용 (권장)');
console.log('   - Dashboard → Workers & Pages → D1 → balance-moim-db-prod → Open D1 Studio');
console.log('   - SQL 편집기에서 scripts/seed-prod.sql 실행\n');
console.log('2. wrangler CLI 사용');
console.log('   - npx wrangler d1 execute balance-moim-db-prod --remote --file=scripts/seed-prod.sql\n');
console.log('자세한 내용은 scripts/SEED_PROD.md를 참고하세요.\n');
process.exit(0);

