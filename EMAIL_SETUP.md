# 이메일 서비스 설정 가이드

이 문서는 TheHFPV 프로젝트에서 이메일 서비스를 설정하는 방법을 설명합니다.

## 지원하는 이메일 서비스

1. **SMTP** (Gmail, Outlook, 기타 SMTP 서버)
2. **SendGrid**
3. **Mailgun**
4. **AWS SES**

## 환경 변수 설정

### 1. SMTP 설정 (Gmail 예시)

```bash
# 이메일 서비스 제공업체 선택
export EMAIL_PROVIDER=smtp

# SMTP 설정
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USERNAME=your-email@gmail.com
export SMTP_PASSWORD=your-app-password
export SMTP_FROM=your-email@gmail.com
export SMTP_FROM_NAME=TheHFPV
```

**Gmail 앱 비밀번호 설정 방법:**
1. Google 계정 설정 → 보안
2. 2단계 인증 활성화
3. 앱 비밀번호 생성
4. 생성된 16자리 비밀번호를 `SMTP_PASSWORD`에 설정

### 2. SendGrid 설정

```bash
# 이메일 서비스 제공업체 선택
export EMAIL_PROVIDER=sendgrid

# SendGrid 설정
export SENDGRID_API_KEY=your-sendgrid-api-key
export SENDGRID_FROM=noreply@yourdomain.com
export SENDGRID_FROM_NAME=TheHFPV
```

**SendGrid API 키 발급 방법:**
1. [SendGrid](https://sendgrid.com/) 계정 생성
2. Settings → API Keys
3. Create API Key
4. Full Access 권한으로 생성

### 3. Mailgun 설정

```bash
# 이메일 서비스 제공업체 선택
export EMAIL_PROVIDER=mailgun

# Mailgun 설정
export MAILGUN_API_KEY=your-mailgun-api-key
export MAILGUN_DOMAIN=your-domain.mailgun.org
export MAILGUN_FROM=noreply@yourdomain.com
export MAILGUN_FROM_NAME=TheHFPV
```

**Mailgun API 키 발급 방법:**
1. [Mailgun](https://www.mailgun.com/) 계정 생성
2. Domains → Add New Domain
3. API Keys 탭에서 Private API key 확인

### 4. AWS SES 설정

```bash
# 이메일 서비스 제공업체 선택
export EMAIL_PROVIDER=aws-ses

# AWS SES 설정
export AWS_ACCESS_KEY=your-aws-access-key
export AWS_SECRET_KEY=your-aws-secret-key
export AWS_REGION=us-east-1
export AWS_SES_FROM=noreply@yourdomain.com
export AWS_SES_FROM_NAME=TheHFPV
```

**AWS SES 설정 방법:**
1. AWS 계정 생성
2. SES 서비스 활성화
3. IAM 사용자 생성 및 SES 권한 부여
4. 도메인 또는 이메일 주소 인증

## 로컬 개발 환경 설정

### 방법 1: 터미널에서 직접 설정 (임시)

```bash
# Gmail SMTP 예시
export EMAIL_PROVIDER=smtp
export SMTP_USERNAME=your-email@gmail.com
export SMTP_PASSWORD=your-app-password
export SMTP_FROM=your-email@gmail.com
export SMTP_FROM_NAME=TheHFPV

# 백엔드 재시작
cd backend && ./gradlew bootRun
```

### 방법 2: setup-env.sh 스크립트 사용 (권장)

```bash
# 스크립트 실행
source setup-env.sh

# 백엔드 재시작
cd backend && ./gradlew bootRun
```

## 테스트 방법

### 1. 백엔드 서버 시작

```bash
cd backend
./gradlew bootRun
```

### 2. 이메일 서비스 테스트

이메일 서비스가 올바르게 설정되었는지 확인하려면:

1. 로그에서 "Email sent successfully" 메시지 확인
2. 실제 이메일 수신 확인
3. 오류 발생 시 로그에서 상세 오류 메시지 확인

### 3. API 테스트

```bash
# 기본 이메일 테스트
curl -X POST http://localhost:8080/api/test/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "테스트 이메일",
    "content": "이것은 테스트 이메일입니다."
  }'

# 인증 이메일 테스트
curl -X POST http://localhost:8080/api/test/email/verification \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "token": "test-token-12345"
  }'
```

## 문제 해결

### 일반적인 문제들

1. **Gmail 인증 실패**
   - 2단계 인증이 활성화되어 있는지 확인
   - 앱 비밀번호를 사용하고 있는지 확인
   - "보안 수준이 낮은 앱 허용" 설정 확인

2. **SendGrid 오류**
   - API 키가 올바른지 확인
   - 도메인이 인증되었는지 확인
   - 계정이 활성화되어 있는지 확인

3. **Mailgun 오류**
   - 도메인이 올바르게 설정되었는지 확인
   - API 키가 올바른지 확인
   - 샌드박스 모드에서 벗어났는지 확인

### 로그 확인

```bash
# 백엔드 로그에서 이메일 관련 오류 확인
tail -f backend/logs/application.log | grep -i email
```

## 보안 주의사항

1. **환경 변수 보안**
   - `.env` 파일을 `.gitignore`에 추가
   - API 키를 코드에 하드코딩하지 않기
   - 프로덕션 환경에서는 안전한 방식으로 환경 변수 관리

2. **이메일 서비스 보안**
   - 최소 권한 원칙 적용
   - 정기적인 API 키 로테이션
   - 이메일 발송 제한 설정

## 다음 단계

이메일 서비스 설정이 완료되면 다음 기능들을 구현할 수 있습니다:

1. 이메일 인증 기능
2. 비밀번호 재설정 기능
3. 환영 이메일 발송
4. 알림 이메일 발송
