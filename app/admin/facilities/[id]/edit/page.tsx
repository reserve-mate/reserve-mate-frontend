"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CircleDot, MapPin, Clock, Plus, Trash2, Edit2 } from "lucide-react"
import DaumPostcode from "react-daum-postcode"
import { Address, OperatingHours } from "@/lib/types/facilityTypes"
import { Checkbox } from "@/components/ui/checkbox"
import { facilityService } from "@/lib/services/facilityService"


// sportTypes 추가
const sportTypes = [
  { value: "TENNIS", label: "테니스" },
  { value: "FUTSAL", label: "풋살" },
  { value: "BASKETBALL", label: "농구" },
  { value: "VOLLEYBALL", label: "배구" },
  { value: "BADMINTON", label: "배드민턴" },
  { value: "BASEBALL", label: "야구" },
  { value: "SOCCER", label: "축구"},
  { value: "OTHER", label: "기타" },
]

// 운영요일 추가
const daysOfWeek = [
  { label: "월", value: "MONDAY" },
  { label: "화", value: "TUESDAY" },
  { label: "수", value: "WEDNESDAY" },
  { label: "목", value: "THURSDAY" },
  { label: "금", value: "FRIDAY" },
  { label: "토", value: "SATURDAY" },
  { label: "일", value: "SUNDAY" },
]

type FacilityParams = {
  id: string;
}

export default function FacilityEditPage({ params }: { params: Promise<FacilityParams> }) {
  const router = useRouter()
  // const facilityId = parseInt(params.id)
  const { id } = use(params)
  const facilityId = parseInt(id, 10)
  const [facility, setFacility] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    name: "",
    sportType: "",
    address: {
      city: "",
      detailAddress: "",
      district: "",
      streetAddress:"",
      zipcode:"",
    },
    description: "",
    operatingHours: [] as OperatingHours[],
    courtsCount: 0,
    hasParking: false,
    hasShower: false,
    hasEquipmentRental: false,
    hasCafe: false
  })

  // 시설 정보 조회
  useEffect(() => {
    const detailFacility = async () => {
      setIsLoading(true)
      try {
        // 실제로는 API에서 데이터를 가져옴
        const foundFacility = await facilityService.getFacility(facilityId);
        
        if (foundFacility) {
          setFacility(foundFacility)
          // 폼 데이터 초기화
          setFormData({
            name: foundFacility.name,
            sportType: foundFacility.sportType,
            address: {
              city: foundFacility.address.city,
              detailAddress: foundFacility.address.detailAddress,
              district: foundFacility.address.district,
              streetAddress: foundFacility.address.streetAddress,
              zipcode: foundFacility.address.zipcode
            },
            description: foundFacility.description?? "",
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
    }
    detailFacility();
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

  // 셀렉트 변경 처리
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 주소 검색 창 열기 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const handlePostcodeComplete = (data: any) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,  //기존 address 유지
        zipcode: data.zonecode,
        city: data.sido,
        district: data.sigungu,
        streetAddress: data.roadAddress,
      }
    }))
    setIsPostcodeOpen(false);
  }

  // 주소 입력값 변경 처리
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  }

  // 운영 요일 관리
  const toggleDay = (day: string) => {
    setFormData(prev => {
      const updatedDay = prev.operatingHours.map(op => {
        if (op.dayOfWeek === day){
          return {...op, holiday: !op.holiday };
        }
        return op;
      })
      return {...prev, operatingHours: updatedDay}
    })
  }

  // 운영 시간 변경 처리
  const currentOperatingHour = formData.operatingHours[0] || { openTime: "", closeTime: ""};

  const handleOperatingHourChange = (field: "openTime" | "closeTime", value: string) =>{
    setFormData(prev => ({
      ...prev,
      operatingHours: prev.operatingHours.map(op => ({
        ...op,
        [field] : value
      }))
    }))
  }
  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // 실제로는 API 호출하여 데이터 저장
      await facilityService.updateFacility(facilityId,formData);
      
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
                  <Select 
                    value={formData.sportType} 
                    onValueChange={(value) => handleSelectChange('sportType', value)}
                  >
                  <SelectTrigger id="sportType" className="h-12 text-base">
                    <SelectValue placeholder="종목을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-base py-2">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">주소</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <Input
                    id="address"
                    name="address"
                    value={formData.address.streetAddress}
                    onChange={handleAddressChange}
                    readOnly
                    className="flex-1 h-12 text-base"
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-12 text-base md:w-auto w-full"
                    onClick={()=> setIsPostcodeOpen(true)}
                  >
                    <MapPin className="mr-2 h-5 w-5" /> 주소 검색
                  </Button>
                </div>
              </div>
              {isPostcodeOpen && (
                <div className="mt-4 border p-4 rounded-md shadow-sm bg-white">
                  <DaumPostcode onComplete={handlePostcodeComplete} />
                  <div className="text-right mt-2">
                    <Button variant="ghost" onClick={() => setIsPostcodeOpen(false)}>닫기</Button>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="detailAddress" className="text-sm font-medium">상세주소</label>
                <Input
                  type="text"
                  id="detailAddress"
                  name="detailAddress"
                  value={formData.address.detailAddress}
                  onChange={handleAddressChange}
                  className="flex-1 h-12 text-base"
                  required
                />
              </div>
              <div className="space-y-2">
              <label htmlFor="openingDays" className="text-sm font-medium">운영 요일</label>
                <div className="border rounded-md p-2 space-y-2">
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => {
                      const matched = formData.operatingHours?.find((op: OperatingHours) => op.dayOfWeek === day.value);
                      const isChecked = matched ? !matched.holiday : false;
                      return (
                        <div key={day.value} className="flex items-center space-x-1">
                          <Checkbox
                            id={day.value}
                            checked={isChecked}
                            onCheckedChange={() => toggleDay(day.value)}
                            className="h-5 w-5"
                          />
                          <label htmlFor={day.value}>{day.label}</label>
                        </div>
                      )
                    }
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="openTime" className="text-sm font-medium">운영 시작 시간</label>
                <Select 
                  value={currentOperatingHour.openTime || ""} 
                  onValueChange={(value) => handleOperatingHourChange('openTime', value)}
                >
                  <SelectTrigger id="openTime" className="h-12 text-base">
                    <SelectValue placeholder="시작 시간을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i < 10 ? `0${i}` : `${i}`
                      return (
                        <SelectItem key={hour} value={`${hour}:00`} className="text-base py-2">
                          {`${hour}:00`}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
              <label htmlFor="closeTime" className="text-sm font-medium">운영 종료 시간 *</label>
                <Select 
                  value={currentOperatingHour.closeTime || ""} 
                  onValueChange={(value) => handleOperatingHourChange('closeTime', value)}
                >
                  <SelectTrigger id="closeTime" className="h-12 text-base">
                    <SelectValue placeholder="종료 시간을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i < 10 ? `0${i}` : `${i}`
                      return (
                        <SelectItem key={hour} value={`${hour}:00`} className="text-base py-2">
                          {`${hour}:00`}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
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