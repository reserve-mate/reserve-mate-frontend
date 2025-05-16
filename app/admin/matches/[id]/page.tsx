"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Target, 
  User,
  DollarSign,
  MessageSquare,
  Check,
  X
} from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { matchService } from "@/lib/services/matchService"
import { AdminMatchDetail, displayMatchStatus, displaySportName, MatchStatusPost } from "@/lib/types/matchTypes"
import { MatchStatus, PlayerStatus, SportType } from "@/lib/enum/matchEnum"

// 더미 매치 데이터
const dummyMatches = [
  {
    id: "1",
    title: "주말 테니스 초보 매치",
    facilityName: "서울 테니스 센터",
    facilityId: "1",
    address: "서울시 강남구 테헤란로 123",
    courtName: "코트 A",
    sportType: "테니스",
    level: "초보",
    matchDate: "2025-03-28",
    matchTime: "18:00 - 20:00",
    startTime: "18:00",
    endTime: "20:00",
    currentParticipants: 6,
    maxParticipants: 8,
    participationFee: 10000,
    description: "테니스를 처음 시작하는 분들을 위한 매치입니다. 서로 기본 스트로크를 연습하며 즐겁게 진행하세요!",
    status: "모집중",
    participants: [
      { id: "user1", name: "홍길동", level: "초보", gender: "남성", joinedAt: "2025-03-15T14:30:00" },
      { id: "user2", name: "김철수", level: "초보", gender: "남성", joinedAt: "2025-03-16T10:15:00" },
      { id: "user3", name: "이영희", level: "초보", gender: "여성", joinedAt: "2025-03-17T09:45:00" },
      { id: "user4", name: "박지민", level: "초보", gender: "남성", joinedAt: "2025-03-17T11:20:00" },
      { id: "user5", name: "최수진", level: "초보", gender: "여성", joinedAt: "2025-03-18T16:30:00" },
      { id: "user6", name: "정민준", level: "초보", gender: "남성", joinedAt: "2025-03-19T13:10:00" }
    ]
  },
  {
    id: "2",
    title: "평일 저녁 풋살 매치",
    facilityName: "강남 풋살장",
    facilityId: "2",
    address: "서울시 강남구 역삼동 456",
    courtName: "실내 코트 1",
    sportType: "풋살",
    level: "중급",
    matchDate: "2025-03-29",
    matchTime: "19:00 - 21:00",
    startTime: "19:00",
    endTime: "21:00",
    currentParticipants: 10,
    maxParticipants: 10,
    participationFee: 15000,
    description: "5대5 풋살 매치입니다. 팀 조끼를 준비해드립니다. 운동화는 실내용을 준비해주세요.",
    status: "마감",
    participants: [
      { id: "user7", name: "김태훈", level: "중급", gender: "남성", joinedAt: "2025-03-15T14:30:00" },
      { id: "user8", name: "이준호", level: "중급", gender: "남성", joinedAt: "2025-03-16T10:15:00" },
      { id: "user9", name: "박서현", level: "중급", gender: "여성", joinedAt: "2025-03-17T09:45:00" },
      { id: "user10", name: "정미나", level: "중급", gender: "여성", joinedAt: "2025-03-17T11:20:00" },
      { id: "user11", name: "강동원", level: "중급", gender: "남성", joinedAt: "2025-03-18T16:30:00" },
      { id: "user12", name: "손흥민", level: "중급", gender: "남성", joinedAt: "2025-03-19T13:10:00" },
      { id: "user13", name: "황희찬", level: "중급", gender: "남성", joinedAt: "2025-03-20T15:45:00" },
      { id: "user14", name: "이강인", level: "중급", gender: "남성", joinedAt: "2025-03-21T14:10:00" },
      { id: "user15", name: "김민재", level: "중급", gender: "남성", joinedAt: "2025-03-21T16:30:00" },
      { id: "user16", name: "조규성", level: "중급", gender: "남성", joinedAt: "2025-03-22T10:15:00" }
    ]
  }
]

