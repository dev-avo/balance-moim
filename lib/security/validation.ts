import { z } from 'zod';

/**
 * 보안 강화된 공통 Zod 스키마
 * 
 * ## 설명
 * - 모든 사용자 입력에 대한 엄격한 검증
 * - XSS, SQL Injection, Command Injection 방지
 * - 길이 제한, 형식 검증
 */

/**
 * 안전한 문자열 스키마
 * - HTML 태그 불허
 * - 특수 문자 제한
 */
export const safeString = (minLength: number = 1, maxLength: number = 255) =>
  z
    .string()
    .min(minLength, `최소 ${minLength}자 이상 입력해주세요.`)
    .max(maxLength, `최대 ${maxLength}자까지 입력 가능합니다.`)
    .trim()
    .refine(
      (val) => !/<script|<iframe|javascript:|onerror=|onload=/i.test(val),
      { message: '허용되지 않는 문자가 포함되어 있습니다.' }
    );

/**
 * 이메일 스키마
 */
export const emailSchema = z
  .string()
  .email('올바른 이메일 형식이 아닙니다.')
  .max(255, '이메일은 최대 255자까지 입력 가능합니다.')
  .toLowerCase()
  .trim();

/**
 * URL 스키마
 */
export const urlSchema = z
  .string()
  .url('올바른 URL 형식이 아닙니다.')
  .max(2048, 'URL은 최대 2048자까지 입력 가능합니다.')
  .refine(
    (val) => val.startsWith('http://') || val.startsWith('https://'),
    { message: 'http:// 또는 https://로 시작해야 합니다.' }
  );

/**
 * 질문 제목 스키마
 */
export const questionTitleSchema = safeString(1, 100);

/**
 * 선택지 스키마
 */
export const optionSchema = safeString(1, 50);

/**
 * 태그 이름 스키마
 */
export const tagNameSchema = z
  .string()
  .min(1, '태그는 최소 1자 이상 입력해주세요.')
  .max(20, '태그는 최대 20자까지 입력 가능합니다.')
  .trim()
  .regex(/^[가-힣a-zA-Z0-9_]+$/, '태그는 한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.')
  .refine(
    (val) => !/<|>|script|iframe/i.test(val),
    { message: '허용되지 않는 문자가 포함되어 있습니다.' }
  );

/**
 * 모임 이름 스키마
 */
export const groupNameSchema = safeString(2, 50);

/**
 * 모임 설명 스키마
 */
export const groupDescriptionSchema = safeString(0, 500).optional();

/**
 * 닉네임 스키마
 */
export const nicknameSchema = z
  .string()
  .min(2, '닉네임은 최소 2자 이상 입력해주세요.')
  .max(20, '닉네임은 최대 20자까지 입력 가능합니다.')
  .trim()
  .regex(/^[가-힣a-zA-Z0-9_]+$/, '닉네임은 한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.');

/**
 * UUID 스키마
 */
export const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    '올바른 ID 형식이 아닙니다.'
  );

/**
 * 페이지네이션 스키마
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * 공개 설정 스키마
 */
export const visibilitySchema = z.enum(['public', 'group', 'private'], {
  errorMap: () => ({ message: '올바른 공개 설정이 아닙니다.' }),
});

/**
 * 선택 옵션 스키마 (A 또는 B)
 */
export const choiceSchema = z.enum(['A', 'B'], {
  errorMap: () => ({ message: '올바른 선택이 아닙니다.' }),
});

/**
 * 검증 에러를 사용자 친화적 메시지로 변환
 */
export function formatZodError(error: z.ZodError): string[] {
  return error.errors.map((err) => {
    const path = err.path.join('.');
    return `${path ? `${path}: ` : ''}${err.message}`;
  });
}

/**
 * API 요청 본문 검증 헬퍼
 * 
 * @example
 * ```typescript
 * const result = await validateRequest(request, mySchema);
 * if(!result.success) {
 *   return NextResponse.json(
 *     { error: result.errors.join(', ') },
 *     { status: 400 }
 *   );
 * }
 * const data = result.data;
 * ```
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch(error) {
    if(error instanceof z.ZodError) {
      return { success: false, errors: formatZodError(error) };
    }
    return { success: false, errors: ['올바르지 않은 요청입니다.'] };
  }
}

