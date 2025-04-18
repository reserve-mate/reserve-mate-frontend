"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash, 
  Eye, 
  MapPin,
  CircleDot,
  Users,
  Calendar,
  X
} from "lucide-react"

// 시설 등록 폼 컴포넌트 import
import RegisterFacilityForm from "@/components/admin/facility-register-form"
import { toast } from "@/hooks/use-toast"
// 더미 시설 데이터
const dummyFacilities = [
  {
    id: "1",
    name: "서울 테니스 센터",
    address: "서울시 강남구 테헤란로 123",
    sportType: "테니스",
    courtsCount: 4,
    reservationsCount: 120,
    active: true,
  },
  {
    id: "2",
    name: "강남 풋살장",
    address: "서울시 강남구 역삼동 456",
    sportType: "풋살",
    courtsCount: 2,
    reservationsCount: 85,
    active: true,
  },
  {
    id: "3",
    name: "종로 농구코트",
    address: "서울시 종로구 종로 789",
    sportType: "농구",
    courtsCount: 3,
    reservationsCount: 65,
    active: true,
  },
  {
    id: "4",
    name: "한강 배드민턴장",
    address: "서울시 영등포구 여의도동 101",
    sportType: "배드민턴",
    courtsCount: 6,
    reservationsCount: 95,
    active: false,
  },
  {
    id: "5",
    name: "송파 스포츠 센터",
    address: "서울시 송파구 잠실동 202",
    sportType: "테니스",
    courtsCount: 5,
    reservationsCount: 110,
    active: true,
  },
  {
    id: "6",
    name: "마포 실내 풋살장",
    address: "서울시 마포구 합정동 303",
    sportType: "풋살",
    courtsCount: 3,
    reservationsCount: 75,
    active: false,
  },
]

// 스포츠 종류별 아이콘
const sportTypeIcons: Record<string, React.ReactNode> = {
  "테니스": <CircleDot className="h-4 w-4" />,
  "풋살": <Users className="h-4 w-4" />,
  "농구": <Users className="h-4 w-4" />,
  "배드민턴": <CircleDot className="h-4 w-4" />,
}

export default function AdminFacilitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [facilities, setFacilities] = useState(dummyFacilities)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  
  // 검색 기능
  const filteredFacilities = facilities.filter(facility => 
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.sportType.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // 삭제 처리
  const handleDelete = (id: string) => {
    setFacilities(prev => prev.filter(facility => facility.id !== id))
  }
  
  // 활성/비활성 토글
  const toggleActive = (id: string) => {
    setFacilities(prev => prev.map(facility => 
      facility.id === id ? { ...facility, active: !facility.active } : facility
    ))
  }
  
  // 시설 등록 폼 토글
  const toggleRegisterForm = () => {
    // 시설 등록 ROLE_ADMIN 만 접근가능, 개발중 임시 주석 처리
    /*
    const token = localStorage.getItem("accessToken");
    if (token){
      const payload = JSON.parse(atob(token.split('.')[1]))
      const role = payload.role;
      console.log("회원 role : "+ role);
      if (role !== 'ROLE_ADMIN'){
        toast({
          title: "권한 없음",
          description: "시설 등록은 관리자만 가능합니다.",
          variant: "destructive",
        });
        return;
      }
    }
    */
    setShowRegisterForm(!showRegisterForm)
  }
  
  // 시설 등록 완료 후 처리
  const handleFacilityRegisterComplete = (newFacility: any) => {
    // 새 시설을 목록에 추가
    setFacilities(prev => [...prev, {
      id: String(prev.length + 1),
      ...newFacility,
      active: true
    }])
    // 등록 폼 닫기
    setShowRegisterForm(false)
    
    // 성공 메시지 처리 등...
  }

  // 시설 관리 목록 UI
  const renderFacilitiesList = () => (
    <Card>
      <CardHeader>
        <CardTitle>등록된 시설</CardTitle>
        <CardDescription>
          모든 시설을 관리하고 새로운 시설을 등록할 수 있습니다.
        </CardDescription>
        
        <div className="mt-4 flex w-full max-w-sm items-center space-x-2">
          <Input 
            placeholder="시설명, 주소, 종류로 검색" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute ml-2 h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>시설명</TableHead>
              <TableHead>종류</TableHead>
              <TableHead className="hidden md:table-cell">주소</TableHead>
              <TableHead className="hidden md:table-cell">코트 수</TableHead>
              <TableHead className="hidden md:table-cell">예약 건수</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFacilities.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell className="font-medium">{facility.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {sportTypeIcons[facility.sportType]}
                    </Badge>
                    <span>{facility.sportType}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    {facility.address}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{facility.courtsCount}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {facility.reservationsCount}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={facility.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    variant="outline"
                  >
                    {facility.active ? "활성" : "비활성"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/facilities/${facility.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> 상세보기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/facilities/${facility.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> 수정하기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(facility.id)}>
                        {facility.active ? (
                          <>
                            <Trash className="mr-2 h-4 w-4 text-red-500" /> 
                            <span className="text-red-500">비활성화</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="mr-2 h-4 w-4 text-green-500" /> 
                            <span className="text-green-500">활성화</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(facility.id)}>
                        <Trash className="mr-2 h-4 w-4 text-red-500" /> 
                        <span className="text-red-500">삭제하기</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredFacilities.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">시설 관리</h1>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={toggleRegisterForm}
        >
          <Plus className="mr-2 h-4 w-4" /> 새 시설 등록
        </Button>
      </div>
      
      {showRegisterForm ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">새 시설 등록</h2>
            <Button variant="ghost" size="icon" onClick={toggleRegisterForm}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="register-form-container">
                <RegisterFacilityForm onComplete={handleFacilityRegisterComplete} />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      {renderFacilitiesList()}
    </div>
  )
} 