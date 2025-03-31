import { api } from '../api';
import { FacilityManager } from './userService';

// 시설 타입 정의
export interface Facility {
  id: number;
  name: string;
  sportType: string;
  address: string;
  detailAddress?: string;
  description?: string;
  operatingHours: string;
  courtsCount: number;
  hasParking: boolean;
  hasShower: boolean;
  hasEquipmentRental: boolean;
  hasCafe: boolean;
  active: boolean;
  images?: string[];
  managers?: FacilityManager[];
}

// 코트 타입 정의
export interface Court {
  id: number;
  facilityId: number;
  name: string;
  type: string;
  width: number;
  height: number;
  isActive: boolean;
}

// 시설 등록 요청 타입
export interface CreateFacilityRequest {
  name: string;
  sportType: string;
  address: string;
  detailAddress?: string;
  description?: string;
  openingHours: string;
  closingHours: string;
  hasParking: boolean;
  hasShower: boolean;
  hasEquipmentRental: boolean;
  hasCafe: boolean;
  courts: Omit<Court, 'id' | 'facilityId'>[];
  images?: File[];
}

// 시설 서비스
export const facilityService = {
  // 시설 목록 조회
  getFacilities: () => 
    api.get<Facility[]>('/facilities'),
  
  // 시설 상세 조회
  getFacility: (id: number) => 
    api.get<Facility>(`/facilities/${id}`),
  
  // 시설 등록 (관리자 전용)
  createFacility: (data: CreateFacilityRequest) => {
    const formData = new FormData();
    
    // JSON 데이터를 FormData에 추가
    formData.append('facilityData', JSON.stringify({
      name: data.name,
      sportType: data.sportType,
      address: data.address,
      detailAddress: data.detailAddress,
      description: data.description,
      operatingHours: `${data.openingHours}-${data.closingHours}`,
      hasParking: data.hasParking,
      hasShower: data.hasShower,
      hasEquipmentRental: data.hasEquipmentRental,
      hasCafe: data.hasCafe,
      courts: data.courts,
    }));
    
    // 이미지 파일 추가
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }
    
    return api.post<Facility>('/admin/facilities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 시설 정보 수정 (관리자 전용)
  updateFacility: (id: number, data: Partial<Facility>) => 
    api.put<Facility>(`/admin/facilities/${id}`, data),
  
  // 시설 상태 변경 (활성/비활성) (관리자 전용)
  toggleFacilityStatus: (id: number) => 
    api.patch<Facility>(`/admin/facilities/${id}/toggle-status`),
  
  // 시설 삭제 (관리자 전용)
  deleteFacility: (id: number) => 
    api.delete(`/admin/facilities/${id}`),
  
  // 시설의 코트 목록 조회
  getCourts: (facilityId: number) => 
    api.get<Court[]>(`/facilities/${facilityId}/courts`),
  
  // 코트 추가 (관리자 전용)
  createCourt: (facilityId: number, data: Omit<Court, 'id' | 'facilityId'>) => 
    api.post<Court>(`/admin/facilities/${facilityId}/courts`, data),
  
  // 코트 정보 수정 (관리자 전용)
  updateCourt: (facilityId: number, courtId: number, data: Partial<Court>) => 
    api.put<Court>(`/admin/facilities/${facilityId}/courts/${courtId}`, data),
  
  // 코트 삭제 (관리자 전용)
  deleteCourt: (facilityId: number, courtId: number) => 
    api.delete(`/admin/facilities/${facilityId}/courts/${courtId}`),
    
  // 시설에 관리자 할당 (관리자 전용)
  assignManager: (facilityId: number, managerId: number) =>
    api.post(`/admin/facilities/${facilityId}/managers/${managerId}`),
    
  // 시설에서 관리자 제거 (관리자 전용)
  removeManager: (facilityId: number, managerId: number) =>
    api.delete(`/admin/facilities/${facilityId}/managers/${managerId}`),
}; 