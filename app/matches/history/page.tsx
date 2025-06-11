"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, LogIn, Trophy } from "lucide-react"
import { matchService } from "@/lib/services/matchService"
import { MatchHistory, MatchHistorySearch, displaySportName, displayPlayerStatus, displayEjectReason } from "@/lib/types/matchTypes"
import { PlayerStatus, SportType, RemovalReason } from "@/lib/enum/matchEnum"
import { useRouter } from "next/navigation"
import { Slice } from "@/lib/types/commonTypes"

// 샘플 데이터
const sampleMatchHistory: MatchHistory[] = [
  {
    playerId: 1,
    matchId: 101,
    matchName: "강남 테니스 클럽 오후 매치",
    facilityName: "강남 테니스 센터",
    address: "서울시 강남구 테헤란로 123",
    sportType: SportType.TENNIS,
    matchDate: "2024-01-20",
    matchTime: 14,
    matchEndTime: 16,
    matchPrice: 25000,
    playerStatus: PlayerStatus.COMPLETED,
    joinDate: "2024-01-15T10:30:00",
    orderId: "ORDER_001_20240115",
    teamCapacity: 4,
    playerCnt: 4
  },
  {
    playerId: 2,
    matchId: 102,
    matchName: "역삼 풋살 저녁 매치",
    facilityName: "역삼 풋살장",
    address: "서울시 강남구 역삼동 456",
    sportType: SportType.FUTSAL,
    matchDate: "2024-01-25",
    matchTime: 19,
    matchEndTime: 21,
    matchPrice: 15000,
    playerStatus: PlayerStatus.READY,
    joinDate: "2024-01-20T15:45:00",
    orderId: "ORDER_002_20240120",
    teamCapacity: 10,
    playerCnt: 8
  },
  {
    playerId: 3,
    matchId: 103,
    matchName: "종로 농구 주말 매치",
    facilityName: "종로 농구코트",
    address: "서울시 종로구 종로 789",
    sportType: SportType.BASKETBALL,
    matchDate: "2024-01-27",
    matchTime: 10,
    matchEndTime: 12,
    matchPrice: 20000,
    playerStatus: PlayerStatus.ONGOING,
    joinDate: "2024-01-22T09:15:00",
    orderId: "ORDER_003_20240122",
    teamCapacity: 10,
    playerCnt: 10
  },
  {
    playerId: 4,
    matchId: 104,
    matchName: "서초 배드민턴 모닝 매치",
    facilityName: "서초 배드민턴장",
    address: "서울시 서초구 서초대로 321",
    sportType: SportType.BADMINTON,
    matchDate: "2024-01-10",
    matchTime: 8,
    matchEndTime: 10,
    matchPrice: 18000,
    playerStatus: PlayerStatus.CANCEL,
    joinDate: "2024-01-05T14:20:00",
    orderId: "ORDER_004_20240105",
    teamCapacity: 4,
    playerCnt: 2
  },
  {
    playerId: 5,
    matchId: 105,
    matchName: "잠실 축구 오후 매치",
    facilityName: "잠실 종합운동장",
    address: "서울시 송파구 올림픽로 25",
    sportType: SportType.SOCCER,
    matchDate: "2024-01-12",
    matchTime: 15,
    matchEndTime: 17,
    matchPrice: 30000,
    playerStatus: PlayerStatus.KICKED,
    ejectReason: RemovalReason.LATE,
    joinDate: "2024-01-08T11:30:00",
    orderId: "ORDER_005_20240108",
    teamCapacity: 22,
    playerCnt: 20
  },
  {
    playerId: 6,
    matchId: 106,
    matchName: "마포 야구 주말 매치",
    facilityName: "마포 야구장",
    address: "서울시 마포구 월드컵로 240",
    sportType: SportType.BASEBALL,
    matchDate: "2024-01-08",
    matchTime: 13,
    matchEndTime: 16,
    matchPrice: 35000,
    playerStatus: PlayerStatus.MATCH_CANCELLED,
    joinDate: "2024-01-03T16:45:00",
    orderId: "ORDER_006_20240103",
    teamCapacity: 18,
    playerCnt: 12
  },
  {
    playerId: 7,
    matchId: 107,
    matchName: "홍대 풋살 나이트 매치",
    facilityName: "홍대 실내 풋살장",
    address: "서울시 마포구 홍익로 94",
    sportType: SportType.FUTSAL,
    matchDate: "2024-02-01",
    matchTime: 21,
    matchEndTime: 23,
    matchPrice: 18000,
    playerStatus: PlayerStatus.READY,
    joinDate: "2024-01-28T20:15:00",
    orderId: "ORDER_007_20240128",
    teamCapacity: 12,
    playerCnt: 9
  },
  {
    playerId: 8,
    matchId: 108,
    matchName: "영등포 테니스 오전 매치",
    facilityName: "영등포 테니스클럽",
    address: "서울시 영등포구 여의도동 15",
    sportType: SportType.TENNIS,
    matchDate: "2024-01-18",
    matchTime: 9,
    matchEndTime: 11,
    matchPrice: 22000,
    playerStatus: PlayerStatus.COMPLETED,
    joinDate: "2024-01-14T13:20:00",
    orderId: "ORDER_008_20240114",
    teamCapacity: 4,
    playerCnt: 4
  }
]

