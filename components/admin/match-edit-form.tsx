"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/hooks/use-toast"
import { format, parse } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { matchService } from "@/lib/services/matchService"
import { SportType } from "@/lib/enum/matchEnum"
import { CourtName, FacilityManagerName, FacilityNames } from "@/lib/types/facilityTypes"
import { facilityService } from "@/lib/services/facilityService"
import { AdminMatchDetail, displaySportName, MatchRegist } from "@/lib/types/matchTypes"
import { useRouter } from "next/navigation"

type sportTypes = {
  value: SportType;
  label: string;
}

const sportTypes: sportTypes[] = [
  { value: SportType.SOCCER, label: "축구" },
  { value: SportType.FUTSAL, label: "풋살" },
  { value: SportType.BASKETBALL, label: "농구" },
  { value: SportType.TENNIS, label: "테니스" },
  { value: SportType.BADMINTON, label: "배드민턴" },
  { value: SportType.BASEBALL, label: "야구" },
]

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i < 10 ? `0${i}` : `${i}`
  return { value: `${hour}:00`, label: `${hour}:00` }
})

type EditMatchFormProps = {
  matchId: number;
  initialData: AdminMatchDetail;
  onComplete: () => void;
}

export default function EditMatchForm({ matchId, initialData, onComplete }: EditMatchFormProps) {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  const [selectSport, setSelectSport] = useState<SportType>(SportType.ALL);

  // 시설 이름 조회
  const [facilityNames, setFacilityNames] = useState<FacilityNames[]>([]);
  const [selectFacilityName, setSelectFacilityName] = useState<FacilityNames | null>(null);

  // 코트 이름 조회
  const [courtNames, setCourtNames] = useState<CourtName[]>([]);

  // 시설 매니저 이름 조회
  const [managerNames, setManagerNames] = useState<FacilityManagerName[]>([]);

  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ value: string, label: string }[]>([])
  const [loadingManagers, setLoadingManagers] = useState(false)
  const [matchData, setMatchData] = useState({
    title: "",
    sportType: SportType.ALL,
    facilityId: 0,
    facilityName: "",
    address: "",
    matchDate: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    fee: "",
    description: "",
    courtId: 0,
    courtName: "",
    managerId: 0,
    managerName: ""
  })
  
  // 초기 데이터 로드
  useEffect(() => {
    if (initialData) {
      try {
        const matchDate = initialData.matchDate;
        const parsedDate = parse(matchDate, 'yyyy-MM-dd', new Date());
        setDate(parsedDate);
        
        // 시작 시간과 종료 시간 파싱 (숫자 형식)
        let startTimeHour = `${initialData.matchTime.toString().padStart(2, '0')}:00`;
        let endTimeHour = `${initialData.endTime.toString().padStart(2, '0')}:00`;

        // 기본 시간대 설정 (시간 선택이 가능하도록)
        const defaultTimeSlots = Array.from(
          { length: 24 },
          (_, i) => {
            const hour = i;
            const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
            return { value: formattedHour, label: formattedHour };
          }
        );
        setAvailableTimeSlots(defaultTimeSlots);

        // 기본 데이터 설정
        setMatchData({
          title: initialData.matchTitle,
          sportType: initialData.sportType,
          facilityId: initialData.facilityId, 
          facilityName: initialData.facilityName,
          address: initialData.address,
          matchDate: matchDate,
          startTime: startTimeHour,
          endTime: endTimeHour,
          maxParticipants: initialData.teamCapacity.toString(),
          fee: initialData.matchPrice.toString(),
          description: initialData.description || "",
          courtId: initialData.facilityCourtId, 
          courtName: initialData.facilityCourt,
          managerId: initialData.managerId,
          managerName: initialData.managerName
        });
        
        fetchGetFacilities(initialData.sportType);
      } catch (error) {
        console.error("초기 데이터 로드 중 오류 발생:", error);
        toast({
          title: "데이터 로드 오류",
          description: "매치 정보를 로드하는 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      }
    }
  }, [initialData]);

  // 스포츠 타입에 따라 시설 필터링
  useEffect(() => {
    // 스포츠 타입이 변경되면 시설 선택 초기화
    if (!initialData) {
      setMatchData(prev => ({
        ...prev,
        facilityId: 0,
        facilityName: "",
        courtId: 0,
        courtName: "",
        managerId: 0
      }))
      setSelectFacilityName(null);
      setCourtNames([]);
      setManagerNames([])
    }
  }, [matchData.sportType, selectSport])
  
  // 시설 선택에 따라 코트 필터링 및 시설 정보 업데이트
  useEffect(() => {
    if (matchData.facilityId) {
      const facility = facilityNames.find(f => f.facilityId === matchData.facilityId)
      setSelectFacilityName(facility || null);
      
      if (facility) {
        // 시설 주소 자동 설정 및 시간 정보 유지
        setMatchData(prev => ({
          ...prev,
          facilityName: facility.facilityName,
          address: facility.address
        }));
        
        // 먼저 코트 정보 로드
        fetchGetCourts(facility.facilityId);
        
        // 그 다음 매니저 정보 로드
        fetchGetFacilityManger(facility.facilityId);
        
        // 시설 정보가 로드되었으므로 시간 범위를 업데이트 (기존 선택된 시간 유지)
        if (date) {
          updateAvailableTimeSlots(format(date, 'yyyy-MM-dd'));
        }
      }
    }
  }, [matchData.facilityId, facilityNames]);
  
  // 매치 날짜 선택 시 가능한 시간대 업데이트
  useEffect(() => {
    if (date) {
      // 날짜가 선택되면 시간대 업데이트
      updateAvailableTimeSlots(format(date, 'yyyy-MM-dd'));
    } else {
      // 날짜를 선택하지 않은 경우에도 기본 시간대 제공
      const defaultTimeSlots = generateDefaultTimeSlots();
      setAvailableTimeSlots(defaultTimeSlots);
    }
  }, [date]);
  
  // 기본 시간대 생성 함수
  const generateDefaultTimeSlots = () => {
    return Array.from(
      { length: 24 },
      (_, i) => {
        const hour = i;
        const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        return { value: formattedHour, label: formattedHour };
      }
    );
  }

  // 사용 가능 시간대 계산
  const updateAvailableTimeSlots = (selectedDate: string) => {
    try {
      // 기본 시간대 (오전 6시부터 오후 12시까지)
      const defaultTimeSlots = Array.from(
        { length: 19 }, // 6시부터 24시까지 (19개 시간)
        (_, i) => {
          const hour = 6 + i;
          const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
          return { value: `${formattedHour}:00`, label: `${formattedHour}:00` };
        }
      );
      
      // 시설 정보가 없으면 기본 시간대 사용
      if (!selectFacilityName) {
        console.log("시설 정보가 아직 로드되지 않았습니다. 기본 시간대 사용.");
        setAvailableTimeSlots(defaultTimeSlots);
        return;
      }
      
      // 필요한 속성이 있는지 체크
      if (!selectFacilityName.startTime || !selectFacilityName.endTime) {
        console.log("시설의 시작 시간 또는 종료 시간 정보가 없습니다. 기본 시간대 사용.", selectFacilityName);
        setAvailableTimeSlots(defaultTimeSlots);
        return;
      }
      
      // 운영 시간 파싱 (안전하게 처리)
      const openHour = parseInt(selectFacilityName.startTime.split(':')[0]) || 9; // 기본값 9시
      let closeHour = parseInt(selectFacilityName.endTime.split(':')[0]) || 18; // 기본값 18시
      if(closeHour === 0) {
        closeHour = 24;
      }
    
      // 운영 시간 내 시간대 생성
      const operatingTimeSlots = Array.from(
        { length: closeHour - openHour + 1 },
        (_, i) => {
          const hour = openHour + i
          const formattedHour = hour < 10 ? `0${hour}` : `${hour}`
          return { value: `${formattedHour}:00`, label: `${formattedHour}:00` }
        }
      )

      console.log("생성된 시간대:", operatingTimeSlots);
      console.log("현재 선택된 시간:", matchData.startTime, matchData.endTime);
      
      setAvailableTimeSlots(operatingTimeSlots)
    } catch (error) {
      console.error("시간대 계산 중 오류 발생:", error);
      // 오류 발생 시 기본 시간대 설정 (전체 시간대)
      const defaultTimeSlots = Array.from(
        { length: 24 },
        (_, i) => {
          const hour = i;
          const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
          return { value: formattedHour, label: formattedHour };
        }
      );
      setAvailableTimeSlots(defaultTimeSlots);
    }
  }

  // 입력값 변경 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setMatchData(prev => ({ ...prev, [name]: value }))
  }

  // 스포츠 종목별 시설 조회
  const fetchGetFacilities = async (sportType: SportType) => {
    try{
      const facilityNames: FacilityNames[] = await facilityService.getMatchFacilityNames(sportType);
      setFacilityNames(facilityNames);
      
      // 초기 데이터가 있는 경우 시설 ID 찾기
      if (initialData && facilityNames.length > 0) {
        const facility = facilityNames.find(f => f.facilityId === initialData.facilityId);
        if (facility) {
          console.log("시설 정보 찾음:", facility);
          setMatchData(prev => ({
            ...prev,
            facilityId: facility.facilityId
          }));
          setSelectFacilityName(facility);
          
        } else {
          console.log("시설 정보를 찾을 수 없음. 첫 번째 시설 선택:", facilityNames[0]);
          // 일치하는 시설이 없으면 첫 번째 시설 선택
          setMatchData(prev => ({
            ...prev,
            facilityId: facilityNames[0].facilityId,
            facilityName: facilityNames[0].facilityName
          }));
        }
      }
    } catch(error: any) {
      console.log("시설 조회 오류:", error);
      // 에러 메시지 표시
      toast({
        title: "시설 조회 실패",
        description: error?.message || "시설 정보를 불러오는 중 오류가 발생했습니다. 권한을 확인해 주세요.",
        variant: "destructive"
      });
      
      // 에러가 발생해도 폼이 작동하도록 빈 시설 목록 설정
      setFacilityNames([]);
    }
  }

  // 스포츠 종목 변경 처리
  const handleSportChange = (value: SportType) => {
    if (!value) return;

    setSelectSport(value);
    setMatchData(prev => ({...prev, ["sportType"]: value}));
    fetchGetFacilities(value);
  }

  // 코트 조회
  const fetchGetCourts = async (facilityId: number) => {
    try{
      const courts: CourtName[] = await facilityService.getMatchCourtNames(facilityId);
      setCourtNames(courts);
      
      // 초기 데이터가 있는 경우 코트 ID 찾기
      if (initialData && courts.length > 0) {
        const court = courts.find(c => c.courtName === initialData.facilityCourt);
        if (court) {
          handleCourtChange(court.courtId.toString());
        }
      }
    } catch(error: any) {
      // 로그인 페이지로 바로 리디렉션하지 않고 에러 메시지만 표시
      toast({
        title: "코트 조회 실패",
        description: error?.message || "코트 정보를 불러오는 중 오류가 발생했습니다. 권한을 확인해 주세요.",
        variant: "destructive"
      });
    }
  }

  // 시설 관리자 조회
  const fetchGetFacilityManger = async (facilityId: number) => {
    try {
      setLoadingManagers(true);
      const facilityMangers: FacilityManagerName[] = await facilityService.getFacilityMangerNames(facilityId);
      setManagerNames(facilityMangers);
      
      // 매니저 데이터가 있으면 첫 번째 매니저를 기본값으로 설정
      if (facilityMangers.length > 0 && !matchData.managerId) {
        handleManagerChange(matchData.managerId.toString());
      }
    } catch(error: any) {
      console.error("매니저 조회 오류:", error);
      // 에러 메시지 표시
      toast({
        title: "매니저 조회 실패",
        description: error?.message || "매니저 정보를 불러오는 중 오류가 발생했습니다. 권한을 확인해 주세요.",
        variant: "destructive"
      });
      
      // 에러가 발생해도 매니저 선택이 가능하도록 빈 배열 설정
      setManagerNames([]);
    } finally {
      setLoadingManagers(false);
    }
  }

  const handleFacilityChange = (value: string) => {
    if(!value) return;
    setMatchData(prev => ({
      ...prev,
      facilityId: parseInt(value)
    }))
    fetchGetCourts(parseInt(value));
    fetchGetFacilityManger(parseInt(value));
  }

  const handleCourtChange = (value: string) => {
    if(!value) return;
    const selectedCourt = courtNames.find(c => c.courtId === parseInt(value))
    
    setMatchData(prev => ({
      ...prev,
      courtId: parseInt(value),
      courtName: selectedCourt ? selectedCourt.courtName : ""
    }))
  }

  const handleManagerChange = (value: string) => {
    if(!value) return;
    const selectManager = managerNames.find(manager => manager.managerId === parseInt(value));

    setMatchData(prev => ({
      ...prev,
      managerId: parseInt(value),
      managerName: selectManager ? selectManager.managerName : ""
    }))
  }

  const timeFormat = (time: string): string => {
    if (!time || time === "" || time === "none") return "0";
    const [hour, minute] = time.split(":");
    if (hour === undefined) return "0";
    return hour + (minute || "00");
  }

  const fetchPutMatchUpdate = async (params: Record<string, any>) => {
    setIsLoading(true);

    try {
      console.log("매치 수정 데이터:", params);
      
      // 시작 시간과 종료 시간 유효성 검사
      if (!matchData.startTime || !matchData.endTime) {
        toast({
          title: "시간 정보 오류",
          description: "시작 시간과 종료 시간을 확인해 주세요.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      await matchService.updateMatch(matchId, params as any);

      toast({
        title: "매치 수정 완료",
        description: "매치 정보가 성공적으로 수정되었습니다."
      });

      onComplete();
    } catch (error: any) {
      console.error("매치 수정 오류:", error);
      toast({
        title: "매치 수정 실패",
        description: error?.message || "매치 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const backPage = () => {
    router.back();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 필수 필드 검증
    if (!matchData.title.trim()) {
      toast({
        title: "매치 제목 필요",
        description: "매치 제목을 입력해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.sportType) {
      toast({
        title: "스포츠 종목 선택 필요",
        description: "스포츠 종목을 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.facilityId) {
      toast({
        title: "시설 선택 필요",
        description: "매치가 진행될 시설을 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.courtId) {
      toast({
        title: "코트 선택 필요",
        description: "매치가 진행될 코트를 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.matchDate) {
      toast({
        title: "매치 날짜 선택 필요",
        description: "매치 날짜를 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.startTime || !matchData.endTime || matchData.startTime === "none" || matchData.endTime === "none") {
      toast({
        title: "매치 시간 선택 필요",
        description: "매치 시작 및 종료 시간을 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.maxParticipants) {
      toast({
        title: "참가자 수 입력 필요",
        description: "최대 참가자 수를 입력해주세요.",
        variant: "destructive"
      })
      return
    }
    
    if (!matchData.fee) {
      toast({
        title: "참가 비용 입력 필요",
        description: "참가 비용을 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    // 시작 시간과 종료 시간이 올바른지 확인
    const startHour = parseInt(matchData.startTime.split(':')[0]);
    const endHour = parseInt(matchData.endTime.split(':')[0]);
    
    if (endHour <= startHour) {
      toast({
        title: "시간 선택 오류",
        description: "종료 시간은 시작 시간보다 나중이어야 합니다.",
        variant: "destructive"
      });
      return;
    }

    // 매치 업데이트 데이터
    const updateMatch: Record<string, any> = {
      matchTitle: matchData.title,
      matchDate: matchData.matchDate,
      matchTime: startHour,
      endTime: endHour,
      facilityCourtId: matchData.courtId,
      managerId: matchData.managerId,
      teamCapacity: matchData.maxParticipants,
      description: matchData.description || undefined
    }

    console.log("제출 데이터:", updateMatch);
    fetchPutMatchUpdate(updateMatch);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <h2 className="text-2xl font-bold">매치 수정</h2>
      <p className="text-gray-500 mb-6">아래 양식을 작성하여 매치 정보를 수정하세요.</p>
      
      <div className="space-y-4">
        {/* 기본 정보 */}
        <div>
          <Label htmlFor="title" className="text-base font-semibold">매치 제목</Label>
          <Input
            id="title"
            name="title"
            value={matchData.title}
            onChange={handleInputChange}
            placeholder="매치 제목을 입력하세요"
            className="mt-1"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="sportType" className="text-base font-semibold">스포츠 종목</Label>
            <Input
              id="sportType"
              name="sportType"
              value={displaySportName(matchData.sportType)}
              className="mt-1"
              readOnly={true}
            />
          </div>
          
          <div>
            <Label htmlFor="facilityId" className="text-base font-semibold">시설</Label>
            <Input
              id="facilityName"
              name="facilityName"
              value={matchData.facilityName}
              className="mt-1"
              readOnly={true}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="courtId" className="text-base font-semibold">코트</Label>
            <Select 
              value={matchData.courtId.toString()} 
              onValueChange={handleCourtChange}
              disabled={courtNames.length === 0}
            >
              <SelectTrigger id="courtId" className="mt-1">
                <SelectValue placeholder="코트 선택" />
              </SelectTrigger>
              <SelectContent>
                {courtNames.map(court => (
                  <SelectItem 
                    key={court.courtId} 
                    value={court.courtId.toString()}
                  >
                    {court.courtName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="managerId" className="text-base font-semibold">매니저</Label>
            <Select 
              value={matchData.managerId.toString()} 
              onValueChange={handleManagerChange}
              disabled={loadingManagers}
            >
              <SelectTrigger id="managerId" className="mt-1">
                <SelectValue placeholder={loadingManagers ? "로딩 중..." : "매니저 선택"} />
              </SelectTrigger>
              <SelectContent>
                {managerNames.length > 0 ? (
                  managerNames.map(manager => (
                    <SelectItem 
                      key={manager.managerId} 
                      value={manager.managerId.toString()}
                    >
                      {manager.managerName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none">매니저 정보 없음</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 날짜 및 시간 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="text-base font-semibold">매치 날짜</Label>
            <Input
              id="matchDate"
              name="matchDate"
              value={matchData.matchDate}
              className="mt-1"
              readOnly={true}
            />
          </div>
          
          <div>
            <Label htmlFor="startTime" className="text-base font-semibold">시작 시간</Label>
            <Input
              id="startTime"
              name="startTime"
              value={matchData.startTime}
              className="mt-1"
              readOnly={true}
            />
          </div>
          
          <div>
            <Label htmlFor="endTime" className="text-base font-semibold">종료 시간</Label>
            <Input
              id="endTime"
              name="endTime"
              value={matchData.endTime}
              className="mt-1"
              readOnly={true}
            />
          </div>
        </div>
        
        {/* 참가자 및 비용 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="maxParticipants" className="text-base font-semibold">최대 참가자 수</Label>
            <Input
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              min="2"
              value={matchData.maxParticipants}
              onChange={handleInputChange}
              placeholder="예: 8"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="fee" className="text-base font-semibold">참가 비용 (원)</Label>
            <Input
              id="fee"
              name="fee"
              type="number"
              min="0"
              value={matchData.fee}
              onChange={handleInputChange}
              placeholder="예: 10000"
              className="mt-1"
              readOnly={true}
            />
          </div>
        </div>
        
        {/* 설명 */}
        <div>
          <Label htmlFor="description" className="text-base font-semibold">매치 설명 (선택사항)</Label>
          <Textarea
            id="description"
            name="description"
            value={matchData.description}
            onChange={handleInputChange}
            placeholder="매치에 대한 추가 설명을 입력하세요"
            className="mt-1 h-24"
          />
        </div>
      </div>
      
      <Alert className="bg-amber-50 text-amber-800 border-amber-200">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          이미 참가자가 있는 매치의 정보를 수정하는 경우 참가자에게 알림이 발송됩니다.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={backPage}
        >
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "처리 중..." : "매치 수정"}
        </Button>
      </div>
    </form>
  )
} 