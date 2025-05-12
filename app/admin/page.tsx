"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Database, Calendar, Settings, User, Users, BookOpen } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <p className="text-gray-500">
            시설 및 예약 관리를 위한 관리자 페이지입니다.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>코트 관리</CardTitle>
              <Database className="h-5 w-5 text-indigo-500" />
            </div>
            <CardDescription>
              시설별 코트를 등록하고 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500">
              각 시설의 코트를 등록, 수정, 삭제하고 세부 정보를 설정할 수 있습니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="/admin/courts">
                코트 관리하기
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>예약 현황</CardTitle>
              <Calendar className="h-5 w-5 text-indigo-500" />
            </div>
            <CardDescription>
              모든 예약 정보를 확인하고 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500">
              예약 상태 확인, 예약 확정/취소 처리, 고객 예약 이력 조회를 할 수 있습니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="/admin/reservations">
                예약 관리하기
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>시설 관리</CardTitle>
              <BookOpen className="h-5 w-5 text-indigo-500" />
            </div>
            <CardDescription>
              스포츠 시설을 등록하고 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500">
              새로운 스포츠 시설을 등록하고 기존 시설의 정보를 수정합니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="/facilities/register">
                시설 관리하기
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>회원 관리</CardTitle>
              <User className="h-5 w-5 text-indigo-500" />
            </div>
            <CardDescription>
              회원 정보를 조회하고 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500">
              회원 계정 관리, 권한 설정, 가입 승인 및 회원 통계를 볼 수 있습니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="#">
                회원 관리하기
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>매니저 관리</CardTitle>
              <Users className="h-5 w-5 text-indigo-500" />
            </div>
            <CardDescription>
              시설 매니저를 등록하고 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500">
              시설별 매니저 계정 생성 및 권한 관리를 할 수 있습니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="#">
                매니저 관리하기
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>시스템 설정</CardTitle>
              <Settings className="h-5 w-5 text-indigo-500" />
            </div>
            <CardDescription>
              시스템 환경 설정을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500">
              시스템 설정, 알림 설정, 결제 시스템 설정 등을 관리할 수 있습니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="#">
                설정 관리하기
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 