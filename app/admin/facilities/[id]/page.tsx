"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Building, MapPin, Calendar, Users } from "lucide-react"
import FacilityManagers from "@/components/admin/facility-managers"

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
            variant={facility.active ? "default" : "destructive"} 
            className="ml-2 sm:ml-4"
          >
            {facility.active ? '활성' : '비활성'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
        {/* 시설 개요 카드 */}
        <Card className="lg:col-span-4">
          <CardHeader className="p-4">
            <CardTitle className="text-lg sm:text-xl">시설 정보</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4 p-4 pt-0">
            <div className="flex items-start">
              <Building className="mr-2 h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <div className="font-medium">종목</div>
                <div className="break-words">{facility.sportType}</div>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="mr-2 h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <div className="font-medium">주소</div>
                <div className="break-words">{facility.address}</div>
                {facility.detailAddress && <div className="text-sm text-gray-500 break-words">{facility.detailAddress}</div>}
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="mr-2 h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <div className="font-medium">운영 시간</div>
                <div>{facility.operatingHours}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="mr-2 h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <div className="font-medium">코트 수</div>
                <div>{facility.courtsCount}개</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between p-4">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href={`/admin/facilities/${facility.id}/edit`}>수정</Link>
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant={facility.active ? "destructive" : "default"} 
                onClick={handleToggleStatus}
                className="w-full sm:w-auto"
              >
                {facility.active ? '비활성화' : '활성화'}
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">삭제</Button>
            </div>
          </CardFooter>
        </Card>

        {/* 상세 정보 탭 */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-4 grid grid-cols-2 md:grid-cols-4 h-auto">
              <TabsTrigger value="overview" className="py-2 px-1 sm:px-3 text-xs sm:text-sm">시설 상세</TabsTrigger>
              <TabsTrigger value="courts" className="py-2 px-1 sm:px-3 text-xs sm:text-sm">코트 정보</TabsTrigger>
              <TabsTrigger value="managers" className="py-2 px-1 sm:px-3 text-xs sm:text-sm">시설 관리자</TabsTrigger>
              <TabsTrigger value="reservations" className="py-2 px-1 sm:px-3 text-xs sm:text-sm">예약 현황</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">시설 설명</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="whitespace-pre-line text-sm sm:text-base">{facility.description || "시설 설명이 없습니다."}</p>
                  
                  <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 ${facility.hasParking ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm sm:text-base">주차 시설</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 ${facility.hasShower ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm sm:text-base">샤워 시설</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 ${facility.hasEquipmentRental ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm sm:text-base">장비 대여</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 ${facility.hasCafe ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm sm:text-base">카페/식당</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="courts">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">코트 정보</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="mb-4 text-sm sm:text-base">코트 정보 관리는 현재 개발 중입니다.</p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/admin/facilities/${facility.id}/courts`}>
                      코트 관리하기
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="managers">
              <FacilityManagers
                facilityId={facility.id}
                facilityName={facility.name}
              />
            </TabsContent>
            
            <TabsContent value="reservations">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">예약 현황</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm sm:text-base">예약 현황 관리는 현재 개발 중입니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 