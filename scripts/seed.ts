/**
 * 데이터 시딩 스크립트
 * 
 * ## 사용법
 * ```bash
 * # 로컬 환경
 * npx tsx scripts/seed.ts
 * 
 * # 프로덕션 환경 (Cloudflare D1)
 * npx wrangler d1 execute balance-moim-db --remote --file=scripts/seed.sql
 * ```
 * 
 * ## 기능
 * - 태그 20개 생성
 * - 질문 100개 생성 (다양한 카테고리)
 * - 질문-태그 연결
 * - 기존 데이터 확인 후 중복 방지
 */

import { db } from '../lib/db';
import { question, tag, questionTag } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import seedData from './seed-data.json';
import { v4 as uuidv4 } from 'uuid';

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
 * 시딩 실행
 */
async function seed() {
  console.log('🌱 시딩 시작...\n');

  try {
    // 1. 태그 생성
    console.log('📝 태그 생성 중...');
    const tagMap = new Map<string, string>(); // tagName -> tagId

    for(const tagName of data.tags) {
      // 기존 태그 확인
      const existingTag = await db
        .select()
        .from(tag)
        .where(eq(tag.name, tagName))
        .limit(1);

      if(existingTag.length > 0) {
        tagMap.set(tagName, existingTag[0].id);
        console.log(`  ✓ 태그 "${tagName}" 이미 존재 (ID: ${existingTag[0].id})`);
      } else {
        const tagId = uuidv4();
        await db.insert(tag).values({
          id: tagId,
          name: tagName,
        });
        tagMap.set(tagName, tagId);
        console.log(`  ✓ 태그 "${tagName}" 생성 완료 (ID: ${tagId})`);
      }
    }

    console.log(`\n✅ 총 ${tagMap.size}개 태그 준비 완료\n`);

    // 2. 질문 생성
    console.log('📝 질문 생성 중...');
    let createdCount = 0;
    let skippedCount = 0;

    for(const q of data.questions) {
      // 기존 질문 확인 (제목 중복 체크)
      const existingQuestion = await db
        .select()
        .from(question)
        .where(eq(question.title, q.title))
        .limit(1);

      if(existingQuestion.length > 0) {
        skippedCount++;
        console.log(`  ⊘ 질문 "${q.title}" 이미 존재 (건너뜀)`);
        continue;
      }

      // 질문 생성
      const questionId = uuidv4();
      
      await db.insert(question).values({
        id: questionId,
        title: q.title,
        optionA: q.optionA,
        optionB: q.optionB,
        visibility: 'public',
        creatorId: null, // 시스템 질문 (생성자 없음)
        groupId: null,
      });

      // 질문-태그 연결
      for(const tagName of q.tags) {
        const tagId = tagMap.get(tagName);
        if(tagId) {
          await db.insert(questionTag).values({
            questionId,
            tagId,
          });
        }
      }

      createdCount++;
      console.log(`  ✓ 질문 "${q.title}" 생성 완료 (태그: ${q.tags.join(', ')})`);
    }

    console.log(`\n✅ 총 ${createdCount}개 질문 생성 완료 (${skippedCount}개 건너뜀)\n`);

    // 3. 결과 요약
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 시딩 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 태그: ${tagMap.size}개`);
    console.log(`📊 질문: ${createdCount}개 생성 (${skippedCount}개 건너뜀)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch(error) {
    console.error('\n❌ 시딩 중 오류 발생:', error);
    throw error;
  }
}

// 스크립트 실행
seed()
  .then(() => {
    console.log('✅ 스크립트 실행 완료');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 스크립트 실행 실패:', error);
    process.exit(1);
  });