export default function MatchHistoryPage() {
  const router = useRouter();
  const [matchHistoryData, setMatchHistoryData] = useState<MatchHistory[]>([]);
  
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

  // 샘플 데이터를 필터링하는 함수
  const getFilteredSampleData = (status: string): MatchHistory[] => {
    const today = new Date();
    
    return sampleMatchHistory.filter(match => {
      const matchDate = new Date(match.matchDate);
      
      switch (status) {
        case "upcoming":
          return matchDate > today && (match.playerStatus === PlayerStatus.READY || match.playerStatus === PlayerStatus.ONGOING);
        case "completed":
          return match.playerStatus === PlayerStatus.COMPLETED;
        case "canceled":
          return match.playerStatus === PlayerStatus.CANCEL || 
                 match.playerStatus === PlayerStatus.KICKED || 
                 match.playerStatus === PlayerStatus.MATCH_CANCELLED;
        default:
          return true;
      }
    });
  }

  // 매치 이용내역 조회 (샘플 데이터 사용)
  const asyncMatchHistory = async (status: string, pageNum: number) => {
    if(loading) return;
    setLoading(true);

    try{
      // 실제 API 호출 대신 샘플 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      
      const filteredData = getFilteredSampleData(status);
      
      if (pageNum === 0) {
        setMatchHistoryData(filteredData);
      } else {
        setMatchHistoryData((prev) => [...prev, ...filteredData]);
      }
      
      setPage(pageNum);
      setHasMore(false); // 샘플 데이터이므로 추가 페이지 없음
    }catch(error : any) {
      setIsError(true);
      setMatchHistoryData([])
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
    setMatchHistoryData([]);
    setPage(0);
    setHasMore(false);
    setLoading(false);
    setTabValue(status as "all" | "upcoming" | "completed" | "canceled")
  }

  // 시간 포맷
  const timeFormat = (time: number): string => {
    return `${time.toString().padStart(2, '0')}:00`;
  }

  // 로그인 테스트 처리
  const handleLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
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
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleLogin}
              >
                로그인 테스트
              </Button>
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
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          샘플 데이터
        </Badge>
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
              ) : matchHistoryData.length === 0 ? (
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
                  {matchHistoryData.map((match) => (
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
                              <span className="text-sm">{timeFormat(match.matchTime)} - {timeFormat(match.matchEndTime)}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              <span className="text-sm">참가비: {match.matchPrice.toLocaleString()}원</span>
                              <span className="text-sm ml-4">참가자: {match.playerCnt}/{match.teamCapacity}명</span>
                            </div>

                            <div className="text-xs text-gray-500">
                              참가일: {new Date(match.joinDate).toLocaleDateString('ko-KR')}
                              {match.orderId && (
                                <span className="ml-4">주문번호: {match.orderId}</span>
                              )}
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

                            {(match.playerStatus === PlayerStatus.READY || match.playerStatus === PlayerStatus.ONGOING) && (
                              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                매치 취소
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