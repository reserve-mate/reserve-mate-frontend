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
2. [시설 및 코트 관리 API](#2-시설-및-코트-관리-api)
3. [예약 관리 API](#3-예약-관리-api)
4. [소셜 매치 API](#4-소셜-매치-api)
5. [리뷰 API](#5-리뷰-api)
6. [결제 API](#6-결제-api)
7. [알림 API](#7-알림-api)
8. [대기 목록 API](#8-대기-목록-api)
9. [팀 관리 API](#9-팀-관리-api)
10. [통계/대시보드 API](#10-통계대시보드-api-관리자-전용)

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
    "role": "string" // "ROLE_USER", "ROLE_FACILITY_MANAGER", "ROLE_ADMIN"
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
- **Endpoint**: `/api/users/me/profile`
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
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
  "updatedAt": "timestamp"
}
```
- **Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized

##### 비밀번호 변경 (개선)
- **Endpoint**: `/api/users/me/password`
- **Method**: PUT
- **Headers**: Authorization: Bearer {토큰}
- **요청 본문**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
- **응답**:
```json
{
  "success": "boolean",
  "message": "string",
  "updatedAt": "timestamp"
}
```
- **상태 코드**: 200 성공, 400 잘못된 요청, 401 인증 실패

### 2. 시설 및 코트 관리 API

#### 2.1 시설 조회

##### 시설 목록 조회
- **Endpoint**: `/api/facilities`
- **Method**: GET
- **Query Parameters**:
  - `search`: 검색어 (시설명, 주소)
  - `city`: 도시
  - `district`: 지역구
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "description": "string",
      "address": {
        "city": "string",
        "district": "string",
        "streetAddress": "string",
        "detailAddress": "string"
      },
      "contactPhone": "string",
      "mainImage": "string"
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
  "description": "string",
  "address": {
    "city": "string",
    "district": "string",
    "streetAddress": "string",
    "detailAddress": "string"
  },
  "contactPhone": "string",
  "images": [
    {
      "id": "long",
      "imageUrl": "string",
      "description": "string",
      "main": "boolean",
      "displayOrder": "integer",
      "uploadedAt": "timestamp"
    }
  ],
  "courts": [
    {
      "id": "long",
      "name": "string",
      "sportType": "string",
      "description": "string",
      "capacity": "integer",
      "indoor": "boolean",
      "active": "boolean"
    }
  ],
  "averageRating": "double",
  "reviews": [
    {
      "id": "long",
      "userId": "long",
      "userName": "string",
      "rating": "integer",
      "content": "string",
      "createdAt": "timestamp"
    }
  ]
}
```
- **Status Codes**: 200 OK, 404 Not Found

#### 2.2 코트 조회

##### 코트 목록 조회
- **Endpoint**: `/api/courts`
- **Method**: GET
- **Query Parameters**:
  - `facilityId`: 시설 ID
  - `sportType`: 스포츠 유형 (SOCCER, BASKETBALL, TENNIS, BADMINTON, BASEBALL, GOLF, TABLE_TENNIS, FUTSAL, FITNESS, SQUASH, OTHER)
  - `indoor`: 실내 여부
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "sportType": "string",
      "description": "string",
      "capacity": "integer",
      "indoor": "boolean",
      "active": "boolean",
      "facilityId": "long",
      "facilityName": "string"
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

##### 코트 상세 조회
- **Endpoint**: `/api/courts/{id}`
- **Method**: GET
- **Path Parameters**: id - 코트 ID
- **Response**:
```json
{
  "id": "long",
  "name": "string",
  "sportType": "string",
  "description": "string",
  "capacity": "integer",
  "indoor": "boolean",
  "active": "boolean",
  "facility": {
    "id": "long",
    "name": "string",
    "address": {
      "city": "string",
      "district": "string",
      "streetAddress": "string",
      "detailAddress": "string"
    }
  }
}
```
- **Status Codes**: 200 OK, 404 Not Found

#### 2.3 시설 및 코트 관리 (관리자/시설 관리자 전용)

##### 시설 등록
- **Endpoint**: `/api/admin/facilities`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "address": {
    "city": "string",
    "district": "string",
    "streetAddress": "string",
    "detailAddress": "string"
  },
  "contactPhone": "string"
}
```
- **Response**: 생성된 시설 정보
- **Status Codes**: 201 Created, 400 Bad Request, 403 Forbidden

##### 시설 이미지 추가
- **Endpoint**: `/api/admin/facilities/{facilityId}/images`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: facilityId - 시설 ID
- **Request Body** (multipart/form-data):
  - `image`: 이미지 파일
  - `description`: 이미지 설명
  - `main`: 대표 이미지 여부
  - `displayOrder`: 표시 순서
- **Response**:
```json
{
  "id": "long",
  "imageUrl": "string",
  "description": "string",
  "main": "boolean",
  "displayOrder": "integer",
  "uploadedAt": "timestamp"
}
```
- **Status Codes**: 201 Created, 400 Bad Request, 403 Forbidden, 404 Not Found

##### 코트 등록
- **Endpoint**: `/api/admin/facilities/{facilityId}/courts`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: facilityId - 시설 ID
- **Request Body**:
```json
{
  "name": "string",
  "sportType": "string",
  "description": "string",
  "capacity": "integer",
  "indoor": "boolean",
  "active": "boolean"
}
```
- **Response**: 생성된 코트 정보
- **Status Codes**: 201 Created, 400 Bad Request, 403 Forbidden, 404 Not Found

##### 시설 수정
- **Endpoint**: `/api/admin/facilities/{id}`
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 시설 ID
- **Request Body**: 시설 등록 요청과 동일
- **Response**: 수정된 시설 정보
- **Status Codes**: 200 OK, 400 Bad Request, 403 Forbidden, 404 Not Found

##### 코트 수정
- **Endpoint**: `/api/admin/courts/{id}`
- **Method**: PUT
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 코트 ID
- **Request Body**: 코트 등록 요청과 동일
- **Response**: 수정된 코트 정보
- **Status Codes**: 200 OK, 400 Bad Request, 403 Forbidden, 404 Not Found

##### 시설 삭제
- **Endpoint**: `/api/admin/facilities/{id}`
- **Method**: DELETE
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 시설 ID
- **Response**: 없음
- **Status Codes**: 204 No Content, 403 Forbidden, 404 Not Found

##### 코트 삭제
- **Endpoint**: `/api/admin/courts/{id}`
- **Method**: DELETE
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 코트 ID
- **Response**: 없음
- **Status Codes**: 204 No Content, 403 Forbidden, 404 Not Found

### 3. 예약 관리 API

#### 3.1 예약 조회 및 관리

##### 코트 예약 가능 시간 조회
- **Endpoint**: `/api/courts/{courtId}/available-slots`
- **Method**: GET
- **Path Parameters**: courtId - 코트 ID
- **Query Parameters**:
  - `date`: 날짜 (YYYY-MM-DD)
- **Response**:
```json
{
  "date": "string",
  "timeSlots": [
    {
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
  "courtId": "long",
  "startTime": "dateTime",
  "endTime": "dateTime",
  "totalPrice": "integer"
}
```
- **Response**:
```json
{
  "id": "long",
  "startTime": "dateTime",
  "endTime": "dateTime",
  "status": "string",
  "totalPrice": "integer",
  "createdAt": "timestamp",
  "court": {
    "id": "long",
    "name": "string",
    "sportType": "string"
  },
  "facility": {
    "id": "long",
    "name": "string"
  }
}
```
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized

##### 사용자 예약 목록 조회
- **Endpoint**: `/api/users/me/reservations`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - `status`: 예약 상태 (PENDING, CONFIRMED, CANCELED, COMPLETED)
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "startTime": "dateTime",
      "endTime": "dateTime",
      "status": "string",
      "totalPrice": "integer",
      "createdAt": "timestamp",
      "court": {
        "id": "long",
        "name": "string",
        "sportType": "string"
      },
      "facility": {
        "id": "long",
        "name": "string"
      }
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
  "startTime": "dateTime",
  "endTime": "dateTime",
  "status": "string",
  "cancelReason": "string",
  "canceledAt": "dateTime",
  "totalPrice": "integer",
  "createdAt": "timestamp",
  "court": {
    "id": "long",
    "name": "string",
    "sportType": "string",
    "facility": {
      "id": "long",
      "name": "string",
      "address": {
        "city": "string",
        "district": "string",
        "streetAddress": "string",
        "detailAddress": "string"
      }
    }
  },
  "payment": {
    "id": "long",
    "amount": "integer",
    "status": "string",
    "payMethod": "string",
    "paidAt": "dateTime"
  },
  "waitingList": {
    "id": "long",
    "status": "string"
  }
}
```
- **Status Codes**: 200 OK, 401 Unauthorized, 403 Forbidden, 404 Not Found

##### 예약 취소
- **Endpoint**: `/api/reservations/{id}/cancel`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 예약 ID
- **Request Body**:
```json
{
  "reason": "string"
}
```
- **Response**:
```json
{
  "id": "long",
  "status": "string",
  "cancelReason": "string",
  "canceledAt": "dateTime"
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
  - `matchDate`: 날짜 (YYYY-MM-DD)
  - `matchStatus`: 매치 상태 (FINISH, CLOSE_TO_DEADLINE, APPLICABLE)
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "matchId": "long",
      "manager": "string",
      "matchStatus": "string",
      "teamCapacity": "integer",
      "description": "string",
      "matchDate": "date",
      "matchTime": "integer",
      "matchPrice": "integer",
      "court": {
        "id": "long",
        "name": "string",
        "sportType": "string",
        "facility": {
          "id": "long",
          "name": "string"
        }
      },
      "currentPlayers": "integer"
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
  "matchId": "long",
  "manager": "string",
  "matchStatus": "string",
  "teamCapacity": "integer",
  "description": "string",
  "matchDate": "date",
  "matchTime": "integer",
  "matchPrice": "integer",
  "court": {
    "id": "long",
    "name": "string",
    "sportType": "string",
    "capacity": "integer",
    "indoor": "boolean",
    "facility": {
      "id": "long",
      "name": "string",
      "address": {
        "city": "string",
        "district": "string",
        "streetAddress": "string",
        "detailAddress": "string"
      },
      "contactPhone": "string"
    }
  },
  "players": [
    {
      "playerId": "long",
      "status": "string",
      "user": {
        "id": "long",
        "name": "string"
      }
    }
  ]
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
  "courtId": "long",
  "teamCapacity": "integer",
  "description": "string",
  "matchDate": "date",
  "matchTime": "integer",
  "matchPrice": "integer"
}
```
- **Response**: 생성된 매치 정보
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized

##### 소셜 매치 참여
- **Endpoint**: `/api/matches/{id}/join`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 매치 ID
- **Response**:
```json
{
  "playerId": "long",
  "status": "string",
  "user": {
    "id": "long",
    "name": "string"
  },
  "match": {
    "matchId": "long"
  }
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
  "playerId": "long",
  "status": "string",
  "user": {
    "id": "long",
    "name": "string"
  },
  "match": {
    "matchId": "long"
  }
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
  "rating": "integer",
  "content": "string"
}
```
- **Response**:
```json
{
  "id": "long",
  "rating": "integer",
  "content": "string",
  "createdAt": "timestamp",
  "user": {
    "id": "long",
    "name": "string"
  },
  "facility": {
    "id": "long",
    "name": "string"
  }
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
      "rating": "integer",
      "content": "string",
      "createdAt": "timestamp",
      "user": {
        "id": "long",
        "name": "string"
      }
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

### 6. 결제 API

##### 결제 생성
- **Endpoint**: `/api/payments`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "reservationId": "long",
  "amount": "integer",
  "payMethod": "string" // "CARD", "POINT", "CASH"
}
```
- **Response**:
```json
{
  "id": "long",
  "impUid": "string",
  "merchantUid": "string",
  "amount": "integer",
  "status": "string",
  "payMethod": "string",
  "paidAt": "dateTime",
  "reservation": {
    "id": "long"
  }
}
```
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized

##### 결제 상세 조회
- **Endpoint**: `/api/payments/{id}`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 결제 ID
- **Response**:
```json
{
  "id": "long",
  "impUid": "string",
  "merchantUid": "string",
  "amount": "integer",
  "status": "string",
  "payMethod": "string",
  "paidAt": "dateTime",
  "canceledAt": "dateTime",
  "cancelReason": "string",
  "reservation": {
    "id": "long",
    "startTime": "dateTime",
    "endTime": "dateTime",
    "court": {
      "id": "long",
      "name": "string"
    }
  }
}
```
- **Status Codes**: 200 OK, 401 Unauthorized, 404 Not Found

##### 결제 취소
- **Endpoint**: `/api/payments/{id}/cancel`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 결제 ID
- **Request Body**:
```json
{
  "reason": "string"
}
```
- **Response**:
```json
{
  "id": "long",
  "status": "string",
  "canceledAt": "dateTime",
  "cancelReason": "string"
}
```
- **Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found

### 7. 알림 API

##### 알림 목록 조회
- **Endpoint**: `/api/notifications`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - `read`: 읽음 여부
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "type": "string",
      "content": "string",
      "method": "string",
      "read": "boolean",
      "sentAt": "dateTime",
      "readAt": "dateTime",
      "reservation": {
        "id": "long"
      },
      "payment": {
        "id": "long"
      }
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

##### 알림 읽음 표시
- **Endpoint**: `/api/notifications/{id}/read`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 알림 ID
- **Response**:
```json
{
  "id": "long",
  "read": "boolean",
  "readAt": "dateTime"
}
```
- **Status Codes**: 200 OK, 401 Unauthorized, 404 Not Found

### 8. 대기 목록 API

##### 대기 목록 등록
- **Endpoint**: `/api/waiting-lists`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "courtId": "long",
  "date": "date",
  "startTime": "time",
  "endTime": "time"
}
```
- **Response**:
```json
{
  "id": "long",
  "date": "date",
  "startTime": "time",
  "endTime": "time",
  "status": "string",
  "court": {
    "id": "long",
    "name": "string"
  }
}
```
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized

##### 사용자 대기 목록 조회
- **Endpoint**: `/api/users/me/waiting-lists`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - `status`: 대기 상태 (WAITING, NOTIFIED, RESERVED, CANCELED, EXPIRED)
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "date": "date",
      "startTime": "time",
      "endTime": "time",
      "status": "string",
      "court": {
        "id": "long",
        "name": "string",
        "facility": {
          "id": "long",
          "name": "string"
        }
      }
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

##### 대기 취소
- **Endpoint**: `/api/waiting-lists/{id}/cancel`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: id - 대기 목록 ID
- **Response**:
```json
{
  "id": "long",
  "status": "string"
}
```
- **Status Codes**: 200 OK, 401 Unauthorized, 404 Not Found

### 9. 팀 관리 API

##### 팀 생성
- **Endpoint**: `/api/teams`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response**:
```json
{
  "id": "long",
  "name": "string",
  "description": "string",
  "createdAt": "timestamp"
}
```
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized

##### 팀 목록 조회
- **Endpoint**: `/api/teams`
- **Method**: GET
- **Query Parameters**:
  - `search`: 검색어
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
- **Response**:
```json
{
  "content": [
    {
      "id": "long",
      "name": "string",
      "description": "string",
      "memberCount": "integer"
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

##### 팀 상세 조회
- **Endpoint**: `/api/teams/{id}`
- **Method**: GET
- **Path Parameters**: id - 팀 ID
- **Response**:
```json
{
  "id": "long",
  "name": "string",
  "description": "string",
  "members": [
    {
      "id": "long",
      "role": "string",
      "joinedAt": "dateTime",
      "user": {
        "id": "long",
        "name": "string",
        "profileImage": "string"
      }
    }
  ]
}
```
- **Status Codes**: 200 OK, 404 Not Found

##### 팀원 추가
- **Endpoint**: `/api/teams/{teamId}/members`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: teamId - 팀 ID
- **Request Body**:
```json
{
  "userId": "long",
  "role": "string" // "OWNER", "ADMIN", "MEMBER"
}
```
- **Response**:
```json
{
  "id": "long",
  "role": "string",
  "joinedAt": "dateTime",
  "team": {
    "id": "long"
  },
  "user": {
    "id": "long",
    "name": "string"
  }
}
```
- **Status Codes**: 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden

##### 팀원 제거
- **Endpoint**: `/api/teams/{teamId}/members/{memberId}`
- **Method**: DELETE
- **Headers**: Authorization: Bearer {token}
- **Path Parameters**: 
  - teamId - 팀 ID
  - memberId - 팀원 ID
- **Response**: 없음
- **Status Codes**: 204 No Content, 401 Unauthorized, 403 Forbidden, 404 Not Found

### 10. 통계/대시보드 API (관리자 전용)

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
  "popularCourts": [
    {
      "courtId": "long",
      "courtName": "string",
      "sportType": "string",
      "reservationCount": "integer",
      "revenue": "integer"
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

##### 사용자 통계
- **Endpoint**: `/api/admin/statistics/users`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - `startDate`: 시작 날짜 (YYYY-MM-DD)
  - `endDate`: 종료 날짜 (YYYY-MM-DD)
- **Response**:
```json
{
  "totalUsers": "integer",
  "newUsers": "integer",
  "activeUsers": "integer",
  "topUsers": [
    {
      "userId": "long",
      "userName": "string",
      "reservationCount": "integer",
      "totalSpent": "integer"
    }
  ],
  "dailySignups": [
    {
      "date": "string",
      "count": "integer"
    }
  ]
}
```
- **Status Codes**: 200 OK, 401 Unauthorized, 403 Forbidden