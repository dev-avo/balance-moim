import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
// Cloudflare Pages Functions에서는 경로 별칭(@/)이 작동하지 않으므로 상대 경로 사용
import { getDb } from './lib/db';
import { user as userTable } from './lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from './lib/utils';

// NextAuth 설정
const nextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt' as const, // JWT 전략 사용
  },
  pages: {
    signIn: '/api/auth/signin',
    error: '/auth/callback-error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if(!account || !profile) return false;

      try {
        // DB가 설정되어 있는지 확인
        const db = getDb();
        
        // Google ID로 기존 사용자 조회
        const existingUser = await db
          .select()
          .from(userTable)
          .where(eq(userTable.googleId, account.providerAccountId))
          .limit(1);

        if(existingUser.length === 0) {
          // 신규 사용자 생성
          await db.insert(userTable).values({
            id: generateId(),
            googleId: account.providerAccountId,
            email: user.email!,
            displayName: user.name || null,
            customNickname: null,
            useNickname: false,
            status: 1, // 정상 사용자
          });
        } else {
          // 기존 사용자 정보 업데이트 (이메일, 이름 변경 가능성)
          await db
            .update(userTable)
            .set({
              email: user.email!,
              displayName: user.name || null,
            })
            .where(eq(userTable.googleId, account.providerAccountId));
        }

        return true;
      } catch(error) {
        console.error('Error saving user to database:', error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      // Google OAuth 정보 저장
      if(account && profile) {
        try {
        const db = getDb();
        
        // DB에서 사용자 정보 조회
        const dbUser = await db
          .select()
          .from(userTable)
          .where(eq(userTable.googleId, account.providerAccountId))
          .limit(1);

        if(dbUser.length > 0) {
          token.id = dbUser[0].id;
          token.googleId = dbUser[0].googleId;
          token.email = dbUser[0].email;
          token.name = dbUser[0].displayName;
          token.status = dbUser[0].status;
          }
        } catch(error) {
          console.error('JWT 콜백에서 DB 접근 오류:', error);
          // DB 접근 실패 시에도 토큰은 반환 (기존 토큰 정보 유지)
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // 세션에 사용자 정보 추가
      if(token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};

// NextAuth 초기화 및 export
// 구조 분해 할당 대신 명시적으로 export하여 Cloudflare Pages Functions에서 안정적으로 작동하도록 함
const nextAuth = NextAuth(nextAuthConfig);

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;

// auth 함수를 직접 구현하여 export
// NextAuth v5 beta에서는 auth가 제대로 export되지 않을 수 있으므로 직접 구현
// handlers를 직접 사용하여 세션 정보 가져오기
async function authFunction(request?: Request) {
  // Request가 없으면 null 반환
  if(!request) {
    return null;
  }
  
  try {
    // handlers.GET을 직접 호출하여 세션 정보 가져오기
    // /api/auth/session 경로로 요청을 만들어서 전달
    const url = new URL(request.url);
    url.pathname = '/api/auth/session';
    const sessionRequest = new Request(url.toString(), {
      method: 'GET',
      headers: request.headers,
    });
    
    const response = await handlers.GET(sessionRequest as any);
    if(response.ok) {
      const session = await response.json();
      return session;
    }
    return null;
  } catch(error) {
    console.error('auth 함수 오류:', error);
    return null;
  }
}

// named export와 default export 모두 제공하여 동적 import에서 안정적으로 작동하도록 함
export const auth = authFunction;
export default authFunction;

