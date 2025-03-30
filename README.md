# ReserveMate - 스포츠 시설 예약 시스템

ReserveMate는 사용자가 쉽게 스포츠 시설을 검색하고 예약할 수 있는 웹 애플리케이션입니다. 다양한 스포츠 시설을 찾아보고, 온라인으로 간편하게 예약하세요. 소셜 매치 기능을 통해 함께 운동할 파트너도 찾을 수 있습니다.

## 주요 기능

- 스포츠 시설 검색 및 예약
- 소셜 매치 참여
- 예약 관리 및 결제
- 사용자 프로필 관리

## 기술 스택

- **프론트엔드**:
  - Next.js 15.1.0
  - React 19
  - TypeScript
  - Tailwind CSS
  - shadcn/ui (Radix UI 기반)
  - React Hook Form
  - Zod

## 시작하기

### 사전 요구사항

- Node.js 18.0.0 이상
- pnpm (권장) 또는 npm/yarn

### 처음부터 환경 설정하기 (Windows/macOS)

#### Windows에서 설정하기

1. **Node.js 설치**:
   - [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전을 다운로드하고 설치합니다.
   - 설치 확인: 명령 프롬프트(cmd)를 열고 다음 명령어 실행
     ```
     node --version
     npm --version
     ```

2. **Git 설치**:
   - [Git 공식 웹사이트](https://git-scm.com/download/win)에서 Git을 다운로드하고 설치합니다.
   - 설치 확인: 명령 프롬프트에서 다음 명령어 실행
     ```
     git --version
     ```

3. **pnpm 설치** (권장):
   - 명령 프롬프트에서 다음 명령어 실행
     ```
     npm install -g pnpm
     ```
   - 설치 확인:
     ```
     pnpm --version
     ```

#### macOS에서 설정하기

1. **Homebrew 설치** (권장):
   - 터미널에서 다음 명령어 실행
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```

2. **Node.js 설치**:
   - Homebrew를 통해 설치 (권장):
     ```bash
     brew install node
     ```
   - 또는 [Node.js 공식 웹사이트](https://nodejs.org/)에서 macOS 버전 다운로드 후 설치
   - 설치 확인:
     ```bash
     node --version
     npm --version
     ```

3. **Git 설치**:
   - Homebrew를 통해 설치:
     ```bash
     brew install git
     ```
   - 설치 확인:
     ```bash
     git --version
     ```

4. **pnpm 설치** (권장):
   - Homebrew를 통해 설치:
     ```bash
     brew install pnpm
     ```
   - 또는 npm을 통해 설치:
     ```bash
     npm install -g pnpm
     ```
   - 설치 확인:
     ```bash
     pnpm --version
     ```

### 프로젝트 설치 및 실행

1. 저장소를 클론합니다:

```bash
git clone https://github.com/reserve-mate/reserve-mate-frontend.git
cd reserve-mate
```

2. 의존성을 설치합니다:

```bash
# pnpm 사용 (권장)
pnpm install

# 또는 npm 사용
npm install

# 또는 yarn 사용
yarn install
```

3. 개발 서버를 실행합니다:

```bash
# pnpm 사용 (권장)
pnpm dev

# 또는 npm 사용
npm run dev

# 또는 yarn 사용
yarn dev
```

4. 브라우저에서 http://localhost:3000 으로 접속하여 애플리케이션을 확인합니다.

### 문제 해결

- **모듈을 찾을 수 없는 오류**: 의존성을 다시 설치해보세요.
  ```bash
  rm -rf node_modules
  pnpm install
  ```

- **포트 3000이 이미 사용 중인 경우**: 다른 포트로 실행할 수 있습니다.
  ```bash
  pnpm dev -- -p 3001
  ```

- **Node.js 버전 문제**: 프로젝트는 Node.js 18.0.0 이상이 필요합니다. nvm을 사용하여 버전을 관리할 수 있습니다.
  - Windows: [nvm-windows](https://github.com/coreybutler/nvm-windows)
  - macOS: 
    ```bash
    brew install nvm
    nvm install 18
    nvm use 18
    ```

## 스크립트

- `pnpm dev`: 개발 서버 실행
- `pnpm build`: 프로덕션용 빌드 생성
- `pnpm start`: 프로덕션 모드로 서버 실행
- `pnpm lint`: 코드 린팅 실행

## 디렉토리 구조

```
/app               - Next.js 앱 라우터
  /admin           - 관리자 페이지
  /facilities      - 시설 관련 페이지
  /login           - 로그인 페이지
  /matches         - 소셜 매치 페이지
  /profile         - 사용자 프로필 페이지
  /reservations    - 예약 관리 페이지
  /signup          - 회원가입 페이지
/components        - 재사용 가능한 컴포넌트
  /ui              - UI 컴포넌트
/hooks             - 커스텀 React 훅
/lib               - 유틸리티 함수 및 헬퍼
/public            - 정적 파일
/styles            - 글로벌 스타일
```

## API 명세서

### 목차
1. [사용자 관리 API](#1-사용자-관리-api)
2. [시설 관리 API](#2-시설-관리-api)
3. [예약 관리 API](#3-예약-관리-api)
4. [소셜 매치 API](#4-소셜-매치-api)
5. [리뷰 API](#5-리뷰-api)
6. [통계/대시보드 API](#6-통계대시보드-api-관리자-전용)

### 1. 사용자 관리 API

#### 1.1 인증 관련

##### 회원가입
- **Endpoint**: `/api/auth/signup`
- **Method**: POST
- **Request Body**:
```json
{
  "email": "string", 
  "password": "string",
  "name": "string",
  "phone": "string"
}
```
- **Response**: 
```json
{
  "id": "long",
  "email": "string",
  "name": "string",
  "phone": "string",
  "createdAt": "timestamp"
}
```
- **Status Codes**: 201 Created, 400 Bad Request

##### 로그인
- **Endpoint**: `/api/auth/login`
- **Method**: POST
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "token": "string",
  "user": {
    "id": "long",
    "email": "string",
    "name": "string",
    "role": "string" // "USER", "ADMIN", "FACILITY_MANAGER"
  }
}
```
- **Status Codes**: 200 OK, 401 Unauthorized

##### 사용자 정보 조회
- **Endpoint**: `/api/users/me`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Response**:
```json
{
  "id": "long",
  "email": "string",
  "name": "string",
  "phone": "string",
  "profileImage": "string",
  "createdAt": "timestamp",
  "role": "string"
}
```
- **Status Codes**: 200 OK, 401 Unauthorized

##### 사용자 정보 수정
- **Endpoint**: `/api/users/me`
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "name": "string",
  "phone": "string",
  "profileImage": "string"
}
```
- **Response**:
```json
{
  "id": "long",
  "email": "string",
  "name": "string",
  "phone": "string",
  "profileImage": "string",
  "updatedAt": "timestamp"
}
```
- **Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized

### 2. 시설 관리 API

#### 2.1 시설 조회

##### 시설 목록 조회
- **Endpoint**: `/api/facilities`
- **Method**: GET
- **Query Parameters**:
  - `search`: 검색어 (시설명, 주소)
  - `sportType`: 스포츠 종류
  - `minPrice`: 최소 가격
  - `maxPrice`: 최대 가격
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "address": "string",
      "sportType": "string",
      "rating": "double",
      "priceRange": "string",
      "imageUrl": "string",
      "description": "string"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int",
    "totalElements": "long",
    "totalPages": "int"
  }
}
```
- **Status Codes**: 200 OK

##### 시설 상세 조회
- **Endpoint**: `/api/facilities/{id}`
- **Method**: GET
- **Path Parameters**: id - 시설 ID
- **Response**:
```json
{
  "id": "long",
  "name": "string",
  "address": "string",
  "sportType": "string",
  "rating": "double",
  "priceRange": "string",
  "imageUrl": "string",
  "description": "string",
  "amenities": ["string"],
  "operationHours": {
    "monday": "string",
    "tuesday": "string",
    "wednesday": "string",
    "thursday": "string",
    "friday": "string",
    "saturday": "string",
    "sunday": "string"
  },
  "reviews": [
    {
      "id": "long",
      "userId": "long",
      "userName": "string",
      "rating": "double",
      "comment": "string",
      "createdAt": "timestamp"
    }
  ]
}
```
- **Status Codes**: 200 OK, 404 Not Found

#### 2.2 시설 관리 (관리자/시설 관리자 전용)

##### 시설 등록
- **Endpoint**: `/api/admin/facilities`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "name": "string",
  "address": "string",
  "sportType": "string",
  "priceRange": "string",
  "imageUrl": "string",
  "description": "string",
  "amenities": ["string"],
  "operationHours": {
    "monday": "string",
    "tuesday": "string",
    "wednesday": "string",
    "thursday": "string",
    "friday": "string",
    "saturday": "string",
    "sunday": "string"
  }
}
```
- **Response**: 생성된 시설 정보 (시설 상세 조회 응답과 동일)
- **Status Codes**: 201 Created, 400 Bad Request, 403 Forbidden

##### 시설 수정
- **Endpoint**: `/api/admin/facilities/{id}`
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 시설 ID
- **Request Body**: 시설 등록 요청과 동일
- **Response**: 수정된 시설 정보
- **Status Codes**: 200 OK, 400 Bad Request, 403 Forbidden, 404 Not Found

##### 시설 삭제
- **Endpoint**: `/api/admin/facilities/{id}`
- **Method**: DELETE
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 시설 ID
- **Response**: 없음
- **Status Codes**: 204 No Content, 403 Forbidden, 404 Not Found

### 3. 예약 관리 API

#### 3.1 예약 조회 및 관리

##### 시설 예약 가능 시간 조회
- **Endpoint**: `/api/facilities/{facilityId}/available-slots`
- **Method**: GET
- **Path Parameters**: facilityId - 시설 ID
- **Query Parameters**:
  - `date`: 날짜 (YYYY-MM-DD)
- **Response**:
```json
{
  "date": "string",
  "timeSlots": [
    {
      "id": "long",
      "startTime": "string",
      "endTime": "string",
      "available": "boolean",
      "price": "integer"
    }
  ]
}
```
- **Status Codes**: 200 OK, 404 Not Found

##### 예약 생성
- **Endpoint**: `/api/reservations`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "facilityId": "long",
  "slotId": "long",
  "date": "string",
  "numberOfPeople": "integer",
  "paymentMethod": "string"
}
```
- **Response**:
```json
{
  "id": "long",
  "facilityId": "long",
  "facilityName": "string",
  "date": "string",
  "startTime": "string",
  "endTime": "string",
  "status": "string", // "PENDING", "CONFIRMED", "CANCELLED"
  "totalPrice": "integer",
  "createdAt": "timestamp"
}
```
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized

