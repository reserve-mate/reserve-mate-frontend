"use client"

import { useState, useEffect } from "react"
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

// 예약 상태 유형
const reservationStatuses = [
  { value: "PENDING", label: "대기중", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { value: "CONFIRMED", label: "확정", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "CANCELED", label: "취소됨", color: "bg-red-50 text-red-600 border-red-200" },
  { value: "COMPLETED", label: "완료", color: "bg-blue-50 text-blue-600 border-blue-200" },
]

// 결제 상태 유형
const paymentStatuses = [
  { value: "PENDING", label: "결제 대기", color: "bg-gray-100 text-gray-800 border-gray-200" },
  { value: "PAID", label: "결제 완료", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { value: "REFUNDED", label: "환불", color: "bg-purple-50 text-purple-600 border-purple-200" },
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

interface ReservationStatusProps {
  facilityId?: string; // 선택적으로 시설 ID를 받을 수 있음
}

export default function ReservationStatus({ facilityId }: ReservationStatusProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  
  // 가상의 예약 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    const dummyReservations: Reservation[] = [
      {
        id: "1",
        userId: "user1",
        userName: "홍길동",
        facilityId: "1",
        facilityName: "서울 테니스 센터",
        courtId: "1",
        courtName: "코트 A",
        reservationDate: "2024-06-01",
        startTime: "18:00",
        endTime: "20:00",
        totalPrice: 40000,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        createdAt: "2024-05-28T14:30:00"
      },
      {
        id: "2",
        userId: "user2",
        userName: "김철수",
        facilityId: "1",
        facilityName: "서울 테니스 센터",
        courtId: "2",
        courtName: "코트 B",
        reservationDate: "2024-06-02",
        startTime: "16:00",
        endTime: "18:00",
        totalPrice: 30000,
        status: "PENDING",
        paymentStatus: "PENDING",
        createdAt: "2024-05-29T10:15:00"
      },
      {
        id: "3",
        userId: "user3",
        userName: "이영희",
        facilityId: "2",
        facilityName: "강남 풋살장",
        courtId: "4",
        courtName: "실내 코트 1",
        reservationDate: "2024-06-03",
        startTime: "19:00",
        endTime: "21:00",
        totalPrice: 60000,
        status: "CANCELED",
        paymentStatus: "REFUNDED",
        createdAt: "2024-05-30T09:45:00"
      },
      {
        id: "4",
        userId: "user1",
        userName: "홍길동",
        facilityId: "3",
        facilityName: "종로 농구코트",
        courtId: "7",
        courtName: "코트 B",
        reservationDate: "2024-05-15",
        startTime: "14:00",
        endTime: "16:00",
        totalPrice: 30000,
        status: "COMPLETED",
        paymentStatus: "PAID",
        createdAt: "2024-05-10T11:20:00"
      }
    ]
    
    // 특정 시설 ID가 주어진 경우 해당 시설의 예약만 필터링
    if (facilityId) {
      setReservations(dummyReservations.filter(r => r.facilityId === facilityId))
    } else {
      setReservations(dummyReservations)
    }
  }, [facilityId])
  
  // 예약 필터링
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.courtName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || !statusFilter ? true : reservation.status === statusFilter
    
    const matchesDate = date 
      ? reservation.reservationDate === format(date, 'yyyy-MM-dd')
      : true
      
    return matchesSearch && matchesStatus && matchesDate
  })
  
  // 예약 필터 초기화
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("ALL")
    setDate(undefined)
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
  const viewReservationDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsDetailsDialogOpen(true)
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
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px] mb-6 bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">전체</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">대기중</TabsTrigger>
              <TabsTrigger value="confirmed" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">확정</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">완료/취소</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="고객명, 시설명 또는 코트명 검색..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="상태 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">모든 상태</SelectItem>
                    {reservationStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
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
                  variant="outline" 
                  onClick={resetFilters}
                >
                  초기화
                </Button>
              </div>
            </div>
            
            <TabsContent value="all">
              <ReservationTable 
                reservations={filteredReservations}
                getStatusBadgeStyle={getStatusBadgeStyle}
                getPaymentStatusBadgeStyle={getPaymentStatusBadgeStyle}
                getStatusLabel={getStatusLabel}
                getPaymentStatusLabel={getPaymentStatusLabel}
                viewReservationDetails={viewReservationDetails}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <ReservationTable 
                reservations={filteredReservations.filter(r => r.status === "PENDING")}
                getStatusBadgeStyle={getStatusBadgeStyle}
                getPaymentStatusBadgeStyle={getPaymentStatusBadgeStyle}
                getStatusLabel={getStatusLabel}
                getPaymentStatusLabel={getPaymentStatusLabel}
                viewReservationDetails={viewReservationDetails}
              />
            </TabsContent>
            
            <TabsContent value="confirmed">
              <ReservationTable 
                reservations={filteredReservations.filter(r => r.status === "CONFIRMED")}
                getStatusBadgeStyle={getStatusBadgeStyle}
                getPaymentStatusBadgeStyle={getPaymentStatusBadgeStyle}
                getStatusLabel={getStatusLabel}
                getPaymentStatusLabel={getPaymentStatusLabel}
                viewReservationDetails={viewReservationDetails}
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <ReservationTable 
                reservations={filteredReservations.filter(r => 
                  r.status === "COMPLETED" || r.status === "CANCELED"
                )}
                getStatusBadgeStyle={getStatusBadgeStyle}
                getPaymentStatusBadgeStyle={getPaymentStatusBadgeStyle}
                getStatusLabel={getStatusLabel}
                getPaymentStatusLabel={getPaymentStatusLabel}
                viewReservationDetails={viewReservationDetails}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* 예약 세부정보 다이얼로그 */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>예약 세부 정보</DialogTitle>
            <DialogDescription>
              예약 ID: {selectedReservation?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">예약 상태</div>
                  <Badge className={getStatusBadgeStyle(selectedReservation.status)}>
                    {getStatusLabel(selectedReservation.status)}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">결제 상태</div>
                  <Badge className={getPaymentStatusBadgeStyle(selectedReservation.paymentStatus)}>
                    {getPaymentStatusLabel(selectedReservation.paymentStatus)}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">고객 정보</div>
                <div className="text-sm">{selectedReservation.userName}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">시설 정보</div>
                <div className="text-sm">{selectedReservation.facilityName}</div>
                <div className="text-sm">{selectedReservation.courtName}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">예약 정보</div>
                <div className="text-sm">
                  {format(new Date(selectedReservation.reservationDate), 'PPP', { locale: ko })}
                </div>
                <div className="text-sm">
                  {selectedReservation.startTime} - {selectedReservation.endTime}
                </div>
                <div className="text-sm">
                  {selectedReservation.totalPrice.toLocaleString()}원
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">예약 생성일</div>
                <div className="text-sm">
                  {format(new Date(selectedReservation.createdAt), 'PPP p', { locale: ko })}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {selectedReservation?.status === "PENDING" && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => updateReservationStatus(selectedReservation.id, "CONFIRMED")}
                  disabled={isLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  예약 확정
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => updateReservationStatus(selectedReservation.id, "CANCELED")}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  예약 취소
                </Button>
              </>
            )}
            
            {selectedReservation?.status === "CONFIRMED" && (
              <>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => updateReservationStatus(selectedReservation.id, "COMPLETED")}
                  disabled={isLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  이용 완료
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => updateReservationStatus(selectedReservation.id, "CANCELED")}
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
  reservations: Reservation[]
  getStatusBadgeStyle: (status: string) => string
  getPaymentStatusBadgeStyle: (status: string) => string
  getStatusLabel: (status: string) => string
  getPaymentStatusLabel: (status: string) => string
  viewReservationDetails: (reservation: Reservation) => void
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
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">#{reservation.id}</TableCell>
              <TableCell>{reservation.userName}</TableCell>
              <TableCell>
                <div>{reservation.facilityName}</div>
                <div className="text-xs text-gray-500">{reservation.courtName}</div>
              </TableCell>
              <TableCell>
                <div>{format(new Date(reservation.reservationDate), 'yy-MM-dd')}</div>
                <div className="text-xs text-gray-500">
                  {reservation.startTime} - {reservation.endTime}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadgeStyle(reservation.status)}>
                  {getStatusLabel(reservation.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div>{reservation.totalPrice.toLocaleString()}원</div>
                <Badge className={getPaymentStatusBadgeStyle(reservation.paymentStatus)}>
                  {getPaymentStatusLabel(reservation.paymentStatus)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => viewReservationDetails(reservation)}
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