"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, CalendarIcon, Clock, Users, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, subDays, isSameDay, parseISO, isTomorrow, startOfDay } from "date-fns"
import { ko } from "date-fns/locale"
import { matchService } from "@/lib/services/matchService" 
import { displayMatchStatus, displaySportName, MatchList, MatchSearch, MathDateCount } from "@/lib/types/matchTypes"
import { MatchStatus, SportType } from "@/lib/enum/matchEnum"

// 시간별로 그룹화된 매치 타입
type GroupedMatches = {
  [timeSlot: string]: MatchList[]
}

export default function MatchesPage() {
  // 검색 세팅
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sportType, setSportType] = useState<SportType | null>(null);
  const [matchStatus, setMatchStatus] = useState<MatchStatus | null>(null);

  // 매치 조회 및 검색 필터링
  const [matches, setMatches] = useState<MatchList[]>([])
  const [filteredMatches, setFilteredMatches] = useState<MatchList[]>([])

  // 무한 스크롤 상태 정의
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // loading 없는 경우 중복 요청, ui깨짐, 데이터 덮어쓰기 에러 발생
  const [isError, setIsError] = useState(false);

  // 날짜별 매치 개수 조회
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dateRange, setDateRange] = useState<Date[]>([])
  const [startDate, setStartDate] = useState<Date>(startOfDay(new Date()))
  const [matchDate, setMatchDate] = useState<MathDateCount[]>([]);

  // 날짜 스크롤
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 매치 카드 스크롤
  const observeRef = useRef<HTMLDivElement | null>(null);

  const ref = useRef(false);
  
  // 로그인 상태를 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 사용자 매치 목록 조회
  const getMatchDatesScroll = (date: Date, pageNumber: number) => {
    const listParams: MatchSearch = {
      matchDate: format(date, 'yyyy-MM-dd', { locale: ko }), // YYYY-MM-DD
      searchValue: searchTerm,
      matchStatus: matchStatus ?? undefined,
      sportType: sportType ?? undefined,
      pageNumber: pageNumber
    };

    const fetchMatches = async () => {
      if( loading ) return; // 로딩 중이면 return

      setLoading(true); // 데이터 요청 시작

      try{
        const matches = await matchService.getMatches(listParams);
        setMatches((prev) => [...prev, ...matches.content]); // 최신 상태를 기반으로 업데이트, 자바스크립트에서 기존 배열을 복사해서 새로운 배열을 만드는 spread 문법
        setPage(matches.number);
        setHasMore(!matches.last);  // 마지막 페이지가 아니면 true
      }catch(err){
        console.log(err);
        setIsError(true);
        window.location.reload();
      }
      finally{
        setLoading(false); // 
      }
    }

    fetchMatches();
  }

  // 날짜별 매치 개수 조회
  const getMatchDateCnt = () => {
    const dateParams: MatchSearch = {
      matchDate: format(startDate, 'yyyy-MM-dd', { locale: ko }), // YYYY-MM-DD
      searchValue: searchTerm,
      sportType: sportType ?? undefined,
      matchStatus: matchStatus ?? undefined
    };
    
    const fetchMatchDates = async () => {
      try {
        const matchDates: MathDateCount[] = await matchService.getMatchDates(dateParams);
        setMatchDate(matchDates);
      } catch (error) {
        console.log(`매치 날짜 조회 실패: ${error}`)
      }
    }
    fetchMatchDates();
  }

  useEffect(() => {
    if( !hasMore || loading || isError ) return;  // 더이상 데이터가 없거나 데이터를 불러오는 중인 경우 중단

    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting){
          getMatchDatesScroll(selectedDate, page + 1);  // 무한 스크롤 조회
        }
      }, { threshold: 1 }
    );

    if(observeRef.current){
      observer.observe(observeRef.current);
    }

    return () => {
      if(observeRef.current){
        observer.unobserve(observeRef.current);
      }
    }

  }, [ page, hasMore, loading ]);

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

    getMatchDateCnt();

  }, [startDate])

  // 초기 선택된 날짜 설정
  useEffect(() => {
    if(ref.current) return;
    ref.current = true;
    // 처음 로드될 때만 오늘 날짜로 설정
    const today = startOfDay(new Date())
    setSelectedDate(today)
    getMatchDatesScroll(today, 0);
    
    // 이미 날짜가 필터링되어 있다면 다시 필터링
    if ( matches && matches?.length > 0) {
      let filtered = [...matches]
      filtered = filtered.filter((match) => isSameDay(parseISO(match.matchDate), today))
      setFilteredMatches(filtered)
    }
  }, [])

  // 지난 날짜의 매치 비활성화 처리
  useEffect(() => {
    const today = startOfDay(new Date())
    
    // 매치 데이터를 복사하여 날짜가 지난 매치의 상태를 '종료'로 변경
    const updatedMatches = matches.map(match => {
      const matchDate = parseISO(match.matchDate)
      if (matchDate < today) {
        return { ...match, status: "END" as const }
      }
      return match
    })
    
  }, [])

  // 검색 및 필터링 처리
  useEffect(() => {
    let filtered = [...matches]

    setFilteredMatches(filtered)
  }, [matches, selectedDate])

  const applyFilter = () => {
    let filtered = [...matches];

    // 검색어 필터링
    if(searchTerm){
      filtered = filtered.filter((match) => match.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) 
      || match.fullAddress.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if(sportType) {
      filtered = filtered.filter((match) => match.sportType === sportType);
    }

    if(matchStatus) {
      filtered = filtered.filter((match) => match.matchStatus === matchStatus);
    }

    setMatches([]);
    setPage(0);
    setHasMore(true);
    getMatchDateCnt();
    getMatchDatesScroll(selectedDate, 0);
  }

  // 날짜별 매치 그룹화 (날짜 뱃지용)
  const matchesByDate = dateRange.map((date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
    const dateMatch = matchDate.find((match) => {
      return isSameDay(parseISO(match.matchDate), dateObj);
    });

    return {
      date: dateObj,
      count: dateMatch?.matchCnt ?? 0, // matchCnt가 없으면 0으로 처리
    };
  });

  // 시간별로 매치 그룹화
  const groupMatchesByTime = (matches: MatchList[]): GroupedMatches => {
    const grouped: GroupedMatches = {}
    
    matches.forEach(match => {
      // 시간만 추출 (18:00 - 20:00 → 18:00)
      const paddedHour = String(match.matchTime).padStart(2, '0') + ":00";
      const timeSlot = paddedHour.split(' ')[0];
      
      if (!grouped[timeSlot]) {
        grouped[timeSlot] = []
      }
      
      grouped[timeSlot].push(match)
    })
    
    return grouped
  }
  
  // 시간순으로 정렬된 그룹화된 매치
  const sortedGroupedMatches = (): [string, MatchList[]][] => {
    const grouped = groupMatchesByTime(filteredMatches);
    
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

  // 날짜 탭 클릭 처리
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)

    setMatches([]);
    setPage(0);
    setHasMore(true);
    getMatchDatesScroll(date, 0);

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

    setMatches([]);
    setHasMore(true);
    setPage(0);
    getMatchDatesScroll(today, 0);

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Input
                placeholder="시설명 또는 위치 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <Select value={sportType ?? 'null'} onValueChange={(value) => setSportType(value === 'null' ? null : value as SportType)}>
              <SelectTrigger>
                <SelectValue placeholder="스포츠 종류" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'null'}>전체 종목</SelectItem>
                <SelectItem value={SportType.TENNIS}>테니스</SelectItem>
                <SelectItem value={SportType.SOCCER}>축구</SelectItem>
                <SelectItem value={SportType.FUTSAL}>풋살</SelectItem>
                <SelectItem value={SportType.BASEBALL}>농구</SelectItem>
                <SelectItem value={SportType.BADMINTON}>배드민턴</SelectItem>
              </SelectContent>
            </Select>

            <Select value={matchStatus ?? 'null'} onValueChange={(value) => setMatchStatus(value === 'null' ? null : (value as MatchStatus))}>
              <SelectTrigger>
                <SelectValue placeholder="매치 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'null'}>전체 상태</SelectItem>
                <SelectItem value={MatchStatus.APPLICABLE}>모집중</SelectItem>
                <SelectItem value={MatchStatus.CLOSE_TO_DEADLINE}>마감임박</SelectItem>
                <SelectItem value={MatchStatus.FINISH}>마감</SelectItem>
                <SelectItem value={MatchStatus.END}>종료</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={applyFilter} className="primary-button">
              <Filter className="mr-2 h-4 w-4" /> 필터 적용
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 날짜별 매치 목록 */}
      <div className="mt-4">
        {( filteredMatches && filteredMatches?.length) > 0 ? (
          <div className="space-y-8">
            {sortedGroupedMatches().map(([timeSlot, matches]) => (
              <div key={timeSlot} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-20 font-bold text-lg">{timeSlot}</div>
                  <div className="h-px flex-grow bg-gray-200"></div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {matches.map((match) => (
                    <MatchCard key={match.matchId} match={match} />
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
         {/* 무한 스크롤 트리거 지점 */}
        <div ref={observeRef} className="text-center">
        {loading && <p className="text-muted-foreground">불러오는 중...</p>}
        </div>
    </div>
  )
}

// 매치 카드 컴포넌트
function MatchCard({ match, compact = false }: { match: MatchList; compact?: boolean }) {
  const isEnded = match.matchStatus === "END"
  
  return (
    <Card className={`styled-card overflow-hidden h-full ${isEnded ? 'match-ended' : ''}`}>
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`${compact ? "text-base" : "text-lg"} font-semibold ${isEnded ? 'text-gray-500' : ''}`}>{match.facilityName}</h3>
          <Badge
            className={`
              ${match.matchStatus === "APPLICABLE" ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900 hover:border-green-300 transition-colors" : ""}
              ${match.matchStatus === "FINISH" ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-900 hover:border-red-300 transition-colors" : ""}
              ${match.matchStatus === "CLOSE_TO_DEADLINE" ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-900 hover:border-blue-300 transition-colors" : ""}
              ${match.matchStatus === "END" ? "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900 hover:border-gray-300 transition-colors" : ""}
              ${match.matchStatus === "ONGOING" ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 hover:text-orange-900 hover:border-orange-300 transition-colors" : ""}
              ${match.matchStatus === "CANCELLED" ? "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 hover:text-purple-900 hover:border-purple-300 transition-colors" : ""}
            `} // CLOSE_TO_DEADLINE -> 모집 마감
          >
            {displayMatchStatus(match.matchStatus)}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <MapPin className={`h-4 w-4 ${isEnded ? 'text-gray-400' : 'text-indigo-500'} mr-2 mt-0.5`} />
            <span className="text-sm text-gray-500">{match.fullAddress}</span>
          </div>
          <div className="flex items-start">
            <CalendarIcon className={`h-4 w-4 ${isEnded ? 'text-gray-400' : 'text-indigo-500'} mr-2 mt-0.5`} />
            <span className="text-sm text-gray-500">{formatDate(match.matchDate)}</span>
          </div>
          <div className="flex items-start">
            <Clock className={`h-4 w-4 ${isEnded ? 'text-gray-400' : 'text-indigo-500'} mr-2 mt-0.5`} />
            <span className="text-sm text-gray-500">{match.matchTime + ":00 - " + match.matchEndTime + ":00"}</span>
          </div>
          <div className="flex items-start">
            <Users className={`h-4 w-4 ${isEnded ? 'text-gray-400' : 'text-indigo-500'} mr-2 mt-0.5`} />
            <span className="text-sm text-gray-500">
              {match.playerCnt}/{match.teamCapacity} 팀 참여 중
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{displaySportName(match.sportType)}</span>
          <span className="text-sm font-medium">{match.matchPrice.toLocaleString()}/인</span>
        </div>
      </CardContent>
      {!compact && (
        <CardFooter className="p-6 pt-0">
          <Button
            asChild
            className="w-full primary-button"
            variant={match.matchStatus === "FINISH" ? "secondary" : "default"}
            disabled={match.matchStatus === "FINISH" || match.matchStatus === "END" || match.matchStatus === "ONGOING"}
          >
            <Link href={`/matches/${match.matchId}`}>{match.matchStatus === "APPLICABLE" || match.matchStatus === "CLOSE_TO_DEADLINE" ? "참가 신청하기" : "상세 보기"}</Link>
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

