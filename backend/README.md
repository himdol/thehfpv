# TheHFPV Backend

Spring Boot 기반의 백엔드 API 서버입니다.

## 기술 스택

- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL
- Gradle
- Checkstyle (Google Java Style)
- JaCoCo (Code Coverage)

## 프로젝트 구조

```
src/main/java/com/thehfpv/
├── ThehfpvBackendApplication.java    # 메인 애플리케이션 클래스
├── config/                          # 설정 클래스들
│   └── SecurityConfig.java          # 보안 설정
├── controller/                      # REST 컨트롤러들
│   ├── AuthController.java          # 인증 관련 API
│   └── TestController.java          # 테스트 API
├── model/                          # 엔티티 클래스들
│   └── User.java                   # 사용자 엔티티
├── repository/                     # 데이터 접근 계층
│   └── UserRepository.java         # 사용자 리포지토리
├── service/                        # 비즈니스 로직 계층
├── dto/                           # 데이터 전송 객체
└── security/                      # 보안 관련 클래스들
```

## API 엔드포인트

### 인증 (Authentication)
- `POST /api/auth/register` - 사용자 회원가입
- `POST /api/auth/login` - 사용자 로그인

### 테스트 (Test)
- `GET /api/test/hello` - Hello 메시지
- `GET /api/test/health` - 서버 상태 확인

## 실행 방법

### 1. 데이터베이스 설정
MySQL 데이터베이스를 설치하고 `thehfpv_db` 데이터베이스를 생성하세요.

```sql
CREATE DATABASE thehfpv_db;
```

### 2. 애플리케이션 설정
`src/main/resources/application.yml` 파일에서 데이터베이스 연결 정보를 수정하세요.

### 3. 애플리케이션 실행

#### Gradle을 사용한 실행
```bash
cd backend
./gradlew bootRun
```

#### JAR 파일로 실행
```bash
cd backend
./gradlew bootJar
java -jar build/libs/thehfpv-backend-1.0.0.jar
```

## 개발 환경 설정

### 필요한 도구
- Java 17 이상
- Gradle 8.5 이상
- MySQL 8.0 이상

### IDE 설정
- IntelliJ IDEA 또는 Eclipse
- Spring Boot 플러그인 설치 권장

## API 테스트

서버가 실행되면 다음 URL로 테스트할 수 있습니다:

- http://localhost:8080/api/test/hello
- http://localhost:8080/api/test/health

## 🔧 스크립트

### Gradle 명령어
- `./gradlew bootRun` - Spring Boot 애플리케이션 실행 (http://localhost:8080)
- `./gradlew bootJar` - JAR 파일 빌드
- `./gradlew test` - 테스트 실행
- `./gradlew checkstyleMain` - 코드 스타일 검사
- `./gradlew jacocoTestReport` - 코드 커버리지 리포트 생성
- `./gradlew buildWithChecks` - 코드 품질 검사와 함께 빌드

### 풀스택 실행
프로젝트 루트에서 다음 명령어로 프론트엔드와 백엔드를 동시에 실행할 수 있습니다:
- `./start-dev.sh` (Linux/Mac)
- `start-dev.bat` (Windows)
- `npm run dev` (npm 스크립트)

## 개발 가이드

### 새로운 API 추가
1. `controller` 패키지에 컨트롤러 클래스 생성
2. `service` 패키지에 비즈니스 로직 구현
3. `repository` 패키지에 데이터 접근 계층 구현
4. `model` 패키지에 엔티티 클래스 생성 (필요시)

### 보안 설정
- Spring Security를 사용한 인증/인가
- CORS 설정으로 프론트엔드와의 통신 허용
- JWT 토큰 기반 인증 (향후 구현 예정)
