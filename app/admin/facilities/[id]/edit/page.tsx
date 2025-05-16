"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

// 더미 시설 데이터
const dummyFacilities = [
  {
    id: 1,
    name: "서울 테니스 센터",
    sportType: "테니스",
    address: "서울시 강남구 테헤란로 123",
    detailAddress: "2층",
    description: "최신 설비를 갖춘 실내 테니스 센터입니다. 냉난방 시설 완비, 샤워실 및 라커룸 구비.",
    operatingHours: "09:00-22:00",
    courtsCount: 3,
    hasParking: true,
    hasShower: true,
    hasEquipmentRental: true,
    hasCafe: true,
    active: true,
    images: ["/images/facility1.jpg"]
  },
  {
    id: 2,
    name: "강남 풋살장",
    sportType: "풋살",
    address: "서울시 강남구 역삼동 456",
    description: "인조 잔디가 깔린 실외 풋살장입니다. 야간 조명 시설 완비.",
    operatingHours: "08:00-23:00",
    courtsCount: 2,
    hasParking: true,
    hasShower: false,
    hasEquipmentRental: true,
    hasCafe: false,
    active: true,
    images: ["/images/facility2.jpg"]
  },
  {
    id: 3,
    name: "종로 농구코트",
    sportType: "농구",
    address: "서울시 종로구 종로 789",
    description: "실내 농구 코트입니다. 냉난방 시설 완비.",
    operatingHours: "10:00-20:00",
    courtsCount: 1,
    hasParking: false,
    hasShower: true,
    hasEquipmentRental: false,
    hasCafe: true,
    active: true,
    images: ["/images/facility3.jpg"]
  },
  {
    id: 4,
    name: "한강 배드민턴장",
    sportType: "배드민턴",
    address: "서울시 영등포구 여의도동 101",
    description: "한강공원 내 위치한 배드민턴 전용 체육관입니다.",
    operatingHours: "08:00-22:00",
    courtsCount: 4,
    hasParking: true,
    hasShower: true,
    hasEquipmentRental: true,
    hasCafe: true,
    active: true,
    images: ["/images/facility4.jpg"]
  }
];

export default function FacilityEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const facilityId = parseInt(params.id)
  const [facility, setFacility] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    name: "",
    sportType: "",
    address: "",
    detailAddress: "",
    description: "",
    operatingHours: "",
    courtsCount: 0,
    hasParking: false,
    hasShower: false,
    hasEquipmentRental: false,
    hasCafe: false
  })

  // 시설 정보 조회
  useEffect(() => {
    setIsLoading(true)
    try {
      // 실제로는 API에서 데이터를 가져옴
      // 여기서는 더미 데이터 사용
      const foundFacility = dummyFacilities.find(f => f.id === facilityId)
      
      if (foundFacility) {
        setFacility(foundFacility)
        // 폼 데이터 초기화
        setFormData({
          name: foundFacility.name,
          sportType: foundFacility.sportType,
          address: foundFacility.address,
          detailAddress: foundFacility.detailAddress || "",
          description: foundFacility.description,
          operatingHours: foundFacility.operatingHours,
          courtsCount: foundFacility.courtsCount,
          hasParking: foundFacility.hasParking,
          hasShower: foundFacility.hasShower,
          hasEquipmentRental: foundFacility.hasEquipmentRental,
          hasCafe: foundFacility.hasCafe
        })
      } else {
        toast({
          title: "시설 정보 없음",
          description: "해당 시설 정보를 찾을 수 없습니다.",
          variant: "destructive"
        })
        router.push("/admin/facilities")
      }
    } catch (error) {
      toast({
        title: "시설 정보 조회 실패",
        description: "시설 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [facilityId, router])

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // 실제로는 API 호출하여 데이터 저장
      // 현재는 더미 데이터만 사용
      
      toast({
        title: "시설 정보 수정 완료",
        description: "시설 정보가 성공적으로 수정되었습니다."
      })
      
      // 성공 후 상세 페이지로 이동
      router.push(`/admin/facilities/${facilityId}`)
    } catch (error) {
      toast({
        title: "시설 정보 수정 실패",
        description: "시설 정보 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container p-4">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-500">시설 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!facility) {
    return (
      <div className="container p-4">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <p className="text-lg font-medium">시설 정보를 찾을 수 없습니다.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/facilities">시설 목록으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link href={`/admin/facilities/${facilityId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">시설 정보 수정</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>시설 정보 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">시설명</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="sportType" className="text-sm font-medium">종목</label>
                <select
                  id="sportType"
                  name="sportType"
                  value={formData.sportType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">종목 선택</option>
                  <option value="테니스">테니스</option>
                  <option value="축구">축구</option>
                  <option value="풋살">풋살</option>
                  <option value="농구">농구</option>
                  <option value="배드민턴">배드민턴</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">주소</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="detailAddress" className="text-sm font-medium">상세주소</label>
                <input
                  type="text"
                  id="detailAddress"
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="operatingHours" className="text-sm font-medium">운영 시간</label>
                <input
                  type="text"
                  id="operatingHours"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="예: 09:00-22:00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="courtsCount" className="text-sm font-medium">코트 수</label>
                <input
                  type="number"
                  id="courtsCount"
                  name="courtsCount"
                  value={formData.courtsCount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">시설 설명</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md h-32"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasParking"
                  name="hasParking"
                  checked={formData.hasParking}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="hasParking" className="text-sm">주차 가능</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasShower"
                  name="hasShower"
                  checked={formData.hasShower}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="hasShower" className="text-sm">샤워실 있음</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasEquipmentRental"
                  name="hasEquipmentRental"
                  checked={formData.hasEquipmentRental}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="hasEquipmentRental" className="text-sm">장비 대여 가능</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasCafe"
                  name="hasCafe"
                  checked={formData.hasCafe}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="hasCafe" className="text-sm">카페 있음</label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/facilities/${facilityId}`)}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 