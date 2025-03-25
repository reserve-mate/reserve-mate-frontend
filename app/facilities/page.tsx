"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MapPin, Search, Filter, Star } from "lucide-react"

// 시설 데이터 타입
type Facility = {
  id: string
  name: string
  address: string
  sportType: string
  rating: number
  priceRange: string
  imageUrl: string
}

// 더미 데이터
const dummyFacilities: Facility[] = [
  {
    id: "1",
    name: "서울 테니스 센터",
    address: "서울시 강남구 테헤란로 123",
    sportType: "테니스",
    rating: 4.5,
    priceRange: "20,000원 ~ 40,000원",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "강남 풋살장",
    address: "서울시 강남구 역삼동 456",
    sportType: "풋살",
    rating: 4.2,
    priceRange: "30,000원 ~ 50,000원",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "종로 농구코트",
    address: "서울시 종로구 종로 789",
    sportType: "농구",
    rating: 4.0,
    priceRange: "15,000원 ~ 25,000원",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    name: "한강 배드민턴장",
    address: "서울시 영등포구 여의도동 101",
    sportType: "배드민턴",
    rating: 4.7,
    priceRange: "10,000원 ~ 20,000원",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    name: "송파 스포츠 센터",
    address: "서울시 송파구 잠실동 202",
    sportType: "테니스",
    rating: 4.3,
    priceRange: "25,000원 ~ 45,000원",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    name: "마포 실내 풋살장",
    address: "서울시 마포구 합정동 303",
    sportType: "풋살",
    rating: 4.1,
    priceRange: "35,000원 ~ 55,000원",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
]

export default function FacilitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sportType, setSportType] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [facilities, setFacilities] = useState<Facility[]>(dummyFacilities)

  // 검색 처리
  const handleSearch = () => {
    // 실제 구현에서는 API 호출을 통해 검색 결과를 가져옵니다
    const filtered = dummyFacilities.filter((facility) => {
      const matchesSearch =
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSport = sportType === "" || facility.sportType === sportType

      return matchesSearch && matchesSport
    })

    setFacilities(filtered)
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8">스포츠 시설 찾기</h1>

      {/* 검색 필터 */}
      <Card className="styled-card mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Input
                placeholder="시설명 또는 위치 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <Select value={sportType} onValueChange={setSportType}>
              <SelectTrigger>
                <SelectValue placeholder="스포츠 종류" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="테니스">테니스</SelectItem>
                <SelectItem value="풋살">풋살</SelectItem>
                <SelectItem value="농구">농구</SelectItem>
                <SelectItem value="배드민턴">배드민턴</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">가격 범위</span>
                <span className="text-sm">
                  {priceRange[0]}천원 - {priceRange[1]}천원
                </span>
              </div>
              <Slider defaultValue={[0, 100]} max={100} step={5} value={priceRange} onValueChange={setPriceRange} />
            </div>
          </div>

          <Button onClick={handleSearch} className="primary-button">
            <Filter className="mr-2 h-4 w-4" /> 필터 적용
          </Button>
        </CardContent>
      </Card>

      {/* 시설 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.id} className="styled-card h-full">
            <div className="relative h-48">
              <Image
                src={facility.imageUrl || "/placeholder.svg"}
                alt={facility.name}
                fill
                className="object-cover rounded-t-xl"
              />
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{facility.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm">{facility.rating}</span>
                </div>
              </div>
              <div className="flex items-start mb-2">
                <MapPin className="h-4 w-4 text-mint-500 mr-1 mt-0.5" />
                <span className="text-sm text-gray-500">{facility.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{facility.sportType}</span>
                <span className="text-sm text-gray-500">{facility.priceRange}</span>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button asChild className="w-full primary-button">
                <Link href={`/facilities/${facility.id}`}>예약하기</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

