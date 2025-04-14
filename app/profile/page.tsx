"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { userService } from "@/lib/services/userService"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [initialProfileData, setInitialProfileData] = useState({
    name: "홍길동",
    email: "user@example.com",
    phone: "010-1234-5678",
  })
  const [profileData, setProfileData] = useState({
    name: "홍길동",
    email: "user@example.com",
    phone: "010-1234-5678",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  
  // 비밀번호 일치 여부 확인 상태
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null)
  
  // 프로필 이미지 관련 상태
  const [showProfileImageModal, setShowProfileImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("/placeholder.svg?height=96&width=96")
  const [isImageUploading, setIsImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 유저 id 저장
  const [userId, setUserId] = useState<number>(0)

  // 초기 데이터 로드 (실제로는 API에서 가져옴)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUserId(userData.id);

        setInitialProfileData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });
        setProfileData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });
        setPreviewUrl(`http://localhost:8080${userData.profileImage}`);
      } catch (error) {
        console.log("유저 정보 불러오기 실패", error);
        toast({
          title: "불러오기 실패",
          description: "유저 정보를 불러오는 중 문제가 발생했습니다.",
          variant: "destructive",
        });
      }
    };
    
    loadUserData();
  }, [])
  
  // 이미지 선택 시 미리보기 생성
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // 이미지 타입만 허용
      if (!file.type.includes('image')) {
        toast({
          title: "이미지 형식 오류",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive",
        })
        return
      }
      
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: "5MB 이하의 이미지만 업로드 가능합니다.",
          variant: "destructive",
        })
        return
      }
      
      setSelectedImage(file)
      const imageUrl = URL.createObjectURL(file)
      setPreviewUrl(imageUrl)
    }
  }
  
  // 이미지 업로드 취소
  const handleCancelImageUpload = () => {
    setSelectedImage(null)
    setShowProfileImageModal(false)
    // 임시 생성한 ObjectURL 해제
    if (previewUrl && previewUrl !== "/placeholder.svg?height=96&width=96") {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl("/placeholder.svg?height=96&width=96")
    }
  }
  
  // 이미지 업로드 처리
  const handleImageUpload = async () => {
    if (!selectedImage) return
    
    setIsImageUploading(true)
    
    try {
      await userService.updateProfileImage(selectedImage) 

      // 성공적인 업로드 시뮬레이션 (2초 후)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "프로필 이미지 변경 성공",
        description: "프로필 이미지가 성공적으로 변경되었습니다.",
      })
      
      setShowProfileImageModal(false)
    } catch (error) {
      toast({
        title: "프로필 이미지 변경 실패",
        description: "이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsImageUploading(false)
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    const updatedData = { ...passwordData, [name]: value }
    setPasswordData(updatedData)
    
    // 새 비밀번호와 비밀번호 확인이 모두 입력된 경우 일치 여부 확인
    if (
      (name === 'newPassword' && updatedData.confirmPassword) || 
      (name === 'confirmPassword' && updatedData.newPassword)
    ) {
      setPasswordMatch(updatedData.newPassword === updatedData.confirmPassword)
    } else if (name === 'confirmPassword' && !value) {
      // 비밀번호 확인을 지운 경우 일치 여부 초기화
      setPasswordMatch(null)
    }
  }

  // 프로필 정보 취소 처리
  const handleProfileReset = () => {
    setProfileData({ ...initialProfileData })
    toast({
      title: "변경사항 취소",
      description: "프로필 정보가 원래 상태로 되돌아갔습니다.",
    })
  }

  // 비밀번호 변경 취소 처리
  const handlePasswordReset = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    toast({
      title: "변경사항 취소",
      description: "비밀번호 변경이 취소되었습니다.",
    })
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      
      await userService.updateUser(userId,{
        name: profileData.name,
        phone: profileData.phone,
      })

      // 성공 시 처리
      toast({
        title: "프로필 업데이트 성공",
        description: "프로필 정보가 성공적으로 업데이트되었습니다.",
      })
      
      // 업데이트 성공 시 초기 데이터도 업데이트
      setInitialProfileData({ ...profileData })
    } catch (error) {
      toast({
        title: "프로필 업데이트 실패",
        description: "프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // API 호출 코드가 여기에 들어갑니다
      // const response = await fetch("/api/users/password", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(passwordData),
      // })

      // 성공 시 처리
      toast({
        title: "비밀번호 변경 성공",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      })

      // 폼 초기화
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "비밀번호 변경 실패",
        description: "비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">내 프로필</h1>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3">
          <Card className="shadow-sm">
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={previewUrl} alt="프로필 이미지" />
                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-gray-500">{profileData.email}</p>
              <Button 
                className="mt-4 w-full" 
                variant="outline"
                onClick={() => setShowProfileImageModal(true)}
              >
                프로필 사진 변경
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="profile" className="flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
              <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">프로필 정보</TabsTrigger>
              <TabsTrigger value="password" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">비밀번호 변경</TabsTrigger>
            </TabsList>

            <div className="relative" style={{ height: "550px" }}>
              <div className="absolute inset-0">
                <TabsContent value="profile" className="absolute inset-0 data-[state=active]:block data-[state=inactive]:hidden">
                  <Card className="shadow-sm h-full flex flex-col">
                    <CardHeader className="pb-6">
                      <CardTitle>프로필 정보</CardTitle>
                      <CardDescription>개인 정보를 수정하고 업데이트하세요.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6 flex-1 overflow-auto">
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">이름</Label>
                          <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">이메일</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled
                          />
                          <p className="text-sm text-gray-500">이메일은 변경할 수 없습니다.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">전화번호</Label>
                          <Input id="phone" name="phone" value={profileData.phone} onChange={handleProfileChange} />
                        </div>
                        <div className="text-sm text-gray-500 mt-6">
                          <p>프로필 정보는 서비스 이용에 활용됩니다.</p>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="px-6 py-4 border-t flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 w-[120px]"
                        onClick={handleProfileReset}
                      >
                        취소
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleProfileSubmit}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-[120px]" 
                        disabled={isLoading}
                      >
                        {isLoading ? "저장 중..." : "저장하기"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="password" className="absolute inset-0 data-[state=active]:block data-[state=inactive]:hidden">
                  <Card className="shadow-sm h-full flex flex-col">
                    <CardHeader className="pb-6">
                      <CardTitle>비밀번호 변경</CardTitle>
                      <CardDescription>계정 보안을 위해 주기적으로 비밀번호를 변경하세요.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6 flex-1 overflow-auto">
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">현재 비밀번호</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">새 비밀번호</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            className={passwordMatch === false ? "border-red-500" : ""}
                          />
                          {passwordData.confirmPassword && (
                            passwordMatch === true ? (
                              <p className="text-sm text-green-600 mt-1">비밀번호가 일치합니다.</p>
                            ) : passwordMatch === false ? (
                              <p className="text-sm text-red-600 mt-1">비밀번호가 일치하지 않습니다.</p>
                            ) : null
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-6">
                          <p>강력한 비밀번호를 사용하면 계정을 더 안전하게 보호할 수 있습니다.</p>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="px-6 py-4 border-t flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 w-[120px]"
                        onClick={handlePasswordReset}
                      >
                        취소
                      </Button>
                      <Button 
                        type="button"
                        onClick={handlePasswordSubmit}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-[120px]" 
                        disabled={isLoading}
                      >
                        {isLoading ? "변경 중..." : "변경하기"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* 프로필 이미지 변경 모달 */}
      <Dialog open={showProfileImageModal} onOpenChange={setShowProfileImageModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>프로필 사진 변경</DialogTitle>
            <DialogDescription>
              새로운 프로필 사진을 업로드하세요. 5MB 이하의 이미지 파일만 가능합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedImage ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-40 w-40 overflow-hidden rounded-full border border-gray-200">
                  <Image
                    src={previewUrl}
                    alt="미리보기"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                  <Button 
                    variant="ghost" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-indigo-600"
                  >
                    이미지 선택
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  클릭하여 이미지를 선택하세요
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-end space-x-3 pt-2">
            {selectedImage ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancelImageUpload}
                  className="w-[120px]"
                >
                  취소
                </Button>
                <Button 
                  type="button" 
                  onClick={handleImageUpload} 
                  disabled={isImageUploading}
                  className="w-[120px]"
                >
                  {isImageUploading ? "변경 중..." : "변경하기"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setShowProfileImageModal(false)}>
                닫기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 모바일 하단 네비게이션용 여백 */}
      <div className="h-16 md:hidden"></div>
    </div>
  )
}

