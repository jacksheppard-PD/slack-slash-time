# Quick Setup Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Slack App
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name: "Time Bot", Select your workspace
4. Click "Create App"

### 3. Configure App
1. **Enable Socket Mode**: Socket Mode → Toggle ON → Generate App Token (`xapp-...`)
2. **Add Bot Scopes**: OAuth & Permissions → Add `commands`, `users:read` → Install to Workspace → Copy Bot Token (`xoxb-...`)
3. **Create Slash Command**: Slash Commands → Create New Command:
   - Command: `/time`
   - Request URL: `https://your-ngrok-url.ngrok.io/slack/events`
   - Description: `Get time in London and Barbados`
   - Usage Hint: `[optional time like "2pm"]`
4. **Get Signing Secret**: Basic Information → Copy Signing Secret

### 4. Configure Environment
```bash
cp env.example .env
# Edit .env with your tokens
```

### 5. Start Bot
```bash
npm start
```

### 6. Test Commands
- `/time` - Current time
- `/time 2pm` - 2:00 PM in both zones
- `/time fri 09:30` - Friday 9:30 AM

## ✅ Success Indicators
- Bot shows: "⚡️ Slack Time Bot is running!"
- Commands work in Slack
- Times display correctly in both timezones

## 🔧 Troubleshooting
- **Command not found**: Check slash command URL matches ngrok
- **Connection failed**: Verify tokens in .env
- **Invalid time**: Check chrono-node parsing
