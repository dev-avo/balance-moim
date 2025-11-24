// GET /api/questions/[questionId]/stats
// 특정 질문의 통계를 가져옵니다.

export const onRequestGet: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    try {
        // 환경 변수 설정
        process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
        process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
        process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
        process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
        
        if(!context.env.DB) {
            return new Response(
                JSON.stringify({ error: '데이터베이스 연결 오류' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const { setDb, getDb } = await import('../../../../../lib/db');
        const { response, question, groupMember, userGroup } = await import('../../../../../lib/db/schema');
        const { eq, and, sql } = await import('drizzle-orm');
        const { getCurrentUser } = await import('../../../../../lib/auth/session');
        
        setDb(context.env.DB);
        const db = getDb();
        
        // URL에서 questionId 추출
        const url = new URL(context.request.url);
        const pathParts = url.pathname.split('/');
        const questionId = pathParts[pathParts.length - 2]; // /api/questions/[questionId]/stats
        
        // 질문 존재 확인
        const existingQuestion = await db
            .select()
            .from(question)
            .where(eq(question.id, questionId))
            .limit(1);
        
        if(existingQuestion.length === 0) {
            return new Response(
                JSON.stringify({ error: '질문을 찾을 수 없습니다.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // 전체 통계 계산
        const allResponses = await db
            .select({
                selectedOption: response.selectedOption,
                count: sql<number>`count(*)`,
            })
            .from(response)
            .where(eq(response.questionId, questionId))
            .groupBy(response.selectedOption);
        
        const optionACount = allResponses.find((r) => r.selectedOption === 'A')?.count || 0;
        const optionBCount = allResponses.find((r) => r.selectedOption === 'B')?.count || 0;
        const totalResponses = optionACount + optionBCount;
        
        const optionAPercentage = totalResponses > 0 
            ? Math.round((optionACount / totalResponses) * 100) 
            : 0;
        const optionBPercentage = totalResponses > 0 
            ? Math.round((optionBCount / totalResponses) * 100) 
            : 0;
        
        // 현재 사용자의 선택 확인
        const secret = context.env.NEXTAUTH_SECRET || '';
        const currentUser = await getCurrentUser(context.request, secret);
        let userSelection: 'A' | 'B' | null = null;
        
        if(currentUser) {
            const userResponse = await db
                .select({ selectedOption: response.selectedOption })
                .from(response)
                .where(
                    and(
                        eq(response.questionId, questionId),
                        eq(response.userId, currentUser.id)
                    )
                )
                .limit(1);
            
            if(userResponse.length > 0) {
                userSelection = userResponse[0].selectedOption as 'A' | 'B';
            }
        }
        
        // 모임별 통계 (로그인 사용자만)
        const groupStats = [];
        
        if(currentUser) {
            // 사용자가 속한 모임 목록 가져오기
            const userGroups = await db
                .select({
                    groupId: groupMember.groupId,
                    groupName: userGroup.name,
                })
                .from(groupMember)
                .innerJoin(userGroup, eq(groupMember.groupId, userGroup.id))
                .where(eq(groupMember.userId, currentUser.id));
            
            // 각 모임별 통계 계산
            for(const group of userGroups) {
                // 모임 멤버들의 응답 가져오기
                const groupResponses = await db
                    .select({
                        selectedOption: response.selectedOption,
                        count: sql<number>`count(*)`,
                    })
                    .from(response)
                    .innerJoin(groupMember, eq(response.userId, groupMember.userId))
                    .where(
                        and(
                            eq(response.questionId, questionId),
                            eq(groupMember.groupId, group.groupId)
                        )
                    )
                    .groupBy(response.selectedOption);
                
                const groupOptionACount = groupResponses.find((r) => r.selectedOption === 'A')?.count || 0;
                const groupOptionBCount = groupResponses.find((r) => r.selectedOption === 'B')?.count || 0;
                const groupTotalResponses = groupOptionACount + groupOptionBCount;
                
                const groupOptionAPercentage = groupTotalResponses > 0
                    ? Math.round((groupOptionACount / groupTotalResponses) * 100)
                    : 0;
                const groupOptionBPercentage = groupTotalResponses > 0
                    ? Math.round((groupOptionBCount / groupTotalResponses) * 100)
                    : 0;
                
                groupStats.push({
                    groupId: group.groupId,
                    groupName: group.groupName,
                    totalResponses: groupTotalResponses,
                    optionACount: groupOptionACount,
                    optionBCount: groupOptionBCount,
                    optionAPercentage: groupOptionAPercentage,
                    optionBPercentage: groupOptionBPercentage,
                });
            }
        }
        
        // 응답 반환
        return new Response(
            JSON.stringify({
                questionId,
                totalResponses,
                optionACount,
                optionBCount,
                optionAPercentage,
                optionBPercentage,
                userSelection,
                groupStats,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch(error) {
        console.error('질문 통계 조회 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: '통계를 가져오는 중 오류가 발생했습니다.', details: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
