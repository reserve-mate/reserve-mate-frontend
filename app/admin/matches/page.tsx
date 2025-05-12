"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash, 
  Eye, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  CircleDot,
  X,
  FilterX
} from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

// 매치 등록 폼 컴포넌트 import
import RegisterMatchForm from "@/components/admin/match-register-form"

// 더미 매치 데이터
const dummyMatches = [
  {
    id: "1",
    title: "주말 테니스 초보 매치",
    facilityName: "서울 테니스 센터",
    address: "서울시 강남구 테헤란로 123",
    sportType: "테니스",
    matchDate: "2025-03-28",
    matchTime: "18:00 - 20:00",
    currentParticipants: 6,
    maxParticipants: 8,
    status: "모집중"
  },
  {
    id: "2",
    title: "평일 저녁 풋살 매치",
    facilityName: "강남 풋살장",
    address: "서울시 강남구 역삼동 456",
    sportType: "풋살",
    matchDate: "2025-03-29",
    matchTime: "19:00 - 21:00",
    currentParticipants: 10,
    maxParticipants: 10,
    status: "마감"
  },
  {
    id: "3",
    title: "농구 3대3 매치",
    facilityName: "종로 농구코트",
    address: "서울시 종로구 종로 789",
    sportType: "농구",
    matchDate: "2025-03-30",
    matchTime: "14:00 - 16:00",
    currentParticipants: 4,
    maxParticipants: 6,
    status: "모집중"
  },
  {
    id: "4",
    title: "배드민턴 복식 매치",
    facilityName: "한강 배드민턴장",
    address: "서울시 영등포구 여의도동 101",
    sportType: "배드민턴",
    matchDate: "2025-03-31",
    matchTime: "20:00 - 22:00",
    currentParticipants: 4,
    maxParticipants: 4,
    status: "마감"
  },
  {
    id: "5",
    title: "테니스 중급자 매치",
    facilityName: "송파 스포츠 센터",
    address: "서울시 송파구 잠실동 202",
    sportType: "테니스",
    matchDate: "2025-04-01",
    matchTime: "10:00 - 12:00",
    currentParticipants: 2,
    maxParticipants: 4,
    status: "모집중"
  },
  {
    id: "6",
    title: "5대5 풋살 매치",
    facilityName: "마포 실내 풋살장",
    address: "서울시 마포구 합정동 303",
    sportType: "풋살",
    matchDate: "2025-04-02",
    matchTime: "18:00 - 20:00",
    currentParticipants: 8,
    maxParticipants: 10,
    status: "모집중"
  }
]

// 스포츠 종류별 아이콘
const sportTypeIcons: Record<string, React.ReactNode> = {
  "테니스": <CircleDot className="h-4 w-4" />,
  "풋살": <Users className="h-4 w-4" />,
  "농구": <Users className="h-4 w-4" />,
  "배드민턴": <CircleDot className="h-4 w-4" />,
}

// 스포츠 종류 목록
const sportTypes = ["테니스", "풋살", "농구", "배드민턴"]

// 상태별 배지 색상
const statusColors: Record<string, string> = {
  "모집중": "bg-green-100 text-green-800",
  "마감": "bg-gray-100 text-gray-800",
  "진행중": "bg-blue-100 text-blue-800",
  "종료": "bg-red-100 text-red-800"
}

export default function AdminMatchesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [matches, setMatches] = useState(dummyMatches)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [selectedSport, setSelectedSport] = useState<string>("ALL")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  
  // 검색 필터링 기능
  const filteredMatches = matches.filter(match => {
    // 텍스트 검색 필터링
    const textMatch = match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.sportType.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 종목 필터링
    const sportMatch = selectedSport === "ALL" || match.sportType === selectedSport;
    
    // 날짜 필터링
    const matchDateObj = new Date(match.matchDate);
    const dateMatch = 
      (!startDate || matchDateObj >= startDate) && 
      (!endDate || matchDateObj <= endDate);
    
    return textMatch && sportMatch && dateMatch;
  });
  
  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSport("ALL");
    setStartDate(undefined);
    setEndDate(undefined);
  };
  
  // 삭제 처리
  const handleDelete = (id: string) => {
    setMatches(prev => prev.filter(match => match.id !== id))
  }
  
  // 마감/재오픈 토글
  const toggleStatus = (id: string) => {
    setMatches(prev => prev.map(match => 
      match.id === id ? {
        ...match,
        status: match.status === "모집중" ? "마감" : "모집중"
      } : match
    ))
  }

  // 매치 등록 폼 토글
  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm)
  }
  
  // 매치 등록 완료 후 처리
  const handleMatchRegisterComplete = (newMatch: any) => {
    // 새 매치를 목록에 추가
    setMatches(prev => [...prev, {
      id: String(prev.length + 1),
      ...newMatch,
      currentParticipants: 0,
      status: "모집중"
    }])
    // 등록 폼 닫기
    setShowRegisterForm(false)
    
    // 성공 메시지 처리 등...
  }

  // 매치 관리 목록 UI
  const renderMatchesList = () => (
    <Card>
      <CardHeader>
        <CardTitle>등록된 매치</CardTitle>
        <CardDescription>
          모든 매치를 관리하고 새로운 매치를 등록할 수 있습니다.
        </CardDescription>
        
        <div className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:max-w-sm">
              <Input 
                placeholder="매치명, 시설명으로 검색" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="모든 종목" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모든 종목</SelectItem>
                {sportTypes.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">시작일:</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, 'yyyy-MM-dd')
                    ) : (
                      <span className="text-muted-foreground">날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">종료일:</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, 'yyyy-MM-dd')
                    ) : (
                      <span className="text-muted-foreground">날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date: Date) => startDate ? date < startDate : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button variant="outline" onClick={resetFilters} className="ml-auto">
              <FilterX className="mr-2 h-4 w-4" />
              필터 초기화
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>매치명</TableHead>
              <TableHead>종류</TableHead>
              <TableHead className="hidden md:table-cell">시설</TableHead>
              <TableHead className="hidden md:table-cell">날짜</TableHead>
              <TableHead className="hidden md:table-cell">시간</TableHead>
              <TableHead>인원</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">{match.title}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {sportTypeIcons[match.sportType]}
                    </Badge>
                    <span>{match.sportType}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    {match.facilityName}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    {match.matchDate}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    {match.matchTime}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                    {match.currentParticipants}/{match.maxParticipants}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={statusColors[match.status]}
                    variant="outline"
                  >
                    {match.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">메뉴 열기</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/matches/${match.id}`} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          상세 보기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/matches/edit/${match.id}`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          수정
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleDelete(match.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredMatches.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
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
        <h1 className="text-3xl font-bold">매치 관리</h1>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={toggleRegisterForm}
        >
          <Plus className="mr-2 h-4 w-4" /> 새 매치 등록
        </Button>
      </div>
      
      {showRegisterForm ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">새 매치 등록</h2>
            <Button variant="ghost" size="icon" onClick={toggleRegisterForm}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="register-form-container">
                <RegisterMatchForm onComplete={handleMatchRegisterComplete} />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      {renderMatchesList()}
    </div>
  )
} 