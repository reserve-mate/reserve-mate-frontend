"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, CalendarIcon, Clock, Users, Search, Filter, ChevronLeft, ChevronRight, PlusCircle, Plus } from "lucide-react"
import { format, addDays, subDays, isSameDay, parseISO, isToday, isTomorrow, startOfDay } from "date-fns"
import { ko } from "date-fns/locale"

// 매치 데이터 타입
type Match = {
  id: string
  courtName: string
  facilityName: string
  address: string
  sportType: string
  matchDate: string
  matchTime: string
  teamCapacity: number
  currentTeams: number
  matchPrice: string
  status: "모집중" | "모집완료" | "진행중" | "종료"
}

// 시간별로 그룹화된 매치 타입
type GroupedMatches = {
  [timeSlot: string]: Match[]
}

// 더미 데이터
const dummyMatches: Match[] = [
  {
    id: "1",
    courtName: "코트 A",
    facilityName: "서울 테니스 센터",
    address: "서울시 강남구 테헤란로 123",
    sportType: "테니스",
    matchDate: "2025-03-28",
    matchTime: "18:00 - 20:00",
    teamCapacity: 4,
    currentTeams: 2,
    matchPrice: "15,000원",
    status: "모집중",
  },
  {
    id: "2",
    courtName: "실내 코트 1",
    facilityName: "강남 풋살장",
    address: "서울시 강남구 역삼동 456",
    sportType: "풋살",
    matchDate: "2025-03-29",
    matchTime: "19:00 - 21:00",
    teamCapacity: 6,
    currentTeams: 6,
    matchPrice: "20,000원",
    status: "모집완료",
  },
  {
    id: "3",
    courtName: "코트 B",
    facilityName: "종로 농구코트",
    address: "서울시 종로구 종로 789",
    sportType: "농구",
    matchDate: "2025-03-30",
    matchTime: "14:00 - 16:00",
    teamCapacity: 4,
    currentTeams: 1,
    matchPrice: "10,000원",
    status: "모집중",
  },
  {
    id: "4",
    courtName: "코트 2",
    facilityName: "한강 배드민턴장",
    address: "서울시 영등포구 여의도동 101",
    sportType: "배드민턴",
    matchDate: "2025-03-31",
    matchTime: "20:00 - 22:00",
    teamCapacity: 8,
    currentTeams: 5,
    matchPrice: "12,000원",
    status: "모집중",
  },
  {
    id: "5",
    courtName: "코트 C",
    facilityName: "서울 테니스 센터",
    address: "서울시 강남구 테헤란로 123",
    sportType: "테니스",
    matchDate: "2025-03-28",
    matchTime: "14:00 - 16:00",
    teamCapacity: 4,
    currentTeams: 3,
    matchPrice: "15,000원",
    status: "모집중",
  },
  {
    id: "6",
    courtName: "실외 코트 2",
    facilityName: "강남 풋살장",
    address: "서울시 강남구 역삼동 456",
    sportType: "풋살",
    matchDate: "2025-03-28",
    matchTime: "16:00 - 18:00",
    teamCapacity: 6,
    currentTeams: 4,
    matchPrice: "20,000원",
    status: "모집중",
  },
  {
    id: "7",
    courtName: "코트 A",
    facilityName: "종로 농구코트",
    address: "서울시 종로구 종로 789",
    sportType: "농구",
    matchDate: "2025-03-29",
    matchTime: "10:00 - 12:00",
    teamCapacity: 4,
    currentTeams: 2,
    matchPrice: "10,000원",
    status: "모집중",
  },
  {
    id: "8",
    courtName: "코트 1",
    facilityName: "한강 배드민턴장",
    address: "서울시 영등포구 여의도동 101",
    sportType: "배드민턴",
    matchDate: "2025-03-30",
    matchTime: "18:00 - 20:00",
    teamCapacity: 8,
    currentTeams: 6,
    matchPrice: "12,000원",
    status: "모집중",
  },
  {
    id: "9",
    courtName: "실내 코트 3",
    facilityName: "강북 스포츠센터",
    address: "서울시 강북구 수유동 123",
    sportType: "테니스",
    matchDate: "2025-03-28",
    matchTime: "10:00 - 12:00",
    teamCapacity: 4,
    currentTeams: 1,
    matchPrice: "18,000원",
    status: "모집중",
  },
  {
    id: "10",
    courtName: "실내 코트 2",
    facilityName: "송파 스포츠센터",
    address: "서울시 송파구 잠실동 456",
    sportType: "배드민턴",
    matchDate: "2025-03-29",
    matchTime: "10:00 - 12:00",
    teamCapacity: 6,
    currentTeams: 3,
    matchPrice: "12,000원",
    status: "모집중",
  },
  {
    id: "11",
    courtName: "메인 코트",
    facilityName: "강서 테니스장",
    address: "서울시 강서구 마곡동 789",
    sportType: "테니스",
    matchDate: "2025-03-29",
    matchTime: "10:00 - 12:00",
    teamCapacity: 4,
    currentTeams: 2,
    matchPrice: "15,000원",
    status: "모집중",
  },
]

