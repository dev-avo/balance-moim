// Cloudflare Pages Functions 환경 타입 정의

export interface Env {
  // D1 데이터베이스
  DB: D1Database;
  
  // 환경 변수
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
}

// 사용자 타입
export interface User {
  id: string;
  google_id: string;
  email: string;
  display_name: string | null;
  custom_nickname: string | null;
  use_nickname: number; // 0: 구글 이름, 1: 커스텀 닉네임
  status: number; // 1: 정상, -1: 탈퇴
  created_at: number;
  updated_at: number;
}

// 질문 타입
export interface Question {
  id: string;
  creator_id: string | null;
  title: string;
  option_a: string;
  option_b: string;
  visibility: 'public' | 'group' | 'private';
  group_id: string | null;
  deleted_at: number | null;
  created_at: number;
  updated_at: number;
}

// 태그 타입
export interface Tag {
  id: string;
  name: string;
  created_at: number;
}

// 응답 타입
export interface Response {
  id: string;
  question_id: string;
  user_id: string | null;
  selected_option: 'A' | 'B';
  created_at: number;
}

// 모임 타입
export interface UserGroup {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  created_at: number;
  updated_at: number;
}

// 모임 멤버 타입
export interface GroupMember {
  group_id: string;
  user_id: string;
  joined_at: number;
}

// 초대 링크 타입
export interface InviteLink {
  id: string;
  group_id: string;
  created_by: string;
  created_at: number;
  expires_at: number;
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// JWT 페이로드 타입
export interface JWTPayload {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

// 통계 타입
export interface QuestionStats {
  total: number;
  optionA: { count: number; percentage: number };
  optionB: { count: number; percentage: number };
}

export interface GroupStats {
  groupId: string;
  groupName: string;
  optionA: { count: number; percentage: number };
  optionB: { count: number; percentage: number };
}

// 유사도 타입
export interface SimilarityResult {
  userId: string;
  displayName: string;
  matchRate: number;
  commonCount: number;
  matchCount: number;
}