##### 사용자 예약 목록 조회
- **Endpoint**: `/api/users/me/reservations`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - `status`: 예약 상태 (PENDING, CONFIRMED, CANCELLED)
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "facilityId": "long",
      "facilityName": "string",
      "facilityImage": "string",
      "date": "string",
      "startTime": "string",
      "endTime": "string",
      "status": "string",
      "totalPrice": "integer",
      "createdAt": "timestamp"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int",
    "totalElements": "long",
    "totalPages": "int"
  }
}
```
- **Status Codes**: 200 OK, 401 Unauthorized

##### 예약 상세 조회
- **Endpoint**: `/api/reservations/{id}`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 예약 ID
- **Response**:
```json
{
  "id": "long",
  "facilityId": "long",
  "facilityName": "string",
  "facilityImage": "string",
  "facilityAddress": "string",
  "date": "string",
  "startTime": "string",
  "endTime": "string",
  "numberOfPeople": "integer",
  "status": "string",
  "totalPrice": "integer",
  "paymentMethod": "string",
  "paymentStatus": "string",
  "createdAt": "timestamp"
}
```
- **Status Codes**: 200 OK, 401 Unauthorized, 403 Forbidden, 404 Not Found

##### 예약 취소
- **Endpoint**: `/api/reservations/{id}/cancel`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 예약 ID
- **Response**:
```json
{
  "id": "long",
  "status": "string",
  "cancelledAt": "timestamp",
  "refundAmount": "integer"
}
```
- **Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

### 4. 소셜 매치 API

#### 4.1 소셜 매치 조회 및 참여

##### 소셜 매치 목록 조회
- **Endpoint**: `/api/matches`
- **Method**: GET
- **Query Parameters**:
  - `sportType`: 스포츠 종류
  - `date`: 날짜 (YYYY-MM-DD)
  - `minSkillLevel`: 최소 스킬 레벨
  - `maxSkillLevel`: 최대 스킬 레벨
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "title": "string",
      "facilityId": "long",
      "facilityName": "string",
      "sportType": "string",
      "date": "string",
      "startTime": "string",
      "endTime": "string",
      "totalSlots": "integer",
      "availableSlots": "integer",
      "skillLevel": "string",
      "pricePerPerson": "integer",
      "imageUrl": "string"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int",
    "totalElements": "long",
    "totalPages": "int"
  }
}
```
- **Status Codes**: 200 OK

