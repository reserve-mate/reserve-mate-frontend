"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { facilityService } from "@/lib/services/facilityService"

// 코트 대분류 유형
const courtMainTypes = [
  { value: true, label: "실내" },
  { value: false, label: "실외" },
]

// 종목별 코트 소분류 유형
const sportCourtTypes = {
  TENNIS: [
    { value: "HARD", label: "하드코트" },
    { value: "CLAY_TENNIS", label: "클레이코트" },
    { value: "GRASS", label: "잔디코트" },
    { value: "SYNTHETIC_TENNIS", label: "합성소재" },
  ],
  FUTSAL: [
    { value: "RUBBER_FUTSAL", label: "고무바닥" },
    { value: "SYNTHETIC_FUTSAL", label: "합성표면" },
    { value: "ARTIFICIAL_TURF_FUTSAL", label: "인조잔디" },
  ],
  BASKETBALL: [
    { value: "WOODEN_BASKET", label: "목재바닥" },
    { value: "SYNTHETIC_BASKET", label: "합성소재" },
  ],
  VOLLEYBALL: [
    { value: "WOODEN_VOLLEY", label: "목재바닥" },
    { value: "SYNTHETIC_VOLLEY", label: "합성소재" },
  ],
  BADMINTON: [
    { value: "WOODEN_BM", label: "목재바닥" },
    { value: "SYNTHETIC_BM", label: "합성소재" },
    { value: "RUBBER_BM", label: "고무바닥" },
  ],
  BASEBALL: [
    { value: "NATURE_GRASS_BASE", label: "천연잔디" },
    { value: "ARTIFICIAL_TURF_BASE", label: "인조잔디" },
    { value: "DIRT_BASE", label: "흙" },
    { value: "CLAY_BASE", label: "점토" },
  ],
  SOCCER: [
    { value: "NATURE_GRASS_FB", label: "천연잔디" },
    { value: "ARTIFICIAL_TURF_FB", label: "인조잔디" },
    { value: "DIRT_FB", label: "흙" },
  ],
  OTHER: [
    { value: "MULTIPURPOSE", label: "다목적" },
    { value: "OTHER", label: "기타" },
  ]
}

// sportTypes
const sportTypes = [
  { value: "TENNIS", label: "테니스" },
  { value: "FUTSAL", label: "풋살" },
  { value: "BASKETBALL", label: "농구" },
  { value: "VOLLEYBALL", label: "배구" },
  { value: "BADMINTON", label: "배드민턴" },
  { value: "BASEBALL", label: "야구" },
  { value: "SOCCER", label: "축구"},
  { value: "OTHER", label: "기타" },
]

// 코트 타입 정의
type Court = {
  id: string;
  name: string;
  facilityId?: string;
  courtType : string;
  indoor : boolean;
  width: string;
  height: string;
  active: boolean;
  fee: string;
}

type Facility = {
  id: string;
  name: string;
  sportType: string;
}

interface CourtManagementProps {
  selectedFacilityId?: string; // 선택된 시설 ID (옵션)
}

