"use client"

import CourtManagement from "@/components/admin/court-management"

export default function CourtsAdminPage() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">코트 관리</h1>
      <p className="text-gray-500">
        시설별 코트를 관리하고 각 코트의 세부 정보를 설정할 수 있습니다.
      </p>
      
      <CourtManagement />
    </div>
  )
} 