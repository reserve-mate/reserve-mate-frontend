"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { CircleDot, MapPin, Clock, Plus, Trash2, Edit2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import DaumPostcode from "react-daum-postcode"
import { facilityService } from "@/lib/services/facilityService"

// 코트 대분류 유형
const courtMainTypes = [
  { value: "indoor", label: "실내" },
  { value: "outdoor", label: "실외" },
]

// 종목별 코트 소분류 유형
const sportCourtTypes = {
  TENNIS: [
    { value: "HARD", label: "하드코트" },
    { value: "CLAY_TENNIS", label: "클레이코트" },
    { value: "GRASS", label: "잔디코트" },
    { value: "SYNTHETIC_TENNIS", label: "합성소재" },
  ],
  FUTSAL: [
    { value: "RUBBER_FUTSAL", label: "고무바닥" },
    { value: "SYNTHETIC_FUTSAL", label: "합성표면" },
    { value: "ARTIFICIAL_TURF_FUTSAL", label: "인조잔디" },
  ],
  BASKETBALL: [
    { value: "WOODEN_BASKET", label: "목재바닥" },
    { value: "SYNTHETIC_BASKET", label: "합성소재" },
  ],
  VOLLEYBALL: [
    { value: "WOODEN_VOLLEY", label: "목재바닥" },
    { value: "SYNTHETIC_VOLLEY", label: "합성소재" },
  ],
  BADMINTON: [
    { value: "WOODEN_BM", label: "목재바닥" },
    { value: "SYNTHETIC_BM", label: "합성소재" },
    { value: "RUBBER_BM", label: "고무바닥" },
  ],
  BASEBALL: [
    { value: "NATURE_GRASS_BASE", label: "천연잔디" },
    { value: "ARTIFICIAL_TURF_BASE", label: "인조잔디" },
    { value: "DIRT_BASE", label: "흙" },
    { value: "CLAY_BASE", label: "점토" },
  ],
  SOCCER: [
    { value: "NATURE_GRASS_FB", label: "천연잔디" },
    { value: "ARTIFICIAL_TURF_FB", label: "인조잔디" },
    { value: "DIRT_FB", label: "흙" },
  ],
  OTHER: [
    { value: "MULTIPURPOSE", label: "다목적" },
    { value: "OTHER", label: "기타" },
  ]
}

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

// 코트 타입 정의
type Court = {
  id: string;
  name: string;
  mainType: string;
  subType: string;
  width: string;
  height: string;
  isActive: boolean;
}

// 주소 타입 정의
type Address = {
  zipcode: string,
  city: string,
  district: string,
  streetAddress: string,
  detailAddress: string,
  address: string,
}

// 시설 등록 폼 props 타입
type RegisterFacilityFormProps = {
  onComplete: (facilityData: any) => void;
}

