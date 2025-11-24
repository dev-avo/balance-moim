/**
 * JWT 토큰 생성 및 검증 유틸리티
 * Cloudflare Pages Functions 환경에 최적화
 */

/**
 * JWT 토큰 생성
 */
export async function createJWT(payload: Record<string, any>, secret: string): Promise<string> {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    
    // Base64 URL 인코딩
    const base64UrlEncode = (str: string): string => {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    };
    
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    
    // 서명 생성 (HMAC-SHA256)
    const data = `${encodedHeader}.${encodedPayload}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    // 서명을 Base64 URL 인코딩
    const signatureArray = new Uint8Array(signature);
    // 바이너리 데이터를 Base64로 직접 인코딩
    let binaryString = '';
    for(let i = 0; i < signatureArray.length; i++) {
        binaryString += String.fromCharCode(signatureArray[i]);
    }
    const encodedSignature = base64UrlEncode(binaryString);
    
    return `${data}.${encodedSignature}`;
}

/**
 * JWT 토큰 검증
 */
export async function verifyJWT(token: string, secret: string): Promise<Record<string, any> | null> {
    try {
        const parts = token.split('.');
        if(parts.length !== 3) {
            return null;
        }
        
        const [encodedHeader, encodedPayload, encodedSignature] = parts;
        
        // 서명 검증
        const data = `${encodedHeader}.${encodedPayload}`;
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const messageData = encoder.encode(data);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );
        
        // Base64 URL 디코딩
        const base64UrlDecode = (str: string): Uint8Array => {
            const base64 = str
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            const padding = '='.repeat((4 - base64.length % 4) % 4);
            const binaryString = atob(base64 + padding);
            return new Uint8Array(binaryString.split('').map(c => c.charCodeAt(0)));
        };
        
        const signature = base64UrlDecode(encodedSignature);
        const isValid = await crypto.subtle.verify('HMAC', cryptoKey, signature, messageData);
        
        if(!isValid) {
            return null;
        }
        
        // Payload 디코딩
        const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
        
        // 만료 시간 확인
        if(payload.exp && payload.exp < Date.now() / 1000) {
            return null;
        }
        
        return payload;
    } catch(error) {
        console.error('JWT 검증 오류:', error);
        return null;
    }
}
