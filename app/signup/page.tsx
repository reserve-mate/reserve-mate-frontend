"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSendVerification = async () => {
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast({
        title: "유효하지 않은 이메일",
        description: "올바른 이메일 주소를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 실제 구현에서는 API를 호출하여 인증 코드를 발송합니다
      // const response = await fetch("/api/auth/send-verification", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: formData.email }),
      // })

      // 성공 시 처리
      setTimeout(() => {
        setVerificationSent(true)
        setIsLoading(false)
        toast({
          title: "인증 코드 발송 완료",
          description: "이메일로 인증 코드가 발송되었습니다. 이메일을 확인해주세요.",
        })
      }, 1000)
    } catch (error) {
      toast({
        title: "인증 코드 발송 실패",
        description: "인증 코드 발송 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length < 6) {
      toast({
        title: "유효하지 않은 인증 코드",
        description: "올바른 인증 코드를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 실제 구현에서는 API를 호출하여 인증 코드를 검증합니다
      // const response = await fetch("/api/auth/verify-code", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: formData.email, code: verificationCode }),
      // })

      // 성공 시 처리 (여기서는 간단히 "123456"을 유효한 코드로 가정)
      setTimeout(() => {
        if (verificationCode === "123456") {
          setIsVerified(true)
          toast({
            title: "이메일 인증 성공",
            description: "이메일 인증이 완료되었습니다.",
          })
        } else {
          toast({
            title: "인증 코드 불일치",
            description: "인증 코드가 일치하지 않습니다. 다시 확인해주세요.",
            variant: "destructive",
          })
        }
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      toast({
        title: "인증 실패",
        description: "인증 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isVerified) {
      toast({
        title: "이메일 인증 필요",
        description: "회원가입을 완료하려면 이메일 인증이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // API 호출 코드가 여기에 들어갑니다
      // const response = await fetch("/api/auth/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })

      // 성공 시 처리
      setTimeout(() => {
        toast({
          title: "회원가입 성공",
          description: "회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.",
        })

        // 로그인 페이지로 이동
        router.push("/login")
      }, 1000)
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="styled-card w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
          <CardDescription className="text-center">
            스포츠 예약 시스템에 가입하여 다양한 서비스를 이용하세요.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={verificationSent || isVerified}
                  className="flex-1"
                />
                {!isVerified && (
                  <Button
                    type="button"
                    onClick={handleSendVerification}
                    disabled={isLoading || verificationSent || !formData.email}
                    className="whitespace-nowrap primary-button"
                  >
                    {verificationSent ? "재발송" : "인증코드 발송"}
                  </Button>
                )}
              </div>
            </div>

            {verificationSent && !isVerified && (
              <div className="space-y-2">
                <Label htmlFor="verificationCode">인증 코드</Label>
                <div className="flex space-x-2">
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    placeholder="인증 코드 6자리"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isLoading || !verificationCode}
                    className="primary-button"
                  >
                    확인
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  이메일로 발송된 6자리 인증 코드를 입력해주세요. (테스트용 코드: 123456)
                </p>
              </div>
            )}

            {isVerified && (
              <Alert className="bg-indigo-50 text-indigo-800 border-indigo-200">
                <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                <AlertTitle>이메일 인증 완료</AlertTitle>
                <AlertDescription>이메일 인증이 성공적으로 완료되었습니다.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="010-0000-0000"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full primary-button" disabled={isLoading || !isVerified}>
              {isLoading ? "처리 중..." : "회원가입"}
            </Button>
            <div className="text-center text-sm">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                로그인
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