export default function RegisterFacilityForm({ onComplete }: RegisterFacilityFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [facilityData, setFacilityData] = useState({
    name: "",
    sportType: "",
    description: "",
    courtsCount: "",
    openingDays: [] as string[],
    openingHours: "",
    closingHours: "",
    hasParking: false,
    hasShower: false,
    hasEquipmentRental: false,
    hasCafe: false,
    images: [] as File[]
  })

  // Tab 변경
  const changeTab = (nextTab: string) => {
    // 현재 탭 유효성 검사
    /*
    if (activeTab === "basic") {
      const { name, sportType, address } = facilityData;
      if (!name || !sportType || !address){
        toast({
          title: "입력오류",
          description: "시설명, 종목 또는 주소를 확인해주세요.",
          variant: "destructive",
        });
        return;
      }
    } else if (activeTab === "details"){
      const { openingHours, closingHours} = facilityData;
      if (!openingHours || !closingHours){
        toast({
          title: "입력오류",
          description: "운영 시작 시간, 종료 시간을 확인해주세요.",
          variant: "destructive"
        });
        return;
      }
      if (closingHours <= openingHours){
        toast({
          title: "입력오류",
          description: "종료 시간이 시작 시간 이후이어야 합니다.",
          variant: "destructive",
        });
        return;
      }
    } else if (activeTab === "courts"){
      const { courtsCount} = facilityData;
      if (!courtsCount || parseInt(courtsCount) <= 0){
        toast({
          title: "입력오류",
          description: "코트를 추가해주세요.",
          variant: "destructive",
        });
        return;
      }
    }
    */
    setActiveTab(nextTab); // 조건 만족 시에만 탭 전환
  };

  // 운영 요일 관리
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      const updated = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      return updated;
    });
  }

  // 주소 정보 관리
  const [addressData, setAddressData] = useState<Address>({
    zipcode: "",
    city: "",
    district: "",
    streetAddress: "",
    detailAddress: "",
    address: "",
  })

  // 주소 검색 창 열기 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const handlePostcodeComplete = (data: any) => {
    setAddressData(prev => ({
      ...prev,
      zipcode: data.zonecode,
      city: data.sido,
      district: data.sigungu,
      streetAddress: data.roadAddress,
      address: data.address,
    }));
    setIsPostcodeOpen(false);
  }

  // 주소 입력값 변경 처리
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value} = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]:value
    }));
  }

  // 코트 정보를 관리하기 위한 상태
  const [courts, setCourts] = useState<Court[]>([])
  const [editingCourt, setEditingCourt] = useState<Court | null>(null)
  const [courtFormData, setCourtFormData] = useState<Court>({
    id: "",
    name: "",
    mainType: "",
    subType: "",
    width: "",
    height: "",
    isActive: true
  })
  
  // 입력값 변경 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFacilityData(prev => ({ ...prev, [name]: value }))
  }
  
  // 셀렉트 변경 처리
  const handleSelectChange = (name: string, value: string) => {
    setFacilityData(prev => ({ ...prev, [name]: value }))
  }
  
  // 체크박스 변경 처리
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFacilityData(prev => ({ ...prev, [name]: checked }))
  }
  
  // 이미지 파일 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setFacilityData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }
  
  // 이미지 삭제 처리
  const handleRemoveImage = (index: number) => {
    setFacilityData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // 코트 입력값 변경 처리
  const handleCourtInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setCourtFormData(prev => ({ ...prev, [name]: value }))
  }

  // 코트 셀렉트 변경 처리 
  const handleCourtSelectChange = (name: string, value: string) => {
    setCourtFormData(prev => ({ ...prev, [name]: value }))
  }

  // 코트 추가 처리
  const handleAddCourt = () => {
    // 필수 필드 체크
    if (!courtFormData.name || !courtFormData.mainType || !courtFormData.subType || !courtFormData.width || 
        !courtFormData.height) {
      toast({
        title: "입력 오류",
        description: "코트 이름, 대분류, 소분류, 가로/세로 길이는 필수 입력 항목입니다.",
        variant: "destructive"
      })
      return
    }

    if (editingCourt) {
      // 기존 코트 수정
      setCourts(prev => 
        prev.map(court => 
          court.id === editingCourt.id ? { ...courtFormData } : court
        )
      )
      setEditingCourt(null)
    } else {
      // 새 코트 추가
      const newCourt = {
        ...courtFormData,
        id: Date.now().toString() // 임시 ID 생성
      }
      setCourts(prev => [...prev, newCourt])
    }

    // 폼 초기화
    setCourtFormData({
      id: "",
      name: "",
      mainType: "",
      subType: "",
      width: "",
      height: "",
      isActive: true
    })

    // 코트 수 자동 업데이트
    setFacilityData(prev => ({
      ...prev,
      courtsCount: (courts.length + (editingCourt ? 0 : 1)).toString()
    }))
  }

  // 코트 수정 처리
  const handleEditCourt = (court: Court) => {
    setEditingCourt(court)
    setCourtFormData(court)
  }

  // 코트 삭제 처리
  const handleDeleteCourt = (id: string) => {
    setCourts(prev => prev.filter(court => court.id !== id))
    
    // 코트 수 자동 업데이트
    setFacilityData(prev => ({
      ...prev,
      courtsCount: (courts.length - 1).toString()
    }))
  }
  
  // 시설 등록 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // 필수 필드 체크
      if (!facilityData.name || !facilityData.sportType || !addressData.address || 
          !facilityData.openingHours || !facilityData.closingHours) {
        throw new Error("필수 정보를 모두 입력해주세요.")
      }

      // 운영 요일 체크
      if (selectedDays.length === 0) {
        toast({
          title: "운영 요일 없음",
          description: "운영 요일을 하나 이상 선택해주세요.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 코트 정보 체크
      if (courts.length === 0) {
        throw new Error("최소 하나 이상의 코트 정보를 등록해주세요.")
      }
      
      // 운영 요일 별 데이터 생성
      const allDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
      const operatingHours = allDays.map((day) => {
        const isOperating = selectedDays.includes(day);
        return {
          dayOfWeek: day,
          openTime: facilityData.openingHours,
          closeTime: facilityData.closingHours,
          holiday: !isOperating, 
        };
      });
      
      // Court 변환
      const saveCourts = courts.map((court) => ({
        id: court.id,
        name: court.name,
        courtType: court.subType,
        width: parseInt(court.width),
        height: parseInt(court.height),
        indoor: court.mainType === "INDOOR",
        active: court.isActive,
      }));

      // 변환된 데이터 형식으로 전달
      const processedData = {
        ...facilityData,
        courtsCount: courts.length,
        courts: saveCourts,
        address: addressData,
        operatingHours: operatingHours,
      }

      console.log("전송 데이터 : ", JSON.stringify(processedData, null, 2));
      
      // API 호출 및 데이터 저장 (실제로는 서버 API 호출)
      await facilityService.createFacility(processedData);
      // 완료 핸들러 호출
      onComplete(processedData)
      
      toast({
        title: "시설 등록 완료",
        description: "시설이 성공적으로 등록되었습니다."
      })
    } catch (error) {
      toast({
        title: "시설 등록 실패",
        description: error instanceof Error ? error.message : "시설 등록 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <Tabs value={activeTab} onValueChange={changeTab} className="w-full">
        <TabsList className="w-full mb-4 grid grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="basic" className="py-3 text-sm md:text-base">기본 정보</TabsTrigger>
          <TabsTrigger value="details" className="py-3 text-sm md:text-base">상세 정보</TabsTrigger>
          <TabsTrigger value="courts" className="py-3 text-sm md:text-base">코트 정보</TabsTrigger>
          <TabsTrigger value="images" className="py-3 text-sm md:text-base">이미지</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6 pt-2">
          <div className="space-y-4">
            <Label htmlFor="name" className="text-base">시설명 *</Label>
            <Input
              id="name"
              name="name"
              value={facilityData.name}
              onChange={handleInputChange}
              placeholder="예: 서울 테니스 센터"
              required
              className="h-12 text-base"
            />
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="sportType" className="text-base">종목 *</Label>
            <Select 
              value={facilityData.sportType} 
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
          
          <div className="space-y-4">
            <Label htmlFor="address" className="text-base">주소 *</Label>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                id="address"
                name="address"
                value={addressData.address}
                onChange={handleAddressChange}
                placeholder="예: 서울시 강남구 테헤란로 123"
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
          
          <div className="space-y-4">
            <Label htmlFor="detailAddress" className="text-base">상세 주소</Label>
            <Input
              id="detailAddress"
              name="detailAddress"
              value={addressData.detailAddress}
              onChange={handleAddressChange}
              placeholder="예: 2층 테니스 코트"
              className="h-12 text-base"
            />
          </div>
          
          <Button 
            type="button" 
            className="mt-6 w-full md:w-auto h-12 text-base" 
            onClick={() => changeTab("details")}
          >
            다음: 상세 정보
          </Button>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6 pt-2">
        <Label htmlFor="openingDays" className="text-base">운영 요일 *</Label>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border rounded-md p-4 space-y-3">
              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day.value} className="flex items-center space-x-1">
                    <Checkbox
                      id={day.value}
                      checked={selectedDays.includes(day.value)}
                      onCheckedChange={(checked) => toggleDay(day.value)}
                      className="h-5 w-5"
                    />
                    <label htmlFor={day.value}>{day.label}</label>
                  </div>
                ))}
              </div>
            </div>  
          </div>  
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Label htmlFor="openingHours" className="text-base">운영 시작 시간 *</Label>
              <Select 
                value={facilityData.openingHours} 
                onValueChange={(value) => handleSelectChange('openingHours', value)}
              >
                <SelectTrigger id="openingHours" className="h-12 text-base">
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
            
            <div className="space-y-4">
              <Label htmlFor="closingHours" className="text-base">운영 종료 시간 *</Label>
              <Select 
                value={facilityData.closingHours} 
                onValueChange={(value) => handleSelectChange('closingHours', value)}
              >
                <SelectTrigger id="closingHours" className="h-12 text-base">
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
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Label className="text-base">편의 시설</Label>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="hasParking" 
                    checked={facilityData.hasParking}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('hasParking', checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <Label htmlFor="hasParking" className="text-base">주차장</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="hasShower" 
                    checked={facilityData.hasShower}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('hasShower', checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <Label htmlFor="hasShower" className="text-base">샤워실</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="hasEquipmentRental" 
                    checked={facilityData.hasEquipmentRental}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('hasEquipmentRental', checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <Label htmlFor="hasEquipmentRental" className="text-base">장비 대여</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="hasCafe" 
                    checked={facilityData.hasCafe}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('hasCafe', checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <Label htmlFor="hasCafe" className="text-base">카페/휴게실</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="description" className="text-base">시설 설명</Label>
              <Textarea
                id="description"
                name="description"
                value={facilityData.description}
                onChange={handleInputChange}
                placeholder="시설에 대한 추가 설명을 입력하세요"
                className="min-h-[120px] text-base"
              />
            </div>
          </div>
          
          <div className="flex flex-col-reverse md:flex-row md:justify-between gap-3 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => changeTab("basic")}
              className="w-full md:w-auto h-12 text-base"
            >
              이전: 기본 정보
            </Button>
            <Button 
              type="button"
              className="w-full md:w-auto h-12 text-base" 
              onClick={() => changeTab("courts")}
            >
              다음: 코트 정보
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="courts" className="space-y-6 pt-2">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">코트 정보 등록</h3>
            <p className="text-sm text-gray-500 mb-6">
              각 코트의 상세 정보를 입력하세요. 최소 하나 이상의 코트 정보가 필요합니다.
            </p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingCourt ? "코트 정보 수정" : "새 코트 추가"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <Label htmlFor="courtName" className="text-base">코트 이름 *</Label>
                    <Input
                      id="courtName"
                      name="name"
                      value={courtFormData.name}
                      onChange={handleCourtInputChange}
                      placeholder="예: A코트, 센터 코트"
                      className="h-12 text-base"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="courtMainType" className="text-base">코트 대분류 *</Label>
                    <Select 
                      value={courtFormData.mainType} 
                      onValueChange={(value) => handleCourtSelectChange('mainType', value)}
                    >
                      <SelectTrigger id="courtMainType" className="h-12 text-base">
                        <SelectValue placeholder="코트 대분류를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {courtMainTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-base py-2">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-3 mt-6">
                  <div className="space-y-4">
                    <Label htmlFor="courtSubType" className="text-base">코트 소분류 *</Label>
                    <Select 
                      value={courtFormData.subType} 
                      onValueChange={(value) => handleCourtSelectChange('subType', value)}
                      disabled={!facilityData.sportType || !courtFormData.mainType}
                    >
                      <SelectTrigger id="courtSubType" className="h-12 text-base">
                        <SelectValue placeholder="코트 소분류를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilityData.sportType && 
                          sportCourtTypes[facilityData.sportType as keyof typeof sportCourtTypes]?.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-base py-2">
                              {type.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {(!facilityData.sportType || !courtFormData.mainType) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {!facilityData.sportType 
                          ? "스포츠 종목을 먼저 선택해주세요." 
                          : "코트 대분류를 먼저 선택해주세요."}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="courtWidth" className="text-base">가로 길이 (m) *</Label>
                    <Input
                      id="courtWidth"
                      name="width"
                      type="number"
                      value={courtFormData.width}
                      onChange={handleCourtInputChange}
                      placeholder="예: 20"
                      className="h-12 text-base"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="courtHeight" className="text-base">세로 길이 (m) *</Label>
                    <Input
                      id="courtHeight"
                      name="height"
                      type="number"
                      value={courtFormData.height}
                      onChange={handleCourtInputChange}
                      placeholder="예: 10"
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex items-center space-x-3">
                  <Checkbox 
                    id="courtIsActive" 
                    checked={courtFormData.isActive}
                    onCheckedChange={(checked) => 
                      setCourtFormData(prev => ({ ...prev, isActive: checked as boolean }))
                    }
                    className="h-5 w-5"
                  />
                  <Label htmlFor="courtIsActive" className="text-base">코트 활성화 상태 (비활성화 시 예약 불가)</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Button 
                  type="button" 
                  onClick={handleAddCourt}
                  className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto h-12 text-base"
                >
                  {editingCourt ? "코트 수정하기" : "코트 추가하기"}
                </Button>
              </CardFooter>
            </Card>

            <div className="rounded-md border">
              <div className="p-4">
                <h4 className="text-md font-medium mb-4">등록된 코트 목록 ({courts.length}개)</h4>
                {courts.length === 0 ? (
                  <p className="text-sm text-gray-500 py-6 text-center">
                    등록된 코트가 없습니다. 위 폼을 통해 코트를 추가해주세요.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {courts.map((court) => (
                      <Card key={court.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div>
                              <h5 className="font-medium text-base">{court.name}</h5>
                              <p className="text-sm text-gray-500 mt-1">
                                {court.mainType} | {court.subType} | 
                                {" "}{parseInt(court.width).toLocaleString()}m × {parseInt(court.height).toLocaleString()}m | 
                                상태: {court.isActive ? "활성화" : "비활성화"}
                              </p>
                            </div>
                            <div className="flex space-x-2 self-end md:self-start">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEditCourt(court)}
                                className="h-10 w-10"
                              >
                                <Edit2 className="h-5 w-5" />
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                className="text-red-500 hover:bg-red-50 h-10 w-10"
                                onClick={() => handleDeleteCourt(court.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col-reverse md:flex-row md:justify-between gap-3 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => changeTab("details")}
              className="w-full md:w-auto h-12 text-base"
            >
              이전: 상세 정보
            </Button>
            <Button 
              type="button" 
              onClick={() => changeTab("images")}
              className="w-full md:w-auto h-12 text-base"
            >
              다음: 이미지
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-6 pt-2">
          <div className="space-y-6">
            <Label className="text-base">시설 이미지</Label>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Plus className="w-10 h-10 text-gray-400" />
                  <p className="mb-2 text-sm md:text-base text-gray-500 text-center px-2">
                    <span className="font-semibold">클릭하여 파일 선택</span> 또는 드래그 앤 드롭
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                </div>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            
            {facilityData.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-medium mb-4">업로드된 이미지</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {facilityData.images.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-36">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Facility Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col-reverse md:flex-row md:justify-between gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setActiveTab("courts")}
              className="w-full md:w-auto h-12 text-base"
            >
              이전: 코트 정보
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto h-12 text-base"
            >
              {isLoading ? "등록 중..." : "시설 등록하기"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
} 