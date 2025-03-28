"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

// 더미 데이터
const dummyMatches: Record<string, Match> = {
  "1": {
    id: "1",
    courtName: "코트 A",
    facilityName: "서울 테니스 센터",
    address: "서울시 강남구 테헤란로 123",
    sportType: "테니스",
    matchDate: "2025-03-28",
    matchTime: "18:00 - 20:00",
    teamCapacity: 4,
    currentTeams: 2,
    matchPrice: "15,000원",
    status: "모집중",
    description:
      "테니스를 좋아하는 분들과 함께 즐거운 시간을 보내고 싶습니다. 초보자도 환영합니다. 장비는 개인이 준비해주세요. 매치 후 간단한 식사 자리도 있을 예정입니다.",
    hostName: "김테니스",
    hostLevel: "중급",
    participants: [
      { id: "p1", name: "김테니스", level: "중급", joinedAt: "2025-03-15" },
      { id: "p2", name: "이라켓", level: "초급", joinedAt: "2025-03-16" },
    ],
    comments: [
      { id: "c1", userName: "박서브", content: "초보자도 참여 가능한가요?", createdAt: "2025-03-17" },
      { id: "c2", userName: "김테니스", content: "네, 초보자도 환영합니다! 편하게 오세요.", createdAt: "2025-03-17" },
    ],
  },
  "2": {
    id: "2",
    courtName: "실내 코트 1",
    facilityName: "강남 풋살장",
    address: "서울시 강남구 역삼동 456",
    sportType: "풋살",
    matchDate: "2025-03-29",
    matchTime: "19:00 - 21:00",
    teamCapacity: 6,
    currentTeams: 6,
    matchPrice: "20,000원",
    status: "모집완료",
    description:
      "6대6 풋살 매치입니다. 팀 단위로 신청 가능하며, 개인 참가자는 팀을 구성해 드립니다. 운동화는 실내용으로 준비해주세요.",
    hostName: "박골키퍼",
    hostLevel: "상급",
    participants: [
      { id: "p1", name: "박골키퍼", level: "상급", joinedAt: "2025-03-10" },
      { id: "p2", name: "김수비수", level: "중급", joinedAt: "2025-03-11" },
      { id: "p3", name: "이공격수", level: "상급", joinedAt: "2025-03-12" },
      { id: "p4", name: "최미드필더", level: "중급", joinedAt: "2025-03-13" },
      { id: "p5", name: "정윙어", level: "중급", joinedAt: "2025-03-14" },
      { id: "p6", name: "한스트라이커", level: "중급", joinedAt: "2025-03-15" },
    ],
    comments: [
      { id: "c1", userName: "축구매니아", content: "팀 유니폼 있나요?", createdAt: "2025-03-16" },
      { id: "c2", userName: "박골키퍼", content: "팀 조끼는 제공됩니다!", createdAt: "2025-03-16" },
      { id: "c3", userName: "풋살러", content: "주차 공간은 어떻게 되나요?", createdAt: "2025-03-17" },
      {
        id: "c4",
        userName: "박골키퍼",
        content: "시설 내 주차장 이용 가능합니다. 2시간 무료입니다.",
        createdAt: "2025-03-17",
      },
    ],
  },
  "3": {
    id: "3",
    courtName: "코트 B",
    facilityName: "종로 농구코트",
    address: "서울시 종로구 종로 789",
    sportType: "농구",
    matchDate: "2025-03-30",
    matchTime: "14:00 - 16:00",
    teamCapacity: 4,
    currentTeams: 1,
    matchPrice: "10,000원",
    status: "모집중",
    description:
      "3대3 농구 매치입니다. 농구를 좋아하는 분들과 함께 즐겁게 경기하고 싶습니다. 농구공은 제가 준비하겠습니다.",
    hostName: "최농구",
    hostLevel: "중급",
    participants: [{ id: "p1", name: "최농구", level: "중급", joinedAt: "2025-03-20" }],
    comments: [],
  },
  "4": {
    id: "4",
    courtName: "코트 2",
    facilityName: "한강 배드민턴장",
    address: "서울시 영등포구 여의도동 101",
    sportType: "배드민턴",
    matchDate: "2025-03-31",
    matchTime: "20:00 - 22:00",
    teamCapacity: 8,
    currentTeams: 5,
    matchPrice: "12,000원",
    status: "모집중",
    description: "배드민턴 복식 경기를 진행합니다. 라켓과 셔틀콕은 제공됩니다. 실내 운동화를 꼭 준비해주세요.",
    hostName: "이셔틀",
    hostLevel: "초급",
    participants: [
      { id: "p1", name: "이셔틀", level: "초급", joinedAt: "2025-03-18" },
      { id: "p2", name: "김라켓", level: "중급", joinedAt: "2025-03-19" },
      { id: "p3", name: "박스매시", level: "초급", joinedAt: "2025-03-20" },
      { id: "p4", name: "정드롭", level: "중급", joinedAt: "2025-03-21" },
      { id: "p5", name: "최클리어", level: "상급", joinedAt: "2025-03-22" },
    ],
    comments: [
      { id: "c1", userName: "배드민턴초보", content: "처음 치는데 참여 가능할까요?", createdAt: "2025-03-23" },
      {
        id: "c2",
        userName: "이셔틀",
        content: "네! 초보자도 환영합니다. 기본적인 룰만 알고 계시면 됩니다.",
        createdAt: "2025-03-23",
      },
    ],
  },
}

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [showMobileJoinPanel, setShowMobileJoinPanel] = useState(false)

  useEffect(() => {
    // 실제 구현에서는 API를 통해 매치 정보를 가져옵니다
    const fetchMatch = () => {
      setLoading(true)
      try {
        const matchData = dummyMatches[params.id]
        if (matchData) {
          setMatch(matchData)
        } else {
          // 매치가 없는 경우 처리
          router.push("/matches")
        }
      } catch (error) {
        console.error("Error fetching match:", error)
        toast({
          title: "오류 발생",
          description: "매치 정보를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMatch()
  }, [params.id, router])

  const handleJoinMatch = () => {
    if (!match) return

    setIsJoining(true)

    // 실제 구현에서는 API를 통해 참가 신청을 처리합니다
    setTimeout(() => {
      const updatedMatch = { ...match }
      updatedMatch.currentTeams += 1

      // 모집 완료 상태 체크
      if (updatedMatch.currentTeams >= updatedMatch.teamCapacity) {
        updatedMatch.status = "모집완료"
      }

      // 참가자 추가 (실제로는 로그인한 사용자 정보를 사용)
      updatedMatch.participants.push({
        id: `p${updatedMatch.participants.length + 1}`,
        name: "홍길동", // 로그인한 사용자 이름
        level: "초급", // 사용자 레벨
        joinedAt: new Date().toISOString().split("T")[0],
      })

      setMatch(updatedMatch)
      setIsJoining(false)

      toast({
        title: "참가 신청 완료",
        description: "매치 참가 신청이 완료되었습니다.",
      })
    }, 1000)
  }

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

  if (loading || !match) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg">매치 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  const isMatchFull = match.currentTeams >= match.teamCapacity
  const canJoin = match.status === "모집중" && !isMatchFull

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
                  {match.currentTeams}
                </span>
                <span className="text-gray-500 text-base">/{match.teamCapacity} 팀</span>
              </div>
              <p className="font-bold text-indigo-700 text-lg">{match.matchPrice}/인</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Button
              className="w-36 h-11 bg-indigo-600 hover:bg-indigo-700 font-medium"
              disabled={!canJoin || isJoining}
              onClick={handleJoinMatch}
            >
              {isJoining
                ? "처리 중..."
                : match.status === "모집완료"
                  ? "모집 완료"
                  : match.status === "진행중"
                    ? "진행 중"
                    : match.status === "종료"
                      ? "종료됨"
                      : "참가 신청하기"}
            </Button>
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
                  <p className="text-sm">{formatDate(match.matchDate)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">시간</p>
                  <p className="text-sm">{match.matchTime}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">참가 현황</p>
                  <p className="text-sm">
                    <span className={isMatchFull ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                      {match.currentTeams}
                    </span>
                    /{match.teamCapacity} 팀
                  </p>
                </div>
                <Separator />
                <p className="text-sm font-medium">참가자 정보</p>
                <div className="grid grid-cols-2 gap-2">
                  {match.participants.slice(0, 4).map((participant) => (
                    <div key={participant.id} className="flex items-center p-2 bg-white rounded-lg shadow-sm">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={`/placeholder.svg?height=24&width=24&text=${participant.name.charAt(0)}`} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-xs">{participant.name}</p>
                        <p className="text-xs text-gray-500">레벨: {participant.level}</p>
                      </div>
                    </div>
                  ))}
                  {match.participants.length > 4 && (
                    <div className="p-2 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <p className="text-xs text-gray-500">+{match.participants.length - 4}명 더 보기</p>
                    </div>
                  )}
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
                src={match.sportType === "테니스" 
                  ? "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1024"
                  : match.sportType === "풋살"
                  ? "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1024"
                  : match.sportType === "농구"
                  ? "https://images.unsplash.com/photo-1505666287802-931582b5ed56?q=80&w=1024"
                  : "https://images.unsplash.com/photo-1626224583764-f88b815bad2a?q=80&w=1024"
                }
                alt={`${match.sportType} 매치 이미지`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  className={`
                    px-3 py-1.5 text-sm font-medium
                    ${match.status === "모집중" ? "bg-green-500 text-white" : ""}
                    ${match.status === "모집완료" ? "bg-blue-500 text-white" : ""}
                    ${match.status === "진행중" ? "bg-yellow-500 text-white" : ""}
                    ${match.status === "종료" ? "bg-gray-500 text-white" : ""}
                  `}
                >
                  {match.status}
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {match.facilityName} - {match.sportType} 매치
                </h1>
                <p className="text-gray-200 mb-1">{match.courtName}</p>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-3">{formatDate(match.matchDate).split("요일")[0]}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{match.matchTime}</span>
                </div>
              </div>
            </div>

            <CardContent className="space-y-6 px-4 sm:px-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-indigo-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">날짜</p>
                    <p className="text-gray-500 text-sm sm:text-base">{formatDate(match.matchDate)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-indigo-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">시간</p>
                    <p className="text-gray-500 text-sm sm:text-base">{match.matchTime}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-indigo-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">위치</p>
                    <p className="text-gray-500 text-sm sm:text-base">{match.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-indigo-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">참가비</p>
                    <p className="text-gray-500 text-sm sm:text-base">{match.matchPrice}/인</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">매치 설명</h3>
                <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line">{match.description}</p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">주최자 정보</h3>
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 mr-3">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${match.hostName.charAt(0)}`} />
                    <AvatarFallback>{match.hostName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{match.hostName}</p>
                    <p className="text-xs sm:text-sm text-gray-500">레벨: {match.hostLevel}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-semibold">참가 현황</h3>
                  <Badge variant="outline" className="px-2 sm:px-3 py-1">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {match.currentTeams}/{match.teamCapacity} 팀
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {match.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center p-2 bg-white rounded-lg shadow-sm">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-2">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${participant.name.charAt(0)}`} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{participant.name}</p>
                        <p className="text-xs text-gray-500">레벨: {participant.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-xl">
            <CardHeader className="px-4 sm:px-6 pt-5 pb-2">
              <CardTitle className="text-lg sm:text-xl font-semibold">위치 정보</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pt-2">
              <div className="relative h-56 sm:h-64 bg-gray-200 rounded-lg overflow-hidden">
                <Image 
                  src="/placeholder.svg?height=300&width=600&text=지도" 
                  alt="지도" 
                  fill 
                  className="object-cover"
                  priority 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">지도 정보</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-medium text-sm sm:text-base">{match.facilityName}</p>
                <p className="text-gray-500 text-sm">{match.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-xl">
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
          </Card>
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
                        {match.currentTeams}
                      </span>
                      /{match.teamCapacity} 팀
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">참가비</p>
                  <p className="font-bold text-indigo-700">{match.matchPrice}/인</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="font-medium">참가자 정보</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">이름</p>
                    <Input placeholder="홍길동" disabled />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">연락처</p>
                    <Input placeholder="010-1234-5678" disabled />
                  </div>
                </div>
                <p className="text-xs text-gray-500">* 회원 정보에 등록된 정보로 자동 입력됩니다.</p>
              </div>

              <Button
                className="w-full py-6 text-lg font-bold"
                disabled={!canJoin || isJoining}
                onClick={handleJoinMatch}
              >
                {isJoining
                  ? "처리 중..."
                  : match.status === "모집완료"
                    ? "모집 완료"
                    : match.status === "진행중"
                      ? "진행 중"
                      : match.status === "종료"
                        ? "종료됨"
                        : "참가 신청하기"}
              </Button>

              {!canJoin && match.status === "모집중" && (
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

