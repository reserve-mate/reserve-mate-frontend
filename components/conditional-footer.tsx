"use client";

import { usePathname } from "next/navigation";
import ClientFooter from "./client-footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // 관리자 페이지에서는 푸터를 표시하지 않음 (관리자 페이지는 별도 레이아웃 사용)
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }
  
  // 일반 사용자 페이지에서는 푸터 표시
  return <ClientFooter />;
} 