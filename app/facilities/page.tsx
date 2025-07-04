"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MapPin, Search, Filter, Star, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { facilityService } from "@/lib/services/facilityService"
import { toast } from "@/hooks/use-toast"
import { Facilities } from "@/lib/types/facilityTypes"

// 시설 데이터 타입
type Facility = {
  facilityId : number
  facilityName : string
  address : string
  sportType : string
  courtId : number
  courtName : string
  fee : number
  imageUrl : string
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

export default function FacilitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sportType, setSportType] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10])
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("10")
  const [facilities, setFacilities] = useState<Facilities[]>([])
  const [isPriceInputVisible, setIsPriceInputVisible] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  //페이징
  const [lastId, setLastId] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 6

  // 로그인 상태 확인
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])

  // 페이지 첫 로딩 시 api 호출
  useEffect(()=> {
    handleSearch()
  },[])

  // 검색 처리
  const handleSearch = async() => {
    try {
      // 실제 구현에서는 API 호출을 통해 검색 결과를 가져옵니다
      const response = await facilityService.getFacilities({
        SportType: sportType === "ALL" ? null : sportType,
        minPrice: Number(minPrice) * 10000,
        maxPrice: Number(maxPrice) * 10000,
        keyword: searchTerm,
        lastId: lastId,
        size: PAGE_SIZE,
      })
      console.log("시설목록----------");
      console.log(response);
      /*
      const filtered = dummyFacilities.filter((facility) => {
        const matchesSearch =
          facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.address.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSport = sportType === "" || sportType === "all" || facility.sportType === sportType

        return matchesSearch && matchesSport
      })
      */  

      setFacilities(response.content)
      if (response.content.length > 0) {
        const lastCourt = response.content[response.content.length - 1]
        setLastId(lastCourt.courtId)
      }
      setHasMore(!response.last)  
    } catch (error) {
      console.log(error);
      toast({
        title: "시설 목록 오류 발생",
        description: "시설 목록을 가져오는 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
    
  }

  // 가격 범위 변경 처리
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    setMinPrice(values[0].toString());
    setMaxPrice(values[1].toString());
  }

  // 입력 필드 값 변경 처리
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === '' ? 0 : parseInt(value);
    setMinPrice(value);
    
    if (numValue >= 0 && numValue <= parseInt(maxPrice)) {
      setPriceRange([numValue, priceRange[1]]);
    }
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === '' ? 0 : parseInt(value);
    setMaxPrice(value);
    
    if (numValue >= parseInt(minPrice) && numValue <= 50) {
      setPriceRange([priceRange[0], numValue]);
    }
  }

  // 가격 범위 입력 방식 토글
  const togglePriceInput = () => {
    setIsPriceInputVisible(!isPriceInputVisible);
  }

  return (
    <div className="page-container pb-16 sm:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">스포츠 시설 찾기</h1>
      </div>

      {/* 검색 필터 */}
      <Card className="styled-card mb-8">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start gap-6">
            <div className="relative flex-grow-0 flex-shrink-0 w-full sm:w-64 md:w-56 lg:w-64">
              <Input
                placeholder="시설명 또는 위치 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex-grow-0 flex-shrink-0 w-full sm:w-48 md:w-40 lg:w-48">
              <Select value={sportType} onValueChange={setSportType}>
                <SelectTrigger>
                  <SelectValue placeholder="스포츠 종류" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">전체</SelectItem>
                  {sportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">가격 범위</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={togglePriceInput} 
                  className="text-xs h-8 px-2"
                >
                  {isPriceInputVisible ? "슬라이더로 설정" : "직접 입력하기"}
                </Button>
              </div>
              
              {isPriceInputVisible ? (
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    max={parseInt(maxPrice)}
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    className="w-24 text-center"
                  />
                  <span className="text-sm">~</span>
                  <Input
                    type="number"
                    min={parseInt(minPrice)}
                    max="50"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    className="w-24 text-center"
                  />
                  <span className="text-sm whitespace-nowrap">만원</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex-grow">
                    <Slider 
                      defaultValue={[0, 10]} 
                      max={50} 
                      step={1} 
                      value={priceRange} 
                      onValueChange={handlePriceRangeChange}
                      className="py-4"
                    />
                  </div>
                  <span className="text-sm whitespace-nowrap font-medium min-w-[90px]">{priceRange[0]}만원 - {priceRange[1]}만원</span>
                </div>
              )}
            </div>

            <Button onClick={handleSearch} className="primary-button flex-shrink-0 w-full sm:w-auto h-10">
              <Filter className="mr-2 h-4 w-4" /> 필터 적용
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 시설 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.facilityId} className="styled-card h-full">
            <div className="relative h-48">
              <Image
                src={facility.imageUrl ? `/uploads${facility.imageUrl}` : "/placeholder.svg"}
                alt={facility.facilityName}
                fill
                className="object-cover rounded-t-xl"
              />
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{facility.facilityName}</h3>
                  <p className="text-sm">{facility.courtName}</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  {/* <span className="text-sm">{facility.rating}</span> */}
                </div>
              </div>
              <div className="flex items-start mb-2">
                <MapPin className="h-4 w-4 text-mint-500 mr-1 mt-0.5" />
                <span className="text-sm text-gray-500">{facility.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {sportTypes.find((type) => type.value === facility.sportType)?.label ?? facility.sportType}
                  {/* {facility.sportType} */}
                </span>
                <span className="text-sm text-gray-500">{facility.fee} 원</span>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button asChild className="w-full primary-button">
                <Link href={`/facilities/${facility.facilityId}/${facility.courtId}`}>예약하기</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

