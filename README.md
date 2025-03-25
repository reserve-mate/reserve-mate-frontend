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