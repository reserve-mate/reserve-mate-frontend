"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, CreditCard, MapPin, Users, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { paymentService, RefundRequest } from "@/lib/services/paymentService"
import { PaymentHistory, displayPaymentStatus } from "@/lib/types/payment"
import { PaymentStatus } from "@/lib/enum/paymentEnum"
import { toast } from "@/hooks/use-toast"
import { Slice } from "@/lib/types/commonTypes"

// 더미 데이터 (개발/테스트용)
const dummyPaymentHistory: PaymentHistory[] = [
  {
    id: 1,
    orderId: "ORDER-20241201-001",
    paymentKey: "pay_test_123456789",
    amount: 50000,
    status: PaymentStatus.PAID,
    paymentMethod: "카드",
    type: 'MATCH',
    matchName: "서울 FC vs 인천 FC",
    facilityName: "서울월드컵경기장",
    reservationDate: "2024-12-15T14:00:00",
    createdAt: "2024-12-01T10:30:00"
  },
  {
    id: 2,
    orderId: "ORDER-20241130-002",
    paymentKey: "pay_test_987654321",
    amount: 30000,
    status: PaymentStatus.CANCELED,
    paymentMethod: "카드",
    type: 'FACILITY',
    facilityName: "올림픽공원 테니스장",
    reservationDate: "2024-12-10T16:00:00",
    createdAt: "2024-11-30T15:20:00",
    cancelReason: "개인 사유로 인한 취소"
  },
  {
    id: 3,
    orderId: "ORDER-20241125-003",
    paymentKey: "pay_test_456789123",
    amount: 25000,
    status: PaymentStatus.PAID,
    paymentMethod: "계좌이체",
    type: 'MATCH',
    matchName: "풋살 친선 경기",
    facilityName: "강남 스포츠센터",
    reservationDate: "2024-11-28T19:00:00",
    createdAt: "2024-11-25T09:15:00"
  },
  {
    id: 4,
    orderId: "ORDER-20241120-004",
    paymentKey: "pay_test_111222333",
    amount: 80000,
    status: PaymentStatus.PAID,
    paymentMethod: "카드",
    type: 'FACILITY',
    facilityName: "잠실 종합운동장 수영장",
    reservationDate: "2024-11-22T10:00:00",
    createdAt: "2024-11-20T14:30:00"
  },
  {
    id: 5,
    orderId: "ORDER-20241118-005",
    paymentKey: "pay_test_444555666",
    amount: 35000,
    status: PaymentStatus.PARTIAL_CANCELED,
    paymentMethod: "카드",
    type: 'MATCH',
    matchName: "주말 축구 매치",
    facilityName: "한강공원 축구장",
    reservationDate: "2024-11-20T15:00:00",
    createdAt: "2024-11-18T11:45:00",
    cancelReason: "일부 인원 참석 불가"
  },
  {
    id: 6,
    orderId: "ORDER-20241115-006",
    paymentKey: "pay_test_777888999",
    amount: 60000,
    status: PaymentStatus.PAID,
    paymentMethod: "계좌이체",
    type: 'FACILITY',
    facilityName: "송파구민체육센터 배드민턴장",
    reservationDate: "2024-11-17T18:00:00",
    createdAt: "2024-11-15T16:20:00"
  }
]

