import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, CreditCard, Users, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">ReserveMate</h1>
            <p className="max-w-[800px] text-gray-200 text-lg md:text-xl lg:text-2xl">
              간편하게 스포츠 시설을 예약하고 관리하세요. 테니스, 축구, 농구 등 다양한 스포츠 시설을 한 곳에서.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 mt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <Link href="/facilities">시설 찾기</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <Link href="/matches">
                  <span className="text-white font-bold">소셜 매치</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">주요 기능</h2>
              <p className="max-w-[700px] text-gray-500 text-lg md:text-xl mx-auto">
                스포츠 시설 예약 시스템의 주요 기능을 소개합니다.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <Card className="styled-card">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
                <div className="p-4 rounded-full bg-indigo-100 text-indigo-600">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">시설 검색</h3>
                <p className="text-gray-500">위치, 스포츠 종류, 가격 등 다양한 조건으로 시설을 검색하세요.</p>
              </CardContent>
            </Card>
            <Card className="styled-card">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
                <div className="p-4 rounded-full bg-indigo-100 text-indigo-600">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">간편 예약</h3>
                <p className="text-gray-500">원하는 날짜와 시간에 빠르고 쉽게 예약하세요.</p>
              </CardContent>
            </Card>
            <Card className="styled-card">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
                <div className="p-4 rounded-full bg-indigo-100 text-indigo-600">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">온라인 결제</h3>
                <p className="text-gray-500">다양한 결제 방법으로 안전하게 결제하세요.</p>
              </CardContent>
            </Card>
            <Card className="styled-card">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
                <div className="p-4 rounded-full bg-indigo-100 text-indigo-600">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">소셜 매치</h3>
                <p className="text-gray-500">함께 운동할 팀원을 찾고 매치를 신청하세요.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Facilities Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">인기 시설</h2>
              <p className="max-w-[700px] text-gray-500 text-lg md:text-xl mx-auto">
                사용자들이 가장 많이 이용하는 인기 스포츠 시설을 만나보세요.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="styled-card">
                <div className="relative h-48 w-full">
                  <Image
                    src={`/placeholder.svg?height=300&width=500&text=인기시설${i}`}
                    alt={`인기 시설 ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">인기 스포츠 시설 {i}</h3>
                  <p className="text-gray-500 mb-4">최신 시설과 편리한 위치로 많은 사용자들이 이용하는 시설입니다.</p>
                  <Button asChild variant="outline" className="w-full hover:text-indigo-700 hover:border-indigo-700">
                    <Link href="/facilities">
                      자세히 보기 <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">지금 바로 시작하세요</h2>
              <p className="max-w-[700px] text-gray-200 text-lg md:text-xl mx-auto">
                회원가입 후 다양한 스포츠 시설을 이용해보세요.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 mt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <Link href="/signup">회원가입</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <Link href="/login">로그인</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">사용자 후기</h2>
              <p className="max-w-[700px] text-gray-500 text-lg md:text-xl mx-auto">
                ReserveMate를 이용한 사용자들의 생생한 후기를 확인하세요.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "김철수",
                role: "테니스 동호회장",
                content:
                  "ReserveMate 덕분에 매주 테니스 코트 예약이 정말 편리해졌어요. 이전에는 전화로 예약하느라 번거로웠는데, 이제는 몇 번의 클릭만으로 예약이 완료됩니다.",
              },
              {
                name: "이영희",
                role: "풋살 매니저",
                content:
                  "소셜 매치 기능이 정말 유용해요. 팀원을 구하기 어려웠는데, 이제는 쉽게 매치를 만들고 참가자를 모집할 수 있어요. 덕분에 더 많은 경기를 즐길 수 있게 되었습니다.",
              },
              {
                name: "박지민",
                role: "농구 동호인",
                content:
                  "결제 시스템이 안전하고 환불 처리도 빠르게 진행되어 만족스러워요. 갑자기 일정이 변경되어도 쉽게 예약을 취소하고 환불받을 수 있어 편리합니다.",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="styled-card">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 text-xl font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{testimonial.name}</h3>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

