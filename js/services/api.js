/**
 * API 서비스 레이어
 * 모든 API 호출을 중앙에서 관리
 */

const API_BASE = '';

/**
 * 기본 fetch 래퍼
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, config);
        
        // 응답이 JSON이 아닌 경우 처리
        const contentType = response.headers.get('content-type');
        if(!contentType || !contentType.includes('application/json')) {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return null;
        }
        
        const data = await response.json();
        
        if(!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch(error) {
        console.error('API request error:', error);
        throw error;
    }
}

/**
 * GET 요청
 */
export function get(endpoint) {
    return request(endpoint, { method: 'GET' });
}

/**
 * POST 요청
 */
export function post(endpoint, body) {
    return request(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
    });
}

/**
 * PUT 요청
 */
export function put(endpoint, body) {
    return request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body)
    });
}

/**
 * PATCH 요청
 */
export function patch(endpoint, body) {
    return request(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body)
    });
}

/**
 * DELETE 요청
 */
export function del(endpoint) {
    return request(endpoint, { method: 'DELETE' });
}

/**
 * 사용자 API
 */
export const userApi = {
    getMe: () => get('/api/users/me'),
    updateSettings: (settings) => patch('/api/users/settings', settings)
};

/**
 * 질문 API
 */
export const questionApi = {
    getRandom: (tags) => {
        const query = tags ? `?tags=${encodeURIComponent(tags)}` : '';
        return get(`/api/questions/random${query}`);
    },
    getById: (id) => get(`/api/questions/${id}`),
    getStats: (id) => get(`/api/questions/${id}/stats`),
    getMy: (page = 1, limit = 10) => get(`/api/questions/my?page=${page}&limit=${limit}`),
    create: (data) => post('/api/questions', data),
    update: (id, data) => patch(`/api/questions/${id}`, data),
    delete: (id) => del(`/api/questions/${id}`)
};

/**
 * 응답 API
 */
export const responseApi = {
    create: (data) => post('/api/responses', data)
};

/**
 * 그룹 API
 */
export const groupApi = {
    getMy: (page = 1, limit = 10) => get(`/api/groups/my?page=${page}&limit=${limit}`),
    getById: (id) => get(`/api/groups/${id}`),
    create: (data) => post('/api/groups', data),
    update: (id, data) => patch(`/api/groups/${id}`, data),
    delete: (id) => del(`/api/groups/${id}`),
    leave: (id) => del(`/api/groups/${id}/leave`),
    getResponses: (id) => get(`/api/groups/${id}/responses`),
    getSimilarity: (id) => get(`/api/groups/${id}/similarity`),
    createInvite: (id) => post(`/api/groups/${id}/invite`),
    joinByInvite: (code) => post(`/api/groups/join/${code}`),
    compare: (groupId, userId) => get(`/api/groups/${groupId}/compare/${userId}`)
};

/**
 * 태그 API
 */
export const tagApi = {
    getAll: () => get('/api/tags'),
    search: (query, limit = 10) => get(`/api/tags/search?q=${encodeURIComponent(query)}&limit=${limit}`)
};