export default function PaymentsPage() {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [useDummyData, setUseDummyData] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  // 모달 상태
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null)
  const [isRefunding, setIsRefunding] = useState(false)

  // 환불 신청 폼 데이터
  const [refundForm, setRefundForm] = useState({
    reason: "",
    refundAmount: 0
  })

  // 탭별 필터링된 결제내역
  const getFilteredPaymentHistory = () => {
    switch (activeTab) {
      case 'match':
        return paymentHistory.filter(payment => payment.type === 'MATCH')
      case 'facility':
        return paymentHistory.filter(payment => payment.type === 'FACILITY')
      default:
        return paymentHistory
    }
  }

  // 탭별 개수 계산
  const getTabCounts = () => {
    const matchCount = paymentHistory.filter(payment => payment.type === 'MATCH').length
    const facilityCount = paymentHistory.filter(payment => payment.type === 'FACILITY').length
    return {
      all: paymentHistory.length,
      match: matchCount,
      facility: facilityCount
    }
  }

  // 결제내역 조회
  const loadPaymentHistory = async (page: number = 0) => {
    try {
      setIsLoading(true)
      
      // API 호출 시도
      const response = await paymentService.getPaymentHistory(page, 10)
      
      if (page === 0) {
        setPaymentHistory(response.content)
      } else {
        setPaymentHistory(prev => [...prev, ...response.content])
      }
      
      setCurrentPage(response.number)
      setTotalPages(response.numberOfElements)
      setHasMore(!response.last)
      setUseDummyData(false)
      
    } catch (error) {
      console.error("결제내역 조회 실패:", error)
      
      // API 실패 시 더미 데이터 사용
      if (page === 0) {
        setPaymentHistory(dummyPaymentHistory)
        setUseDummyData(true)
        setHasMore(false)
        
        toast({
          title: "개발 모드",
          description: "API 연결이 되지 않아 더미 데이터를 표시합니다.",
          variant: "default",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 더보기 로드 (더미 데이터 사용 시에는 실행하지 않음)
  const loadMore = () => {
    if (hasMore && !isLoading && !useDummyData) {
      loadPaymentHistory(currentPage + 1)
    }
  }

  // 환불 신청 모달 열기
  const openRefundModal = (payment: PaymentHistory) => {
    setSelectedPayment(payment)
    setRefundForm({
      reason: "",
      refundAmount: payment.amount
    })
    setShowRefundModal(true)
  }

  // 상세보기 모달 열기
  const openDetailModal = async (payment: PaymentHistory) => {
    setSelectedPayment(payment)
    setShowDetailModal(true)
    
    // 실제 환경에서는 상세 정보를 다시 불러올 수 있음
    if (!useDummyData) {
      try {
        const detailResponse = await paymentService.getPaymentDetail(payment.id)
        setSelectedPayment(detailResponse)
      } catch (error) {
        console.error("상세 정보 조회 실패:", error)
      }
    }
  }

  // 환불 신청 처리
  const handleRefundSubmit = async () => {
    if (!selectedPayment) return
    
    if (!refundForm.reason.trim()) {
      toast({
        title: "환불 사유 필수",
        description: "환불 사유를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsRefunding(true)
    
    try {
      const refundRequest: RefundRequest = {
        paymentId: selectedPayment.id,
        reason: refundForm.reason,
        refundAmount: refundForm.refundAmount
      }

      if (useDummyData) {
        // 더미 데이터 환경에서는 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 로컬 상태 업데이트
        setPaymentHistory(prev => 
          prev.map(p => 
            p.id === selectedPayment.id 
              ? { ...p, status: PaymentStatus.CANCELED, cancelReason: refundForm.reason }
              : p
          )
        )
      } else {
        await paymentService.requestRefund(refundRequest)
        
        // 성공 시 데이터 새로고침
        loadPaymentHistory(0)
      }

      toast({
        title: "환불 신청 완료",
        description: "환불 신청이 성공적으로 접수되었습니다. 처리까지 2-3일 정도 소요됩니다.",
      })
      
      setShowRefundModal(false)
      setSelectedPayment(null)
      
    } catch (error) {
      console.error("환불 신청 실패:", error)
      toast({
        title: "환불 신청 실패",
        description: "환불 신청 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsRefunding(false)
    }
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadPaymentHistory()
  }, [])

  // 금액 포맷팅
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // 결제 상태에 따른 Badge variant
  const getStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "default" as const
      case PaymentStatus.CANCELED:
        return "destructive" as const
      case PaymentStatus.PARTIAL_CANCELED:
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  // 결제 타입별 정보 가져오기
  const getPaymentTypeInfo = (payment: PaymentHistory) => {
    if (payment.type === 'MATCH') {
      return {
        icon: Users,
        label: "소셜 매치",
        title: payment.matchName || "매치 예약",
        subtitle: payment.facilityName || "",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600"
      }
    } else {
      return {
        icon: MapPin,
        label: "시설 예약",
        title: payment.facilityName || "시설 예약",
        subtitle: "",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        iconColor: "text-green-600"
      }
    }
  }

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto py-8">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">결제내역</h1>
            <p className="text-muted-foreground">
              결제 및 환불 내역을 확인할 수 있습니다.
              {useDummyData && " (데모 데이터)"}
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              전체
              {(() => {
                const counts = getTabCounts()
                return counts.all > 0 && <Badge variant="secondary" className="ml-1 h-5 text-xs">{counts.all}</Badge>
              })()}
            </TabsTrigger>
            <TabsTrigger value="match" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              소셜 매치
              {(() => {
                const counts = getTabCounts()
                return counts.match > 0 && <Badge variant="secondary" className="ml-1 h-5 text-xs">{counts.match}</Badge>
              })()}
            </TabsTrigger>
            <TabsTrigger value="facility" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              시설 예약
              {(() => {
                const counts = getTabCounts()
                return counts.facility > 0 && <Badge variant="secondary" className="ml-1 h-5 text-xs">{counts.facility}</Badge>
              })()}
            </TabsTrigger>
          </TabsList>

          {/* 전체 탭 */}
          <TabsContent value="all" className="space-y-4">
            {isLoading && paymentHistory.length === 0 ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : getFilteredPaymentHistory().length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">결제내역이 없습니다</h3>
                  <p className="text-muted-foreground mb-6">
                    아직 결제한 내역이 없습니다. 경기나 시설을 예약해보세요.
                  </p>
                  <Link href="/matches">
                    <Button>경기 둘러보기</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {getFilteredPaymentHistory().map((payment) => {
                  const typeInfo = getPaymentTypeInfo(payment)
                  const TypeIcon = typeInfo.icon
                  
                  return (
                    <Card key={payment.id} className={`hover:shadow-md transition-shadow ${typeInfo.borderColor} border-l-4`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                              <TypeIcon className={`h-5 w-5 ${typeInfo.iconColor}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">
                                  {typeInfo.title}
                                </CardTitle>
                                <Badge variant="outline" className={`text-xs ${typeInfo.iconColor} border-current`}>
                                  {typeInfo.label}
                                </Badge>
                              </div>
                              {typeInfo.subtitle && (
                                <p className="text-sm text-muted-foreground mb-1">{typeInfo.subtitle}</p>
                              )}
                              <CardDescription className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(payment.createdAt)}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(payment.status)}>
                            {displayPaymentStatus(payment.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">결제금액</span>
                              <span className="font-semibold">{formatAmount(payment.amount)}원</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">결제수단</span>
                              <span>{payment.paymentMethod}</span>
                            </div>
                            {payment.reservationDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">이용일시</span>
                                <span>{formatDate(payment.reservationDate)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">주문번호</span>
                              <span className="font-mono text-xs">{payment.orderId}</span>
                            </div>
                            {payment.type === 'MATCH' && payment.facilityName && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">경기장</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {payment.facilityName}
                                </span>
                              </div>
                            )}
                            {payment.cancelReason && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">취소사유</span>
                                <span className="text-red-600">{payment.cancelReason}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 추가 액션 버튼들 */}
                        <Separator className="my-4" />
                        <div className="flex justify-end gap-2">
                          {payment.status === PaymentStatus.PAID && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openRefundModal(payment)}
                            >
                              환불 신청
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDetailModal(payment)}
                          >
                            상세보기
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* 매치 탭 */}
          <TabsContent value="match" className="space-y-4">
            {getFilteredPaymentHistory().length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">매치 결제내역이 없습니다</h3>
                  <p className="text-muted-foreground mb-6">
                    아직 소셜 매치 결제 내역이 없습니다. 매치에 참여해보세요.
                  </p>
                  <Link href="/matches">
                    <Button>매치 둘러보기</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {getFilteredPaymentHistory().map((payment) => {
                  const typeInfo = getPaymentTypeInfo(payment)
                  const TypeIcon = typeInfo.icon
                  
                  return (
                    <Card key={payment.id} className={`hover:shadow-md transition-shadow ${typeInfo.borderColor} border-l-4`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                              <TypeIcon className={`h-5 w-5 ${typeInfo.iconColor}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">
                                  {typeInfo.title}
                                </CardTitle>
                                <Badge variant="outline" className={`text-xs ${typeInfo.iconColor} border-current`}>
                                  {typeInfo.label}
                                </Badge>
                              </div>
                              {typeInfo.subtitle && (
                                <p className="text-sm text-muted-foreground mb-1">{typeInfo.subtitle}</p>
                              )}
                              <CardDescription className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(payment.createdAt)}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(payment.status)}>
                            {displayPaymentStatus(payment.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">결제금액</span>
                              <span className="font-semibold">{formatAmount(payment.amount)}원</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">결제수단</span>
                              <span>{payment.paymentMethod}</span>
                            </div>
                            {payment.reservationDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">이용일시</span>
                                <span>{formatDate(payment.reservationDate)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">주문번호</span>
                              <span className="font-mono text-xs">{payment.orderId}</span>
                            </div>
                            {payment.type === 'MATCH' && payment.facilityName && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">경기장</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {payment.facilityName}
                                </span>
                              </div>
                            )}
                            {payment.cancelReason && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">취소사유</span>
                                <span className="text-red-600">{payment.cancelReason}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 추가 액션 버튼들 */}
                        <Separator className="my-4" />
                        <div className="flex justify-end gap-2">
                          {payment.status === PaymentStatus.PAID && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openRefundModal(payment)}
                            >
                              환불 신청
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDetailModal(payment)}
                          >
                            상세보기
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* 시설 탭 */}
          <TabsContent value="facility" className="space-y-4">
            {getFilteredPaymentHistory().length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">시설 결제내역이 없습니다</h3>
                  <p className="text-muted-foreground mb-6">
                    아직 시설 예약 결제 내역이 없습니다. 시설을 예약해보세요.
                  </p>
                  <Link href="/facilities">
                    <Button>시설 둘러보기</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {getFilteredPaymentHistory().map((payment) => {
                  const typeInfo = getPaymentTypeInfo(payment)
                  const TypeIcon = typeInfo.icon
                  
                  return (
                    <Card key={payment.id} className={`hover:shadow-md transition-shadow ${typeInfo.borderColor} border-l-4`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                              <TypeIcon className={`h-5 w-5 ${typeInfo.iconColor}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">
                                  {typeInfo.title}
                                </CardTitle>
                                <Badge variant="outline" className={`text-xs ${typeInfo.iconColor} border-current`}>
                                  {typeInfo.label}
                                </Badge>
                              </div>
                              {typeInfo.subtitle && (
                                <p className="text-sm text-muted-foreground mb-1">{typeInfo.subtitle}</p>
                              )}
                              <CardDescription className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(payment.createdAt)}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(payment.status)}>
                            {displayPaymentStatus(payment.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">결제금액</span>
                              <span className="font-semibold">{formatAmount(payment.amount)}원</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">결제수단</span>
                              <span>{payment.paymentMethod}</span>
                            </div>
                            {payment.reservationDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">이용일시</span>
                                <span>{formatDate(payment.reservationDate)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">주문번호</span>
                              <span className="font-mono text-xs">{payment.orderId}</span>
                            </div>
                            {payment.type === 'MATCH' && payment.facilityName && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">경기장</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {payment.facilityName}
                                </span>
                              </div>
                            )}
                            {payment.cancelReason && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">취소사유</span>
                                <span className="text-red-600">{payment.cancelReason}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 추가 액션 버튼들 */}
                        <Separator className="my-4" />
                        <div className="flex justify-end gap-2">
                          {payment.status === PaymentStatus.PAID && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openRefundModal(payment)}
                            >
                              환불 신청
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDetailModal(payment)}
                          >
                            상세보기
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* 더보기 버튼 (더미 데이터가 아닐 때만) */}
          {hasMore && !useDummyData && (
            <div className="text-center pt-6">
              <Button 
                variant="outline" 
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? "불러오는 중..." : "더보기"}
              </Button>
            </div>
          )}
        </Tabs>
      </div>

      {/* 환불 신청 모달 */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              환불 신청
            </DialogTitle>
            <DialogDescription>
              결제 취소 및 환불을 신청합니다. 처리까지 2-3일 정도 소요됩니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="grid gap-4 py-4">
              {/* 결제 정보 요약 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">결제 정보</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>결제 타입:</span>
                    <span className="flex items-center gap-1">
                      {(() => {
                        const typeInfo = getPaymentTypeInfo(selectedPayment)
                        const TypeIcon = typeInfo.icon
                        return (
                          <>
                            <TypeIcon className={`h-4 w-4 ${typeInfo.iconColor}`} />
                            {typeInfo.label}
                          </>
                        )
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>상품명:</span>
                    <span>{getPaymentTypeInfo(selectedPayment).title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>결제금액:</span>
                    <span className="font-semibold">{formatAmount(selectedPayment.amount)}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>결제일시:</span>
                    <span>{formatDate(selectedPayment.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* 환불 금액 */}
              <div className="space-y-2">
                <Label htmlFor="refund-amount">환불 금액</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  value={refundForm.refundAmount}
                  onChange={(e) => setRefundForm(prev => ({ ...prev, refundAmount: Number(e.target.value) }))}
                  max={selectedPayment.amount}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  최대 {formatAmount(selectedPayment.amount)}원까지 환불 가능합니다.
                </p>
              </div>

              {/* 환불 사유 */}
              <div className="space-y-2">
                <Label htmlFor="refund-reason">환불 사유 *</Label>
                <Textarea
                  id="refund-reason"
                  placeholder="환불 사유를 상세히 입력해주세요."
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* 주의사항 */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <h5 className="font-medium text-amber-800 mb-1">환불 유의사항</h5>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• 환불 처리는 영업일 기준 2-3일 소요됩니다.</li>
                  <li>• 카드 결제의 경우 카드사 정책에 따라 추가 시간이 소요될 수 있습니다.</li>
                  <li>• 부분 환불도 가능하며, 환불 후 취소할 수 없습니다.</li>
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundModal(false)}>
              취소
            </Button>
            <Button 
              onClick={handleRefundSubmit}
              disabled={isRefunding || !refundForm.reason.trim()}
            >
              {isRefunding ? "처리 중..." : "환불 신청"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 상세보기 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              결제 상세 정보
            </DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="grid gap-6 py-4">
              {/* 기본 정보 */}
              <div>
                <h4 className="font-semibold mb-3 text-lg">기본 정보</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-muted-foreground">결제 타입</span>
                      <div className="flex items-center gap-2 mt-1">
                        {(() => {
                          const typeInfo = getPaymentTypeInfo(selectedPayment)
                          const TypeIcon = typeInfo.icon
                          return (
                            <>
                              <TypeIcon className={`h-4 w-4 ${typeInfo.iconColor}`} />
                              <span className="font-medium">{typeInfo.label}</span>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">상품명</span>
                      <p className="font-medium">{getPaymentTypeInfo(selectedPayment).title}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">결제 상태</span>
                      <div className="mt-1">
                        <Badge variant={getStatusVariant(selectedPayment.status)}>
                          {displayPaymentStatus(selectedPayment.status)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">결제 수단</span>
                      <p className="font-medium">{selectedPayment.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-muted-foreground">결제 금액</span>
                      <p className="font-semibold text-lg">{formatAmount(selectedPayment.amount)}원</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">결제 일시</span>
                      <p className="font-medium">{formatDate(selectedPayment.createdAt)}</p>
                    </div>
                    {selectedPayment.reservationDate && (
                      <div>
                        <span className="text-muted-foreground">이용 일시</span>
                        <p className="font-medium">{formatDate(selectedPayment.reservationDate)}</p>
                      </div>
                    )}
                    {selectedPayment.type === 'MATCH' && selectedPayment.facilityName && (
                      <div>
                        <span className="text-muted-foreground">경기장</span>
                        <p className="font-medium">{selectedPayment.facilityName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* 결제 정보 */}
              <div>
                <h4 className="font-semibold mb-3">결제 정보</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>주문번호:</span>
                    <span className="font-mono">{selectedPayment.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>결제키:</span>
                    <span className="font-mono">{selectedPayment.paymentKey}</span>
                  </div>
                </div>
              </div>

              {/* 취소 정보 (취소된 경우에만) */}
              {selectedPayment.status === PaymentStatus.CANCELED && selectedPayment.cancelReason && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">취소 정보</h4>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <div className="text-sm">
                        <span className="text-muted-foreground">취소 사유:</span>
                        <p className="mt-1 text-red-700">{selectedPayment.cancelReason}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 