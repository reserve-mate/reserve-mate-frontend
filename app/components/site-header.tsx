import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/router'

// 로그인 상태를 useState로 관리
const [isLoggedIn, setIsLoggedIn] = useState(false)
const [isAdmin, setIsAdmin] = useState(false)

// 현재 경로 확인
const pathname = usePathname()

// 초기 로드 시 로컬 스토리지에서 로그인 상태 확인
useEffect(() => {
  const loggedInStatus = localStorage.getItem('isLoggedIn')
  const adminStatus = localStorage.getItem('isAdmin')
  setIsLoggedIn(loggedInStatus === 'true')
  setIsAdmin(adminStatus === 'true')
}, [])

// 로그인 상태가 변경될 때 로컬 스토리지 업데이트
useEffect(() => {
  localStorage.setItem('isLoggedIn', isLoggedIn.toString())
}, [isLoggedIn]) 