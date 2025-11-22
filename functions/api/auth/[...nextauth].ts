// NextAuth를 Cloudflare Pages Functions에서 사용하기 위한 래퍼
// NextAuth v5는 Edge Runtime을 지원하므로 Cloudflare Pages에서도 작동 가능

export const onRequest: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    // 환경 변수를 process.env에 설정 (NextAuth가 사용)
    process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
    process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
    process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
    
    // 동적 import로 NextAuth handlers 로드
    const { handlers } = await import('../../../auth');
    const { setDb } = await import('../../../lib/db');
    
    // D1 데이터베이스 설정
    setDb(context.env.DB);
    
    // NextAuth handlers 호출
    const request = context.request;
    const response = await handlers.GET(request as any);
    return response;
};

export const onRequestPost: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string; NEXTAUTH_SECRET: string; NEXTAUTH_URL: string }> = async (context) => {
    // 환경 변수를 process.env에 설정
    process.env.GOOGLE_CLIENT_ID = context.env.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = context.env.GOOGLE_CLIENT_SECRET;
    process.env.NEXTAUTH_SECRET = context.env.NEXTAUTH_SECRET;
    process.env.NEXTAUTH_URL = context.env.NEXTAUTH_URL;
    
    // 동적 import로 NextAuth handlers 로드
    const { handlers } = await import('../../../auth');
    const { setDb } = await import('../../../lib/db');
    
    // D1 데이터베이스 설정
    setDb(context.env.DB);
    
    // NextAuth handlers 호출
    const request = context.request;
    const response = await handlers.POST(request as any);
    return response;
};
