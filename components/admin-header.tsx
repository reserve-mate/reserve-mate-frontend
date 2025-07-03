"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function AdminHeader({ toggleMenu, menuOpen }: { toggleMenu: () => void, menuOpen: boolean }) {
  const router = useRouter()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-800 text-white shadow-md">
      <div className="px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-white hover:bg-gray-700 mr-1 md:hidden"
            aria-label={`메뉴 ${menuOpen ? '닫기' : '열기'}`}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-white">ReserveMate <span className="text-indigo-400">Admin</span></span>
          </Link>
        </div>
      </div>
    </header>
  )
} 