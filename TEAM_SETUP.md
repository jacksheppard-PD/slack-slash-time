# 🚀 Team Setup Guide - Slack Time Bot

This guide will help your team admin install the Time Bot in your team's Slack workspace.

## 📋 **What This Bot Does**

- **Command**: `/time` - Shows current time in London, Barbados, and France
- **Features**: 
  - Natural language parsing (e.g., `/time 2pm`, `/time fri 09:30`)
  - Uses sender's timezone as reference
  - Ephemeral responses (only visible to command sender)
  - Clean time format: `🇬🇧 14:30`

## 🔧 **Setup Instructions for Team Admin**

### **Step 1: Create Slack App**

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"** → **"From scratch"**
3. **App Name**: `Time Bot` (or your preferred name)
4. **Workspace**: Select your team's workspace
5. Click **"Create App"**

### **Step 2: Configure App Credentials**

1. **Go to "Basic Information"** → **"App-Level Tokens"**
2. Click **"Generate Token and Scopes"**
3. **Add scope**: `connections:write`
4. **Copy the token** (starts with `xapp-`) → This is your `SLACK_APP_TOKEN`

5. **Go to "OAuth & Permissions"**
6. Under **"Bot Token Scopes"**, add:
   - `commands`
   - `users:read`
7. Click **"Install to Workspace"** and authorize
8. **Copy the "Bot User OAuth Token"** (starts with `xoxb-`) → This is your `SLACK_BOT_TOKEN`

9. **Go to "App Credentials"**
10. **Copy the "Signing Secret"** → This is your `SLACK_SIGNING_SECRET`

### **Step 3: Enable Socket Mode**

1. Go to **"Socket Mode"** (in left sidebar)
2. **Toggle "Enable Socket Mode" to ON**
3. **Save changes**

### **Step 4: Create Slash Command**

1. Go to **"Slash Commands"**
2. Click **"Create New Command"**
3. Configure:
   - **Command**: `/time`
   - **Request URL**: Leave empty (Socket Mode)
   - **Short Description**: `Get time in London, Barbados, and France`
   - **Usage Hint**: `[optional time like "2pm"]`
4. **Save changes**

### **Step 5: Deploy the Bot**

#### **Option A: Run on Your Computer (Simple)**
1. **Download the bot files** from your team member
2. **Create `.env` file** with your tokens:
   ```
   SLACK_SIGNING_SECRET=your_signing_secret_here
   SLACK_BOT_TOKEN=xoxb-your_bot_token_here
   SLACK_APP_TOKEN=xapp-your_app_token_here
   
   # Timezone configuration (optional - defaults work fine)
   LONDON_TZ=Europe/London
   LONDON_LABEL=London
   LONDON_EMOJI=:flag-gb:
   
   BARBADOS_TZ=America/Barbados
   BARBADOS_LABEL=Barbados
   BARBADOS_EMOJI=:flag-bb:
   
   FRANCE_TZ=Europe/Paris
   FRANCE_LABEL=France
   FRANCE_EMOJI=:flag-fr:
   ```
3. **Install dependencies**: `npm install`
4. **Start the bot**: `node app.js`
5. **Keep your computer running** (or use a server)

#### **Option B: Deploy to Cloud Server (Recommended)**
1. **Deploy to Heroku/Railway/DigitalOcean**
2. **Set environment variables** in your hosting platform
3. **Bot runs 24/7** without needing your computer

## ✅ **Testing**

Once installed, test in any Slack channel:
- `/time` - Current time in all zones
- `/time 2pm` - 2:00 PM in all zones
- `/time fri 09:30` - Friday 9:30 AM in all zones

## 🔒 **Security Notes**

- **Keep your tokens secure** - don't share them publicly
- **Only team admins** should have access to app settings
- **The bot only responds to `/time` commands** - it won't post publicly

## 🆘 **Troubleshooting**

**Bot not responding?**
- Check if Socket Mode is enabled
- Verify all tokens are correct in `.env`
- Make sure the bot process is running

**Command not found?**
- Check if `/time` slash command is created
- Verify the command is installed in your workspace

**Need help?** Contact your team member who set up the bot initially.

---

**Bot created by**: [Your Name]  
**Last updated**: [Current Date]
