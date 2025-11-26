// API 서비스 모듈
// 모든 API 호출을 중앙에서 관리

const API_BASE = '/api';

/**
 * 기본 API 호출 함수
 * @param {string} endpoint - API 엔드포인트 (/api 제외)
 * @param {Object} options - fetch 옵션
 * @returns {Promise<Object>} API 응답
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include', // 쿠키 포함
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  // JSON 응답 파싱
  let data;
  try {
    data = await response.json();
  } catch {
    data = { success: false, error: '응답을 파싱할 수 없습니다.' };
  }
  
  // 에러 처리
  if (!response.ok) {
    throw new APIError(
      data.error || `HTTP ${response.status} 오류`,
      response.status,
      data
    );
  }
  
  return data;
}

/**
 * API 에러 클래스
 */
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// =====================================================
// 인증 API
// =====================================================
export const authAPI = {
  /** 세션 확인 */
  getSession: () => fetchAPI('/auth/session'),
  
  /** 로그아웃 */
  signout: () => fetchAPI('/auth/signout', { method: 'POST' }),
};

// =====================================================
// 사용자 API
// =====================================================
export const userAPI = {
  /** 내 정보 조회 */
  getMe: () => fetchAPI('/users/me'),
  
  /** 내 정보 수정 */
  updateMe: (data) => fetchAPI('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  /** 회원 탈퇴 */
  deleteMe: () => fetchAPI('/users/me', { method: 'DELETE' }),
};

// =====================================================
// 질문 API
// =====================================================
export const questionAPI = {
  /** 랜덤 질문 가져오기 */
  getRandom: (tags = []) => {
    const params = tags.length > 0 ? `?tags=${tags.join(',')}` : '';
    return fetchAPI(`/questions/random${params}`);
  },
  
  /** 모임 전용 랜덤 질문 가져오기 */
  getRandomForGroup: (groupId) => {
    return fetchAPI(`/questions/random?groupId=${groupId}`);
  },
  
  /** 내가 만든 질문 목록 */
  getMy: (page = 1, limit = 10) => 
    fetchAPI(`/questions/my?page=${page}&limit=${limit}`),
  
  /** 질문 상세 */
  getDetail: (id) => fetchAPI(`/questions/${id}`),
  
  /** 질문 생성 */
  create: (data) => fetchAPI('/questions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  /** 질문 수정 */
  update: (id, data) => fetchAPI(`/questions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  /** 질문 삭제 */
  delete: (id) => fetchAPI(`/questions/${id}`, {
    method: 'DELETE',
  }),
  
  /** 질문 통계 */
  getStats: (id) => fetchAPI(`/questions/stats?id=${id}`),
};

// =====================================================
// 응답 API
// =====================================================
export const responseAPI = {
  /** 응답 제출 */
  submit: (questionId, selectedOption) => fetchAPI('/responses', {
    method: 'POST',
    body: JSON.stringify({ questionId, selectedOption }),
  }),
};

// =====================================================
// 모임 API
// =====================================================
export const groupAPI = {
  /** 내 모임 목록 */
  getMy: (page = 1, limit = 10) => 
    fetchAPI(`/groups/my?page=${page}&limit=${limit}`),
  
  /** 모임 상세 */
  getDetail: (id) => fetchAPI(`/groups/${id}`),
  
  /** 모임 생성 */
  create: (data) => fetchAPI('/groups', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  /** 모임 수정 */
  update: (id, data) => fetchAPI(`/groups/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  /** 모임 삭제 */
  delete: (id) => fetchAPI(`/groups/${id}`, {
    method: 'DELETE',
  }),
  
  /** 초대 링크 생성 */
  createInvite: (id) => fetchAPI(`/groups/invite?id=${id}`, {
    method: 'POST',
  }),
  
  /** 초대로 모임 참여 */
  join: (code) => fetchAPI(`/groups/join?code=${code}`, {
    method: 'POST',
  }),
  
  /** 초대 정보 조회 */
  getInviteInfo: (code) => fetchAPI(`/groups/join?code=${code}`),
  
  /** 모임 나가기 */
  leave: (id) => fetchAPI(`/groups/leave?id=${id}`, {
    method: 'POST',
  }),
  
  /** 사용자 비교 */
  getCompare: (groupId, userId) => 
    fetchAPI(`/groups/compare?groupId=${groupId}&userId=${userId}`),
  
  /** 멤버 추방 */
  removeMember: (groupId, userId) => 
    fetchAPI(`/groups/members?groupId=${groupId}&userId=${userId}`, {
      method: 'DELETE',
    }),
  
  /** 모임 응답 목록 */
  getResponses: (id, tag = '') => {
    const params = tag ? `&tag=${tag}` : '';
    return fetchAPI(`/groups/responses?id=${id}${params}`);
  },
  
  /** 질문별 멤버 목록 조회 */
  getQuestionMembers: (groupId, questionId) => 
    fetchAPI(`/groups/responses?id=${groupId}&questionId=${questionId}`),
  
  /** 취향 유사도 */
  getSimilarity: (id) => fetchAPI(`/groups/similarity?id=${id}`),
  
  /** 사용자 비교 */
  getCompare: (groupId, userId) => 
    fetchAPI(`/groups/compare?groupId=${groupId}&userId=${userId}`),
};

// =====================================================
// 태그 API
// =====================================================
export const tagAPI = {
  /** 전체 태그 목록 */
  getAll: () => fetchAPI('/tags'),
  
  /** 태그 검색 */
  search: (query) => fetchAPI(`/tags/search?q=${encodeURIComponent(query)}`),
  
  /** 태그 생성 */
  create: (name) => fetchAPI('/tags', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
};

// 기본 내보내기
export default {
  auth: authAPI,
  user: userAPI,
  question: questionAPI,
  response: responseAPI,
  group: groupAPI,
  tag: tagAPI,
};
