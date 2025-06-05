"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminReservationStatus from "@/components/admin/reservation-status"

export default function ReservationsAdminPage() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">예약 현황</h1>
      <p className="text-gray-500">
        모든 예약을 조회하고 상태를 관리할 수 있습니다.
      </p>
      
      <AdminReservationStatus />
    </div>
  )
} 