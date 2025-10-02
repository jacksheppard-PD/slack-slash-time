# 🚀 Slack Time Bot - Team Deployment Guide

This guide will help you deploy the Slack Time Bot for your entire team to use.

## 📋 What This Bot Does

- **Command**: `/time` - Shows current time in London, Barbados, and France
- **Features**: 
  - Natural language parsing (e.g., `/time 2pm`, `/time fri 09:30`)
  - Country-specific parsing (e.g., `/time barbados 9am`)
  - Uses sender's timezone as reference
  - Ephemeral responses (only visible to command sender)
  - "Post time in this channel" button for sharing
  - Clean time format with flag emojis

## 🎯 Deployment Options

### Option 1: Deploy to Your Own Server (Recommended)

#### Prerequisites
- A server with Node.js 18+ installed
- Domain name or IP address
- SSL certificate (required for Slack)

#### Steps

1. **Upload the bot files to your server**
   ```bash
   # Copy all files to your server
   scp -r . user@your-server.com:/path/to/slack-bot/
   ```

2. **Install dependencies**
   ```bash
   cd /path/to/slack-bot/
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Slack app credentials
   ```

4. **Set up process management (PM2)**
   ```bash
   npm install -g pm2
   pm2 start app.js --name "slack-time-bot"
   pm2 startup
   pm2 save
   ```

5. **Set up reverse proxy (Nginx)**
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Option 2: Deploy to Cloud Platform

#### Heroku Deployment

1. **Create Heroku app**
   ```bash
   heroku create your-slack-time-bot
   ```

2. **Set environment variables**
   ```bash
   heroku config:set SLACK_BOT_TOKEN=xoxb-your-token
   heroku config:set SLACK_SIGNING_SECRET=your-secret
   heroku config:set SLACK_APP_TOKEN=xapp-your-token
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy Slack Time Bot"
   git push heroku main
   ```

#### Railway Deployment

1. **Connect your GitHub repository**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically**

#### DigitalOcean App Platform

1. **Create new app**
2. **Connect GitHub repository**
3. **Set environment variables**
4. **Deploy**

## 🔧 Slack App Configuration

### Step 1: Create Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "Time Bot") and select your workspace
4. Click "Create App"

### Step 2: Configure App Settings

#### Enable Socket Mode
1. Go to "Socket Mode" in the left sidebar
2. Toggle "Enable Socket Mode" to ON
3. Generate an App Token with `connections:write` scope
4. Copy the App Token (starts with `xapp-`)

#### Add Bot Token Scopes
1. Go to "OAuth & Permissions"
2. Add these Bot Token Scopes:
   - `commands`
   - `users:read`
   - `im:write`
   - `chat:write`
3. Click "Install to Workspace"
4. Copy the Bot User OAuth Token (starts with `xoxb-`)

#### Create Slash Command
1. Go to "Slash Commands"
2. Click "Create New Command"
3. Fill in:
   - **Command**: `/time`
   - **Request URL**: Leave empty (Socket Mode)
   - **Short Description**: `Get time in London, Barbados, and France`
   - **Usage Hint**: `[optional time like "2pm" or "barbados 9am"]`
4. Click "Save"

#### Get Signing Secret
1. Go to "Basic Information"
2. Copy the "Signing Secret"

### Step 3: Environment Variables

Create a `.env` file with:

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_TOKEN=xapp-your-app-token-here

# Optional: Customize timezone labels and emojis
TZ1_ZONE=Europe/London
TZ1_EMOJI=:flag-gb:
TZ1_LABEL=London
TZ2_ZONE=America/Barbados
TZ2_EMOJI=:flag-bb:
TZ2_LABEL=Barbados
TZ3_ZONE=Europe/Paris
TZ3_EMOJI=:flag-fr:
TZ3_LABEL=France
```

## 🚀 Starting the Bot

### Local Development
```bash
npm start
```

### Production (PM2)
```bash
pm2 start app.js --name "slack-time-bot"
pm2 logs slack-time-bot  # View logs
pm2 restart slack-time-bot  # Restart if needed
```

## 📱 Usage Examples

### Basic Commands
- `/time` - Show current time in all timezones
- `/time 2pm` - Show 2:00 PM in all timezones
- `/time 14:30` - Show 2:30 PM in all timezones

### Country-Specific Parsing
- `/time barbados 9am` - Show 9:00 AM from Barbados perspective
- `/time london 2pm` - Show 2:00 PM from London perspective
- `/time france 10:30` - Show 10:30 AM from France perspective

### Natural Language
- `/time tomorrow 09:30` - Tomorrow at 9:30 AM
- `/time fri 9:30` - Next Friday at 9:30 AM
- `/time next monday 14:00` - Next Monday at 2:00 PM

### Output Format
```
Time zones for "barbados 9am" (from barbados perspective)
🇬🇧 14:00
🇧🇧 09:00
🇫🇷 15:00
[Post time in this channel]
```

## 🔧 Customization

### Change Timezones

Edit the environment variables in `.env`:

```env
TZ1_ZONE=America/New_York
TZ1_EMOJI=:flag-us:
TZ1_LABEL=New York
TZ2_ZONE=Europe/London
TZ2_EMOJI=:flag-gb:
TZ2_LABEL=London
TZ3_ZONE=Asia/Tokyo
TZ3_EMOJI=:flag-jp:
TZ3_LABEL=Tokyo
```

### Add More Timezones

Edit `app.js` to add more zones:

```javascript
const TARGET_TIMEZONES = {
  zone1: { /* existing */ },
  zone2: { /* existing */ },
  zone3: { /* existing */ },
  zone4: {
    zone: process.env.TZ4_ZONE || 'Australia/Sydney',
    emoji: process.env.TZ4_EMOJI || ':flag-au:',
    label: process.env.TZ4_LABEL || 'Sydney'
  }
};
```

## 🐛 Troubleshooting

### Common Issues

1. **"Command not found"**
   - Ensure the slash command is created in Slack App settings
   - Check that Socket Mode is enabled

2. **"Invalid signing secret"**
   - Verify your `SLACK_SIGNING_SECRET` in `.env`
   - Make sure there are no extra spaces or characters

3. **"Socket mode connection failed"**
   - Check your `SLACK_APP_TOKEN` in `.env`
   - Ensure Socket Mode is enabled in Slack App settings

4. **"Button not working"**
   - Verify you have `im:write` and `chat:write` scopes
   - Check the bot logs for error messages

### Debug Mode

To see detailed logs:
```bash
export DEBUG=slack-bot*
npm start
```

### Check Bot Status

```bash
pm2 status
pm2 logs slack-time-bot
```

## 📞 Support

If you encounter issues:

1. Check the bot logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all required Slack app permissions are granted
4. Test the bot in a DM first before using in channels

## 🎉 Success!

Once deployed, your team can use `/time` in any channel or DM to get timezone information. The bot will work exactly like Giphy - showing a preview first, then allowing users to post the time publicly in the channel.

---

**Need help?** Check the logs first, then refer to the troubleshooting section above.
