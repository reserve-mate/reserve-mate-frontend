"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Building, MapPin, Calendar, Users, ClipboardList } from "lucide-react"
import FacilityManagers from "@/components/admin/facility-managers"
import CourtManagement from "@/components/admin/court-management"
import ReservationStatus from "@/components/admin/reservation-status"

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

export default function FacilityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const facilityId = parseInt(params.id)
  const [facility, setFacility] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // 시설 정보 조회 (더미 데이터 사용)
  useEffect(() => {
    setIsLoading(true)
    try {
      // 실제로는 API에서 데이터를 가져옴
      // 여기서는 더미 데이터 사용
      const foundFacility = dummyFacilities.find(f => f.id === facilityId)
      
      if (foundFacility) {
        setFacility(foundFacility)
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

  // 시설 상태 토글(활성/비활성)
  const handleToggleStatus = () => {
    if (!facility) return

    try {
      // 실제로는 API 호출
      setFacility({
        ...facility,
        active: !facility.active
      })
      
      toast({
        title: `시설 ${facility.active ? '비활성화' : '활성화'} 완료`,
        description: `시설이 성공적으로 ${facility.active ? '비활성화' : '활성화'}되었습니다.`
      })
    } catch (error) {
      toast({
        title: "상태 변경 실패",
        description: "시설 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  // 시설 삭제
  const handleDelete = () => {
    if (!confirm("정말로 이 시설을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return
    }

    try {
      // 실제로는 API 호출
      toast({
        title: "시설 삭제 완료",
        description: "시설이 성공적으로 삭제되었습니다."
      })
      router.push("/admin/facilities")
    } catch (error) {
      toast({
        title: "시설 삭제 실패",
        description: "시설 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      })
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
    <div className="container p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-8 gap-2">
        <Button variant="ghost" asChild className="w-full sm:w-auto sm:mr-4 justify-start">
          <Link href="/admin/facilities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Link>
        </Button>
        <div className="flex items-center mt-2 sm:mt-0">
          <h1 className="text-xl sm:text-2xl font-bold">{facility.name}</h1>
          <Badge 
            className={`ml-2 ${
              facility.active 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}
          >
            {facility.active ? "활성" : "비활성"}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:w-fit">
          <TabsTrigger value="overview">기본 정보</TabsTrigger>
          <TabsTrigger value="courts">코트 관리</TabsTrigger>
          <TabsTrigger value="reservations">예약 현황</TabsTrigger>
          <TabsTrigger value="managers">매니저 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">시설 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">종목</p>
                  <p>{facility.sportType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">운영 시간</p>
                  <p>{facility.operatingHours}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">코트 수</p>
                  <p>{facility.courtsCount}개</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">주소</p>
                  <p>
                    {facility.address}
                    {facility.detailAddress ? `, ${facility.detailAddress}` : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">시설 설명</p>
                <p className="text-sm">{facility.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge variant="outline" className={facility.hasParking ? "border-green-500" : "border-gray-200"}>
                  주차 {facility.hasParking ? "가능" : "불가능"}
                </Badge>
                <Badge variant="outline" className={facility.hasShower ? "border-green-500" : "border-gray-200"}>
                  샤워실 {facility.hasShower ? "있음" : "없음"}
                </Badge>
                <Badge variant="outline" className={facility.hasEquipmentRental ? "border-green-500" : "border-gray-200"}>
                  장비 대여 {facility.hasEquipmentRental ? "가능" : "불가능"}
                </Badge>
                <Badge variant="outline" className={facility.hasCafe ? "border-green-500" : "border-gray-200"}>
                  카페 {facility.hasCafe ? "있음" : "없음"}
                </Badge>
              </div>

              {facility.images && facility.images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">시설 이미지</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {facility.images.map((image: string, index: number) => (
                      <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                        <img
                          src={image}
                          alt={`${facility.name} 이미지 ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                className={`${
                  facility.active 
                    ? "text-red-600 border-red-200 hover:bg-red-50" 
                    : "text-green-600 border-green-200 hover:bg-green-50"
                }`}
                onClick={handleToggleStatus}
              >
                {facility.active ? "비활성화" : "활성화"}
              </Button>
              <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <Link href={`/admin/facilities/edit/${facility.id}`}>
                  수정
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                삭제
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="courts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">코트 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityCourtManagement facilityId={String(facility.id)} facilityName={facility.name} sportType={facility.sportType} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">예약 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityReservations facilityId={String(facility.id)} facilityName={facility.name} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">매니저 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityManagers facilityId={facility.id} facilityName={facility.name} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// 시설별 코트 관리 컴포넌트
function FacilityCourtManagement({ facilityId, facilityName, sportType }: { facilityId: string, facilityName: string, sportType: string }) {
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">{facilityName}의 코트</h3>
        <p className="text-gray-500 text-sm">이 시설의 코트를 관리하고 새로운 코트를 추가할 수 있습니다.</p>
      </div>
      
      {/* 특정 시설에 대한 코트 관리를 위해 facilityId를 전달 */}
      <CourtManagement selectedFacilityId={facilityId} />
    </div>
  )
}

// 시설별 예약 현황 컴포넌트
function FacilityReservations({ facilityId, facilityName }: { facilityId: string, facilityName: string }) {
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">{facilityName}의 예약</h3>
        <p className="text-gray-500 text-sm">이 시설에 대한 모든 예약을 조회하고 관리할 수 있습니다.</p>
      </div>
      
      {/* 특정 시설에 대한 예약 현황을 위해 facilityId 전달 */}
      <ReservationStatus facilityId={facilityId} />
    </div>
  )
} 