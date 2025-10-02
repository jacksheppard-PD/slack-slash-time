# 🚀 Team Installation Guide - Slack Time Bot

## 📋 **Quick Installation (Recommended)**

### **Step 1: Deploy the Bot**
Choose one of these deployment options:

#### **Option A: Railway (Easiest)**
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your `slack-slash-time` repository
5. Railway will automatically deploy your bot
6. Copy the deployment URL (e.g., `https://your-app.railway.app`)

#### **Option B: Heroku**
1. Go to [Heroku.com](https://heroku.com)
2. Create a new app
3. Connect your GitHub repository
4. Enable automatic deploys
5. Copy the app URL (e.g., `https://your-app.herokuapp.com`)

### **Step 2: Create Slack App**
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From an app manifest"
4. Select your workspace
5. Copy and paste the contents of `slack-app-manifest.json`
6. **Important**: Replace `https://your-app-url.railway.app` with your actual deployment URL
7. Click "Create"

### **Step 3: Configure Environment Variables**
1. In your Slack app settings, go to "Basic Information"
2. Copy the "App-Level Token" (starts with `xapp-`)
3. Go to "OAuth & Permissions"
4. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### **Step 4: Set Environment Variables**
In your deployment platform (Railway/Heroku):

**Railway:**
1. Go to your project dashboard
2. Click "Variables" tab
3. Add these variables:
   - `SLACK_BOT_TOKEN` = `xoxb-your-bot-token`
   - `SLACK_APP_TOKEN` = `xapp-your-app-token`

**Heroku:**
1. Go to your app dashboard
2. Click "Settings" → "Config Vars"
3. Add the same variables as above

### **Step 5: Install to Workspace**
1. In your Slack app, go to "Install App"
2. Click "Install to Workspace"
3. Authorize the permissions
4. Your bot is now installed! 🎉

---

## 🔧 **Manual Installation (Advanced)**

If you prefer to set up everything manually:

### **1. Clone the Repository**
```bash
git clone https://github.com/jacksheppard-PD/slack-slash-time.git
cd slack-slash-time
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment**
```bash
cp env.example .env
# Edit .env with your tokens
```

### **4. Run the Bot**
```bash
npm start
```

### **5. Configure Slack App**
- Create app at [api.slack.com/apps](https://api.slack.com/apps)
- Set up slash command `/time`
- Configure OAuth scopes: `commands`, `users:read`, `im:write`, `chat:write`
- Enable Socket Mode
- Install to workspace

---

## 🎯 **Testing Your Installation**

Once installed, test the bot:

1. **Basic time check:**
   ```
   /time
   ```

2. **Country-specific time:**
   ```
   /time barbados 9am
   ```

3. **Post to channel:**
   - Click the "Post time in this channel" button
   - Should appear as a public message

---

## 🆘 **Troubleshooting**

### **Bot not responding?**
- Check that environment variables are set correctly
- Verify the bot is running (check deployment logs)
- Ensure Socket Mode is enabled in Slack app settings

### **Permission errors?**
- Make sure all required OAuth scopes are enabled
- Reinstall the app to refresh permissions

### **Deployment issues?**
- Check deployment logs for errors
- Verify all dependencies are installed
- Ensure environment variables are set

---

## 📞 **Need Help?**

- Check the main [README.md](README.md) for detailed setup
- Review [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deployment options
- See [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) for GitHub-specific instructions

---

## 🎉 **You're All Set!**

Your team can now use the Time Bot to coordinate across timezones. The bot supports:
- ✅ Current time display across 3 timezones
- ✅ Country-specific time parsing
- ✅ Interactive buttons for posting to channels
- ✅ Works in both channels and DMs
