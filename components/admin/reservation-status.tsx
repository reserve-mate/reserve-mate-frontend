"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarIcon, Search, Filter, Clock, CheckCircle, XCircle } from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { AdminReservationDetail, AdminReservationResponse } from "@/lib/types/reservationType"
import { reservationService } from "@/lib/services/reservationService"
import { FacilityNames } from "@/lib/types/facilityTypes"
import { facilityService } from "@/lib/services/facilityService"
import { timeFormat } from "@/lib/types/commonTypes"
import { displayPaymentStatus } from "@/lib/types/payment"
import { PaymentStatus } from "@/lib/enum/paymentEnum"

// 예약 상태 유형
const reservationStatuses = [
  { value: "PENDING", label: "대기중", color: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700" },
  { value: "CONFIRMED", label: "확정", color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900" },
  { value: "CANCELED", label: "취소됨", color: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-700" },
  { value: "COMPLETED", label: "완료", color: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700" },
]

// 결제 상태 유형
const paymentStatuses = [
  { value: "PENDING", label: "결제 대기", color: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900" },
  { value: "PAID", label: "결제 완료", color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700" },
  { value: "REFUNDED", label: "환불", color: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:text-purple-700" },
]

// 예약 타입 정의
type Reservation = {
  id: string
  userId: string
  userName: string
  facilityId: string
  facilityName: string
  courtId: string
  courtName: string
  reservationDate: string
  startTime: string
  endTime: string
  totalPrice: number
  status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED"
  paymentStatus: "PENDING" | "PAID" | "REFUNDED"
  createdAt: string
}

export default function ReservationStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<AdminReservationResponse | null>(null)

  // 검색 조건
  const [tabValue, setTabValue] = useState<"ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [facilityNames, setFacilityNames] = useState<FacilityNames[]>([]);
  const [selectFacility, setSelectFacility] = useState<string>("all");

  // 페이징
  const [adminReservations, setAdminReservations] = useState<AdminReservationResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isError, setIsError] = useState(false);

  // 예약 상세
  const [reservationDetail, setReservationDetail] = useState<AdminReservationDetail | null>(null);

  const observerRef = useRef<HTMLTableElement | null>(null);
  
  // 예약 현황 api
  const getAdminReservations = async (type: string, page: number) => {
    if(isLoading) return;
    setIsLoading(true);
    const searchParam = {
      searchTerm: searchTerm,
      reserveStatus: (type === "ALL") ? "" : type,
      facility: isNaN(parseInt(selectFacility)) ? 0 : parseInt(selectFacility),
      searchDate: (date) ? format(date, "yyyy-MM-dd") : "",
      pageNum: page
    }

    try{
      const response = await reservationService.getAdminReservations(searchParam);
      setAdminReservations((prev) => {
        const merged = [...prev, ...response.content];
        const unique = [...new Map(merged.map(r => [r.reservationId, r])).values()];
        return unique;
      });
      setPage(response.number);
      setHasMore(!response.last);
    }catch(error: any) {
      console.log(error)
      setIsError(true);
      setAdminReservations([])
    }finally {
      setIsLoading(false);
    }
  }

  // 시설명 조회 api
  const fetchGetFacilities = async () => {
    try {
      const response = await facilityService.getMatchFacilityNames(undefined);
      setFacilityNames(response);
    } catch (error) {
      setFacilityNames([])
    }
  }

  // 가상의 예약 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    fetchGetFacilities(); // 시설명 조회
    getAdminReservations("ALL", 0); // 예약 현황 조회
  }, []);

  // 무한 스크롤
  useEffect(() => {
    if(isLoading || !hasMore || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting) {
          getAdminReservations(tabValue, page + 1); // 예약 현황 조회
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
  }, [page, hasMore, isLoading]);
  
  // 예약 필터 검색
  const searchReservation = () => {
    setPage(0);
    setHasMore(false);
    setIsLoading(false);
    setAdminReservations([]);
    getAdminReservations(tabValue, 0);
  }

  // 예약 필터 초기화
  const resetFilters = () => {
    setSearchTerm("")
    setSelectFacility("all")
    setDate(undefined)
  }

  const handleTab = (type:string) => {
    setTabValue(type as "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED");
    setPage(0);
    setHasMore(false);
    setIsLoading(false);
    setAdminReservations([]);
    getAdminReservations(type, 0);
  }
  
  // 상태 배지 스타일 가져오기
  const getStatusBadgeStyle = (status: string) => {
    return reservationStatuses.find(s => s.value === status)?.color || ""
  }
  
  // 결제 상태 배지 스타일 가져오기
  const getPaymentStatusBadgeStyle = (status: string) => {
    return paymentStatuses.find(s => s.value === status)?.color || ""
  }
  
  // 예약 상태 표시 텍스트
  const getStatusLabel = (status: string) => {
    return reservationStatuses.find(s => s.value === status)?.label || status
  }
  
  // 결제 상태 표시 텍스트
  const getPaymentStatusLabel = (status: string) => {
    return paymentStatuses.find(s => s.value === status)?.label || status
  }
  
  // 예약 세부 정보 보기
  const viewReservationDetails = async (reservationId: number) => {
    try {
      const response = await reservationService.getAdminReservaionDetail(reservationId);
      if(!response) {
        toast({
          title: "조회 실패",
          description: "예약 정보가 존재하지 않습니다.",
          variant: "destructive"
        })
      } 
      setReservationDetail(response);
      setIsDetailsDialogOpen(true);
    } catch (error: any) {
      let errormsg = "조회 중 에러가 발생하였습니다."
      if(error.message) {
        errormsg = error.message;
      }
      toast({
          title: "조회 실패",
          description: error.message,
          variant: "destructive"
        })
    }

  }
  
  // 예약 상태 변경
  const updateReservationStatus = (id: string, status: "CONFIRMED" | "CANCELED" | "COMPLETED") => {
    setIsLoading(true)
    
    // 실제로는 API 호출
    setTimeout(() => {
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === id
            ? { ...reservation, status }
            : reservation
        )
      )
      
      setIsDetailsDialogOpen(false)
      
      toast({
        title: "예약 상태 변경 완료",
        description: `예약이 ${getStatusLabel(status)}(으)로 변경되었습니다.`
      })
      
      setIsLoading(false)
    }, 500)
  }
  
  return (
    <div className="space-y-6"> 
      <Card>
        <CardHeader>
          <CardTitle>예약 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" value={tabValue} onValueChange={(val) => handleTab(val)}>
            <TabsList className="grid w-full grid-cols-5 lg:w-[400px] mb-6 bg-gray-100">
              <TabsTrigger value="ALL" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">전체</TabsTrigger>
              <TabsTrigger value="PENDING" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">대기중</TabsTrigger>
              <TabsTrigger value="CONFIRMED" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">확정</TabsTrigger>
              <TabsTrigger value="COMPLETED" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">완료</TabsTrigger>
              <TabsTrigger value="CANCELED" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">취소</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="고객명, 시설명 검색"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select
                  value={selectFacility}
                  onValueChange={setSelectFacility}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="시설 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 시설</SelectItem>
                    {facilityNames.length > 0 ? facilityNames.map((facility) => (
                      <SelectItem key={facility.facilityId} value={String(facility.facilityId)} className="text-sm sm:text-base">
                        {facility.facilityName}
                      </SelectItem>
                    )) : "아직 등록된 시설이 없습니다."}
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[210px] justify-start text-left font-normal pl-3">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, 'PPP', { locale: ko })
                      ) : (
                        <span>날짜 선택</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button 
                  onClick={searchReservation}
                  className="bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  검색
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                >
                  초기화
                </Button>
              </div>
            </div>
            
            <TabsContent value={tabValue}>
              <ReservationTable 
                reservations={adminReservations}
                getStatusBadgeStyle={getStatusBadgeStyle}
                getPaymentStatusBadgeStyle={getPaymentStatusBadgeStyle}
                getStatusLabel={getStatusLabel}
                getPaymentStatusLabel={getPaymentStatusLabel}
                viewReservationDetails={viewReservationDetails}
              />
            </TabsContent>
          </Tabs>
          {/* 무한스크롤 */}
          <Table ref={observerRef}>
            <TableBody>
              <TableRow>
                {isLoading && <TableCell className="text-center">불러오는 중...</TableCell>}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* 예약 세부정보 다이얼로그 */}
      {(reservationDetail) && (
        <>
          <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>예약 세부 정보</DialogTitle>
                <DialogDescription>
                  예약 ID: {reservationDetail.reservationId}
                </DialogDescription>
              </DialogHeader>
              
              {reservationDetail && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">예약 번호</div>
                      <div className="text-sm">{reservationDetail.reservationNumber}</div>
                    </div>

                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500">예약 상태</div>
                      <Badge className={getStatusBadgeStyle(reservationDetail.reservationStatus)}>
                        {getStatusLabel(reservationDetail.reservationStatus)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500">결제 상태</div>
                      <Badge className={getPaymentStatusBadgeStyle(reservationDetail.paymentStatus)}>
                        {reservationDetail.reservationStatus === "CANCELED" && !reservationDetail.paymentStatus
                          ? "미결제"
                          : displayPaymentStatus(reservationDetail.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">고객 정보</div>
                    <div className="text-sm">{reservationDetail.userName}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">시설 정보</div>
                    <div className="text-sm">{reservationDetail.facilityName}</div>
                    <div className="text-sm">{reservationDetail.courtName}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">예약 정보</div>
                    <div className="text-sm">
                      예약날짜: {format(new Date(reservationDetail.reservationDate), 'PPP', { locale: ko })}
                    </div>
                    <div className="text-sm">
                      예약시간: {timeFormat(reservationDetail.startTime)}-{timeFormat(reservationDetail.endTime)}
                    </div>
                    <div className="text-sm">
                      가격: {reservationDetail.totalPrice.toLocaleString()}원
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">예약 생성일</div>
                    <div className="text-sm">
                      {format(new Date(reservationDetail.createAt), 'PPP p', { locale: ko })}
                    </div>
                  </div>

                {(reservationDetail.reservationStatus === "CANCELED") && 
                  (
                    <>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">취소 사유</div>
                        <div className="text-sm">
                          {reservationDetail.cancelReason}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">취소일</div>
                        <div className="text-sm">
                          {format(new Date(reservationDetail.cancelAt), 'PPP p', { locale: ko })}
                        </div>
                      </div>
                    </>
                  )
                }

                  {(reservationDetail.reservationStatus === "CANCELED" && reservationDetail.paymentStatus === PaymentStatus.CANCELED)
                  && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">취소 가격</div>
                      <div className="text-sm">
                        {reservationDetail.refundAmount.toLocaleString()}원
                      </div>
                    </div>
                  )
                  }
                </div>
              )}
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {reservationDetail.reservationStatus === "PENDING" && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => updateReservationStatus(reservationDetail.reservationId.toString(), "CONFIRMED")}
                      disabled={isLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      예약 확정
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => updateReservationStatus(reservationDetail.reservationId.toString(), "CANCELED")}
                      disabled={isLoading}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      예약 취소
                    </Button>
                  </>
                )}
                
                {reservationDetail.reservationStatus === "CONFIRMED" && (
                  <>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => updateReservationStatus(reservationDetail.reservationId.toString(), "COMPLETED")}
                      disabled={isLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      이용 완료
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => updateReservationStatus(reservationDetail.reservationId.toString(), "CANCELED")}
                      disabled={isLoading}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      예약 취소
                    </Button>
                  </>
                )}
                
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  닫기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

// 예약 테이블 컴포넌트
function ReservationTable({
  reservations,
  getStatusBadgeStyle,
  getPaymentStatusBadgeStyle,
  getStatusLabel,
  getPaymentStatusLabel,
  viewReservationDetails
}: {
  reservations: AdminReservationResponse[]
  getStatusBadgeStyle: (status: string) => string
  getPaymentStatusBadgeStyle: (status: string) => string
  getStatusLabel: (status: string) => string
  getPaymentStatusLabel: (status: string) => string
  viewReservationDetails: (reservationId: number) => void
}) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        조회된 예약이 없습니다.
      </div>
    )
  }
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>예약 ID</TableHead>
            <TableHead>고객명</TableHead>
            <TableHead>시설/코트</TableHead>
            <TableHead>예약일시</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>결제</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.reservationId}>
              <TableCell className="font-medium">#{reservation.reservationId}</TableCell>
              <TableCell>{reservation.userName}</TableCell>
              <TableCell>
                <div>{reservation.facilityName
                  ? reservation.facilityName.length > 9
                    ? reservation.facilityName.slice(0, 9) + "…"
                    : reservation.facilityName
                  : ""}</div>
                <div className="text-xs text-gray-500">{reservation.courtName}</div>
              </TableCell>
              <TableCell>
                <div>{format(new Date(reservation.reservationDate), 'yyyy-MM-dd (EEE)', { locale: ko })}</div>
                <div className="text-xs text-gray-500">
                  {timeFormat(reservation.startTime)} - {timeFormat(reservation.endTime)}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadgeStyle(reservation.reservationStatus)}>
                  {getStatusLabel(reservation.reservationStatus)}
                </Badge>
              </TableCell>
              <TableCell>
                <div>{reservation.totalPrice.toLocaleString()}원</div>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => viewReservationDetails(reservation.reservationId)}
                >
                  상세
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 