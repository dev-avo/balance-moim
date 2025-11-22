import * as schema from './schema';
import { drizzle } from 'drizzle-orm/d1';

// Cloudflare Pages 환경에서는 D1 데이터베이스를 사용
// Edge Runtime에서는 better-sqlite3를 사용할 수 없으므로 D1만 사용

// 전역 변수로 D1 데이터베이스 저장 (Cloudflare Pages 환경)
const globalForDb = globalThis as unknown as {
  dbInstance: ReturnType<typeof createDbFromD1> | undefined;
  d1Database: D1Database | undefined;
};

// Cloudflare Pages 환경에서 D1 데이터베이스 생성
function createDbFromD1(d1Database: D1Database) {
  return drizzle(d1Database, { schema });
}

// 데이터베이스 인스턴스 생성
function createDb() {
  // Cloudflare Pages 환경: D1 데이터베이스 사용
  if(globalForDb.d1Database) {
    return createDbFromD1(globalForDb.d1Database);
  }
  
  // Edge Runtime에서는 better-sqlite3를 사용할 수 없음
  throw new Error('D1 데이터베이스가 설정되지 않았습니다. Cloudflare Pages 환경에서는 setDb(d1Database)를 먼저 호출해야 합니다.');
}

// D1 데이터베이스 설정 (Cloudflare Pages 환경에서 호출)
export function setDb(d1Database: D1Database) {
  globalForDb.d1Database = d1Database;
  // 기존 인스턴스가 있으면 재생성
  if(globalForDb.dbInstance) {
    globalForDb.dbInstance = createDbFromD1(d1Database);
  }
}

export function getDb() {
  if(!globalForDb.dbInstance) {
    globalForDb.dbInstance = createDb();
  }
  return globalForDb.dbInstance;
}

// db export (기존 코드와의 호환성)
// Edge Runtime에서 모듈 로드 시점에 D1이 설정되지 않으므로 Proxy 사용
// 실제 사용 시점에 getDb()를 호출하여 D1 인스턴스 반환
// 각 API 라우트에서 setDb(env.DB)를 먼저 호출해야 함
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(target, prop) {
    try {
      // 실제 db 인스턴스 반환 (D1이 설정되어 있어야 함)
      const dbInstance = getDb();
      const value = dbInstance[prop as keyof ReturnType<typeof getDb>];
      // 함수인 경우 this 바인딩 유지
      if(typeof value === 'function') {
        return value.bind(dbInstance);
      }
      return value;
    } catch(error) {
      // D1이 설정되지 않은 경우 에러 발생
      throw new Error('D1 데이터베이스가 설정되지 않았습니다. API 라우트에서 setDb(env.DB)를 먼저 호출해야 합니다.');
    }
  }
});

export type DbClient = ReturnType<typeof getDb>;

