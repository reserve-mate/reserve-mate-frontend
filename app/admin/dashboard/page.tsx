"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, DollarSign, Users } from "lucide-react"

export default function AdminDashboardPage() {
  // 더미 데이터
  const stats = {
    totalReservations: 245,
    activeUsers: 120,
    totalRevenue: "4,850,000원",
    facilitiesCount: 15,
  }

  const recentReservations = [
    {
      id: "1",
      user: "김철수",
      facility: "서울 테니스 센터",
      court: "코트 A",
      date: "2025-03-28",
      time: "18:00 - 20:00",
      status: "확정",
      amount: "40,000원",
    },
    {
      id: "2",
      user: "이영희",
      facility: "강남 풋살장",
      court: "실내 코트 1",
      date: "2025-03-29",
      time: "19:00 - 21:00",
      status: "대기중",
      amount: "60,000원",
    },
    {
      id: "3",
      user: "박지민",
      facility: "종로 농구코트",
      court: "코트 B",
      date: "2025-03-30",
      time: "14:00 - 16:00",
      status: "확정",
      amount: "30,000원",
    },
    {
      id: "4",
      user: "최수진",
      facility: "한강 배드민턴장",
      court: "코트 2",
      date: "2025-03-31",
      time: "20:00 - 22:00",
      status: "취소",
      amount: "20,000원",
    },
  ]

  const users = [
    {
      id: "1",
      name: "김철수",
      email: "kim@example.com",
      phone: "010-1234-5678",
      registeredDate: "2025-01-15",
      reservationsCount: 8,
    },
    {
      id: "2",
      name: "이영희",
      email: "lee@example.com",
      phone: "010-2345-6789",
      registeredDate: "2025-02-10",
      reservationsCount: 5,
    },
    {
      id: "3",
      name: "박지민",
      email: "park@example.com",
      phone: "010-3456-7890",
      registeredDate: "2025-02-20",
      reservationsCount: 3,
    },
    {
      id: "4",
      name: "최수진",
      email: "choi@example.com",
      phone: "010-4567-8901",
      registeredDate: "2025-03-05",
      reservationsCount: 2,
    },
  ]

  const facilities = [
    {
      id: "1",
      name: "서울 테니스 센터",
      address: "서울시 강남구 테헤란로 123",
      sportType: "테니스",
      courtsCount: 4,
      reservationsCount: 120,
    },
    {
      id: "2",
      name: "강남 풋살장",
      address: "서울시 강남구 역삼동 456",
      sportType: "풋살",
      courtsCount: 2,
      reservationsCount: 85,
    },
    {
      id: "3",
      name: "종로 농구코트",
      address: "서울시 종로구 종로 789",
      sportType: "농구",
      courtsCount: 3,
      reservationsCount: 65,
    },
    {
      id: "4",
      name: "한강 배드민턴장",
      address: "서울시 영등포구 여의도동 101",
      sportType: "배드민턴",
      courtsCount: 6,
      reservationsCount: 95,
    },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">총 예약 수</p>
              <p className="text-3xl font-bold">{stats.totalReservations}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">활성 사용자</p>
              <p className="text-3xl font-bold">{stats.activeUsers}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">총 매출</p>
              <p className="text-3xl font-bold">{stats.totalRevenue}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">등록된 시설</p>
              <p className="text-3xl font-bold">{stats.facilitiesCount}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 예약 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>최근 예약</CardTitle>
          <CardDescription>최근에 등록된 예약 내역입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>사용자</TableHead>
                <TableHead>시설</TableHead>
                <TableHead>날짜</TableHead>
                <TableHead>시간</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>금액</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.id}</TableCell>
                  <TableCell>{reservation.user}</TableCell>
                  <TableCell>{reservation.facility}</TableCell>
                  <TableCell>{reservation.date}</TableCell>
                  <TableCell>{reservation.time}</TableCell>
                  <TableCell>
                    <Badge
                      className={`
                        ${reservation.status === "확정" ? "bg-green-100 text-green-800" : ""}
                        ${reservation.status === "대기중" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${reservation.status === "취소" ? "bg-gray-100 text-gray-800" : ""}
                      `}
                    >
                      {reservation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{reservation.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      상세
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 탭 콘텐츠 */}
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">사용자 관리</TabsTrigger>
          <TabsTrigger value="facilities">시설 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>사용자 목록</CardTitle>
              <CardDescription>등록된 사용자 목록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>전화번호</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>예약 수</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.registeredDate}</TableCell>
                      <TableCell>{user.reservationsCount}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>시설 목록</CardTitle>
              <CardDescription>등록된 시설 목록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>시설명</TableHead>
                    <TableHead>주소</TableHead>
                    <TableHead>스포츠 종류</TableHead>
                    <TableHead>코트 수</TableHead>
                    <TableHead>예약 수</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.id}</TableCell>
                      <TableCell>{facility.name}</TableCell>
                      <TableCell>{facility.address}</TableCell>
                      <TableCell>{facility.sportType}</TableCell>
                      <TableCell>{facility.courtsCount}</TableCell>
                      <TableCell>{facility.reservationsCount}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

