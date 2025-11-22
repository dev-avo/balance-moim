import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// 로컬 개발용 SQLite 데이터베이스 인스턴스 생성
function createDb() {
  // 로컬 개발 환경: better-sqlite3 사용
  const dbPath = path.join(
    process.cwd(),
    '.wrangler/state/v3/d1/miniflare-D1DatabaseObject',
    '2549d8d3bab8cbb0e514e6812bca2f8ebcce04327a5b13dc6e63f52fcd550126.sqlite'
  );
  const sqlite = new Database(dbPath);
  return drizzle(sqlite, { schema });
}

// 싱글톤 인스턴스 (전역 변수 사용)
const globalForDb = globalThis as unknown as {
  dbInstance: ReturnType<typeof createDb> | undefined;
};

export function getDb() {
  if(!globalForDb.dbInstance) {
    globalForDb.dbInstance = createDb();
  }
  return globalForDb.dbInstance;
}

// db export 추가 (기존 코드와의 호환성)
export const db = getDb();

export type DbClient = ReturnType<typeof getDb>;

