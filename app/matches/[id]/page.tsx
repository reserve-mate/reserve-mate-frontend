"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { MapPin, Calendar, Clock, Users, DollarSign, Share2, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react"
import { matchService } from "@/lib/services/matchService"
import { MatchDetailRespone, MatchPayment } from "@/lib/types/matchTypes"
import { MatchStatus, SportType } from "@/lib/enum/matchEnum"
import { loadTossPayments, ANONYMOUS, TossPaymentsWidgets, TossPaymentsPayment } from "@tosspayments/tosspayments-sdk";
import { matchPlayerService } from "@/lib/services/matchplayerService"
import Script from "next/script"
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { Location } from "@/lib/types/commonTypes"

declare global {              // Property 'kakao' does not exist on type 'Window & typeof globalThis'. 에러 방지
  interface Window {          // kakao 라는 객체가 window에 존재하고 있다고 인식
    kakao: any;
  }
}

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
  description: string
  hostName: string
  hostLevel: string
  participants: Participant[]
  comments: Comment[]
}

type Participant = {
  id: string
  name: string
  level: string
  joinedAt: string
}

type Comment = {
  id: string
  userName: string
  content: string
  createdAt: string
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || '';
const customerKey: string = generateUniqueString();

// 무작위 문자열 생성
function generateUniqueString(): string {
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10)
  );
}