export default function CourtManagement({ selectedFacilityId }: CourtManagementProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<string>("")
  const [courts, setCourts] = useState<Court[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSportType, setSelectedSportType] = useState<string>("OTHER")
  
  // 코트 관리 다이얼로그 상태
  const [isCourtDialogOpen, setIsCourtDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  
  // 삭제 다이얼로그 상태
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [courtToDelete, setCourtToDelete] = useState<string | null>(null)
  
  // 코트 폼 데이터
  const [courtFormData, setCourtFormData] = useState<Court>({
    id: "",
    name: "",
    facilityId: "",
    courtType: "",
    width: "",
    height: "",
    indoor: true,
    fee: "",
    active: true
  })
  
  // 가상의 시설 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    // 외부에서 선택된 시설 ID가 있으면 자동으로 선택
    if (selectedFacilityId) {
      setSelectedFacility(selectedFacilityId)
    }
  }, [selectedFacilityId])
  
  const responseCourtDto = (dto: any): Court => ({
    id: dto.id,
    facilityId: selectedFacilityId,
    name: dto.name,
    courtType: dto.courtType,
    width: String(dto.width),
    height: String(dto.height),
    indoor: dto.indoor,
    active: dto.active,
    fee: dto.fee ? String(dto.fee) : "0",
  })

  // 시설 선택 시 코트 데이터 로드 (실제로는 API 호출)
  const fetchCourts = useCallback(async () => {
    if (!selectedFacility) return;
    try {
      const facilityId = Number(selectedFacility);
      const response = await facilityService.getCourts(facilityId);
      const courtDto = response.map(responseCourtDto);
      setCourts(courtDto);
    } catch (error) {
      
      toast({
        title: "코트 목록 조회 실패",
        description: "코트 목록을 불러오는 중 실패하였습니다.",
        variant: "destructive"
      });
    }
  }, [selectedFacility]);
  
  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);



  // 시설 선택 시 해당 sportType 로드 
  useEffect(()=> {
    const fetchSportType = async () => {
      if (selectedFacilityId){
        const facility = await facilityService.getFacilitySportType(Number(selectedFacilityId))
        setSelectedSportType(facility?.sportType || "OTHER");
      }
    }
    fetchSportType();
  },[selectedFacilityId])

  // 코트 필터링
  const filteredCourts = courts.filter(court =>
    court.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // 코트 폼 입력 처리
  const handleCourtInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setCourtFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // 코트 셀렉트 입력 처리
  const handleCourtSelectChange = (name: string, value: string) => {
    setCourtFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // 코트 체크박스 입력 처리
  const handleCourtCheckboxChange = (name: string, checked: boolean) => {
    setCourtFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  // 코트 추가 다이얼로그 열기
  const openAddCourtDialog = () => {
    setDialogMode("add")
    setCourtFormData({
      id: "",
      name: "",
      facilityId: selectedFacility,
      courtType: "",
      width: "",
      height: "",
      indoor: true,
      fee: "",
      active: true
    })
    setIsCourtDialogOpen(true)
  }
  
  // 코트 수정 다이얼로그 열기
  const openEditCourtDialog = (court: Court) => {
    setDialogMode("edit")
    setCourtFormData({ ...court })
    setIsCourtDialogOpen(true)
  }
  
  // 코트 삭제 다이얼로그 열기
  const openDeleteCourtDialog = (courtId: string) => {
    setCourtToDelete(courtId)
    setIsDeleteDialogOpen(true)
  }
  
  // 코트 저장 처리
  const handleSaveCourt = async () => {
    setIsLoading(true)
    
    try {
      // 유효성 검사
      if (!courtFormData.name || !courtFormData.indoor || !courtFormData.courtType || !courtFormData.width || !courtFormData.height || !courtFormData.fee) {
        toast({
          title: "입력 오류",
          description: "필수 필드를 모두 입력해주세요.",
          variant: "destructive"
        })
        setIsLoading(false)
        return
      }

      // 코트 변환 처리
      const payload = {
        name : courtFormData.name,
        courtType : courtFormData.courtType,
        indoor : courtFormData.active,
        active : courtFormData.active,
        width : Number(courtFormData.width),
        height: Number(courtFormData.height),
        fee : Number(courtFormData.fee)
      }

      // 실제로는 API 호출
      if (dialogMode === "add") {
        await facilityService.createCourt(Number(selectedFacilityId),payload)
        fetchCourts()

        toast({
          title: "코트 추가 완료",
          description: `${courtFormData.name}코트가 추가되었습니다.`
        })
      } else {
        // 기존 코트 수정
        await facilityService.updateCourt(Number(selectedFacilityId), Number(courtFormData.id), payload)
        fetchCourts()
        
        toast({
          title: "코트 수정 완료",
          description: `${courtFormData.name} 코트가 수정되었습니다.`
        })
      }
      
      setIsCourtDialogOpen(false)
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "코트 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }
  
  // 코트 삭제 처리
  const handleDeleteCourt = async() => {
    setIsLoading(true)
    
    try {
      // 실제로는 API 호출
      if (courtToDelete) {
        await facilityService.deleteCourt(Number(selectedFacilityId), Number(courtToDelete))
        fetchCourts()

        toast({
          title: "코트 삭제 완료",
          description: ` 코트가 삭제되었습니다.`
        })
      }
      
      setIsDeleteDialogOpen(false)
      setCourtToDelete(null)
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "코트 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>코트 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedFacility && (
              <>
                <div className="flex items-center justify-between">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="코트 검색..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={openAddCourtDialog}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    코트 추가
                  </Button>
                </div>
                
                {filteredCourts.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    {searchTerm ? "검색 결과가 없습니다." : "등록된 코트가 없습니다."}
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>코트명</TableHead>
                          <TableHead>유형</TableHead>
                          <TableHead>규격(m)</TableHead>
                          <TableHead>시간당 요금</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead className="text-right">관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCourts.map((court) => (
                          <TableRow key={court.id}>
                            <TableCell className="font-medium">{court.name}</TableCell>
                            <TableCell>
                              {courtMainTypes.find(t => t.value === court.indoor)?.label} / 
                              {sportCourtTypes[selectedSportType as keyof typeof sportCourtTypes]
                                .find(t => t.value === court.courtType)?.label}
                            </TableCell>
                            <TableCell>{court.width} × {court.height}</TableCell>
                            <TableCell>{parseInt(court.fee).toLocaleString()}원</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                court.active 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {court.active ? "사용 가능" : "사용 불가"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditCourtDialog(court)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => openDeleteCourtDialog(court.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 코트 추가/수정 다이얼로그 */}
      <Dialog open={isCourtDialogOpen} onOpenChange={setIsCourtDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "코트 추가" : "코트 수정"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "add" 
                ? "새로운 코트 정보를 입력하세요." 
                : "코트 정보를 수정하세요."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">코트명 *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="예: 코트 A"
                  value={courtFormData.name}
                  onChange={handleCourtInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="indoor">코트 환경 *</Label>
                  <Select
                    value={String(courtFormData.indoor)}
                    onValueChange={(value) => handleCourtSelectChange("indoor", value)}
                  >
                    <SelectTrigger id="indoor">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {courtMainTypes.map((type) => (
                        <SelectItem key={String(type.value)} value={String(type.value)}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="courtType">코트 바닥 *</Label>
                  <Select
                    value={courtFormData.courtType}
                    onValueChange={(value) => handleCourtSelectChange("courtType", value)}
                  >
                    <SelectTrigger id="courtType">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportCourtTypes[selectedSportType as keyof typeof sportCourtTypes].map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="width">폭(m)</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    placeholder="예: 20"
                    value={courtFormData.width}
                    onChange={handleCourtInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="height">길이(m)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    placeholder="예: 40"
                    value={courtFormData.height}
                    onChange={handleCourtInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fee">시간당 요금(원)</Label>
                <Input
                  id="fee"
                  name="fee"
                  type="number"
                  placeholder="예: 20000"
                  value={courtFormData.fee}
                  onChange={handleCourtInputChange}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="active"
                  checked={courtFormData.active}
                  onCheckedChange={(checked) => 
                    handleCourtCheckboxChange("active", checked as boolean)
                  }
                />
                <Label htmlFor="active" className="text-sm font-normal">
                  이 코트는 현재 사용 가능합니다
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCourtDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleSaveCourt}
            >
              {isLoading ? "처리 중..." : (dialogMode === "add" ? "추가" : "저장")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 코트 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>코트 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 이 코트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며 모든 관련 예약 정보도 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteCourt}
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 