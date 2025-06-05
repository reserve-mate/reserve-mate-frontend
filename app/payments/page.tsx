"use client"

import { useState, useEffect, useRef } from "react"
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
import { PaymentHistCntResponse, PaymentHistResponse, PaymentHistory, displayPaymentStatus } from "@/lib/types/payment"
import { PaymentStatus } from "@/lib/enum/paymentEnum"
import { toast } from "@/hooks/use-toast"
import { Slice } from "@/lib/types/commonTypes"

export default function PaymentsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  const [activeTab, setActiveTab] = useState('match');

  // 결제 내역 카운트
  const [paymentMatchCnt, setPaymentMatchCnt] = useState<number>(0);  // 매치 결제 내역 카운트
  const [paymentReservationCnt , setPaymentReservationCnt] = useState<number>(0); // 예약 결제 내역 카운트

  // 결제 내역
  const [paymentHist, setPaymentHist] = useState<PaymentHistResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState(false);
  const [isError, setIsError] = useState(false);

  // 모달 상태
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistResponse | null>(null)
  const [isRefunding, setIsRefunding] = useState(false)

  // 환불 신청 폼 데이터
  const [refundForm, setRefundForm] = useState({
    reason: "",
    refundAmount: 0
  })

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 결제 내역 카운트
  useEffect(() => {

    const getPaymentHistCnt = async () => {
      try {
        const response = await paymentService.getPaymentHistCnt();
        setPaymentMatchCnt(response.matchPaymentCnt);
        setPaymentReservationCnt(response.reservationPaymentCnt);
      } catch (error: any) {
        setPaymentMatchCnt(0);
        setPaymentReservationCnt(0);
      }
    }
    
    getPaymentHistCnt();
  }, []);

  const getPaymentHist = async (type: string, pageNum: number) => {
    if(isLoading) return;
      setIsLoading(true);

      try {
        const response = await paymentService.getPaymentHist({
          type: type
          , pageNum: pageNum
        });
        setPaymentHist((prev) => {
          const merged = [...prev, ...response.content];
          const unique = [...new Map(merged.map(r => [r.paymentId, r])).values()];
          return unique;
      });
        setPage(response.number);
        setHasMore(!response.last);
        setIsError(false);
      } catch (error: any) {
        setPaymentHist([]);
        setIsError(true);
      }finally {
        setIsLoading(false);
      }
      
    }

  // 결제 내역 조회
  useEffect(() => {
    getPaymentHist("match", 0);
  }, []);

  // 무한 스크롤
  useEffect(() => {
    if(!hasMore || isLoading || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting) {
          getPaymentHist(activeTab, page + 1);
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

  }, [page, hasMore, isLoading])

  // 탭별 개수 계산
  const getTabCounts = () => {
    const matchCount = paymentHist.filter(payment => payment.paymentType === 'MATCH').length
    const facilityCount = paymentHist.filter(payment => payment.paymentType === 'RESERVATION').length
    return {
      match: matchCount,
      facility: facilityCount
    }
  }

  // 환불 신청 모달 열기
  const openRefundModal = (payment: PaymentHistResponse) => {
    setSelectedPayment(payment)
    setRefundForm({
      reason: "",
      refundAmount: payment.amount
    })
    setShowRefundModal(true)
  }

  // 상세보기 모달 열기
  const openDetailModal = async (payment: PaymentHistResponse) => {
    setSelectedPayment(payment)
    setShowDetailModal(true)
    
    // 실제 환경에서는 상세 정보를 다시 불러올 수 있음
    // if (!useDummyData) {
    //   try {
    //     const detailResponse = await paymentService.getPaymentDetail(payment.id)
    //     setSelectedPayment(detailResponse)
    //   } catch (error) {
    //     console.error("상세 정보 조회 실패:", error)
    //   }
    // }
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
        paymentId: selectedPayment.paymentId,
        reason: refundForm.reason,
        refundAmount: refundForm.refundAmount
      }

      if (paymentHist) {
        // 더미 데이터 환경에서는 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 로컬 상태 업데이트
        // setPaymentHistory(prev => 
        //   prev.map(p => 
        //     p.id === selectedPayment.paymentId 
        //       ? { ...p, status: PaymentStatus.CANCELED, cancelReason: refundForm.reason }
        //       : p
        //   )
        // )
      } else {
        await paymentService.requestRefund(refundRequest)
        
        // 성공 시 데이터 새로고침
        //loadPaymentHistory(0)
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
  const getPaymentTypeInfo = (payment: PaymentHistResponse) => {
    if (payment.paymentType === 'MATCH') {
      return {
        icon: Users,
        label: "소셜 매치",
        title: payment.refName || "매치 예약",
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

  // 탭 변경
  const handleTab = (type: string) => {
    setActiveTab(type);
    setPage(0);
    setHasMore(false);
    setPaymentHist([]);
    getPaymentHist(type, 0);
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
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={(val) => handleTab(val)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="match" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              소셜 매치
              <Badge variant="secondary" className="ml-1 h-5 text-xs">{paymentMatchCnt}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reservation" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              시설 예약
              <Badge variant="secondary" className="ml-1 h-5 text-xs">{paymentReservationCnt}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* 전체 탭 */}
          <TabsContent value={activeTab} className="space-y-4">
            {isLoading && paymentHist.length === 0 ? (
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
            ) : paymentHist.length === 0 ? (
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
                {paymentHist.map((payment) => {
                  const typeInfo = getPaymentTypeInfo(payment)
                  const TypeIcon = typeInfo.icon
                  
                  return (
                    <Card key={payment.paymentId} className={`hover:shadow-md transition-shadow ${typeInfo.borderColor} border-l-4`}>
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
                                {formatDate(payment.paidAt)}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(payment.paymentStatus)}>
                            {displayPaymentStatus(payment.paymentStatus)}
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
                            {payment.useDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">이용일시</span>
                                <span>{formatDate(payment.useDate)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">주문번호</span>
                              <span className="font-mono text-xs">{payment.orderId}</span>
                            </div>
                            {payment.paymentType === 'MATCH' && payment.facilityName && (
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
                          {payment.paymentStatus === PaymentStatus.PAID && (
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

            {/* 무한 스크롤 트리거 지점 */}
            <div ref={observerRef} className="text-center">
            {isLoading && <p className="text-muted-foreground">불러오는 중...</p>}
            </div>
          </TabsContent>
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
                    <span>{formatDate(selectedPayment.paidAt)}</span>
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
                        <Badge variant={getStatusVariant(selectedPayment.paymentStatus)}>
                          {displayPaymentStatus(selectedPayment.paymentStatus)}
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
                      <p className="font-medium">{formatDate(selectedPayment.paidAt)}</p>
                    </div>
                    {selectedPayment.useDate && (
                      <div>
                        <span className="text-muted-foreground">이용 일시</span>
                        <p className="font-medium">{formatDate(selectedPayment.useDate)}</p>
                      </div>
                    )}
                    {selectedPayment.paymentType === 'MATCH' && selectedPayment.facilityName && (
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
                  {/* <div className="flex justify-between">
                    <span>결제키:</span>
                    <span className="font-mono">{selectedPayment.paymentKey}</span>
                  </div> */}
                </div>
              </div>

              {/* 취소 정보 (취소된 경우에만) */}
              {selectedPayment.paymentStatus === PaymentStatus.CANCELED && selectedPayment.cancelReason && (
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