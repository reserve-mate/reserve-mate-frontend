"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Calendar, 
  Settings, 
  CreditCard,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(true)

  // 관리자 권한 체크
  useEffect(() => {
    // 개발 테스트를 위해 인증 체크 일시적으로 비활성화
    // 실제 배포 시에는 아래 주석을 해제하고 이 줄을 삭제하세요
    setIsAdmin(true); // 개발 중에는 항상 관리자 권한 부여
    return; // 아래 코드는 실행하지 않음

    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const admin = localStorage.getItem('isAdmin') === 'true'
    
    if (!loggedIn || !admin) {
      toast({
        title: "접근 권한이 없습니다",
        description: "관리자 페이지는 관리자만 접근할 수 있습니다.",
        variant: "destructive",
      })
      router.push('/')
      return
    }
    
    setIsAdmin(true)
  }, [router])

  // 메뉴 토글
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // 관리자 권한이 없으면 내용 표시하지 않음
  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <div className={`bg-white shadow-md ${menuOpen ? 'w-64' : 'w-20'} transition-all duration-300 overflow-hidden`}>
        <div className="p-6 pb-4 flex items-center justify-between">
          <h2 className={`font-bold text-xl text-indigo-600 ${!menuOpen && 'hidden'}`}>
            관리자 모드
          </h2>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {menuOpen ? (
              <ChevronLeft className="h-6 w-6" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        <nav className="mt-2">
          <ul className="space-y-2 px-4">
            <li>
              <Link 
                href="/admin/dashboard" 
                className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                <span className={`${!menuOpen && 'hidden'}`}>대시보드</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/facilities" 
                className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              >
                <Building className="h-5 w-5 mr-3" />
                <span className={`${!menuOpen && 'hidden'}`}>시설 관리</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/matches" 
                className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              >
                <Calendar className="h-5 w-5 mr-3" />
                <span className={`${!menuOpen && 'hidden'}`}>매치 관리</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/users" 
                className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              >
                <Users className="h-5 w-5 mr-3" />
                <span className={`${!menuOpen && 'hidden'}`}>사용자 관리</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/reservations" 
                className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              >
                <CreditCard className="h-5 w-5 mr-3" />
                <span className={`${!menuOpen && 'hidden'}`}>예약 관리</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/settings" 
                className="flex items-center p-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
              >
                <Settings className="h-5 w-5 mr-3" />
                <span className={`${!menuOpen && 'hidden'}`}>설정</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 ${!menuOpen && 'justify-center'}`}
            onClick={() => router.push('/')}
          >
            <LogOut className="h-5 w-5 mr-3" />
            {menuOpen && <span>나가기</span>}
          </Button>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="container py-8">
          {children}
        </div>
      </div>
    </div>
  )
}

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
) 