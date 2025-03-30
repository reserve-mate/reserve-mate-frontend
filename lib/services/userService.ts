import { api } from '../api';

// 사용자 타입 정의
export interface User {
  id: number;
  username: string;
  email: string;
  // 필요한 필드 추가
}

// 로그인 요청 타입
export interface LoginRequest {
  username: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  token: string;
  user: User;
}

// 사용자 서비스
export const userService = {
  // 로그인
  login: (data: LoginRequest) => 
    api.post<LoginResponse>('/auth/login', data),
  
  // 회원가입
  register: (data: { username: string; email: string; password: string }) => 
    api.post<User>('/auth/register', data),
  
  // 사용자 정보 조회
  getCurrentUser: () => 
    api.get<User>('/users/me'),
  
  // 사용자 정보 업데이트
  updateUser: (userId: number, data: Partial<User>) => 
    api.put<User>(`/users/${userId}`, data),
  
  // 비밀번호 변경
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post('/users/change-password', data),
}; 