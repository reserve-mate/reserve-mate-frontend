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
import { User, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  // This would be replaced with actual auth state
  const isLoggedIn = false

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-semibold">
                  홈
                </Link>
                <Link href="/facilities" className="text-lg font-semibold">
                  시설 찾기
                </Link>
                <Link href="/matches" className="text-lg font-bold text-indigo-600">
                  소셜 매치
                </Link>
                <Link href="/reservations" className="text-lg font-semibold">
                  내 예약
                </Link>
                {!isLoggedIn ? (
                  <>
                    <Link href="/login" className="text-lg font-semibold">
                      로그인
                    </Link>
                    <Link href="/signup" className="text-lg font-semibold">
                      회원가입
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile" className="text-lg font-semibold">
                      내 프로필
                    </Link>
                    <Button variant="ghost" className="justify-start p-0 text-lg font-semibold">
                      로그아웃
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-indigo-600">ReserveMate</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/facilities" className="font-medium transition-colors hover:text-indigo-600">
              시설 찾기
            </Link>
            <Link href="/matches" className="font-bold text-indigo-600 transition-colors hover:text-indigo-800">
              소셜 매치
            </Link>
            <Link href="/reservations" className="font-medium transition-colors hover:text-indigo-600">
              내 예약
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex hover:text-indigo-600">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild size="sm" className="hidden md:flex primary-button">
                <Link href="/signup">회원가입</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
                  <Link href="/reservations">예약 내역</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/payments">결제 내역</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>로그아웃</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

