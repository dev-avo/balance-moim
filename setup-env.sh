#!/bin/bash

# 환경 변수 설정 스크립트

echo "🔧 밸런스 모임 환경 변수 설정"
echo ""

# .env.local 파일이 이미 있는지 확인
if [ -f .env.local ]; then
    echo "⚠️  .env.local 파일이 이미 존재합니다."
    read -p "덮어쓰시겠습니까? (y/N): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "취소되었습니다."
        exit 0
    fi
fi

echo "📝 환경 변수 입력을 시작합니다..."
echo ""

# Google Client ID
read -p "Google OAuth Client ID를 입력하세요: " GOOGLE_CLIENT_ID

# Google Client Secret
read -p "Google OAuth Client Secret을 입력하세요: " GOOGLE_CLIENT_SECRET

# NextAuth Secret 생성
echo ""
echo "🔑 NextAuth Secret을 생성합니다..."
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
echo "생성된 NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""

# NextAuth URL
read -p "NEXTAUTH_URL을 입력하세요 (기본값: http://localhost:3000): " NEXTAUTH_URL
NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}

# .env.local 파일 생성
cat > .env.local << ENVFILE
# Google OAuth
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

# NextAuth
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=$NEXTAUTH_URL
ENVFILE

echo ""
echo "✅ .env.local 파일이 생성되었습니다!"
echo ""
echo "📋 생성된 환경 변수:"
echo "   GOOGLE_CLIENT_ID: $GOOGLE_CLIENT_ID"
echo "   GOOGLE_CLIENT_SECRET: [보안상 표시하지 않음]"
echo "   NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo "   NEXTAUTH_URL: $NEXTAUTH_URL"
echo ""
echo "🚀 이제 'npm run dev'로 개발 서버를 시작할 수 있습니다!"
