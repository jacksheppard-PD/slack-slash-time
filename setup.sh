#!/bin/bash

# Slack Time Bot Setup Script
echo "🚀 Setting up Slack Time Bot..."

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
    echo "After updating .env, run: node app.js"
else
    echo "✅ .env file found"
    echo "🚀 Starting bot..."
    node app.js
fi
