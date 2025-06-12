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
import { MiniModal } from "@/components/ui/mini-modal"
import { matchService } from "@/lib/services/matchService"
import { AdminMatchDetail, AdminPlayer, displayEjectReason, displayMatchStatus, displayPlayerStatus, displaySportName, MatchStatusPost } from "@/lib/types/matchTypes"

import { MatchStatus, PlayerStatus, SportType, RemovalReason } from "@/lib/enum/matchEnum"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { matchPlayerService } from "@/lib/services/matchplayerService"

// 상태별 배지 색상
const statusColors: Record<MatchStatus, string> = {
  "APPLICABLE": "bg-green-100 text-green-800 border-green-200",
  "FINISH": "bg-red-100 text-red-800 border-red-200",
  "CLOSE_TO_DEADLINE": "bg-blue-100 text-blue-800 border-blue-200",
  "END": "bg-gray-100 text-gray-800 border-gray-200",
  "ONGOING" : "bg-orange-100 text-orange-800 border-orange-200",
  "CANCELLED" : "bg-purple-100 text-purple-800 border-purple-200"
}

// 퇴장 사유 표시 함수
const displayRemovalReason = (reason: RemovalReason): string => {
  const reasons = {
    [RemovalReason.LATE]: "지각",
    [RemovalReason.ABUSIVE_BEHAVIOR]: "폭언/비매너",
    [RemovalReason.SERIOUS_RULE_VIOLATION]: "심각한 룰위반"
  }
  return reasons[reason] || "기타"
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
  const [selectedRemovalReason, setSelectedRemovalReason] = useState<RemovalReason>(RemovalReason.LATE)
  const [isEditing, setIsEditing] = useState(false)
  
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
  const handleKickParticipant = async () => {
    if (!match || !selectedParticipant) return

    try {
      const updatePlayers = match.adminPlayers
      .map(
        (player: AdminPlayer) => {
          if(player.payerId === parseInt(selectedParticipant)) {
            return {
              ...player
              , playerStatus: PlayerStatus.KICKED
              , ejectReason: selectedRemovalReason
            }
          }
          return player;
        }
      );

      const ejectParam = {
        playerId: parseInt(selectedParticipant),
        ejectRequest: selectedRemovalReason,
        facilityId: match.facilityId
      };
      // 여기서 API를 호출하는 코드가 실제로 구현될 때, 퇴장 사유도 함께 전달
      await matchPlayerService.ejectPlayer(ejectParam);
      
      setMatch({
        ...match,
        adminPlayers: updatePlayers,
      })
      
      toast({
        title: "참가자 제외 완료",
        description: `퇴장 사유: ${displayRemovalReason(selectedRemovalReason)} - 해당 참가자가 매치에서 제외되었습니다.`
      })
      
      setIsKickDialogOpen(false)
      setSelectedParticipant(null)
    } catch (error: any) {
      let errorMsg = "참가자 제외 중 오류가 발생했습니다.";
      if(error.message) {
        errorMsg = error.message;
      }
      toast({
        title: "참가자 제외 실패",
        description: errorMsg,
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

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2 text-indigo-500" />
                    매니저
                  </div>
                  <p>{match.managerName}</p>
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
                  {/* <Button 
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleStatusChange(MatchStatus.ONGOING)}
                  >
                    진행 상태로 변경
                  </Button> */}
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
              
              {
                (match.matchStatus === MatchStatus.APPLICABLE || match.matchStatus === MatchStatus.CLOSE_TO_DEADLINE || match.matchStatus === MatchStatus.FINISH)
                && 
                (
                  <Button asChild variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    <Link href={`/admin/matches/${match.matchId}/edit`}>
                      수정
                    </Link>
                  </Button>
                )
              }
              
              {
                (match.matchStatus === MatchStatus.APPLICABLE || (match.matchStatus === MatchStatus.CLOSE_TO_DEADLINE && match.adminPlayers.length < (match.teamCapacity / 2)))
                &&
                (
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    매치 취소
                  </Button>
                )
              }
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
                              <TableCell>{displayPlayerStatus(participant.playerStatus)}</TableCell>
                              <TableCell>{displayEjectReason(participant.ejectReason)}</TableCell>
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
      <MiniModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="매치 취소"
        description="매치를 정말 취소하시겠습니까? 취소 시, 모든 참가자에게 참가비가 환불됩니다."
        footerContent={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="h-8 text-sm"
            >
              돌아가기
            </Button>
            <Button 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700 h-8 text-sm"
            >
              매치 취소
            </Button>
          </>
        }
      />
      
      {/* 참가자 강제 퇴장 확인 다이얼로그 */}
      <MiniModal 
        isOpen={isKickDialogOpen}
        onClose={() => setIsKickDialogOpen(false)}
        title="참가자 퇴장"
        description="참가자를 매치에서 퇴장시키려면 사유를 선택하세요."
        footerContent={
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs px-3 py-0" 
              onClick={() => setIsKickDialogOpen(false)}
            >
              취소
            </Button>
            <Button 
              onClick={handleKickParticipant} 
              className="bg-red-600 hover:bg-red-700 h-7 text-xs px-3 py-0"
            >
              퇴장
            </Button>
          </>
        }
      >
        <RadioGroup 
          value={selectedRemovalReason} 
          onValueChange={(value) => setSelectedRemovalReason(value as RemovalReason)}
          className="space-y-0.5"
        >
          <div className="flex items-center space-x-2 h-5">
            <RadioGroupItem value={RemovalReason.LATE} id="late" className="h-3.5 w-3.5" />
            <Label htmlFor="late" className="text-xs">지각</Label>
          </div>
          <div className="flex items-center space-x-2 h-5">
            <RadioGroupItem value={RemovalReason.ABUSIVE_BEHAVIOR} id="abusive" className="h-3.5 w-3.5" />
            <Label htmlFor="abusive" className="text-xs">폭언/비매너</Label>
          </div>
          <div className="flex items-center space-x-2 h-5">
            <RadioGroupItem value={RemovalReason.SERIOUS_RULE_VIOLATION} id="rule-violation" className="h-3.5 w-3.5" />
            <Label htmlFor="rule-violation" className="text-xs">심각한 룰위반</Label>
          </div>
        </RadioGroup>
      </MiniModal>
    </div>
  )
} 