##### 소셜 매치 상세 조회
- **Endpoint**: `/api/matches/{id}`
- **Method**: GET
- **Path Parameters**: id - 매치 ID
- **Response**:
```json
{
  "id": "long",
  "title": "string",
  "facilityId": "long",
  "facilityName": "string",
  "facilityAddress": "string",
  "sportType": "string",
  "date": "string",
  "startTime": "string",
  "endTime": "string",
  "totalSlots": "integer",
  "availableSlots": "integer",
  "participants": [
    {
      "userId": "long",
      "userName": "string",
      "skillLevel": "string"
    }
  ],
  "skillLevel": "string",
  "pricePerPerson": "integer",
  "description": "string",
  "host": {
    "userId": "long",
    "userName": "string"
  },
  "createdAt": "timestamp"
}
```
- **Status Codes**: 200 OK, 404 Not Found

##### 소셜 매치 생성
- **Endpoint**: `/api/matches`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "title": "string",
  "facilityId": "long",
  "date": "string",
  "startTime": "string",
  "endTime": "string",
  "totalSlots": "integer",
  "skillLevel": "string",
  "pricePerPerson": "integer",
  "description": "string"
}
```
- **Response**: 생성된 매치 정보
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized

##### 소셜 매치 참여
- **Endpoint**: `/api/matches/{id}/join`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 매치 ID
- **Request Body**:
```json
{
  "paymentMethod": "string"
}
```
- **Response**:
```json
{
  "matchId": "long",
  "userId": "long",
  "status": "string", // "JOINED"
  "paymentAmount": "integer",
  "joinedAt": "timestamp"
}
```
- **Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found

##### 소셜 매치 참여 취소
- **Endpoint**: `/api/matches/{id}/cancel`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 매치 ID
- **Response**:
```json
{
  "matchId": "long",
  "userId": "long",
  "status": "string", // "CANCELLED"
  "refundAmount": "integer",
  "cancelledAt": "timestamp"
}
```
- **Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found

### 5. 리뷰 API

##### 리뷰 작성
- **Endpoint**: `/api/facilities/{facilityId}/reviews`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: facilityId - 시설 ID
- **Request Body**:
```json
{
  "rating": "double",
  "comment": "string"
}
```
- **Response**:
```json
{
  "id": "long",
  "facilityId": "long",
  "userId": "long",
  "userName": "string",
  "rating": "double",
  "comment": "string",
  "createdAt": "timestamp"
}
```
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized

##### 시설 리뷰 목록 조회
- **Endpoint**: `/api/facilities/{facilityId}/reviews`
- **Method**: GET
- **Path Parameters**: facilityId - 시설 ID
- **Query Parameters**:
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "userId": "long",
      "userName": "string",
      "rating": "double",
      "comment": "string",
      "createdAt": "timestamp"
    }
  ],
  "pageable": {
    "pageNumber": "int",
    "pageSize": "int",
    "totalElements": "long",
    "totalPages": "int"
  }
}
```
- **Status Codes**: 200 OK, 404 Not Found

### 6. 통계/대시보드 API (관리자 전용)

##### 시설별 예약 통계
- **Endpoint**: `/api/admin/statistics/facilities/{facilityId}`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: facilityId - 시설 ID
- **Query Parameters**:
  - `startDate`: 시작 날짜 (YYYY-MM-DD)
  - `endDate`: 종료 날짜 (YYYY-MM-DD)
- **Response**:
```json
{
  "facilityId": "long",
  "facilityName": "string",
  "totalReservations": "integer",
  "totalRevenue": "integer",
  "averageRating": "double",
  "popularTimeSlots": [
    {
      "startTime": "string",
      "endTime": "string",
      "count": "integer"
    }
  ],
  "dailyStats": [
    {
      "date": "string",
      "reservations": "integer",
      "revenue": "integer"
    }
  ]
}
```
- **Status Codes**: 200 OK, 401 Unauthorized, 403 Forbidden, 404 Not Found