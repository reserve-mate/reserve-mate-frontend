"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { PlusCircle, UserPlus, Trash2 } from "lucide-react"

// 관리자 타입 정의
type FacilityManager = {
  id: number;
  username: string;
  email: string;
  facilityId: number;
}

// 더미 데이터
const dummyManagers: { [key: string]: FacilityManager[] } = {
  "1": [
    { id: 101, username: "김테니스", email: "tennis1@example.com", facilityId: 1 },
    { id: 102, username: "이테니스", email: "tennis2@example.com", facilityId: 1 }
  ],
  "2": [
    { id: 103, username: "박풋살", email: "futsal1@example.com", facilityId: 2 },
  ],
  "3": [
    { id: 104, username: "최농구", email: "basketball@example.com", facilityId: 3 },
    { id: 105, username: "정농구", email: "basketball2@example.com", facilityId: 3 }
  ],
  "4": [
    { id: 106, username: "강배드민턴", email: "badminton@example.com", facilityId: 4 }
  ]
};

type FacilityManagersProps = {
  facilityId: number;
  facilityName: string;
}

export default function FacilityManagers({ facilityId, facilityName }: FacilityManagersProps) {
  const [managers, setManagers] = useState<FacilityManager[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newManager, setNewManager] = useState({
    username: "",
    email: "",
    password: "",
  })

  // 시설 관리자 목록 조회
  const fetchManagers = async () => {
    setIsLoading(true)
    try {
      // 실제로는 API에서 데이터를 가져옴
      // 여기서는 더미 데이터 사용
      setTimeout(() => {
        const facilityIdStr = facilityId.toString();
        setManagers(dummyManagers[facilityIdStr] || []);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      toast({
        title: "관리자 목록 조회 실패",
        description: "관리자 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  // 관리자 정보 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewManager((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 관리자 생성 처리
  const handleCreateManager = async () => {
    try {
      if (!newManager.username || !newManager.email || !newManager.password) {
        throw new Error("모든 필수 정보를 입력해주세요.")
      }

      setIsLoading(true)
      
      // 실제로는 API 호출
      // 여기서는 더미 데이터 업데이트
      const newManagerId = Math.floor(Math.random() * 1000) + 200;
      const createdManager = {
        id: newManagerId,
        username: newManager.username,
        email: newManager.email,
        facilityId: facilityId
      };
      
      // 더미 데이터에 추가 (실제로는 API에서 처리)
      const facilityIdStr = facilityId.toString();
      if (!dummyManagers[facilityIdStr]) {
        dummyManagers[facilityIdStr] = [];
      }
      dummyManagers[facilityIdStr].push(createdManager);
      
      toast({
        title: "관리자 생성 완료",
        description: "시설 관리자가 성공적으로 생성되었습니다."
      })
      
      // 목록 갱신 및 폼 초기화
      await fetchManagers()
      setNewManager({
        username: "",
        email: "",
        password: "",
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast({
        title: "관리자 생성 실패",
        description: error instanceof Error ? error.message : "관리자 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 관리자 삭제 처리
  const handleDeleteManager = async (managerId: number) => {
    if (!confirm("정말로 이 관리자를 삭제하시겠습니까?")) {
      return
    }

    try {
      setIsLoading(true)
      
      // 실제로는 API 호출
      // 여기서는 더미 데이터 업데이트
      const facilityIdStr = facilityId.toString();
      if (dummyManagers[facilityIdStr]) {
        dummyManagers[facilityIdStr] = dummyManagers[facilityIdStr].filter(
          manager => manager.id !== managerId
        );
      }
      
      toast({
        title: "관리자 삭제 완료",
        description: "관리자가 성공적으로 삭제되었습니다."
      })
      
      // 목록 갱신
      await fetchManagers()
    } catch (error) {
      toast({
        title: "관리자 삭제 실패",
        description: "관리자 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 컴포넌트 마운트 시 관리자 목록 조회
  useEffect(() => {
    fetchManagers()
  }, [facilityId])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4">
        <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-0">시설 관리자</CardTitle>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              관리자 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md w-[calc(100%-2rem)]">
            <DialogHeader>
              <DialogTitle>시설 관리자 추가</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">사용자 이름</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="사용자 이름"
                  value={newManager.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일"
                  value={newManager.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                  value={newManager.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">취소</Button>
              </DialogClose>
              <Button onClick={handleCreateManager} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "처리 중..." : "관리자 생성"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {managers.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm sm:text-base">
            {isLoading ? "로딩 중..." : "현재 등록된 관리자가 없습니다."}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">이름</TableHead>
                  <TableHead className="text-xs sm:text-sm">이메일</TableHead>
                  <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-4">{manager.username}</TableCell>
                    <TableCell className="text-xs sm:text-sm py-2 sm:py-4 break-all">{manager.email}</TableCell>
                    <TableCell className="py-2 sm:py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteManager(manager.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs sm:text-sm text-gray-500 p-4">
        <p>
          관리자는 해당 시설의 예약 및 코트 관리 권한을 갖습니다.
        </p>
      </CardFooter>
    </Card>
  )
} 