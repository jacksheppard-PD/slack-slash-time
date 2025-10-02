#!/bin/bash

# Slack Time Bot Deployment Script
echo "🚀 Deploying Slack Time Bot..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your Slack app credentials"
    echo "   You can get these from: https://api.slack.com/apps"
    echo ""
    echo "Required tokens:"
    echo "   - SLACK_BOT_TOKEN (starts with xoxb-)"
    echo "   - SLACK_APP_TOKEN (starts with xapp-)"
    echo "   - SLACK_SIGNING_SECRET"
    echo ""
    echo "After updating .env, run: npm start"
    exit 1
fi

echo "✅ .env file found"

# Check if PM2 is installed for production deployment
if command -v pm2 &> /dev/null; then
    echo "🔄 PM2 detected. Starting bot with PM2..."
    pm2 start app.js --name "slack-time-bot"
    pm2 save
    echo "✅ Bot started with PM2"
    echo "📊 View logs: pm2 logs slack-time-bot"
    echo "🔄 Restart: pm2 restart slack-time-bot"
else
    echo "⚠️  PM2 not installed. Starting bot directly..."
    echo "💡 For production, install PM2: npm install -g pm2"
    echo "🚀 Starting bot..."
    node app.js
fi
