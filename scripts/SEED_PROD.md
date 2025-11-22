# 프로덕션 DB 시딩 가이드

프로덕션 Cloudflare D1 데이터베이스에 초기 데이터(100개 질문 + 20개 태그)를 추가하는 방법입니다.

## 방법 1: 로컬에서 wrangler 사용 (권장)

### Step 1: wrangler 로그인 확인

```bash
# wrangler 로그인 상태 확인
npx wrangler whoami

# 로그인이 안 되어 있다면
npx wrangler login
```

### Step 2: 프로덕션 DB 시딩 실행

```bash
# 프로덕션 DB에 시딩 실행
npm run db:seed:prod
```

이 명령어는 `scripts/seed.ts`를 사용하여 프로덕션 DB에 데이터를 추가합니다.

**주의**: 현재 `seed.ts`는 로컬 DB에 연결하도록 되어 있어, 프로덕션 DB에 직접 시딩하려면 수정이 필요합니다.

## 방법 2: Cloudflare D1 Studio 사용 (간단)

### Step 1: D1 Studio 접속

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
2. **Workers & Pages** → **D1** 클릭
3. `balance-moim-db-prod` 데이터베이스 선택
4. **Open D1 Studio** 버튼 클릭

### Step 2: SQL 실행

D1 Studio의 SQL 편집기에서 다음 SQL을 실행하세요:

```sql
-- 태그 시딩 (20개)
INSERT OR IGNORE INTO tag (id, name) VALUES
('tag-1', '음식'),
('tag-2', '연애'),
('tag-3', '취미'),
('tag-4', '직장생활'),
('tag-5', '여행'),
('tag-6', '패션'),
('tag-7', '운동'),
('tag-8', '영화'),
('tag-9', '음악'),
('tag-10', '게임'),
('tag-11', 'MBTI'),
('tag-12', '일상'),
('tag-13', '관계'),
('tag-14', '가치관'),
('tag-15', '습관'),
('tag-16', '건강'),
('tag-17', '돈'),
('tag-18', '라이프스타일'),
('tag-19', '자기계발'),
('tag-20', 'sns');
```

**참고**: 전체 시딩 SQL은 `scripts/seed-data.json` 파일을 참고하여 생성할 수 있습니다.

## 방법 3: wrangler d1 execute 사용

### Step 1: 시딩 SQL 파일 생성

`scripts/seed-prod.sql` 파일을 생성하고 SQL 명령어를 작성합니다.

### Step 2: 프로덕션 DB에 실행

```bash
# SQL 파일 실행
npx wrangler d1 execute balance-moim-db-prod --remote --file=scripts/seed-prod.sql

# 또는 직접 SQL 명령어 실행
npx wrangler d1 execute balance-moim-db-prod --remote --command="INSERT INTO tag (id, name) VALUES ('tag-1', '음식');"
```

## 방법 4: API 엔드포인트 사용 (보안 주의)

프로덕션 환경에서 API 엔드포인트를 만들어 시딩할 수 있지만, 보안상 권장하지 않습니다.

---

## 확인

시딩이 완료되면 다음 명령어로 확인할 수 있습니다:

```bash
# 태그 개수 확인
npx wrangler d1 execute balance-moim-db-prod --remote --command="SELECT COUNT(*) as count FROM tag;"

# 질문 개수 확인
npx wrangler d1 execute balance-moim-db-prod --remote --command="SELECT COUNT(*) as count FROM question;"
```

예상 결과:
- 태그: 20개
- 질문: 100개

---

## 문제 해결

### wrangler 로그인 오류

```bash
# wrangler 재로그인
npx wrangler login
```

### 권한 오류

Cloudflare 계정에 D1 데이터베이스 접근 권한이 있는지 확인하세요.

### 데이터 중복

시딩 스크립트는 `INSERT OR IGNORE`를 사용하여 중복 데이터를 방지합니다.

