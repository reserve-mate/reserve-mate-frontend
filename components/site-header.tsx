"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  User, 
  Menu, 
  Search, 
  Home, 
  Map, 
  Users, 
  Calendar, 
  Settings, 
  HelpCircle, 
  Info,
  CreditCard,
  Bookmark,
  Zap,
  Trophy
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { userService } from "@/lib/services/userService"

export function SiteHeader() {
  const router = useRouter();
  // 로그인 상태를 useState로 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // 현재 경로 확인
  const pathname = usePathname()

  // 초기 로드 시 로컬 스토리지에서 로그인 상태 확인
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    const adminStatus = localStorage.getItem('isAdmin')
    console.log("site-header"+loggedInStatus);
    setIsLoggedIn(loggedInStatus === 'true')
    setIsAdmin(adminStatus === 'true')
  }, [])
  
  // 로그인 상태가 변경될 때 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString())
  }, [isLoggedIn])
  
  // 링크가 현재 경로와 일치하는지 확인하는 함수
  const isActive = (path: string) => {
    return pathname === path
  }

  // 로그인/로그아웃 처리
  const handleLogin = () => {
    setIsLoggedIn(true)
    // 테스트를 위해 관리자 권한도 부여
    setIsAdmin(true)
    localStorage.setItem('isAdmin', 'true')
    toast({
      title: "로그인 성공",
      description: "환영합니다! 관리자 권한으로 로그인했습니다.",
    })
  }
  const handleLogout = async () => {
    try {
      await userService.logout();
      setIsLoggedIn(false)
      setIsAdmin(false)
      localStorage.removeItem("accessToken");
      localStorage.setItem('isAdmin', 'false')

      toast({
        title: "로그아웃 완료",
        description: "성공적으로 로그아웃되었습니다.",
      });  
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        description: "서버와 통신 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
    
  }

  // 예약 목록 이동
  const goListPage = async (state: string, link: string) => {
    sessionStorage.removeItem(state)
    await Promise.resolve();
    router.push(link);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-14 items-center justify-between max-w-6xl mx-auto px-2 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center pl-0">
            <span className="text-xl font-bold text-indigo-600">ReserveMate</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm ml-8">
            <Link href="/facilities" className={`font-medium transition-colors hover:text-indigo-600 ${isActive("/facilities") ? "font-bold text-indigo-600" : ""}`}>
              시설 찾기
            </Link>
            <button onClick={() => goListPage("matches-state", "/matches")} className={`font-medium transition-colors hover:text-indigo-600 ${isActive("/matches") ? "font-bold text-indigo-600" : ""}`}>
              소셜 매치
            </button>
          </nav>
        </div>
        
        {/* 모바일 탑 네비게이션 */}
        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex text-gray-700 hover:text-indigo-600"
                onClick={handleLogin}
              >
                로그인 테스트
              </Button>
              <Button asChild size="sm" className="hidden md:flex primary-button bg-indigo-600 text-white hover:bg-indigo-700">
                <Link href="/signup">회원가입</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden md:flex">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">프로필</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="w-full text-left" onClick={() => goListPage("reservations-list-state", "/reservations")}>예약 내역</button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="w-full text-left" onClick={() => goListPage("payments-status", "/payments")}>결제 내역</button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="w-full text-left" onClick={() => goListPage("match-history-state", "/matches/history")}>매치 이용내역</button>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        관리자 모드
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu" className="ml-1 p-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[300px] p-0">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <h2 className="text-xl font-bold mb-2">ReserveMate</h2>
                <p className="text-sm opacity-80">스포츠 시설 예약을 더 쉽게</p>
              </div>
              
              <nav className="p-6">
                <div className="grid gap-6">
                  {isLoggedIn ? (
                    <>                      
                      <Link href="/profile" className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-indigo-600">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>내 프로필</span>
                      </Link>
                      <Link href="/reservations" className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-indigo-600">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>예약 내역</span>
                      </Link>
                      <Link href="/payments" className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-indigo-600">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <span>결제 내역</span>
                      </Link>
                      <Link href="/matches/history" className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-indigo-600">
                        <Trophy className="w-5 h-5 text-gray-400" />
                        <span>매치 이용내역</span>
                      </Link>
                      {isAdmin && (
                        <Link href="/admin/dashboard" className="flex items-center gap-3 text-base font-medium text-indigo-600 hover:text-indigo-800">
                          <Settings className="w-5 h-5 text-indigo-500" />
                          <span>관리자 모드</span>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link href="/facilities/popular" className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-indigo-600">
                        <Zap className="w-5 h-5 text-gray-400" />
                        <span>인기 시설</span>
                      </Link>
                      <Link href="/matches/popular" className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-indigo-600">
                        <Trophy className="w-5 h-5 text-gray-400" />
                        <span>추천 매치</span>
                      </Link>
                    </>
                  )}
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  {!isLoggedIn ? (
                    <div className="grid gap-4">
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                        onClick={handleLogin}
                      >
                        로그인 테스트
                      </Button>
                      <Button asChild variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                        <Link href="/signup">회원가입</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        로그아웃
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* 모바일 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
        <div className="grid h-full grid-cols-3">
          <Link 
            href="/" 
            className={`flex flex-col items-center justify-center ${isActive("/") ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">홈</span>
          </Link>
          <Link 
            href="/facilities" 
            className={`flex flex-col items-center justify-center ${isActive("/facilities") ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
          >
            <Map className="w-6 h-6" />
            <span className="text-xs mt-1">시설</span>
          </Link>
          <Link 
            href="/matches" 
            className={`flex flex-col items-center justify-center ${isActive("/matches") ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">매치</span>
          </Link>
        </div>
      </div>
      
      {/* 모바일 하단 네비게이션용 여백 */}
      <div className="h-16 md:hidden"></div>
    </header>
  )
}

