# 🚀 Quick Start Guide for Your Team

## What This Bot Does

Your team can now use `/time` in Slack to get timezone information for London, Barbados, and France!

### Examples:
- `/time` - Current time in all timezones
- `/time 2pm` - 2pm in all timezones  
- `/time barbados 9am` - 9am in Barbados, equivalent times elsewhere
- `/time london 2pm` - 2pm in London, equivalent times elsewhere

## For Team Admins: Setting Up the Bot

### Option 1: Simple Setup (Recommended)

1. **Download the bot files** to your server
2. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```
3. **Follow the prompts** to configure your Slack app credentials
4. **Done!** Your team can now use `/time`

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your Slack app tokens
   ```

3. **Start the bot:**
   ```bash
   npm start
   ```

## For Team Members: Using the Bot

### Basic Usage
- Type `/time` in any channel or DM
- Click "Post time in this channel" to share with everyone
- Works just like Giphy!

### Advanced Usage
- `/time barbados 9am` - Shows 9am in Barbados
- `/time london 2pm` - Shows 2pm in London  
- `/time france 10:30` - Shows 10:30 in France
- `/time tomorrow 09:30` - Tomorrow at 9:30 AM
- `/time fri 9:30` - Next Friday at 9:30 AM

## Customization

Want different timezones? Edit the `.env` file:

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

## Troubleshooting

**Bot not responding?**
- Check if it's running: `pm2 status` (if using PM2)
- Check logs: `pm2 logs slack-time-bot`
- Restart: `pm2 restart slack-time-bot`

**Need help?**
- Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions
- Verify your Slack app has all required permissions
- Make sure Socket Mode is enabled in your Slack app

## Production Deployment

For production use, install PM2 for process management:

```bash
npm install -g pm2
pm2 start app.js --name slack-time-bot
pm2 startup
pm2 save
```

This ensures the bot restarts automatically if it crashes and runs in the background.

---

**That's it!** Your team now has a powerful timezone bot that works just like Giphy. 🎉
