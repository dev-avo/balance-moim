import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// 로컬 개발용 SQLite 데이터베이스
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!dbInstance) {
    // 로컬 개발 환경: better-sqlite3 사용
    const dbPath = path.join(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject', '0000000000000000000000000000000000000000000000000000000000000001.sqlite');
    const sqlite = new Database(dbPath);
    dbInstance = drizzle(sqlite, { schema });
  }
  
  return dbInstance;
}

export type DbClient = ReturnType<typeof getDb>;