export default function MatchDetailPage({ params }: { params: { id: number } }) {
  const numberFormat = /\B(?=(\d{3})+(?!\d))/g; // 천원단위 숫자 포맷

  const router = useRouter()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [showMobileJoinPanel, setShowMobileJoinPanel] = useState(false)

  // 지도 위도 경도
  const [ location, setLocation ] = useState<Location | null>(null);

  // 토스 결제
  const [payment, setPayment] = useState<TossPaymentsPayment | null>(null);
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 50000,
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // 매치 상세조회 데이터
  const [matchDetail, setMatchDetail] = useState<MatchDetailRespone | null>(null);

  // 로그인 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const ref = useRef(false);

  function selectPaymentMethod(method: any) {
    setSelectedPaymentMethod(method);
  }

  const generateUniqueString = (): string => {
    return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
  }

  // 매치 상세 조회
  const getMatchDetail = (matchId: number) => {
    // todo 로컬 스토리지 가져와서 변수에 저장하기
    setLoading(true)

    const fetchMatchDetail = async () => {
      try {
        const matchInfo = await matchService.getMatch(params.id);
        console.log(matchInfo.matchDataDto.matchId)
        setMatchDetail(matchInfo);
      } catch (error: any) {
        alert(error.errorCode + ":" + error.message);
        if(error.errorCode === "UNAUTHORIZED"){
          window.location.reload();
          return;
        }
        router.push("/matches");
      } finally {
        setLoading(false);
      }
    }

    fetchMatchDetail();
  }

  // 로그인 상태 확인
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(loggedInStatus === 'true')
  }, [])

  // 지도 위도 경도
  useEffect(() => {
    if(!matchDetail) return;

    const matchAddress = matchDetail.facilityDataDto.address;

    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(matchAddress, function (result: any, status: any){
        if (status === window.kakao.maps.services.Status.OK) {
          console.log(result[0].y)
          console.log(result[0].x)

          const coords: Location = {
            latitude: result[0].y,
            longitude: result[0].x
          } 

          setLocation(coords)
        }

      })
    });

  }, [matchDetail])

  // 토스 결제창 초기화
  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
        const payment = tossPayments.payment({
          customerKey,
        });
        // 비회원 결제
        // const payment = tossPayments.payment({ customerKey: ANONYMOUS });

        setPayment(payment);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    }

    fetchPayment();
  }, [clientKey, customerKey]);

  // 토스 결제 요청창 노출
  const requestPayment = async () => {
    if (!matchDetail) return;

    if ( !isLoggedIn ) {
      alert("로그인 후 참가 신청을 하실 수 있습니다.");
      router.push("/login");
      return false;
    }

    setIsJoining(true);

    const requeMatch = {
      matchId: params.id,
      amount: matchDetail.matchDataDto.matchPrice
    }

    try{
      let verifyMatch = await matchPlayerService.verifyMatch(requeMatch);

      if( verifyMatch ) {
        alert("이미 해당 매치에 신청한 이력이 존재합니다.");
        setIsJoining(false);
      }else{
        await payment?.requestPayment({
          method: "CARD", // 카드 및 간편결제
          amount: {
            currency: "KRW",
            value: matchDetail.matchDataDto.matchPrice,
          },
          orderId: customerKey, // 고유 주문번호
          orderName: matchDetail.matchDataDto.matchName,
          successUrl: window.location.origin + "/payment/processing/" + params.id, // 결제 요청이 성공하면 리다이렉트되는 URL
          failUrl: window.location.origin + "/payment/failed", // 결제 요청이 실패하면 리다이렉트되는 URL
          customerEmail: (matchDetail.userDataDto) ? matchDetail.userDataDto.userEmail : "",
          customerName: (matchDetail.userDataDto) ? matchDetail.userDataDto.userName : "",
          customerMobilePhone: (matchDetail.userDataDto) ? matchDetail.userDataDto.phone : "",
          // 카드 결제에 필요한 정보
          card: {
            useEscrow: false,
            flowMode: "DEFAULT", // 통합결제창 여는 옵션
            useCardPoint: false,
            useAppCardOnly: false,
          },
        })
      }

    } catch (err) {
      setIsJoining(false);
      console.log(err)
    }
    
  }

  // api 응답
  useEffect(() => {
    if(ref.current) return;
    ref.current = true;

    getMatchDetail(params.id);
  }, [params.id, isLoggedIn])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!match || !comment.trim()) return

    // 실제 구현에서는 API를 통해 댓글을 저장합니다
    const newComment = {
      id: `c${match.comments.length + 1}`,
      userName: "홍길동", // 로그인한 사용자 이름
      content: comment,
      createdAt: new Date().toISOString().split("T")[0],
    }

    const updatedMatch = { ...match }
    updatedMatch.comments.push(newComment)
    setMatch(updatedMatch)
    setComment("")

    toast({
      title: "댓글 등록 완료",
      description: "댓글이 등록되었습니다.",
    })
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

  // 가격 천원단위
  const priceFormat = (price: number): string => {
    return price.toString().replace(numberFormat, ',');
  }

  // 참가여부 버튼
  const isMatchApplyBtn = () => {
    if(!matchDetail) return;
    if(matchDetail.userDataDto && matchDetail.userDataDto.isMatchApply) {
      return (<Button
          className="w-full py-6 text-lg font-bold"
          disabled={!canJoin || isJoining}
          onClick={requestPayment}
        >
          매치 취소하기
        </Button>)
    }else{
      return (<Button
        className="w-full py-6 text-lg font-bold"
        disabled={!canJoin || isJoining}
        onClick={requestPayment}
      >
        {isJoining
          ? "처리 중..."
          : "참가 신청하기"}
      </Button>)
    }
    
  }

  if (loading || !matchDetail) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg">매치 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  const isMatchFull = matchDetail.playerCnt >= matchDetail.matchDataDto.teamCapacity
  const isMatchStatus = (matchDetail.matchDataDto.matchStatus === MatchStatus.APPLICABLE || matchDetail.matchDataDto.matchStatus === MatchStatus.CLOSE_TO_DEADLINE);
  const canJoin = isMatchStatus && !isMatchFull

  return (
    <div className="container py-4 sm:py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <Button variant="ghost" className="mb-4 sm:mb-6 flex items-center gap-1" onClick={() => router.push("/matches")}>
        <ChevronLeft className="h-4 w-4" /> 매치 목록으로 돌아가기
      </Button>

      {/* 모바일에서만 보이는 참가 신청 요약 및 플로팅 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white shadow-xl border-t z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-full bg-indigo-100 h-11 w-11">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                <span className={`font-bold text-base ${isMatchFull ? "text-red-500" : "text-green-500"}`}>
                  {matchDetail.playerCnt}
                </span>
                <span className="text-gray-500 text-base">/{matchDetail.matchDataDto.teamCapacity} 팀</span>
              </div>
              <p className="font-bold text-indigo-700 text-lg">{matchDetail.matchDataDto.teamCapacity}/인</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
          {isMatchApplyBtn()}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs" 
              onClick={() => setShowMobileJoinPanel(!showMobileJoinPanel)}
            >
              {showMobileJoinPanel ? (
                <span className="flex items-center text-gray-500">접기 <ChevronDown className="h-3 w-3 ml-1.5" /></span>
              ) : (
                <span className="flex items-center text-indigo-600">참가 정보 보기 <ChevronUp className="h-3 w-3 ml-1.5" /></span>
              )}
            </Button>
          </div>
        </div>
        
        {/* 모바일 확장 패널 */}
        {showMobileJoinPanel && (
          <div className="px-4 pb-4 pt-0 border-t border-gray-100 animate-in slide-in-from-bottom duration-300">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-500">날짜</p>
                  <p className="text-sm">{matchDetail.matchDataDto.matchDate}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">시간</p>
                  <p className="text-sm">{matchDetail.matchDataDto.matchTime}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">참가 현황</p>
                  <p className="text-sm">
                    <span className={isMatchFull ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                      {matchDetail.playerCnt}
                    </span>
                    /{matchDetail.matchDataDto.teamCapacity} 팀
                  </p>
                </div>
                <Separator />
                <p className="text-sm font-medium">참가자 정보</p>
                <div className="grid grid-cols-2 gap-2">
                  {matchDetail.playerDtos.slice(0, 4).map((participant) => (
                    <div key={participant.playerId} className="flex items-center p-2 bg-white rounded-lg shadow-sm">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={`${participant.profileImage !== null ? participant.profileImage : `/placeholder.svg?height=32&width=32&text=${participant.userName.charAt(0)}`}`} />
                        <AvatarFallback>{`${participant.profileImage !== null ? participant.profileImage : `/placeholder.svg?height=32&width=32&text=${participant.userName.charAt(0)}`}`}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-xs">{participant.userName}</p>
                      </div>
                    </div>
                  ))}
                  {
                    matchDetail.playerDtos.length > 0 ? 

                    matchDetail.playerDtos.length > 4 && (
                      <div className="p-2 bg-white rounded-lg shadow-sm flex items-center justify-center">
                        <p className="text-xs text-gray-500">+{matchDetail.playerDtos.length - 4}명 더 보기</p>
                      </div>
                  ) : <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line w-[500px]">아직 아무도 참여하지 않았어요. {"\n"} 첫 번째 참가자가 되어보세요!</p>
                }
                </div>
                <div className="text-xs text-gray-500 space-y-1 mt-2">
                  <p>• 참가 신청 후 24시간 이내에 결제를 완료해주세요.</p>
                  <p>• 매치 시작 24시간 전까지 취소 시 전액 환불됩니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 본문 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-24 lg:pb-0">
        {/* 매치 정보 */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
            <div className="relative h-72 sm:h-80 md:h-96">
              <Image
                src={`${matchDetail.facilityDataDto.imageDtos[0] !== null ? matchDetail.facilityDataDto.imageDtos[0] : "https://images.unsplash.com/photo-1626224583764-f88b815bad2a?q=80&amp;w=1024"}`}
                alt={`${matchDetail.facilityDataDto.facilityName} 이미지`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  className={`
                    px-3 py-1.5 text-sm font-medium
                    ${matchDetail.matchDataDto.matchStatus === MatchStatus.APPLICABLE ? "bg-green-500 text-white" : ""}
                    ${matchDetail.matchDataDto.matchStatus === MatchStatus.FINISH ? "bg-blue-500 text-white" : ""}
                    ${matchDetail.matchDataDto.matchStatus === MatchStatus.CLOSE_TO_DEADLINE ? "bg-yellow-500 text-white" : ""}
                    ${matchDetail.matchDataDto.matchStatus === MatchStatus.END ? "bg-gray-500 text-white" : ""}
                  `}
                >
                  {`
                    ${matchDetail.matchDataDto.matchStatus === MatchStatus.APPLICABLE ? "모집 중" : ""}
                    ${matchDetail.matchDataDto.matchStatus === MatchStatus.FINISH ? "모집 마감" : ""}
                    ${matchDetail.matchDataDto.matchStatus === MatchStatus.CLOSE_TO_DEADLINE ? "마감 임박" : ""}
                    ${matchDetail.matchDataDto.matchStatus === MatchStatus.END ? "종료" : ""}
                  `}
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {matchDetail.facilityDataDto.facilityName} 
                  - 
                  {`
                    ${matchDetail.facilityDataDto.sportType === SportType.FUTSAL ? "풋살" : ""}
                    ${matchDetail.facilityDataDto.sportType === SportType.TENNIS ? "테니스" : ""}
                    ${matchDetail.facilityDataDto.sportType === SportType.SOCCER ? "축구" : ""}
                    ${matchDetail.facilityDataDto.sportType === SportType.BADMINTON ? "배드민턴" : ""}
                    ${matchDetail.facilityDataDto.sportType === SportType.BASKETBALL ? "야구" : ""}
                    ${matchDetail.facilityDataDto.sportType === SportType.BASEBALL ? "농구" : ""}
                  `} 매치
                </h1>
                <p className="text-gray-200 mb-1">{matchDetail.facilityDataDto.courtName}</p>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-3">{matchDetail.matchDataDto.matchDate}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{`${matchDetail.matchDataDto.matchTime}:00`} - {`${matchDetail.matchDataDto.matchEndTime}:00`}</span>
                </div>
              </div>
            </div>

            <CardContent className="space-y-6 px-4 sm:px-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-indigo-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">날짜</p>
                    <p className="text-gray-500 text-sm sm:text-base">{matchDetail.matchDataDto.matchDate}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-indigo-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">시간</p>
                    <p className="text-gray-500 text-sm sm:text-base">{`${matchDetail.matchDataDto.matchTime}:00`} - {`${matchDetail.matchDataDto.matchEndTime}:00`}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-indigo-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">위치</p>
                    <p className="text-gray-500 text-sm sm:text-base">{matchDetail.facilityDataDto.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-indigo-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">참가비</p>
                    <p className="text-gray-500 text-sm sm:text-base">{priceFormat(matchDetail.matchDataDto.matchPrice)}/인</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">매치 설명</h3>
                <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line">{`${matchDetail.matchDataDto.description !== null ? matchDetail.matchDataDto.description : "즐거운 매치가 되길 바랍니다!"}`}</p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">매니저 정보</h3>
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 mr-3">
                    <AvatarImage src={`${matchDetail.matchDataDto.mangerImage !== null ? matchDetail.matchDataDto.mangerImage : `/placeholder.svg?height=32&width=32&text=${matchDetail.matchDataDto.manager.charAt(0)}`}`} />
                    <AvatarFallback>{`${matchDetail.matchDataDto.mangerImage !== null ? matchDetail.matchDataDto.mangerImage : `/placeholder.svg?height=32&width=32&text=${matchDetail.matchDataDto.manager.charAt(0)}`}`}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{matchDetail.matchDataDto.manager}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-semibold">참가 현황</h3>
                  <Badge variant="outline" className="px-2 sm:px-3 py-1">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {matchDetail.playerCnt}/{matchDetail.matchDataDto.teamCapacity} 팀
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {
                    
                    matchDetail.playerCnt > 0 ?
                    matchDetail.playerDtos.map((participant) => (
                        <div key={participant.playerId} className="flex items-center p-2 bg-white rounded-lg shadow-sm">
                          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-2">
                            <AvatarImage src={`${participant.profileImage !== null ? participant.profileImage : `/placeholder.svg?height=32&width=32&text=${participant.userName.charAt(0)}`}`} />
                            <AvatarFallback>{`${participant.profileImage !== null ? participant.profileImage : `/placeholder.svg?height=32&width=32&text=${participant.userName.charAt(0)}`}`}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-xs sm:text-sm">{participant.userName}</p>
                          </div>
                        </div>
                      )) : 
                      <>
                      {/* 데스크탑인 경우 */}
                      <p className="hidden sm:block text-gray-700 text-sm sm:text-base whitespace-pre-line w-[500px]">아직 아무도 참여하지 않았어요. 첫 번째 참가자가 되어보세요!</p>

                      {/* 모바일인 경우 */}
                      <p className="block sm:hidden text-gray-700 text-sm sm:text-base whitespace-pre-line w-[500px]">아직 아무도 참여하지 않았어요. {"\n"} 첫 번째 참가자가 되어보세요!</p>
                      </>
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-xl">
            <CardHeader className="px-4 sm:px-6 pt-5 pb-2">
              <CardTitle className="text-lg sm:text-xl font-semibold">위치 정보</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pt-2">
              <div id="map" className="relative h-56 sm:h-64 bg-gray-200 rounded-lg overflow-hidden">
                <Map center={location ? {lat: location?.latitude, lng: location?.longitude } : {lat: 37.497930, lng: 127.027596 }}
                style={{ width: '100%', height: '100%' }}
                level={3}
                >
                  <MapMarker position={location ? {lat: location?.latitude, lng: location?.longitude } : {lat: 37.497930, lng: 127.027596 }}>
                  </MapMarker>
                </Map>
              </div>
              <div className="mt-4">
                <p className="font-medium text-sm sm:text-base">{matchDetail.facilityDataDto.facilityName}</p>
                <p className="text-gray-500 text-sm">{matchDetail.facilityDataDto.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="border-0 shadow-lg rounded-xl">
            <CardHeader className="px-4 sm:px-6 pt-5 pb-0">
              <CardTitle className="text-lg sm:text-xl font-semibold">문의 및 댓글</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pt-4">
              <form onSubmit={handleSubmitComment} className="mb-4 sm:mb-6">
                <Textarea
                  placeholder="댓글을 입력하세요..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-3 resize-none text-sm sm:text-base"
                  rows={3}
                />
                <Button type="submit" disabled={!comment.trim()}>
                  댓글 등록
                </Button>
              </form>

              <div className="space-y-3 sm:space-y-4">
                {match.comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4 text-sm sm:text-base">아직 댓글이 없습니다.</p>
                ) : (
                  match.comments.map((comment) => (
                    <div key={comment.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-2">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32&text=${comment.userName.charAt(0)}`}
                            />
                            <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium text-sm sm:text-base">{comment.userName}</p>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">{comment.createdAt}</p>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* 참가 신청 (데스크톱 화면에서만 표시) */}
        <div className="hidden lg:block">
          <Card className="sticky top-20 border-0 shadow-lg rounded-xl">
            <CardHeader className="px-6 pt-5 pb-0">
              <CardTitle className="text-xl font-semibold">참가 신청</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pt-5 space-y-5">
              <div className="rounded-lg bg-indigo-50 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 rounded-full p-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">참가 인원</p>
                    <p className="font-bold">
                      <span className={isMatchFull ? "text-red-500" : "text-green-500"}>
                        {matchDetail.playerCnt}
                      </span>
                      /{matchDetail.matchDataDto.teamCapacity} 팀
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">참가비</p>
                  <p className="font-bold text-indigo-700">{priceFormat(matchDetail.matchDataDto.matchPrice)}/인</p>
                </div>
              </div>

              <Separator />

              {
                (matchDetail.userDataDto !== null) ? 
                <div className="space-y-3">
                  <p className="font-medium">참가자 정보</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">이름</p>
                      <Input value={`${matchDetail.userDataDto.userName}`} disabled />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">연락처</p>
                      <Input value={matchDetail.userDataDto.phone} disabled />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">* 회원 정보에 등록된 정보로 자동 입력됩니다.</p>
                </div> : ""
              }

              {isMatchApplyBtn()}

              {/* <Button
                className="w-full py-6 text-lg font-bold"
                disabled={!canJoin || isJoining}
                onClick={requestPayment}
              >
                {isJoining
                ? "처리 중..."
                : "참가 신청하기"}
              </Button> */}

              {!canJoin && (
                <p className="text-center text-red-500 text-sm">모집이 마감되었습니다.</p>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <p>• 참가 신청 후 24시간 이내에 결제를 완료해주세요.</p>
                <p>• 매치 시작 24시간 전까지 취소 시 전액 환불됩니다.</p>
                <p>• 매치 시작 12시간 전까지 취소 시 50% 환불됩니다.</p>
                <p>• 그 이후에는 환불이 불가능합니다.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function formatMoney(price: number): string{
  
  return "";
}