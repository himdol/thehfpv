#!/bin/bash

# 이메일 서비스 환경 변수 설정 스크립트
# 사용법: source setup-env.sh

echo "환경 변수를 설정합니다..."

# Google OAuth 설정
echo "Google OAuth 설정을 입력하세요:"
echo -n "Google Client ID: "
read GOOGLE_CLIENT_ID
echo -n "Google Client Secret: "
read GOOGLE_CLIENT_SECRET

echo "이메일 서비스 환경 변수를 설정합니다..."

# 이메일 서비스 제공업체 선택
echo -n "이메일 서비스를 선택하세요 (smtp/sendgrid/mailgun/aws-ses): "
read EMAIL_PROVIDER

case $EMAIL_PROVIDER in
    "smtp")
        echo "SMTP 설정을 입력하세요:"
        echo -n "SMTP 호스트 (기본값: smtp.gmail.com): "
        read SMTP_HOST
        echo -n "SMTP 포트 (기본값: 587): "
        read SMTP_PORT
        echo -n "이메일 주소: "
        read SMTP_USERNAME
        echo -n "앱 비밀번호: "
        read -s SMTP_PASSWORD
        echo
        echo -n "발신자 이메일: "
        read SMTP_FROM
        echo -n "발신자 이름 (기본값: TheHFPV): "
        read SMTP_FROM_NAME
        
        # 기본값 설정
        SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}
        SMTP_PORT=${SMTP_PORT:-587}
        SMTP_FROM_NAME=${SMTP_FROM_NAME:-TheHFPV}
        
        # 환경 변수 설정
        export EMAIL_PROVIDER=smtp
        export SMTP_HOST=$SMTP_HOST
        export SMTP_PORT=$SMTP_PORT
        export SMTP_USERNAME=$SMTP_USERNAME
        export SMTP_PASSWORD=$SMTP_PASSWORD
        export SMTP_FROM=$SMTP_FROM
        export SMTP_FROM_NAME=$SMTP_FROM_NAME
        
        echo "SMTP 설정이 완료되었습니다."
        ;;
        
    "sendgrid")
        echo "SendGrid 설정을 입력하세요:"
        echo -n "SendGrid API 키: "
        read -s SENDGRID_API_KEY
        echo
        echo -n "발신자 이메일: "
        read SENDGRID_FROM
        echo -n "발신자 이름 (기본값: TheHFPV): "
        read SENDGRID_FROM_NAME
        
        SENDGRID_FROM_NAME=${SENDGRID_FROM_NAME:-TheHFPV}
        
        export EMAIL_PROVIDER=sendgrid
        export SENDGRID_API_KEY=$SENDGRID_API_KEY
        export SENDGRID_FROM=$SENDGRID_FROM
        export SENDGRID_FROM_NAME=$SENDGRID_FROM_NAME
        
        echo "SendGrid 설정이 완료되었습니다."
        ;;
        
    "mailgun")
        echo "Mailgun 설정을 입력하세요:"
        echo -n "Mailgun API 키: "
        read -s MAILGUN_API_KEY
        echo
        echo -n "Mailgun 도메인: "
        read MAILGUN_DOMAIN
        echo -n "발신자 이메일: "
        read MAILGUN_FROM
        echo -n "발신자 이름 (기본값: TheHFPV): "
        read MAILGUN_FROM_NAME
        
        MAILGUN_FROM_NAME=${MAILGUN_FROM_NAME:-TheHFPV}
        
        export EMAIL_PROVIDER=mailgun
        export MAILGUN_API_KEY=$MAILGUN_API_KEY
        export MAILGUN_DOMAIN=$MAILGUN_DOMAIN
        export MAILGUN_FROM=$MAILGUN_FROM
        export MAILGUN_FROM_NAME=$MAILGUN_FROM_NAME
        
        echo "Mailgun 설정이 완료되었습니다."
        ;;
        
    "aws-ses")
        echo "AWS SES 설정을 입력하세요:"
        echo -n "AWS Access Key: "
        read AWS_ACCESS_KEY
        echo -n "AWS Secret Key: "
        read -s AWS_SECRET_KEY
        echo
        echo -n "AWS 리전 (기본값: us-east-1): "
        read AWS_REGION
        echo -n "발신자 이메일: "
        read AWS_SES_FROM
        echo -n "발신자 이름 (기본값: TheHFPV): "
        read AWS_SES_FROM_NAME
        
        AWS_REGION=${AWS_REGION:-us-east-1}
        AWS_SES_FROM_NAME=${AWS_SES_FROM_NAME:-TheHFPV}
        
        export EMAIL_PROVIDER=aws-ses
        export AWS_ACCESS_KEY=$AWS_ACCESS_KEY
        export AWS_SECRET_KEY=$AWS_SECRET_KEY
        export AWS_REGION=$AWS_REGION
        export AWS_SES_FROM=$AWS_SES_FROM
        export AWS_SES_FROM_NAME=$AWS_SES_FROM_NAME
        
        echo "AWS SES 설정이 완료되었습니다."
        ;;
        
    *)
        echo "잘못된 선택입니다."
        exit 1
        ;;
esac

# Google OAuth 환경변수 export
export GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
export GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

echo "환경 변수가 설정되었습니다."
echo "Google OAuth 설정:"
echo "  Client ID: $GOOGLE_CLIENT_ID"
echo "  Client Secret: ${GOOGLE_CLIENT_SECRET:0:10}..."
echo "백엔드를 재시작하세요: cd backend && ./gradlew bootRun"
