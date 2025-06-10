"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, LogIn, Trophy } from "lucide-react"
import { matchService } from "@/lib/services/matchService"
import { displaySportName, displayPlayerStatus, displayEjectReason, MatchHistoryResponse } from "@/lib/types/matchTypes"
import { PlayerStatus } from "@/lib/enum/matchEnum"

export default function MatchHistoryPage() {
  const [matchHistory, setMatchHistory] = useState<MatchHistoryResponse[]>([]);

  // 무한 스크롤
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [tabValue, setTabValue] = useState<"all" | "upcoming" | "completed" | "canceled">("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const observeRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])

  // 매치 이용내역 조회 (샘플 데이터 사용)
  const asyncMatchHistory = async (status: string, pageNum: number) => {
    if(loading) return;
    setLoading(true);

    try{

      const response = await matchService.getMatchHistory({
        matchStatus: status,
        pageNum: pageNum
      });
      
      setMatchHistory((prev) => { // id 중복 방지
        const merged = [...prev, ...response.content];
        const unique = [...new Map(merged.map(match => [match.matchId, match])).values()];
        return unique;
      })
      setPage(pageNum);
      setHasMore(!response.last); // 샘플 데이터이므로 추가 페이지 없음
    }catch(error : any) {
      setIsError(true);
      setMatchHistory([])
    }finally {
      setLoading(false);
    }
  }

  // 초기 조회
  useEffect(() => {
    if (isLoggedIn) {
      asyncMatchHistory(tabValue, 0) // 매치 이용내역 조회
    }
  }, [tabValue, isLoggedIn])
  
  // 무한 스크롤 (샘플 데이터에서는 비활성화)
  useEffect(() => {
    if(!hasMore || loading || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting) {
          asyncMatchHistory(tabValue, page + 1);
        }
      }, {threshold: 1}
    );

    if(observeRef.current) {
      observer.observe(observeRef.current);
    }

    return () => {
      if(observeRef.current) {
        observer.unobserve(observeRef.current);
      }
    }
  }, [page, hasMore, loading])

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date)
  }

  const handleTab = (status: string) => {
    setMatchHistory([]);
    setPage(0);
    setHasMore(false);
    setLoading(false);
    setTabValue(status as "all" | "upcoming" | "completed" | "canceled");
    asyncMatchHistory(status, 0)
  }

  // 시간 포맷
  const timeFormat = (time: number): string => {
    return `${time.toString().padStart(2, '0')}:00`;
  }

  if (!isLoggedIn) {
    return (
      <div className="container py-8">
        <Card className="styled-card mb-8">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <LogIn className="h-16 w-16 text-indigo-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-6">매치 이용내역을 확인하려면 로그인이 필요합니다.</p>
            
            <div className="flex gap-3">
              <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300">
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">매치 이용내역</h1>
      </div>

      <Card className="styled-card mb-8">
        <CardContent className="p-6">
          <Tabs value={tabValue} className="w-full" onValueChange={(val) => handleTab(val)}>
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">전체</TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">예정</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">완료</TabsTrigger>
              <TabsTrigger value="canceled" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">취소</TabsTrigger>
            </TabsList>

            <TabsContent value={tabValue}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">매치 내역을 불러오는 중...</p>
                </div>
              ) : matchHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {tabValue === "all" && "참여한 매치가 없습니다."}
                    {tabValue === "upcoming" && "예정된 매치가 없습니다."}
                    {tabValue === "completed" && "완료된 매치가 없습니다."}
                    {tabValue === "canceled" && "취소된 매치가 없습니다."}
                  </p>
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Link href="/matches">매치 찾아보기</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchHistory.map((match) => (
                    <Card key={`${match.matchId}-${match.playerId}`} className="border border-indigo-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold">{match.matchName}</h3>
                              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                {displaySportName(match.sportType)}
                              </Badge>
                              <Badge
                                className={`
                                  ${match.playerStatus === PlayerStatus.READY ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                                  ${match.playerStatus === PlayerStatus.ONGOING ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                                  ${match.playerStatus === PlayerStatus.COMPLETED ? "bg-green-100 text-green-800 border-green-200" : ""}
                                  ${match.playerStatus === PlayerStatus.CANCEL ? "bg-gray-100 text-gray-600 border-gray-200" : ""}
                                  ${match.playerStatus === PlayerStatus.KICKED ? "bg-red-100 text-red-800 border-red-200" : ""}
                                  ${match.playerStatus === PlayerStatus.MATCH_CANCELLED ? "bg-gray-100 text-gray-600 border-gray-200" : ""}
                                `}
                              >
                                {displayPlayerStatus(match.playerStatus)}
                              </Badge>
                              {match.ejectReason && (
                                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                                  {displayEjectReason(match.ejectReason)}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{match.facilityName}</span>
                              <span className="text-xs text-gray-400 ml-2">({match.address})</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="text-sm">{formatDate(match.matchDate)}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm">{timeFormat(match.matchTime)} - {timeFormat(match.endTime)}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              <span className="text-sm">참가비: {match.matchPrice.toLocaleString()}원</span>
                              <span className="text-sm ml-4">참가자: {match.playerCnt}/{match.teamCapacity}명</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:min-w-[120px]">
                            <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300">
                              <Link href={`/matches/${match.matchId}`}>매치 상세</Link>
                            </Button>
                            
                            {match.playerStatus === PlayerStatus.COMPLETED && (
                              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Link href={`/matches/${match.matchId}/review`}>리뷰 작성</Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* 무한 스크롤 트리거 지점 */}
                  <div ref={observeRef} className="text-center">
                    {loading && <p className="text-muted-foreground">불러오는 중...</p>}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 