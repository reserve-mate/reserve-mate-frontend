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
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { AdminHeader } from "@/components/admin-header"
import AdminFooter from "@/components/admin-footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // 화면 크기에 따라 메뉴 상태 관리
  useEffect(() => {
    // 초기 로드 시 데스크톱인 경우 메뉴 열기
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };

    // 초기 로드 시 크기 확인
    handleResize();

    // 화면 크기 변경 리스너 추가
    window.addEventListener('resize', handleResize);
    
    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('isAdmin')
    router.push('/')
    toast({
      title: "로그아웃 성공",
      description: "일반 사용자 페이지로 돌아갑니다.",
    })
  }

  // 관리자 권한이 없으면 내용 표시하지 않음
  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 사이드바 */}
      <aside 
        className={`bg-slate-800 text-white shadow-lg transition-all duration-300 ease-in-out 
          ${menuOpen 
            ? 'w-[240px] translate-x-0' 
            : 'w-0 md:w-16 -translate-x-full md:translate-x-0'
          } h-full fixed md:relative z-30 flex flex-col ${!menuOpen && 'invisible md:visible'}`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-700">
          <h2 className={`font-bold text-lg text-indigo-300 transition-opacity duration-200 ${!menuOpen ? 'opacity-0 invisible' : 'opacity-100'}`}>
            관리자 모드
          </h2>
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-slate-300 hover:text-white hover:bg-slate-700">
            {menuOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            <li>
              <Link 
                href="/admin/dashboard" 
                className="flex items-center px-3 py-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                onClick={() => window.innerWidth < 768 && setMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5 shrink-0" style={{ marginLeft: !menuOpen ? 'auto' : '0', marginRight: !menuOpen ? 'auto' : '12px' }} />
                <span className={`transition-opacity duration-200 ${!menuOpen ? 'hidden' : 'block'}`}>대시보드</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/facilities" 
                className="flex items-center px-3 py-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                onClick={() => window.innerWidth < 768 && setMenuOpen(false)}
              >
                <Building className="h-5 w-5 shrink-0" style={{ marginLeft: !menuOpen ? 'auto' : '0', marginRight: !menuOpen ? 'auto' : '12px' }} />
                <span className={`transition-opacity duration-200 ${!menuOpen ? 'hidden' : 'block'}`}>시설 관리</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/matches" 
                className="flex items-center px-3 py-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                onClick={() => window.innerWidth < 768 && setMenuOpen(false)}
              >
                <Calendar className="h-5 w-5 shrink-0" style={{ marginLeft: !menuOpen ? 'auto' : '0', marginRight: !menuOpen ? 'auto' : '12px' }} />
                <span className={`transition-opacity duration-200 ${!menuOpen ? 'hidden' : 'block'}`}>매치 관리</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/users" 
                className="flex items-center px-3 py-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                onClick={() => window.innerWidth < 768 && setMenuOpen(false)}
              >
                <Users className="h-5 w-5 shrink-0" style={{ marginLeft: !menuOpen ? 'auto' : '0', marginRight: !menuOpen ? 'auto' : '12px' }} />
                <span className={`transition-opacity duration-200 ${!menuOpen ? 'hidden' : 'block'}`}>사용자 관리</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/reservations" 
                className="flex items-center px-3 py-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                onClick={() => window.innerWidth < 768 && setMenuOpen(false)}
              >
                <CreditCard className="h-5 w-5 shrink-0" style={{ marginLeft: !menuOpen ? 'auto' : '0', marginRight: !menuOpen ? 'auto' : '12px' }} />
                <span className={`transition-opacity duration-200 ${!menuOpen ? 'hidden' : 'block'}`}>예약 관리</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/settings" 
                className="flex items-center px-3 py-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                onClick={() => window.innerWidth < 768 && setMenuOpen(false)}
              >
                <Settings className="h-5 w-5 shrink-0" style={{ marginLeft: !menuOpen ? 'auto' : '0', marginRight: !menuOpen ? 'auto' : '12px' }} />
                <span className={`transition-opacity duration-200 ${!menuOpen ? 'hidden' : 'block'}`}>설정</span>
              </Link>
            </li>
          </ul>
        </nav>
          
        {/* 하단 로그아웃 버튼 */}
        <div className="h-12 px-4 flex items-center border-t border-slate-700 bg-slate-800">
          <div className="flex items-center px-3 py-2 text-red-300 hover:bg-red-600 hover:text-white rounded-md transition-colors cursor-pointer w-full"
            onClick={handleLogout}>
            <LogOut className="h-5 w-5 shrink-0" style={{ marginLeft: !menuOpen ? 'auto' : '0', marginRight: !menuOpen ? 'auto' : '12px' }} />
            <span className={`transition-opacity duration-200 ${!menuOpen ? 'hidden' : 'block'}`}>로그아웃</span>
          </div>
        </div>
      </aside>
      
      {/* 메인 콘텐츠 영역 (헤더, 콘텐츠, 푸터 포함) */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <AdminHeader toggleMenu={toggleMenu} menuOpen={menuOpen} />
        
        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-auto p-0">
          <div className="w-full h-full flex justify-center">
            <div className="w-full max-w-5xl py-6 px-4">
              {children}
            </div>
          </div>
        </main>
        
        <AdminFooter />
      </div>

      {/* 모바일용 백드롭 */}
      {menuOpen && typeof window !== 'undefined' && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
      <Toaster />
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