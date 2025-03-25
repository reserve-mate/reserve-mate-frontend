import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, CalendarClock, ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] max-w-6xl mx-auto px-4 py-16 overflow-hidden">
      {/* 배경 요소: 스포츠 필드 라인 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* 축구장/풋살장 라인 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] border-4 border-indigo-100 rounded-xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[200px] h-[400px] border-4 border-indigo-100 rounded-r-xl"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[200px] h-[400px] border-4 border-indigo-100 rounded-l-xl"></div>
      </div>
    
      <div className="text-center space-y-8 relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-100">
        <div className="relative h-60 sm:h-80 mb-6 flex items-center justify-center">
          {/* 메인 404 이미지 */}
          <div className="relative">
            <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto">
              <text x="50%" y="53%" dominantBaseline="middle" textAnchor="middle" fontSize="120" fontWeight="bold" fill="#6366F1" className="select-none">404</text>
            </svg>
            
            {/* 스포츠 장비 아이콘들 */}
            <div className="absolute -top-8 -left-12 bg-white p-3 rounded-full shadow-lg border-2 border-indigo-600 animate-bounce" style={{ animationDuration: '3s' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="2" />
                <path d="M12 2V22" stroke="#6366F1" strokeWidth="1" />
                <path d="M2 12H22" stroke="#6366F1" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute -top-12 left-24 bg-white p-3 rounded-full shadow-lg border-2 border-indigo-600 animate-bounce" style={{ animationDuration: '2.3s', animationDelay: '0.2s' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4C4 4 6 6 12 6C18 6 20 4 20 4V16C20 16 18 18 12 18C6 18 4 16 4 16V4Z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 6V18" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="absolute -bottom-12 left-10 bg-white p-3 rounded-full shadow-lg border-2 border-indigo-600 animate-bounce" style={{ animationDuration: '2.7s', animationDelay: '0.4s' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.5L12 21L2 16.5M22 12L12 16.5L2 12M22 7.5L12 12L2 7.5L12 3L22 7.5Z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="absolute -bottom-8 right-10 bg-white p-3 rounded-full shadow-lg border-2 border-indigo-600 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.1s' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="6" stroke="#6366F1" strokeWidth="2" />
                <path d="M12 14L12 22" stroke="#6366F1" strokeWidth="2" />
                <path d="M8 18H16" stroke="#6366F1" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute -top-4 right-0 bg-white p-3 rounded-full shadow-lg border-2 border-indigo-600 animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 14C6 14 6 14.5 7.5 16C9 17.5 11 17.5 12 17.5C13 17.5 15 17.5 16.5 16C18 14.5 18 14 18 14" stroke="#6366F1" strokeWidth="2" />
                <rect x="2" y="6" width="20" height="10" rx="2" stroke="#6366F1" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900">죄송합니다.</h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          현재 찾을 수 없는 페이지를 요청하셨습니다. 다른 스포츠 시설이나 매치를 확인해 보시는 건 어떨까요?
        </p>

        <div className="bg-indigo-50 p-6 rounded-xl max-w-md mx-auto border border-indigo-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">다음을 시도해 보세요:</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start">
              <Home className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" />
              <span>메인 페이지로 돌아가기</span>
            </li>
            <li className="flex items-start">
              <Search className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" />
              <span>다른 스포츠 시설 검색하기</span>
            </li>
            <li className="flex items-start">
              <CalendarClock className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" />
              <span>다른 날짜의 매치 확인하기</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-3">
            <Link href="/">
              홈으로 가기 <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-indigo-600 text-indigo-600 hover:text-indigo-700 hover:border-indigo-700 rounded-lg px-6 py-3">
            <Link href="/facilities">
              시설 찾아보기
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-indigo-600 text-indigo-600 hover:text-indigo-700 hover:border-indigo-700 rounded-lg px-6 py-3">
            <Link href="/matches">
              소셜 매치 둘러보기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 