// 상태별 배지 색상
const statusColors: Record<MatchStatus, string> = {
  "APPLICABLE": "bg-green-100 text-green-800 border-green-200",
  "FINISH": "bg-red-100 text-red-800 border-red-200",
  "CLOSE_TO_DEADLINE": "bg-blue-100 text-blue-800 border-blue-200",
  "END": "bg-gray-100 text-gray-800 border-gray-200",
  "ONGOING" : "bg-orange-100 text-orange-800 border-orange-200",
  "CANCELLED" : "bg-purple-100 text-purple-800 border-purple-200"
}

export default function MatchDetailPage({ params }: { params: { id: number } }) {
  const router = useRouter()
  const matchId = params.id
  const [match, setMatch] = useState<AdminMatchDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isKickDialogOpen, setIsKickDialogOpen] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null)
  
  const getAdminMatch = async () => {
    try {
      // 실제로는 API에서 데이터를 가져옴
      const foundMatch = await matchService.getAdminMatch(params.id);
      
      if (foundMatch) {
        setMatch(foundMatch)
      } else {
        toast({
          title: "매치 정보 없음",
          description: "해당 매치 정보를 찾을 수 없습니다.",
          variant: "destructive"
        })
        router.push("/admin/matches")
      }
    } catch (error) {
      toast({
        title: "매치 정보 조회 실패",
        description: "매치 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  } 

  // 매치 정보 조회 (더미 데이터 사용)
  useEffect(() => {
    setIsLoading(true)
    getAdminMatch();
  }, [matchId, router])

  // 매치 상태 변경
  const handleStatusChange = async (newStatus: MatchStatus) => {
    if (!match) return

    const matchStatus: MatchStatusPost = {
      matchStatus: newStatus
    }

    try {
      // 실제로는 API 호출
      await matchService.updateMatchStat({
        matchId: params.id,
        matchStatus: matchStatus
      });
      setMatch({
        ...match,
        matchStatus: newStatus
      })
      
      toast({
        title: "매치 상태 변경 완료",
        description: `매치 상태가 "${displayMatchStatus(newStatus)}"(으)로 변경되었습니다.`
      })
    } catch (error: any) {
      toast({
        title: "상태 변경 실패",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // 매치 삭제
  const handleDelete = async() => {
    try {
      // 실제로는 API 호출
      await matchService.deleteMatch(params.id);

      toast({
        title: "매치 삭제 완료",
        description: "매치가 성공적으로 삭제되었습니다."
      })
      router.push("/admin/matches")
    } catch (error) {
      toast({
        title: "매치 삭제 실패",
        description: "매치 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  // 참가자 강제 퇴장
  const handleKickParticipant = () => {
    if (!match || !selectedParticipant) return

    try {
      // 실제로는 API 호출
      const updatedParticipants = match.adminPlayers.filter(
        (p: any) => p.id !== selectedParticipant
      )
      
      setMatch({
        ...match,
        adminPlayers: updatedParticipants,
        //currentParticipants: updatedParticipants.length
      })
      
      toast({
        title: "참가자 제외 완료",
        description: "해당 참가자가 매치에서 제외되었습니다."
      })
      
      setIsKickDialogOpen(false)
      setSelectedParticipant(null)
    } catch (error) {
      toast({
        title: "참가자 제외 실패",
        description: "참가자 제외 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  // 로딩 UI
  if (isLoading) {
    return (
      <div className="container p-4">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-500">매치 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  // 매치 정보 없을 때 UI
  if (!match) {
    return (
      <div className="container p-4">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <p className="text-lg font-medium">매치 정보를 찾을 수 없습니다.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/matches">매치 목록으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-8 gap-2">
        <Button variant="ghost" asChild className="w-full sm:w-auto sm:mr-4 justify-start">
          <Link href="/admin/matches">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Link>
        </Button>
        <div className="flex items-center mt-2 sm:mt-0">
          <h1 className="text-xl sm:text-2xl font-bold">{match.matchTitle}</h1>
          <Badge className={`ml-2 ${statusColors[match.matchStatus]}`}>
            {displayMatchStatus(match.matchStatus)}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:w-fit">
          <TabsTrigger value="overview">기본 정보</TabsTrigger>
          <TabsTrigger value="participants">참가자 ({match.adminPlayers.length}/{match.teamCapacity})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">매치 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Target className="h-4 w-4 mr-2 text-indigo-500" />
                    종목
                  </div>
                  <p>{displaySportName(match.sportType)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                    시설 / 코트
                  </div>
                  <p>{match.facilityName} / {match.facilityCourt}</p>
                  <p className="text-sm text-gray-500">{match.address}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                    날짜
                  </div>
                  <p>{match.matchDate}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                    시간
                  </div>
                  <p>{`${match.matchTime}:00-${match.endTime}:00`}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2 text-indigo-500" />
                    참가 인원
                  </div>
                  <p>{match.adminPlayers.length} / {match.teamCapacity}명</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
                    참가비
                  </div>
                  <p>{match.matchPrice.toLocaleString()}원</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
                  매치 설명
                </div>
                <p className="text-sm whitespace-pre-line">{match.description}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-wrap justify-end gap-2">
              {(match.matchStatus === MatchStatus.CLOSE_TO_DEADLINE && ((match.adminPlayers.length + 1) >= (match.teamCapacity / 2))) && (
                <Button 
                  variant="outline"
                  className="border-amber-200 text-amber-600 hover:bg-amber-50"
                  onClick={() => handleStatusChange(MatchStatus.FINISH)}
                >
                  모집 마감
                </Button>
              )}
              
              {match.matchStatus === MatchStatus.FINISH && ( // 모집 마감한 경우
                <>
                {((match.adminPlayers.length !== match.teamCapacity) && (match.adminPlayers.length + 1) >= (match.teamCapacity / 2)) && (
                  <Button 
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                    onClick={() => handleStatusChange(MatchStatus.CLOSE_TO_DEADLINE)}
                  >
                    재모집
                  </Button>
                )}
                  <Button 
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleStatusChange(MatchStatus.ONGOING)}
                  >
                    진행 상태로 변경
                  </Button>
                </>
              )}
              
              {match.matchStatus === MatchStatus.ONGOING && ( // 진행 중인 경우 매치 종료 버튼 활성화
                <Button 
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleStatusChange(MatchStatus.END)}
                >
                  매치 종료
                </Button>
              )}
              
              <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <Link href={`/admin/matches/edit/${match.matchId}`}>
                  수정
                </Link>
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                매취 취소
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">참가자 목록</CardTitle>
            </CardHeader>
            <CardContent>
              {match.adminPlayers && match.adminPlayers.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>참가자</TableHead>
                        <TableHead>전화번호</TableHead>
                        <TableHead>참가일</TableHead>
                        {(match.matchStatus === MatchStatus.ONGOING || match.matchStatus === MatchStatus.END) && 
                        (
                          <>
                            <TableHead>상태</TableHead>
                            <TableHead>퇴장사유</TableHead>
                            {(match.matchStatus === MatchStatus.ONGOING) && (
                              <TableHead className="text-right">관리</TableHead>
                            )}
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {match.adminPlayers.map((participant) => (
                        <TableRow key={participant.payerId}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {participant.userName.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{participant.userName}</div>
                                <div className="text-xs text-gray-500">{participant.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{participant.phone}</TableCell>
                          <TableCell>
                            {participant.joinDate}
                          </TableCell>
                          {(match.matchStatus === MatchStatus.ONGOING || match.matchStatus === MatchStatus.END) 
                          && (
                            <>
                              <TableCell>{participant.playerStatus}</TableCell>
                              <TableCell>{participant.ejectReason}</TableCell>
                              {(match.matchStatus === MatchStatus.ONGOING && participant.playerStatus === PlayerStatus.ONGOING) && (
                                <TableCell className="text-right">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => {
                                      setSelectedParticipant(String(participant.payerId))
                                      setIsKickDialogOpen(true)
                                    }}
                                  >
                                    퇴장
                                  </Button>
                                </TableCell>
                              )}
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  참가자가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 매치 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>매치 취소</AlertDialogTitle>
            <AlertDialogDescription>
              매치를 정말 취소하시겠습니까? 취소 시, 모든 참가자에게 참가비가 환불됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>돌아가기</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              매치 취소
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 참가자 강제 퇴장 확인 다이얼로그 */}
      <AlertDialog open={isKickDialogOpen} onOpenChange={setIsKickDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>참가자 퇴장</AlertDialogTitle>
            <AlertDialogDescription>
              정말 이 참가자를 매치에서 퇴장시키겠습니까?
              참가자에게 자동으로 알림이 발송됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleKickParticipant} className="bg-red-600 hover:bg-red-700">
              퇴장
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 