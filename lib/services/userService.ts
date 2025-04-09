import { api } from '../api';

// 사용자 역할 열거형
export enum UserRole {
  ROLE_USER = 'ROLE_USER',
  ROLE_FACILITY_MANAGER = 'ROLE_FACILITY_MANAGER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

// 사용자 타입 정의
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  // 필요한 필드 추가
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  token: string;
  user: User;
}

// 시설 관리자 생성 요청 타입
export interface CreateManagerRequest {
  username: string;
  email: string;
  password: string;
  facilityId: number;
}

// 시설 관리자 타입
export interface FacilityManager extends User {
  facilityId: number;
}

// 사용자 서비스
export const userService = {
  // 로그인
  login: (data: LoginRequest) => 
    api.post<LoginResponse>('/login', data),

  // 로그아웃
  logout: () =>
    api.post('/logout'),
  
  // 회원가입
  register: (data: { username: string; email: string; password: string }) => 
    api.post<User>('/auth/register', data),
  
  // 사용자 정보 조회
  getCurrentUser: () => 
    api.get<User>('/users/me/profile'),
  
  // 사용자 정보 업데이트
  updateUser: (userId: number, data: Partial<User>) => 
    api.put<User>(`/users/${userId}`, data),
  
  // 비밀번호 변경
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post('/users/change-password', data),
    
  // 시설 관리자 생성 (ADMIN 전용)
  createFacilityManager: (data: CreateManagerRequest) =>
    api.post<FacilityManager>('/admin/facility-managers', data),
    
  // 시설의 관리자 목록 조회
  getFacilityManagers: (facilityId: number) =>
    api.get<FacilityManager[]>(`/admin/facilities/${facilityId}/managers`),
    
  // 시설 관리자 정보 수정
  updateFacilityManager: (managerId: number, data: Partial<FacilityManager>) =>
    api.put<FacilityManager>(`/admin/facility-managers/${managerId}`, data),
    
  // 시설 관리자 삭제
  deleteFacilityManager: (managerId: number) =>
    api.delete(`/admin/facility-managers/${managerId}`),
}; 