import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// 개발 환경: SQLite, 프로덕션: Cloudflare D1
export function getDb(d1Database?: D1Database) {
  if (!d1Database) {
    throw new Error('Database instance not provided');
  }
  
  return drizzle(d1Database, { schema });
}

export type DbClient = ReturnType<typeof getDb>;

