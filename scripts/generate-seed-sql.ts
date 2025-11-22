/**
 * 시딩 SQL 파일 생성 스크립트
 * 
 * seed-data.json을 읽어서 프로덕션 DB용 SQL 파일을 생성합니다.
 */

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import seedData from './seed-data.json';

interface SeedQuestion {
  title: string;
  optionA: string;
  optionB: string;
  tags: string[];
}

interface SeedData {
  tags: string[];
  questions: SeedQuestion[];
}

const data: SeedData = seedData as SeedData;

/**
 * SQL 이스케이프
 */
function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

/**
 * SQL 파일 생성
 */
function generateSql() {
  console.log('📝 시딩 SQL 파일 생성 중...\n');

  let sql = `-- 프로덕션 DB 시딩 SQL
-- 이 파일은 scripts/seed-data.json을 기반으로 생성되었습니다
-- 실행 방법: npx wrangler d1 execute balance-moim-db-prod --remote --file=scripts/seed-prod.sql

-- 태그 ${data.tags.length}개 생성
INSERT OR IGNORE INTO tag (id, name) VALUES
`;

  // 태그 생성
  const tagMap = new Map<string, string>();
  const tagValues: string[] = [];

  data.tags.forEach((tagName) => {
    const tagId = uuidv4();
    tagMap.set(tagName, tagId);
    tagValues.push(`('${tagId}', '${escapeSql(tagName)}')`);
  });

  sql += tagValues.join(',\n') + ';\n\n';

  // 질문 생성
  sql += `-- 질문 ${data.questions.length}개 생성\n`;
  let questionCount = 0;

  data.questions.forEach((q) => {
    const questionId = uuidv4();
    // Unix timestamp (초 단위)
    const now = Math.floor(Date.now() / 1000);

    sql += `-- 질문: ${q.title}\n`;
    sql += `INSERT OR IGNORE INTO question (id, title, option_a, option_b, visibility, creator_id, group_id, deleted_at, created_at, updated_at) VALUES `;
    sql += `('${questionId}', '${escapeSql(q.title)}', '${escapeSql(q.optionA)}', '${escapeSql(q.optionB)}', 'public', NULL, NULL, NULL, ${now}, ${now});\n`;

    // 질문-태그 연결 (태그 이름으로 조회하여 안전하게 삽입)
    q.tags.forEach((tagName) => {
      const escapedTagName = escapeSql(tagName);
      sql += `INSERT OR IGNORE INTO question_tag (question_id, tag_id) SELECT '${questionId}', id FROM tag WHERE name = '${escapedTagName}' LIMIT 1;\n`;
    });

    sql += '\n';
    questionCount++;
  });

  sql += `\n-- 총 ${data.tags.length}개 태그, ${questionCount}개 질문 생성 완료\n`;

  // 파일 저장
  const outputPath = path.join(__dirname, 'seed-prod.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');

  console.log(`✅ SQL 파일 생성 완료: ${outputPath}`);
  console.log(`📊 태그: ${data.tags.length}개`);
  console.log(`📊 질문: ${questionCount}개\n`);
  console.log('💡 다음 명령어로 프로덕션 DB에 시딩할 수 있습니다:');
  console.log('   npx wrangler d1 execute balance-moim-db-prod --remote --file=scripts/seed-prod.sql\n');
}

// 실행
generateSql();

