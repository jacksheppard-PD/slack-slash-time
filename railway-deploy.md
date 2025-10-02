# 🚂 Railway Deployment Guide

## **One-Click Deployment**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/deploy?template=https://github.com/jacksheppard-PD/slack-slash-time)

## **Manual Deployment Steps**

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select `slack-slash-time` repository
   - Railway will automatically detect it's a Node.js app

3. **Set Environment Variables**
   - Go to your project dashboard
   - Click "Variables" tab
   - Add these variables:
     ```
     SLACK_BOT_TOKEN=xoxb-your-bot-token-here
     SLACK_APP_TOKEN=xapp-your-app-token-here
     ```

4. **Get Your App URL**
   - Railway will provide a URL like `https://your-app.railway.app`
   - Copy this URL for the Slack app manifest

5. **Configure Slack App**
   - Use the `slack-app-manifest.json` file
   - Replace `https://your-app-url.railway.app` with your actual Railway URL
   - Create the Slack app and install to workspace

## **Railway Advantages**
- ✅ Automatic deployments from GitHub
- ✅ Built-in environment variable management
- ✅ Free tier available
- ✅ Easy scaling
- ✅ Built-in monitoring

## **Cost**
- **Free tier**: 500 hours/month (enough for most teams)
- **Pro tier**: $5/month for unlimited usage
