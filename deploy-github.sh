#!/bin/bash

# GitHub Deployment Script for Slack Time Bot
echo "🚀 Deploying Slack Time Bot to GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Check if we have a remote origin
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  No GitHub remote found."
    echo "📝 Please create a new repository on GitHub first:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Name it 'slack-time-bot' (or whatever you prefer)"
    echo "   3. Don't initialize with README (we have files already)"
    echo "   4. Copy the repository URL"
    echo ""
    read -p "🔗 Enter your GitHub repository URL: " github_url
    
    if [ -n "$github_url" ]; then
        git remote add origin "$github_url"
        echo "✅ GitHub remote added"
    else
        echo "❌ No URL provided. Please run this script again with your GitHub URL."
        exit 1
    fi
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "Deploy Slack Time Bot - $(date)"
    echo "✅ Changes committed"
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Successfully pushed to GitHub!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Go to https://railway.app (recommended) or https://heroku.com"
    echo "   2. Sign up with GitHub"
    echo "   3. Create new project from GitHub repo"
    echo "   4. Add environment variables:"
    echo "      - SLACK_BOT_TOKEN=xoxb-your-token"
    echo "      - SLACK_SIGNING_SECRET=your-secret"
    echo "      - SLACK_APP_TOKEN=xapp-your-token"
    echo "   5. Deploy!"
    echo ""
    echo "📖 See GITHUB_DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Failed to push to GitHub"
    echo "💡 Make sure you have access to the repository"
    exit 1
fi
