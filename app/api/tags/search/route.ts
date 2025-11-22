import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tag } from '@/lib/db/schema';
import { like, sql } from 'drizzle-orm';

export const runtime = 'edge';

/**
 * GET /api/tags/search
 * 
 * 태그를 검색합니다. 질문 등록 시 자동완성 기능에 사용됩니다.
 * 
 * ## Query Parameters
 * - q: 검색 키워드 (선택사항)
 * - limit: 반환할 최대 개수 (기본값: 10)
 * 
 * ## 로직
 * - q가 없으면: 인기 태그 반환 (사용 빈도가 높은 순)
 * - q가 있으면: LIKE 검색으로 매칭되는 태그 반환
 * 
 * ## 응답 예시
 * ```json
 * {
 *   "tags": [
 *     { "id": "tag1", "name": "음식" },
 *     { "id": "tag2", "name": "영화" }
 *   ]
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    let tags;

    if(query) {
      // 검색 키워드가 있으면 LIKE 검색
      tags = await db
        .select()
        .from(tag)
        .where(like(tag.name, `%${query}%`))
        .limit(limit);
    } else {
      // 검색 키워드가 없으면 모든 태그 반환 (최신순)
      tags = await db
        .select()
        .from(tag)
        .orderBy(tag.createdAt)
        .limit(limit);
    }

    return NextResponse.json({ tags });
  } catch(error) {
    console.error('태그 검색 오류:', error);
    return NextResponse.json(
      { error: '태그를 검색하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

