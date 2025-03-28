"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const sportTypes = [
  { value: "soccer", label: "축구" },
  { value: "futsal", label: "풋살" },
  { value: "basketball", label: "농구" },
  { value: "volleyball", label: "배구" },
  { value: "tennis", label: "테니스" },
  { value: "badminton", label: "배드민턴" },
  { value: "baseball", label: "야구" },
  { value: "swimming", label: "수영" },
  { value: "other", label: "기타" },
]

const amenities = [
  { id: "parking", label: "주차시설" },
  { id: "shower", label: "샤워실" },
  { id: "locker", label: "락커룸" },
  { id: "equipment", label: "장비대여" },
  { id: "cafe", label: "카페/매점" },
  { id: "wifi", label: "무료 와이파이" },
]

export default function RegisterFacilityPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [facilityData, setFacilityData] = useState({
    name: "",
    address: "",
    sportType: "",
    description: "",
    openingHours: "",
    contact: "",
    price: "",
    amenities: [] as string[],
    images: [] as File[]
  })
  
  // 로그인 확인
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!loggedIn) {
      toast({
        title: "로그인이 필요합니다",
        description: "시설 등록을 위해 로그인이 필요합니다.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    
    // 관리자 권한 확인
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) {
      toast({
        title: "접근 권한이 없습니다",
        description: "시설 등록은 관리자만 가능합니다.",
        variant: "destructive",
      })
      router.push('/')
    }
  }, [router])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFacilityData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (value: string) => {
    setFacilityData(prev => ({ ...prev, sportType: value }))
  }
  
  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setFacilityData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityId]
      }))
    } else {
      setFacilityData(prev => ({
        ...prev,
        amenities: prev.amenities.filter(id => id !== amenityId)
      }))
    }
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFacilityData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }))
    }
  }
  
  const handleRemoveImage = (index: number) => {
    setFacilityData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // 실제로는 API 호출하여 서버에 전송
      // 테스트를 위한 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "시설 등록 완료",
        description: "시설이 성공적으로 등록되었습니다.",
      })
      
      // 등록 완료 후 시설 목록 페이지로 이동
      router.push('/facilities')
    } catch (error) {
      toast({
        title: "시설 등록 실패",
        description: "시설 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">시설 등록</h1>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>시설 정보 입력</CardTitle>
          <CardDescription>
            아래 양식을 작성하여 새로운 스포츠 시설을 등록하세요.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">시설 이름 <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={facilityData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="예: OO 풋살장"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sportType">스포츠 유형 <span className="text-red-500">*</span></Label>
                  <Select
                    value={facilityData.sportType}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger id="sportType">
                      <SelectValue placeholder="스포츠 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportTypes.map((sport) => (
                        <SelectItem key={sport.value} value={sport.value}>
                          {sport.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">주소 <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  name="address"
                  value={facilityData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="예: 서울특별시 강남구 테헤란로 123"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingHours">운영 시간</Label>
                  <Input
                    id="openingHours"
                    name="openingHours"
                    value={facilityData.openingHours}
                    onChange={handleInputChange}
                    placeholder="예: 09:00 - 22:00, 연중무휴"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact">연락처 <span className="text-red-500">*</span></Label>
                  <Input
                    id="contact"
                    name="contact"
                    value={facilityData.contact}
                    onChange={handleInputChange}
                    required
                    placeholder="예: 010-1234-5678"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">이용 요금</Label>
                <Input
                  id="price"
                  name="price"
                  value={facilityData.price}
                  onChange={handleInputChange}
                  placeholder="예: 시간당 50,000원, 1인당 10,000원"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">시설 설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={facilityData.description}
                  onChange={handleInputChange}
                  placeholder="시설에 대한 상세 설명을 입력하세요..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-3">
                <Label>편의 시설</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={facilityData.amenities.includes(amenity.id)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                      />
                      <label
                        htmlFor={amenity.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="images">시설 사진</Label>
                
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 h-auto py-2">
                    <TabsTrigger value="upload" className="py-2">파일 선택</TabsTrigger>
                    <TabsTrigger value="preview" disabled={facilityData.images.length === 0} className="py-2">
                      {facilityData.images.length > 0 ? `선택된 파일 (${facilityData.images.length})` : "선택된 파일 없음"}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="pt-4 pb-6">
                    <div className="w-full p-2 border border-gray-200 rounded-md">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="h-auto py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 mb-2">최대 5MB 크기의 이미지 파일을 여러 개 선택할 수 있습니다.</p>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="pt-4 pb-6">
                    {facilityData.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {facilityData.images.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-70 hover:opacity-100"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">선택된 파일이 없습니다.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-[120px]"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="w-[120px] bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? "등록 중..." : "등록하기"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* 모바일 하단 네비게이션용 여백 */}
      <div className="h-16 md:hidden"></div>
    </div>
  )
} 