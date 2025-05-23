"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { facilityService } from "@/lib/services/facilityService"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash, 
  Eye, 
  MapPin,
  CircleDot,
  Users,
  Calendar,
  X
} from "lucide-react"

// 시설 등록 폼 컴포넌트 import
import RegisterFacilityForm from "@/components/admin/facility-register-form"
import { toast } from "@/hooks/use-toast"
import type { FacilityList } from "@/lib/services/facilityService"

// 스포츠 종류별 아이콘
const sportTypeIcons: Record<string, React.ReactNode> = {
  "테니스": <CircleDot className="h-4 w-4" />,
  "풋살": <Users className="h-4 w-4" />,
  "농구": <Users className="h-4 w-4" />,
  "배드민턴": <CircleDot className="h-4 w-4" />,
}

export default function AdminFacilitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [facilities, setFacilities] = useState<FacilityList[]>([])
  const [lastId, setLastId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<HTMLTableRowElement | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const router = useRouter();
  const PAGE_SIZE = 7
  
  const loadFacilities = useCallback(async () => {
    if (loading || !hasMore ) return
    setLoading(true)
    
    try {
      const response = await facilityService.getFacilities({
        keyword: searchTerm,
        lastId: lastId ?? null,
        size: String(PAGE_SIZE),
      })

      const newFacilities = response;
      console.log("시설 목록 data 확인: ", newFacilities);
      const prevIds = new Set(facilities.map(f => f.facilityId));
      const filtered = newFacilities.filter(f => !prevIds.has(f.facilityId));
      
      setFacilities(prev => [...prev, ...filtered]);
      setLastId(filtered.length > 0 ? String(filtered[filtered.length - 1].facilityId) : lastId);
      setHasMore(newFacilities.length === PAGE_SIZE);

    } catch (error) {
      console.log("시설 불러오기 실패: ", error)
    } finally{
      setLoading(false)
    }
    
  }, [facilities, hasMore, lastId, loading, searchTerm])

  // 검색어 입력시
  useEffect(() => {
    const fetchOnSearch = async () => {
      setLoading(true)
      try {
        const response = await facilityService.getFacilities({
          keyword: searchTerm,
          lastId: null,  // 검색시 항상 처음부터
          size: String(PAGE_SIZE),
        });

        setFacilities(response);
        setLastId(response.length > 0 ? String(response[response.length - 1].facilityId) : null);
        setHasMore(response.length === PAGE_SIZE);
      } catch (e) {
        console.error("검색 중 에러", e);
      } finally {
        setLoading(false);
      }
    }

    fetchOnSearch();
  }, [searchTerm]);

  //IntersectionObserver
  useEffect(()=> {
    if(!observerRef.current || !scrollContainerRef.current || !hasMore) return

    const observer = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && !loading){
        loadFacilities()
      }
    }, 
    {
      root: scrollContainerRef.current,
      rootMargin: "0px",
      threshold: 0.5  // 화면의 절반 이상 보일 때만 호출하기
    })

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [ loadFacilities, hasMore, loading])

  // 삭제 처리
  const handleDelete = (id: string) => {
    setFacilities(prev => prev.filter(facility => facility.facilityId !== id))
  }
  
  // 활성/비활성 토글
  const toggleActive = (id: string) => {
    setFacilities(prev => prev.map(facility => 
      facility.facilityId === id ? { ...facility, active: !facility.active } : facility
    ))
  }
  
  // 시설 등록 폼 토글
  const toggleRegisterForm = () => {
    // 시설 등록 ROLE_ADMIN 만 접근가능, 개발중 임시 주석 처리
    /*
    const token = localStorage.getItem("accessToken");
    if (token){
      const payload = JSON.parse(atob(token.split('.')[1]))
      const role = payload.role;
      console.log("회원 role : "+ role);
      if (role !== 'ROLE_ADMIN'){
        toast({
          title: "권한 없음",
          description: "시설 등록은 관리자만 가능합니다.",
          variant: "destructive",
        });
        return;
      }
    }
    */
    setShowRegisterForm(!showRegisterForm)
  }
  
  // 시설 등록 완료 후 처리
  const handleFacilityRegisterComplete = (newFacility: any) => {
    // 주소 데이터 추가 확인
    console.log(newFacility.address);

    // 등록 폼 닫기
    setShowRegisterForm(false)
    
    //리스트 초기화 후 다시 불러오기
    setFacilities([]);
    setLastId(null);
    setHasMore(true);

    setTimeout(()=>{
      loadFacilities();
    }, 100);
    
    // 성공 메시지 처리 등...
    toast({
      title: "시설 등록 완료",
      description: `${newFacility.name} 시설이 등록되었습니다.`,
      variant: "default",
    })
  }

  // 시설 관리 목록 UI
  const renderFacilitiesList = () => (
    <Card>
      <CardHeader>
        <CardTitle>등록된 시설</CardTitle>
        <CardDescription>
          모든 시설을 관리하고 새로운 시설을 등록할 수 있습니다.
        </CardDescription>
        
        <div className="mt-4 flex w-full max-w-sm items-center space-x-2">
          <Input 
            placeholder="시설명, 주소, 종류로 검색" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute ml-2 h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div ref={scrollContainerRef} className="max-h-[600px] overflow-y-auto pr-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>시설명</TableHead>
              <TableHead>종류</TableHead>
              <TableHead className="hidden md:table-cell">주소</TableHead>
              <TableHead className="hidden md:table-cell">코트 수</TableHead>
              <TableHead className="hidden md:table-cell">예약 건수</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilities.map((facility) => (
              <TableRow 
                key={facility.facilityId}
                className="isolate relative"
                style={{ position: 'relative' }}
              >
                <TableCell className="font-medium">{facility.facilityName}</TableCell>
                <TableCell>
                  <span className="whitespace-nowrap">{facility.sportType}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    {facility.address}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{facility.courtCount}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {facility.reservationCount}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={facility.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    variant="outline"
                  >
                    {facility.active ? "활성" : "비활성"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap relative">
                  <div className="flex justify-end space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        router.push(`/admin/facilities/${facility.facilityId}`);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        router.push(`/admin/facilities/${facility.facilityId}/edit`);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 p-0 ${facility.active ? "text-red-500 hover:text-red-600 hover:bg-red-100" : "text-green-500 hover:text-green-600 hover:bg-green-100"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleActive(facility.facilityId);
                      }}
                    >
                      {facility.active ? (
                        <CircleDot className="h-4 w-4" />
                      ) : (
                        <Calendar className="h-4 w-4" />
                      )}
                      <span className="sr-only">{facility.active ? "Deactivate" : "Activate"}</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(facility.facilityId);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {hasMore &&(
              <TableRow ref={observerRef}>
                <TableCell colSpan={7} className="text-center py-2">
                  <span className="text-gray-400 text-sm"> 불러오는중 ...</span>
                </TableCell>
              </TableRow>
            )}
            {facilities.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">시설 관리</h1>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={toggleRegisterForm}
        >
          <Plus className="mr-2 h-4 w-4" /> 새 시설 등록
        </Button>
      </div>
      
      {showRegisterForm ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">새 시설 등록</h2>
            <Button variant="ghost" size="icon" onClick={toggleRegisterForm}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="register-form-container">
                <RegisterFacilityForm onComplete={handleFacilityRegisterComplete} />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      {renderFacilitiesList()}
    </div>
  )
} 