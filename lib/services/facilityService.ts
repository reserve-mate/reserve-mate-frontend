import { headers } from 'next/headers';
import { api } from '../api';
import { SportType } from '../enum/matchEnum';
import { CourtName, FacilityManagerName, FacilityNames } from '../types/facilityTypes';
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
  courtType: string;
  width: number;
  height: number;
  indoor: boolean;
  active: boolean;
}

// 주소 타입 정의
export interface Address {
  zipcode: string,
  city: string,
  district: string,
  streetAddress: string,
  detailAddress: string,
}

// 시설 등록 요청 타입
export interface CreateFacilityRequest {
  name: string;
  sportType: string;
  address: Address;
  description?: string;
  hasParking: boolean;
  hasShower: boolean;
  hasEquipmentRental: boolean;
  hasCafe: boolean;
  courts: Omit<Court, 'id' | 'facilityId'>[];
  operatingHours: {
    dayOfWeek: string;
    openTime: string | null;
    closeTime: string | null;
    holiday: boolean;
  }[];
  images?: File[];
}

export interface FacilityList {
  facilityId: string;
  facilityName: string;
  address: string;
  sportType: string;
  courtCount: number;
  reservationCount: number;
  active? : boolean;
}

interface FacilityListResponse {
  content: FacilityList[];
  totalPages: number;

}

// 시설 서비스
export const facilityService = {
  // 시설 목록 조회
  getFacilities: async(data:{ keyword : string; lastId : string | null; size : string}) => {
    const res =  await api.get<FacilityListResponse>("/admin/facilities",{
      params: data,
    })
    console.log("시설 service data: ", JSON.stringify(res, null, 2));
    return res.content;
  },

  // 매치 등록 시 시설명 조회
  getMatchFacilityNames: (sportType: string | undefined) => {
    let endPoint = `/admin/facilities/getFacilityNames?sportType=${sportType}`;
    if(!sportType) {
      endPoint = `/admin/facilities/getFacilityNames`;
    }
    return api.get<FacilityNames[]>(endPoint);
  },

  // 매치 등록 시 코트명 조회
  getMatchCourtNames: (facilityId: number) => {
    let endPoint = `/admin/facilities/getCourtNames?facilityId=${facilityId}`;
    return api.get<CourtName[]>(endPoint);
  },

  getFacilityMangerNames: (facilityId: number) => {
    let endPoint = `/admin/facilities/getManagerNames?facilityId=${facilityId}`;
    return api.get<FacilityManagerName[]>(endPoint);
  },
  
  // 시설 상세 조회
  getFacility: (id: number) => 
    api.get<Facility>(`/facilities/${id}`),
  
  // 시설 등록 (관리자 전용)
  createFacility: (data: CreateFacilityRequest) => {
    const formData = new FormData();
    console.log(data.images);
    // JSON 데이터를 FormData에 추가
    const facilityData = {
      name: data.name,
      sportType: data.sportType,
      address: data.address,
      description: data.description,
      hasParking: data.hasParking,
      hasShower: data.hasShower,
      hasEquipmentRental: data.hasEquipmentRental,
      hasCafe: data.hasCafe,
      courts: data.courts,
      operatingHours: data.operatingHours,
    };

    formData.append(
      `facilityData`,
      new Blob([JSON.stringify(facilityData)], {type: 'application/json'})
    );
  
    // 이미지 존재하는 경우에만 images + meta 추가
    if (data.images && data.images.length > 0) {
      const imageMeta: {displayOrder: number; isMain: boolean}[] = [];

      data.images.forEach((image, index) => {
        formData.append(`images`, image);
        imageMeta.push({
          displayOrder: index,
          isMain: index === 0 // 첫번째 이미지를 메인으로
        })
      });
      // 이미지 상세 정보 추가
      formData.append(`imageMeta`, new Blob([JSON.stringify(imageMeta)], {type: 'application/json'}));
      console.log(formData);
    
    }
    return api.post<Facility>('/admin/facilities', formData) 
    
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