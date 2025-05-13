"use client"

import { useEffect, useRef, useState } from "react"
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
  FilterX,
  Filter
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
import { AdminMatches, AdminMatchSearch } from "@/lib/types/matchTypes"
import { matchService } from "@/lib/services/matchService"
import { MatchStatus, SportType } from "@/lib/enum/matchEnum"
import { useRouter } from "next/navigation"

// 스포츠 종류 목록
const sportTypes: SportType[] = [
  SportType.TENNIS
  , SportType.FUTSAL
  , SportType.SOCCER
  , SportType.BADMINTON
  , SportType.BASEBALL
  , SportType.BASKETBALL
]

// 상태별 배지 색상
const statusColors: Record<MatchStatus, string> = {
  "APPLICABLE": "bg-green-100 text-green-800",
  "FINISH": "bg-gray-100 text-gray-800",
  "CLOSE_TO_DEADLINE": "bg-blue-100 text-blue-800",
  "END": "bg-red-100 text-red-800"
}

// 날짜 포맷
const setDateFormat = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`;
}

export default function AdminMatchesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showRegisterForm, setShowRegisterForm] = useState(false)

  // 관리자 매치 목록 조회
  const [adminMatches, setAdminMatches] = useState<AdminMatches[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isError, setIsError] = useState(false);

  // 검색 세팅
  const [selectedSport, setSelectedSport] = useState<SportType>(SportType.ALL)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const router = useRouter();

  // 로그인 상태를 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const observerRef = useRef<HTMLTableElement | null>(null);

  const ref = useRef(false);

  const fetchGetAdinMatches = async (pageNumber: number) => {

    let startDateStr: string = (startDate) ? setDateFormat(startDate) : "";
    let endDateStr: string = (endDate) ? setDateFormat(endDate) : "";

    const searchParam: AdminMatchSearch = {
      searchValue: searchTerm,
      pageNumber: pageNumber,
      startDate: startDateStr,
      endDate: endDateStr,
      sportType: selectedSport
    }
    
    try {
      const adminMatches = await matchService.adminGetMatches(searchParam);
      setAdminMatches((prev) => [...prev, ...adminMatches.content]);
      setPage(adminMatches.number);
      setHasMore(!adminMatches.last);
    } catch (error: any) {
      console.log(error);
      if(!error || error.errorCode === "FORBIDDEN") {
        router.push("/login");
        return;
      }
      setIsError(true);
      setAdminMatches([]);
    } finally {
      setLoading(false);
    }

  }

  // 관리자 매치 초기 조회
  useEffect(() => {
    if(ref.current) return;
    ref.current = true; 

    if(loading) return; // 로딩 중이면 중지

    setLoading(true); // 로딩 실행

    fetchGetAdinMatches(0);
  }, [])

  // 무한 스크롤
  useEffect(() => {
    if(loading || !hasMore || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting) {
          fetchGetAdinMatches(page + 1);
        }
      }, {threshold: 1}
    );

    if(observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if(observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    }

  }, [page, hasMore, loading])

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])
  
  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSport(SportType.ALL);
    setStartDate(undefined);
    setEndDate(undefined);
  };
  
  // 삭제 처리
  const handleDelete = (id: number) => {
    //setMatches(prev => prev.filter(match => adminMatches.id !== id))
  }
  
  // 마감/재오픈 토글
  const toggleStatus = (id: number) => {
    // setMatches(prev => prev.map(match => 
    //   match.id === id ? {
    //     ...match,
    //     status: match.status === "모집중" ? "마감" : "모집중"
    //   } : match
    // ))

    // setAdminMatches(prev => prev.map(adminMatch => adminMatch.matchId === id ? {
    //   ...adminMatch,
    //   matchStatus: adminMatch.matchStatus === "APPLICABLE" ? "" : ""
    //   } : adminMatch
    // ));
  }

  // 매치 등록 폼 토글
  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm)
  }
  
  // 매치 등록 완료 후 처리
  const handleMatchRegisterComplete = () => {
    setAdminMatches([]);
    fetchGetAdinMatches(0)
    // 새 매치를 목록에 추가
    // setMatches(prev => [...prev, {
    //   id: String(prev.length + 1),
    //   ...newMatch,
    //   currentParticipants: 0,
    //   status: "모집중"
    // }])
    // 등록 폼 닫기
    setShowRegisterForm(false)
    
    // 성공 메시지 처리 등...
  }

  // 종목에 따른 화면 노출
  const displaySportType = (sportType: SportType): string => {
    let sportStr = "";

    switch (sportType) {
      case SportType.TENNIS:
        sportStr = "테니스";
        break;
      case SportType.SOCCER:
        sportStr = "축구";
        break;
      case SportType.FUTSAL:
        sportStr = "풋살";
        break;
      case SportType.BASEBALL:
        sportStr = "야구";
        break;
      case SportType.BADMINTON:
        sportStr = "배드민턴";
        break;
      case SportType.BASKETBALL:
        sportStr = "농구";
        break;
    }

    return sportStr;
  }

  // 매치 상태에 따른 화면 노출 수정
  const displayMatchStatus = (status: MatchStatus): string => {
    let statusStr: string = "";
    
    if(status === 'APPLICABLE') {
      statusStr = "모집중";
    }else if(status === "CLOSE_TO_DEADLINE") {
      statusStr = "마감임박";
    }else if(status === "FINISH") {
      statusStr = "마감";
    }else if(status === "END") {
      statusStr = "종료";
    }

    return statusStr;
  }

  // 관리자 매치 검색
  const handleMatchSearch = () => {
    // 검색 전 초기화
    setAdminMatches([]);
    setPage(0);
    setHasMore(false);

    fetchGetAdinMatches(0);
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
            
            <Select value={selectedSport} onValueChange={(value) => setSelectedSport(value as SportType)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="모든 종목" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SportType.ALL}>전체 종목</SelectItem>
                <SelectItem value={SportType.TENNIS}>테니스</SelectItem>
                <SelectItem value={SportType.SOCCER}>축구</SelectItem>
                <SelectItem value={SportType.FUTSAL}>풋살</SelectItem>
                <SelectItem value={SportType.BASEBALL}>농구</SelectItem>
                <SelectItem value={SportType.BADMINTON}>배드민턴</SelectItem>
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

              <Button onClick={handleMatchSearch} className="primary-button">
                <Filter className="mr-2 h-4 w-4" />
                필터 적용
              </Button>
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
              <TableHead className="min-w-[140px] max-w-[200px]">매치명</TableHead>
              <TableHead className="min-w-[70px]">종류</TableHead>
              <TableHead className="hidden md:table-cell min-w-[150px] max-w-[200px]">시설</TableHead>
              <TableHead className="hidden md:table-cell min-w-[90px]">날짜</TableHead>
              <TableHead className="hidden md:table-cell min-w-[100px]">시간</TableHead>
              <TableHead className="min-w-[70px]">인원</TableHead>
              <TableHead className="min-w-[90px]">상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminMatches.map((match) => (
              <TableRow key={match.matchId}>
                <TableCell className="font-medium">{match.matchName}</TableCell>
                <TableCell>
                  <span className="whitespace-nowrap">{displaySportType(match.sportType)}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate max-w-[150px]" title={match.facilityName}>{match.facilityName}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="whitespace-nowrap">{match.matchDate}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    {`${match.matchTime}:00-${match.endTime}:00`}
                  </div>
                </TableCell>
                <TableCell className="min-w-[70px]">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                    {match.playerCnt}/{match.teamCapacity}
                  </div>
                </TableCell>
                <TableCell className="min-w-[90px]">
                  <Badge 
                    className={`whitespace-nowrap ${statusColors[match.matchStatus]}`}
                    variant="outline"
                  >
                    {displayMatchStatus(match.matchStatus)}
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
                        <Link href={`/admin/matches/${match.matchId}`} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          상세 보기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/matches/edit/${match.matchId}`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          수정
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleDelete(match.matchId)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {adminMatches.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Table ref={observerRef}>
            <TableBody>
              <TableRow>
                {loading && <TableCell className="text-center">불러오는 중...</TableCell>}
              </TableRow>
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