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
import { MatchStatus, PlayerStatus } from "@/lib/enum/matchEnum"
import { scrollToWhenReady } from "@/hooks/use-scroll"
import { useRouter } from "next/navigation"

const STORAGE_KEY = 'match-history-state'

export default function MatchHistoryPage() {
  const router = useRouter();

  const [matchHistory, setMatchHistory] = useState<MatchHistoryResponse[]>([]);

  // 무한 스크롤
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [tabValue, setTabValue] = useState<"all" | "upcoming" | "completed" | "canceled">("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const observeRef = useRef<HTMLDivElement | null>(null);

  // 세션 정보가 있으면 복원
  const savedScrollRef = useRef<number | null>(null);
  const restoredRef = useRef(false);

  // 세션에서 복원
  useEffect(() => {
    if(restoredRef.current) return;

    const saved = sessionStorage.getItem(STORAGE_KEY);
    if(saved) {
      const {matches, page, hasMore, tabValue, scrollY} = JSON.parse(saved);

      setTabValue(tabValue);
      setMatchHistory(matches as MatchHistoryResponse[]);
      setPage(page);
      setHasMore(hasMore)

      savedScrollRef.current = scrollY;
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    } else {
      asyncMatchHistory(tabValue, 0)
    }

    restoredRef.current = true;
  }, [tabValue])

  // 스크롤 위치 시키기
  useEffect(() => {
    if(savedScrollRef.current) {
      scrollToWhenReady(savedScrollRef.current);
      savedScrollRef.current = null;
    }
  }, [tabValue, matchHistory.length])
  
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
        const unique = [...new Map(merged.map(matchPlayer => [matchPlayer.playerId, matchPlayer])).values()];
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

  // 무한 스크롤
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
    sessionStorage.removeItem(STORAGE_KEY);
    restoredRef.current = false;
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

  // 스크롤 세션 저장
  const setMatchSession = () => {
    const payload = JSON.stringify({
      matches: matchHistory
      , page: page
      , hasMore: hasMore
      , tabValue: tabValue
      , scrollY: window.scrollY
    });

    sessionStorage.setItem(STORAGE_KEY, payload);
  }

  // 매치 상세 화면 이동
  const goMatchDetail = (matchId: number) => {
    setMatchSession();
    router.push(`/matches/${matchId}`);
  }

  // 매치 리뷰 작성 이동
  const goRegistReview = (matchId: number) => {
    setMatchSession();
    router.push(`/facilities/${matchId}/review?reviewType=MATCH`);
  }

  // 매치 리뷰 재작성 이동
  const goModifyReview = (facilityId: number, reviewId: number) => {
    setMatchSession();
    router.push(`/facilities/${facilityId}/review/edit?reviewId=${reviewId}&reviewType=MATCH`);
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
                                  ${match.playerStatus === PlayerStatus.READY ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-200 hover:text-amber-900 hover:border-amber-300 transition-colors" : ""}
                                  ${match.playerStatus === PlayerStatus.ONGOING ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-900 hover:border-blue-300 transition-colors" : ""}
                                  ${match.playerStatus === PlayerStatus.COMPLETED ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900 hover:border-green-300 transition-colors" : ""}
                                  ${match.playerStatus === PlayerStatus.CANCEL ? "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-900 hover:border-gray-300 transition-colors" : ""}
                                  ${match.playerStatus === PlayerStatus.KICKED ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-900 hover:border-red-300 transition-colors" : ""}
                                  ${match.playerStatus === PlayerStatus.MATCH_CANCELLED ? "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-900 hover:border-gray-300 transition-colors" : ""}
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
                            
                            {(match.playerStatus !== PlayerStatus.CANCEL && match.playerStatus !== PlayerStatus.MATCH_CANCELLED) && 
                              (
                                <>
                                  <div className="flex items-center text-gray-600">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span className="text-sm">참가자: {match.playerCnt}/{match.teamCapacity}명</span>
                                  </div>
                                </>
                              )
                            }
                          </div>

                          <div className="flex flex-col gap-2 md:min-w-[120px]">
                            <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300">
                              <button onClick={() => goMatchDetail(match.matchId)}>매치 상세</button>
                            </Button>
                            
                            {(match.playerStatus === PlayerStatus.COMPLETED && match.matchStatus === MatchStatus.END) && !match.reviewId && (
                              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <button onClick={() => goRegistReview(match.matchId)}>리뷰 작성</button>
                              </Button>
                            )}

                            {(match.playerStatus === PlayerStatus.COMPLETED && match.matchStatus === MatchStatus.END) && match.reviewId && (
                              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <button onClick={() => goModifyReview(match.facilityId, match.reviewId)}>리뷰 재작성</button>
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