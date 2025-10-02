# 🚀 GitHub Deployment - Super Simple!

Since your team uses GitHub, this is the **easiest** way to deploy your Slack Time Bot.

## 🎯 Two Options (Both Super Easy)

### Option 1: Railway (Recommended - 5 minutes) ⭐
### Option 2: Heroku (Also easy - 10 minutes)

---

## 🚀 Option 1: Railway Deployment (EASIEST)

### Step 1: Push to GitHub
```bash
# If you haven't already, initialize git
git init
git add .
git commit -m "Initial Slack Time Bot"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/yourusername/slack-time-bot.git
git push -u origin main
```

### Step 2: Deploy with Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `slack-time-bot` repository
5. Railway automatically detects it's a Node.js app and deploys!

### Step 3: Set Environment Variables
In Railway dashboard:
1. Go to your project → "Variables" tab
2. Add these variables:
   ```
   SLACK_BOT_TOKEN=xoxb-your-token-here
   SLACK_SIGNING_SECRET=your-secret-here
   SLACK_APP_TOKEN=xapp-your-token-here
   ```
3. Railway automatically restarts your app

### Step 4: Done! 🎉
Your bot is now live and your team can use `/time` in Slack!

---

## 🚀 Option 2: Heroku Deployment

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy with Heroku
```bash
# Install Heroku CLI
# Then:
heroku create your-slack-time-bot
git push heroku main
```

### Step 3: Set Environment Variables
```bash
heroku config:set SLACK_BOT_TOKEN=xoxb-your-token-here
heroku config:set SLACK_SIGNING_SECRET=your-secret-here
heroku config:set SLACK_APP_TOKEN=xapp-your-token-here
```

### Step 4: Done! 🎉

---

## 🔧 What You Need from Slack

### 1. Create Slack App
- Go to [api.slack.com/apps](https://api.slack.com/apps)
- Click "Create New App" → "From scratch"
- Name: "Time Bot", Workspace: your workspace

### 2. Enable Socket Mode
- Go to "Socket Mode" → Toggle ON
- Generate App Token with `connections:write` scope
- Copy the App Token (starts with `xapp-`)

### 3. Add Bot Scopes
- Go to "OAuth & Permissions"
- Add these scopes:
  - `commands`
  - `users:read`
  - `im:write`
  - `chat:write`
- Click "Install to Workspace"
- Copy Bot Token (starts with `xoxb-`)

### 4. Create Slash Command
- Go to "Slash Commands" → "Create New Command"
- Command: `/time`
- Description: `Get time in London, Barbados, and France`
- Usage Hint: `[optional time like "2pm" or "barbados 9am"]`
- Leave Request URL empty (Socket Mode)

### 5. Get Signing Secret
- Go to "Basic Information"
- Copy "Signing Secret"

---

## 🎯 Why This is Perfect for Your Team

### ✅ **Zero Server Management**
- No servers to maintain
- No SSL certificates to configure
- No PM2 or process management

### ✅ **Automatic Deployments**
- Push to GitHub → Auto-deploys
- Your team can contribute via GitHub
- Version control built-in

### ✅ **Easy Updates**
- Edit code → Push to GitHub → Auto-updates
- Your team can make changes via pull requests

### ✅ **Built-in Monitoring**
- Railway/Heroku provide logs and monitoring
- Automatic restarts if the bot crashes

### ✅ **Team Collaboration**
- Everyone can see the code on GitHub
- Easy to add new timezones or features
- Pull request workflow for changes

---

## 🚀 Quick Start Commands

### For Railway:
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy Slack Time Bot"
git push origin main

# 2. Go to railway.app, connect GitHub repo
# 3. Add environment variables in Railway dashboard
# 4. Done!
```

### For Heroku:
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy Slack Time Bot"
git push origin main

# 2. Deploy to Heroku
heroku create your-slack-time-bot
git push heroku main

# 3. Set environment variables
heroku config:set SLACK_BOT_TOKEN=xoxb-your-token
heroku config:set SLACK_SIGNING_SECRET=your-secret
heroku config:set SLACK_APP_TOKEN=xapp-your-token

# 4. Done!
```

---

## 🎉 What Your Team Gets

### **Professional Deployment**
- HTTPS automatically configured
- Automatic scaling
- Built-in monitoring and logs
- Zero downtime deployments

### **Easy Collaboration**
- GitHub workflow for changes
- Easy to add new features
- Version control and rollbacks
- Team can contribute via pull requests

### **Maintenance-Free**
- No server management
- Automatic restarts
- Built-in error handling
- Easy to monitor

---

## 💡 Pro Tips

### **For Team Updates:**
- Anyone can submit a pull request to add features
- Easy to add new timezones by editing `.env` variables
- Changes deploy automatically when merged

### **For Monitoring:**
- Railway: Check logs in dashboard
- Heroku: `heroku logs --tail`

### **For Customization:**
- Edit timezones in Railway/Heroku environment variables
- No code changes needed for basic customization

---

**This is the perfect setup for your team!** 🚀

GitHub + Railway/Heroku = Zero server management + Easy team collaboration + Professional deployment
