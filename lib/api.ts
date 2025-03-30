// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// 토큰 가져오기 함수
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// 기본 fetch 래퍼 함수
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  // 기본 헤더 설정
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  // 인증 토큰이 있으면 Authorization 헤더 추가
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 401 Unauthorized 처리 - 토큰 만료 등
  if (response.status === 401) {
    // 로컬 스토리지에서 토큰 제거
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      // 로그인 페이지로 리다이렉트 (옵션)
      window.location.href = '/login';
    }
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
  }

  if (!response.ok) {
    // API 오류 처리
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `API 요청 실패: ${response.status}`);
  }

  // 204 No Content 응답인 경우 빈 객체 반환
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// API 메서드
export const api = {
  // GET 요청
  get: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  
  // POST 요청
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    fetchApi<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    }),
  
  // PUT 요청
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    fetchApi<T>(endpoint, { 
      ...options, 
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    }),
  
  // PATCH 요청
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    fetchApi<T>(endpoint, { 
      ...options, 
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    }),
  
  // DELETE 요청
  delete: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
}; 