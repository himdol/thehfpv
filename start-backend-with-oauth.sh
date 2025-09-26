#!/bin/bash

# Google OAuth 환경 변수 설정 (실제 값으로 교체하세요)
# export GOOGLE_CLIENT_ID="your-google-client-id"
# export GOOGLE_CLIENT_SECRET="your-google-client-secret"

echo "Google OAuth 환경 변수 설정 완료:"
echo "GOOGLE_CLIENT_ID: $GOOGLE_CLIENT_ID"
echo "GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:0:10}..."

# 백엔드 디렉토리로 이동
cd backend

# 백엔드 실행
echo "백엔드 시작 중..."
./gradlew bootRun -x checkstyleMain
