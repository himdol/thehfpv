# TheHFPV Project

이 프로젝트는 React와 TypeScript를 사용한 프론트엔드와 Java Spring Boot를 사용한 백엔드로 구성된 풀스택 웹 애플리케이션입니다.

## 🛠️ 기술 스택

### Frontend
- **React 19** - 사용자 인터페이스 라이브러리
- **TypeScript** - 정적 타입 검사
- **CSS3** - 스타일링

### Backend
- **Java 17** - 프로그래밍 언어
- **Spring Boot 3.2.0** - 웹 프레임워크
- **Spring Security** - 인증/인가
- **Spring Data JPA** - 데이터 접근 계층
- **MySQL** - 데이터베이스
- **Gradle** - 빌드 도구
- **Checkstyle** - 코드 스타일 검사
- **JaCoCo** - 코드 커버리지

## 📦 설치 및 실행

### 풀스택 개발 환경 설정

#### 방법 1: 자동 스크립트 사용 (권장)
```bash
# Linux/Mac - 기존 프로세스 자동 종료 후 실행
./start-dev.sh

# Windows - 기존 프로세스 자동 종료 후 실행
start-dev.bat
```

#### 방법 2: npm 스크립트 사용
```bash
# 의존성 설치
npm run install:all

# 프론트엔드와 백엔드를 동시에 실행 (포트 정리 포함)
npm run dev

# 포트만 정리하고 싶을 때
npm run kill-ports
```

#### 방법 3: 개별 실행
```bash
# 프론트엔드만 실행
npm start

# 백엔드만 실행
cd backend && ./gradlew bootRun
```

### 빌드

```bash
# Frontend 프로덕션 빌드
npm run build

# Backend JAR 파일 빌드
cd backend
./gradlew bootJar
```

## 🎯 주요 기능

### Frontend
- 반응형 디자인
- 모던한 UI/UX
- TypeScript 지원
- 컴포넌트 기반 아키텍처

### Backend
- RESTful API
- JWT 기반 인증
- 사용자 관리 시스템
- 데이터베이스 연동

## 📁 프로젝트 구조

```
thehfpv/
├── src/                    # Frontend 소스 코드
│   ├── components/         # React 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── contexts/          # React Context
│   ├── services/          # API 서비스
│   └── types/             # TypeScript 타입 정의
├── backend/               # Backend 소스 코드
│   ├── src/main/java/com/thehfpv/
│   │   ├── controller/    # REST 컨트롤러
│   │   ├── service/       # 비즈니스 로직
│   │   ├── repository/    # 데이터 접근 계층
│   │   ├── model/         # 엔티티 클래스
│   │   └── config/        # 설정 클래스
│   ├── build.gradle      # Gradle 설정
│   ├── settings.gradle   # Gradle 프로젝트 설정
│   └── gradle.properties # Gradle 속성
├── package.json          # Frontend 의존성
└── README.md            # 프로젝트 문서
```

## 🔧 스크립트

### 풀스택 실행
- `./start-dev.sh` (Linux/Mac) 또는 `start-dev.bat` (Windows) - 기존 프로세스 종료 후 프론트엔드와 백엔드 동시 실행
- `npm run dev` - npm을 통한 풀스택 실행 (포트 정리 포함)
- `npm run kill-ports` - 3000, 8080 포트의 기존 프로세스 종료
- `npm run install:all` - 모든 의존성 설치

### Frontend
- `npm start` - React 개발 서버 실행 (http://localhost:3000)
- `npm run build` - 프로덕션용 빌드
- `npm run test` - 테스트 실행

### Backend
- `./gradlew bootRun` - Spring Boot 애플리케이션 실행 (http://localhost:8080)
- `./gradlew bootJar` - JAR 파일 빌드
- `./gradlew test` - 테스트 실행
- `./gradlew checkstyleMain` - 코드 스타일 검사
- `./gradlew jacocoTestReport` - 코드 커버리지 리포트 생성

## �� 라이선스

MIT License
