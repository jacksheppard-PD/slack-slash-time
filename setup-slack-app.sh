#!/bin/bash

# Slack Time Bot - Setup Script
# This script helps configure the Slack app after deployment

echo "🚀 Slack Time Bot Setup"
echo "======================"
echo ""

# Check if we're in the right directory
if [ ! -f "slack-app-manifest.json" ]; then
    echo "❌ Error: slack-app-manifest.json not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "📋 Setup Checklist:"
echo ""
echo "1. ✅ Deploy your bot to Railway/Heroku"
echo "2. ✅ Get your deployment URL (e.g., https://your-app.railway.app)"
echo "3. ✅ Set environment variables in your deployment platform"
echo "4. ✅ Create Slack app using the manifest"
echo "5. ✅ Install to your workspace"
echo ""

# Ask for deployment URL
read -p "🌐 Enter your deployment URL (e.g., https://your-app.railway.app): " DEPLOY_URL

if [ -z "$DEPLOY_URL" ]; then
    echo "❌ Error: Deployment URL is required"
    exit 1
fi

# Update the manifest with the actual URL
echo "📝 Updating manifest with your deployment URL..."

# Create a temporary file with the updated manifest
sed "s|https://your-app-url.railway.app|$DEPLOY_URL|g" slack-app-manifest.json > slack-app-manifest-updated.json

echo "✅ Updated manifest saved as: slack-app-manifest-updated.json"
echo ""

echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Go to https://api.slack.com/apps"
echo "2. Click 'Create New App' → 'From an app manifest'"
echo "3. Select your workspace"
echo "4. Copy and paste the contents of 'slack-app-manifest-updated.json'"
echo "5. Click 'Create'"
echo "6. Go to 'Install App' and install to your workspace"
echo ""

echo "🔑 Environment Variables Needed:"
echo "================================"
echo ""
echo "In your deployment platform (Railway/Heroku), set these variables:"
echo ""
echo "SLACK_BOT_TOKEN=xoxb-your-bot-token-here"
echo "SLACK_APP_TOKEN=xapp-your-app-token-here"
echo ""

echo "🎉 You're all set! Test your bot with: /time"
echo ""

# Display the updated manifest
echo "📄 Updated Manifest:"
echo "==================="
cat slack-app-manifest-updated.json
