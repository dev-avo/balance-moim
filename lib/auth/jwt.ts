// JWT 유틸리티 (jose 라이브러리 사용 - Cloudflare Workers 호환)
import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';

// JWT 페이로드 타입
export interface JWTPayload extends JoseJWTPayload {
  userId: string;
  email: string;
}

// 텍스트 인코더 (시크릿 키 변환용)
const getSecretKey = (secret: string): Uint8Array => {
  return new TextEncoder().encode(secret);
};

/**
 * JWT 토큰 생성
 * @param payload - 토큰에 담을 데이터 (userId, email)
 * @param secret - JWT 시크릿 키
 * @param expiresIn - 만료 시간 (기본: 7일)
 * @returns JWT 토큰 문자열
 */
export async function signJWT(
  payload: { userId: string; email: string },
  secret: string,
  expiresIn: string = '7d'
): Promise<string> {
  const secretKey = getSecretKey(secret);
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
  
  return token;
}

/**
 * JWT 토큰 검증
 * @param token - JWT 토큰 문자열
 * @param secret - JWT 시크릿 키
 * @returns 검증된 페이로드 또는 null (검증 실패 시)
 */
export async function verifyJWT(
  token: string,
  secret: string
): Promise<JWTPayload | null> {
  try {
    const secretKey = getSecretKey(secret);
    
    const { payload } = await jwtVerify(token, secretKey);
    
    // 필수 필드 확인
    if (!payload.userId || !payload.email) {
      return null;
    }
    
    return payload as JWTPayload;
  } catch (error) {
    // 토큰 만료, 서명 불일치 등 모든 에러는 null 반환
    console.error('JWT 검증 실패:', error);
    return null;
  }
}

/**
 * JWT 토큰에서 페이로드 추출 (검증 없이)
 * 주의: 디버깅 용도로만 사용, 실제 인증에는 verifyJWT 사용
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload as JWTPayload;
  } catch {
    return null;
  }
}