export default function MatchesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sportType, setSportType] = useState("")
  const [matches, setMatches] = useState<Match[]>(dummyMatches)
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dateRange, setDateRange] = useState<Date[]>([])
  const [startDate, setStartDate] = useState<Date>(startOfDay(new Date()))
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  // 로그인 상태를 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 로그인 상태 확인
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])

  // 날짜 범위 생성
  useEffect(() => {
    const range: Date[] = []
    
    for (let i = 0; i < 14; i++) {
      range.push(addDays(startDate, i))
    }

    setDateRange(range)
  }, [startDate])

  // 초기 선택된 날짜 설정
  useEffect(() => {
    // 처음 로드될 때만 오늘 날짜로 설정
    const today = startOfDay(new Date())
    setSelectedDate(today)
    
    // 이미 날짜가 필터링되어 있다면 다시 필터링
    if (matches.length > 0) {
      let filtered = [...matches]
      filtered = filtered.filter((match) => isSameDay(parseISO(match.matchDate), today))
      setFilteredMatches(filtered)
    }
  }, [])

  // 검색 및 필터링 처리
  useEffect(() => {
    let filtered = [...matches]

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (match) =>
          match.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 스포츠 종류 필터링
    if (sportType && sportType !== "all") {
      filtered = filtered.filter((match) => match.sportType === sportType)
    }

    // 선택된 날짜의 매치만 필터링
    if (selectedDate) {
      filtered = filtered.filter((match) => isSameDay(parseISO(match.matchDate), selectedDate))
    }

    setFilteredMatches(filtered)
  }, [searchTerm, sportType, matches, selectedDate])

  // 날짜별 매치 그룹화 (날짜 뱃지용)
  const matchesByDate = dateRange.map((date) => {
    const dateMatches = matches.filter((match) => isSameDay(parseISO(match.matchDate), date))

    return {
      date,
      matches: dateMatches,
      count: dateMatches.length,
    }
  })

  // 시간별로 매치 그룹화
  const groupMatchesByTime = (matches: Match[]): GroupedMatches => {
    const grouped: GroupedMatches = {}
    
    matches.forEach(match => {
      // 시간만 추출 (18:00 - 20:00 → 18:00)
      const timeSlot = match.matchTime.split(' ')[0]
      
      if (!grouped[timeSlot]) {
        grouped[timeSlot] = []
      }
      
      grouped[timeSlot].push(match)
    })
    
    return grouped
  }
  
  // 시간순으로 정렬된 그룹화된 매치
  const sortedGroupedMatches = (): [string, Match[]][] => {
    const grouped = groupMatchesByTime(filteredMatches)
    
    // 시간을 키로 정렬
    return Object.entries(grouped).sort((a, b) => {
      const timeA = a[0].split(':').map(Number)
      const timeB = b[0].split(':').map(Number)
      
      // 시간으로 먼저 비교
      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0]
      }
      
      // 분으로 비교
      return timeA[1] - timeB[1]
    })
  }

  const handleSearch = () => {
    // 실제 구현에서는 API 호출을 통해 검색 결과를 가져옵니다
    const filtered = dummyMatches.filter((match) => {
      const matchesSearch =
        match.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.address.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSport = sportType === "" || sportType === "all" || match.sportType === sportType

      return matchesSearch && matchesSport
    })

    setMatches(filtered)
  }

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy년 MM월 dd일 (eee)", { locale: ko })
  }

  // 날짜 탭 클릭 처리
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  // 이전 주로 이동
  const handlePrevWeek = () => {
    setStartDate(subDays(startDate, 7))
    
    // 스크롤을 시작점으로 이동
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0
    }
  }

  // 다음 주로 이동
  const handleNextWeek = () => {
    setStartDate(addDays(startDate, 7))
    
    // 스크롤을 시작점으로 이동
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0
    }
  }

  // 오늘 날짜로 이동
  const goToToday = () => {
    const today = startOfDay(new Date())
    setStartDate(today)
    setSelectedDate(today)
    
    // 선택된 날짜가 화면에 표시되도록 스크롤 조정
    setTimeout(() => {
      const todayButton = document.querySelector(`.date-button-today`)
      if (todayButton && scrollContainerRef.current) {
        todayButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }, 100)
  }

  return (
    <div className="page-container pb-16 sm:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-3xl font-bold">소셜 매치 찾기</h1>
      </div>

      {/* 날짜 선택 캘린더 - 상단으로 이동 */}
      <div className="mb-6 relative">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevWeek}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>이전</span>
          </Button>
          
          <div className="text-center mb-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={goToToday}
            >
              오늘
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            className="flex items-center gap-1"
          >
            <span>다음</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div ref={scrollContainerRef} className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="flex space-x-2 min-w-max">
            {dateRange.map((date, index) => {
              const isToday = isSameDay(date, new Date());
              const isFirstDay = index === 0;
              // 이전 날짜와 월이 다른 경우(월이 바뀐 경우)를 체크
              const isPrevDifferentMonth = index > 0 && date.getMonth() !== dateRange[index - 1].getMonth();
              // 첫 날짜이거나 월이 바뀌었을 때 월 표시
              const showMonth = isFirstDay || isPrevDifferentMonth;
              
              return (
                <Button
                  key={index}
                  variant={isSameDay(date, selectedDate) ? "default" : "outline"}
                  onClick={() => handleDateClick(date)}
                  className={`flex flex-col py-2 px-4 h-auto w-[80px] ${
                    isSameDay(date, selectedDate) ? "bg-indigo-600 text-white" : "hover:bg-indigo-50"
                  } ${isToday ? "date-button-today" : ""}`}
                >
                  <span className="text-xs opacity-70">
                    {isToday ? "오늘" : isTomorrow(date) ? "내일" : format(date, "eee", { locale: ko })}
                  </span>
                  {showMonth && (
                    <span className="text-xs font-medium -mb-1">
                      {format(date, "M월", { locale: ko })}
                    </span>
                  )}
                  <span className="text-lg font-semibold">{format(date, "d", { locale: ko })}</span>
                  <Badge
                    className={`mt-1 ${
                      isSameDay(date, selectedDate)
                        ? "bg-white text-indigo-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {matchesByDate[index]?.count || 0}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

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

            <Button onClick={handleSearch} className="primary-button">
              <Filter className="mr-2 h-4 w-4" /> 필터 적용
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 날짜별 매치 목록 */}
      <div className="mt-4">
        {filteredMatches.length > 0 ? (
          <div className="space-y-8">
            {sortedGroupedMatches().map(([timeSlot, matches]) => (
              <div key={timeSlot} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-20 font-bold text-lg">{timeSlot}</div>
                  <div className="h-px flex-grow bg-gray-200"></div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">해당 날짜에 예정된 매치가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// 매치 카드 컴포넌트
function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  return (
    <Card className="styled-card overflow-hidden h-full">
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`${compact ? "text-base" : "text-lg"} font-semibold`}>{match.facilityName}</h3>
          <Badge
            className={`
              ${match.status === "모집중" ? "status-badge status-badge-recruiting" : ""}
              ${match.status === "모집완료" ? "status-badge status-badge-completed" : ""}
              ${match.status === "진행중" ? "status-badge status-badge-in-progress" : ""}
              ${match.status === "종료" ? "status-badge status-badge-ended" : ""}
            `}
          >
            {match.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
            <span className="text-sm text-gray-500">{match.address}</span>
          </div>
          <div className="flex items-start">
            <CalendarIcon className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
            <span className="text-sm text-gray-500">{formatDate(match.matchDate)}</span>
          </div>
          <div className="flex items-start">
            <Clock className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
            <span className="text-sm text-gray-500">{match.matchTime}</span>
          </div>
          <div className="flex items-start">
            <Users className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
            <span className="text-sm text-gray-500">
              {match.currentTeams}/{match.teamCapacity} 팀 참여 중
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{match.sportType}</span>
          <span className="text-sm font-medium">{match.matchPrice}/인</span>
        </div>
      </CardContent>
      {!compact && (
        <CardFooter className="p-6 pt-0">
          <Button
            asChild
            className="w-full primary-button"
            variant={match.status === "모집완료" ? "secondary" : "default"}
            disabled={match.status === "모집완료" || match.status === "종료"}
          >
            <Link href={`/matches/${match.id}`}>{match.status === "모집중" ? "참가 신청하기" : "상세 보기"}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return format(date, "yyyy년 MM월 dd일 (eee)", { locale: ko })
}

