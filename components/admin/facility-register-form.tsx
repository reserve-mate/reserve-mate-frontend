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

// 코트 유형 목록
const courtTypes = [
  { value: "indoor", label: "실내" },
  { value: "outdoor", label: "실외" },
  { value: "hardcourt", label: "하드코트" },
  { value: "clay", label: "클레이코트" },
  { value: "grass", label: "잔디코트" },
  { value: "artificial", label: "인조잔디" },
]

const sportTypes = [
  { value: "tennis", label: "테니스" },
  { value: "futsal", label: "풋살" },
  { value: "basketball", label: "농구" },
  { value: "volleyball", label: "배구" },
  { value: "badminton", label: "배드민턴" },
  { value: "baseball", label: "야구" },
  { value: "other", label: "기타" },
]

// 코트 타입 정의
type Court = {
  id: string;
  name: string;
  type: string;
  width: string;
  height: string;
  isActive: boolean;
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
    address: "",
    detailAddress: "",
    description: "",
    courtsCount: "",
    openingHours: "",
    closingHours: "",
    hasParking: false,
    hasShower: false,
    hasEquipmentRental: false,
    hasCafe: false,
    images: [] as File[]
  })

  // 코트 정보를 관리하기 위한 상태
  const [courts, setCourts] = useState<Court[]>([])
  const [editingCourt, setEditingCourt] = useState<Court | null>(null)
  const [courtFormData, setCourtFormData] = useState<Court>({
    id: "",
    name: "",
    type: "",
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
    if (!courtFormData.name || !courtFormData.type || !courtFormData.width || 
        !courtFormData.height) {
      toast({
        title: "입력 오류",
        description: "코트 이름, 유형, 가로/세로 길이는 필수 입력 항목입니다.",
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
      type: "",
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // 필수 필드 체크
      if (!facilityData.name || !facilityData.sportType || !facilityData.address || 
          !facilityData.openingHours || !facilityData.closingHours) {
        throw new Error("필수 정보를 모두 입력해주세요.")
      }

      // 코트 정보 체크
      if (courts.length === 0) {
        throw new Error("최소 하나 이상의 코트 정보를 등록해주세요.")
      }
      
      // API 호출 및 데이터 저장 (실제로는 서버 API 호출)
      
      // 변환된 데이터 형식으로 전달
      const processedData = {
        ...facilityData,
        courtsCount: courts.length,
        courts: courts,
        openingHours: `${facilityData.openingHours}-${facilityData.closingHours}`
      }
      
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
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="details">상세 정보</TabsTrigger>
          <TabsTrigger value="courts">코트 정보</TabsTrigger>
          <TabsTrigger value="images">이미지</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">시설명 *</Label>
            <Input
              id="name"
              name="name"
              value={facilityData.name}
              onChange={handleInputChange}
              placeholder="예: 서울 테니스 센터"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sportType">종목 *</Label>
            <Select 
              value={facilityData.sportType} 
              onValueChange={(value) => handleSelectChange('sportType', value)}
            >
              <SelectTrigger id="sportType">
                <SelectValue placeholder="종목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {sportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">주소 *</Label>
            <div className="flex space-x-2">
              <Input
                id="address"
                name="address"
                value={facilityData.address}
                onChange={handleInputChange}
                placeholder="예: 서울시 강남구 테헤란로 123"
                className="flex-1"
                required
              />
              <Button type="button" variant="outline">
                <MapPin className="mr-2 h-4 w-4" /> 주소 검색
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="detailAddress">상세 주소</Label>
            <Input
              id="detailAddress"
              name="detailAddress"
              value={facilityData.detailAddress}
              onChange={handleInputChange}
              placeholder="예: 2층 테니스 코트"
            />
          </div>
          
          <Button 
            type="button" 
            className="mt-2" 
            onClick={() => setActiveTab("details")}
          >
            다음: 상세 정보
          </Button>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="openingHours">운영 시작 시간 *</Label>
              <Select 
                value={facilityData.openingHours} 
                onValueChange={(value) => handleSelectChange('openingHours', value)}
              >
                <SelectTrigger id="openingHours">
                  <SelectValue placeholder="시작 시간을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i < 10 ? `0${i}` : `${i}`
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="closingHours">운영 종료 시간 *</Label>
              <Select 
                value={facilityData.closingHours} 
                onValueChange={(value) => handleSelectChange('closingHours', value)}
              >
                <SelectTrigger id="closingHours">
                  <SelectValue placeholder="종료 시간을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i < 10 ? `0${i}` : `${i}`
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>편의 시설</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasParking" 
                    checked={facilityData.hasParking}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('hasParking', checked as boolean)
                    }
                  />
                  <Label htmlFor="hasParking">주차장</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasShower" 
                    checked={facilityData.hasShower}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('hasShower', checked as boolean)
                    }
                  />
                  <Label htmlFor="hasShower">샤워실</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasEquipmentRental" 
                    checked={facilityData.hasEquipmentRental}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('hasEquipmentRental', checked as boolean)
                    }
                  />
                  <Label htmlFor="hasEquipmentRental">장비 대여</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasCafe" 
                    checked={facilityData.hasCafe}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('hasCafe', checked as boolean)
                    }
                  />
                  <Label htmlFor="hasCafe">카페/휴게실</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">시설 설명</Label>
              <Textarea
                id="description"
                name="description"
                value={facilityData.description}
                onChange={handleInputChange}
                placeholder="시설에 대한 추가 설명을 입력하세요"
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setActiveTab("basic")}
            >
              이전: 기본 정보
            </Button>
            <Button 
              type="button" 
              onClick={() => setActiveTab("courts")}
            >
              다음: 코트 정보
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="courts" className="space-y-4 pt-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">코트 정보 등록</h3>
            <p className="text-sm text-gray-500 mb-4">
              각 코트의 상세 정보를 입력하세요. 최소 하나 이상의 코트 정보가 필요합니다.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>{editingCourt ? "코트 정보 수정" : "새 코트 추가"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="courtName">코트 이름 *</Label>
                    <Input
                      id="courtName"
                      name="name"
                      value={courtFormData.name}
                      onChange={handleCourtInputChange}
                      placeholder="예: A코트, 센터 코트"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="courtType">코트 유형 *</Label>
                    <Select 
                      value={courtFormData.type} 
                      onValueChange={(value) => handleCourtSelectChange('type', value)}
                    >
                      <SelectTrigger id="courtType">
                        <SelectValue placeholder="코트 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {courtTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="courtWidth">가로 길이 (m) *</Label>
                    <Input
                      id="courtWidth"
                      name="width"
                      type="number"
                      value={courtFormData.width}
                      onChange={handleCourtInputChange}
                      placeholder="예: 20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="courtHeight">세로 길이 (m) *</Label>
                    <Input
                      id="courtHeight"
                      name="height"
                      type="number"
                      value={courtFormData.height}
                      onChange={handleCourtInputChange}
                      placeholder="예: 10"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-2">
                  <Checkbox 
                    id="courtIsActive" 
                    checked={courtFormData.isActive}
                    onCheckedChange={(checked) => 
                      setCourtFormData(prev => ({ ...prev, isActive: checked as boolean }))
                    }
                  />
                  <Label htmlFor="courtIsActive">코트 활성화 상태 (비활성화 시 예약 불가)</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={handleAddCourt}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {editingCourt ? "코트 수정하기" : "코트 추가하기"}
                </Button>
              </CardFooter>
            </Card>

            <Separator className="my-6" />

            <div className="rounded-md border">
              <div className="p-4">
                <h4 className="text-md font-medium mb-2">등록된 코트 목록 ({courts.length}개)</h4>
                {courts.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    등록된 코트가 없습니다. 위 폼을 통해 코트를 추가해주세요.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {courts.map((court) => (
                      <Card key={court.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{court.name}</h5>
                              <p className="text-sm text-gray-500">
                                {courtTypes.find(t => t.value === court.type)?.label || court.type} | 
                                {" "}{parseInt(court.width).toLocaleString()}m × {parseInt(court.height).toLocaleString()}m | 
                                상태: {court.isActive ? "활성화" : "비활성화"}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEditCourt(court)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                className="text-red-500 hover:bg-red-50"
                                onClick={() => handleDeleteCourt(court.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setActiveTab("details")}
            >
              이전: 상세 정보
            </Button>
            <Button 
              type="button" 
              onClick={() => setActiveTab("images")}
            >
              다음: 이미지
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4 pt-4">
          <div className="space-y-4">
            <Label>시설 이미지</Label>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Plus className="w-8 h-8 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
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
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">업로드된 이미지</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {facilityData.images.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-24">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Facility Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setActiveTab("courts")}
            >
              이전: 코트 정보
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? "등록 중..." : "시설 등록하기"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
} 