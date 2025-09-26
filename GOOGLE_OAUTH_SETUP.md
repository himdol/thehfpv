# Google OAuth 설정 가이드

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성 및 OAuth 2.0 클라이언트 ID 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services** → **Credentials** 이동
4. **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs** 선택
5. **Application type**: Web application 선택
6. **Name**: 원하는 이름 입력
7. **Authorized redirect URIs**에 다음 URI 추가:
   ```
   http://localhost:8080/api/login/oauth2/code/google
   ```

### 1.2 클라이언트 ID와 시크릿 복사
- **Client ID**와 **Client Secret**을 복사하여 저장

## 2. 환경 변수 설정

### 2.1 로컬 개발 환경
`.env` 파일을 생성하거나 환경 변수를 설정:

```bash
export GOOGLE_CLIENT_ID="your-google-client-id"
export GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2.2 application-local.yml 설정
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID:your-google-client-id}
            client-secret: ${GOOGLE_CLIENT_SECRET:your-google-client-secret}
            scope:
              - openid
              - profile
              - email
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
```

## 3. 테스트

### 3.1 백엔드 실행
```bash
cd backend
./gradlew bootRun
```

### 3.2 프론트엔드 실행
```bash
npm start
```

### 3.3 OAuth 로그인 테스트
1. http://localhost:3000 접속
2. 로그인 페이지에서 "Google" 버튼 클릭
3. Google 인증 완료 후 자동 로그인 확인

## 4. 문제 해결

### 4.1 "redirect_uri_mismatch" 에러
- Google Cloud Console에서 Authorized redirect URIs 확인
- 정확한 URI: `http://localhost:8080/api/login/oauth2/code/google`

### 4.2 "invalid_client" 에러
- Client ID와 Client Secret 확인
- 환경 변수 설정 확인

### 4.3 OAuth 콜백 후 로그인 상태가 안보이는 경우
- 브라우저 개발자 도구에서 네트워크 탭 확인
- `/api/session/user` 요청 응답 확인
- 세션 쿠키 설정 확인

## 5. 보안 주의사항

⚠️ **중요**: 
- Client Secret은 절대 공개 저장소에 커밋하지 마세요
- 환경 변수나 별도 설정 파일을 사용하세요
- 프로덕션 환경에서는 HTTPS를 사용하세요