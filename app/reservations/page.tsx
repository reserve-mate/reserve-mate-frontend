"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, LogIn } from "lucide-react"
import { displayReservationStatus, Reservations } from "@/lib/types/reservationType"
import { reservationService } from "@/lib/services/reservationService"
import { displaySportName } from "@/lib/types/matchTypes"
import { ReservationStatus } from "@/lib/enum/reservationEnum"
import { useRouter } from "next/navigation"
import { scrollToWhenReady } from "@/hooks/use-scroll"

const STORAGE_KEY = 'reservations-list-state'

export default function ReservationsPage() {
  const router = useRouter();
  const [reservationDatas, setReservationDatas] = useState<Reservations[]>([]);   // 예약 목록 데이터
  
  // 무한 스크롤
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [tabValue, setTabValue] = useState<"upcoming" | "past">("upcoming");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const observeRef = useRef<HTMLDivElement | null>(null);

  const savedScrollRef = useRef<number | null>(null);
  const restoredRef = useRef(false);

  // 세션에 정보 있으면 복원
  useEffect(() => {
    if(restoredRef.current) return;

    const saved = sessionStorage.getItem(STORAGE_KEY);
    if(saved) {
      const {reservations, page, hasMore, tabValue, scrollY} = JSON.parse(saved);

      setTabValue(tabValue);
      setReservationDatas(reservations as Reservations[]);
      setPage(page);
      setHasMore(hasMore);

      savedScrollRef.current = scrollY;
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    }else {
      asyncReservations(tabValue, 0) // 예약 목록 조회
    }

    restoredRef.current = true;
  }, [tabValue]);

  // 스크롤 위치 시키기
  useEffect(() => {
    if(savedScrollRef.current) {
      scrollToWhenReady(savedScrollRef.current);
      savedScrollRef.current = null;
    }
  }, [tabValue, reservationDatas.length])
  
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])

  // 예약 목록 조회
  const asyncReservations = async (type: string, pageNum: number) => {
    if(loading) return;
    setLoading(true);

    try{
      const response = await reservationService.getReservations({
        type: type,
        pageNum: pageNum
      });
      setReservationDatas((prev) => {
        const merged = [...(prev || []), ...response.content];
        const unique = [...new Map(merged.map(r => [r.reservationId, r])).values()]
        return unique;
      });
      setPage(response.number);
      setHasMore(!response.last);
    }catch(error : any) {
      setIsError(true);
      //setReservationDatas([])
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
          asyncReservations(tabValue, page + 1);
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

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString())
  }, [isLoggedIn])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

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

  const handleTab = (type:string) => {
    sessionStorage.removeItem(STORAGE_KEY);
    restoredRef.current = false;
    setReservationDatas([]);
    setPage(0);
    setHasMore(false);
    setLoading(false);
    setTabValue(type as "upcoming" | "past")
  }

  // 예약 취소 페이지 이동
  const handleCancel = (reservationId: number, status: ReservationStatus) => {
    setSessionStorage();
    router.push(`/reservations/cancel/${reservationId}?status=${status}`);
  }

  // 시간 포맷
  const timeFormat = (time: string): string => {
    const hour = parseInt(time.split(":")[0], 10);
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  // 세션 데이터 세팅
  const setSessionStorage = () => {
    const payload = JSON.stringify({
      reservations: reservationDatas
      , page: page
      , hasMore: hasMore
      , tabValue: tabValue
      , scrollY: window.scrollY
    });

    sessionStorage.setItem(STORAGE_KEY, payload);
  }

  // 상세 페이지 이동
  const goReservationDetail = (reservationId: number) => {
    setSessionStorage()
    router.push(`/reservations/${reservationId}`);
  }

  // 리뷰 작성 페이지 이동
  const goRegistReview = (reservationId: number) => {
    setSessionStorage();
    router.push(`/facilities/${reservationId}/review?reviewType=RESERVATION`);
  }

  // 리뷰 재작성 페이지 이동
  const getModifyReview = (facilityId: number, reviewId: number) => {
    setSessionStorage();
    router.push(`/facilities/${facilityId}/review/edit?reviewId=${reviewId}&reviewType=RESERVATION`);
  }

  if(!reservationDatas) {
    return;
  }

  if (!isLoggedIn) {
    return (
      <div className="container py-8">
        <Card className="styled-card mb-8">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <LogIn className="h-16 w-16 text-indigo-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-6">예약 내역을 확인하려면 로그인이 필요합니다.</p>
            
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
      <h1 className="text-3xl font-bold mb-8">내 예약</h1>

      <Card className="styled-card mb-8">
        <CardContent className="p-6">
          <Tabs value={tabValue} className="w-full" onValueChange={(val) => handleTab(val)}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">예정된 예약</TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">지난 예약</TabsTrigger>
            </TabsList>

            <TabsContent value={tabValue}>
              {reservationDatas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">예정된 예약이 없습니다.</p>
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Link href="/facilities">시설 찾아보기</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservationDatas.map((reservation) => (
                    <Card key={reservation.reservationId} className="border border-indigo-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{reservation.facilityName}</h3>
                              <Badge
                                className={`
                                  ${reservation.reservationStatus === ReservationStatus.PENDING ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300" : ""}
                                  ${reservation.reservationStatus === ReservationStatus.CONFIRMED ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-700 hover:border-green-300" : ""}
                                  ${reservation.reservationStatus === ReservationStatus.COMPLETED ? "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-300" : ""}
                                  ${reservation.reservationStatus === ReservationStatus.CANCELED ? "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300" : ""}
                                  `}
                              >
                                {displayReservationStatus(reservation.reservationStatus)}
                              </Badge>
                            </div>

                            <div className="text-sm text-gray-500">
                              {reservation.courtName} | {displaySportName(reservation.sportType)}
                            </div>

                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">{reservation.address}</span>
                            </div>

                            <div className="flex items-start">
                              <Calendar className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">{formatDate(reservation.reservationDate)}</span>
                            </div>

                            <div className="flex items-start">
                              <Clock className="h-4 w-4 text-indigo-400 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-500">{`${timeFormat(reservation.startTime)}-${timeFormat(reservation.endTime)}`}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:min-w-[120px]">
                            <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300">
                              <button onClick={() => goReservationDetail(reservation.reservationId)}>상세 보기</button>
                            </Button>

                            {((reservation.reservationStatus === ReservationStatus.PENDING) || (reservation.reservationStatus === ReservationStatus.CONFIRMED)) && (
                              <Button 
                                variant="destructive" 
                                className="bg-red-600 hover:bg-red-700" 
                                onClick={() => handleCancel(reservation.reservationId, reservation.reservationStatus)}
                              >
                                예약 취소
                              </Button>
                            )}

                            {(reservation.reservationStatus === ReservationStatus.COMPLETED && !reservation.reviewId) && (
                              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <button onClick={() => goRegistReview(reservation.reservationId)}>리뷰 작성</button>
                              </Button>
                            )}

                            {(reservation.reservationStatus === ReservationStatus.COMPLETED && reservation.reviewId) && (
                              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <button onClick={() => getModifyReview(reservation.facilityId, reservation.reviewId)}>리뷰 재작성</button>
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

