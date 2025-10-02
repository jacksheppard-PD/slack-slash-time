# Slack Time Bot

A Slack bot that provides a `/time` slash command to display times in multiple timezones (London, Barbados, and France).

## Features

- **Natural Language Parsing**: Accepts time inputs like "2pm", "tomorrow 09:30", "fri 9:30"
- **Multi-Timezone Display**: Shows times in Europe/London, America/Barbados, and Europe/Paris
- **User Timezone Aware**: Uses the caller's Slack timezone as reference
- **Ephemeral Responses**: Only visible to the command caller
- **Error Handling**: Graceful error messages with usage examples

## Setup Instructions

### 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "Time Bot") and select your workspace
4. Click "Create App"

### 2. Configure App Settings

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
   - **Request URL**: `https://your-ngrok-url.ngrok.io/slack/events` (use your ngrok URL)
   - **Short Description**: `Get time in London and Barbados`
   - **Usage Hint**: `[optional time like "2pm" or "tomorrow 09:30"]`
4. Click "Save"

#### Get Signing Secret
1. Go to "Basic Information"
2. Copy the "Signing Secret" (starts with a long string)

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file:

```bash
cp env.example .env
```

Edit `.env` with your tokens:

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_TOKEN=xapp-your-app-token-here
```

### 5. Start the Bot

```bash
npm start
```

The bot will start and show:
```
⚡️ Slack Time Bot is running!
🌍 Target timezones:
   🇬🇧 London (Europe/London)
   🇧🇧 Barbados (America/Barbados)
   🇫🇷 France (Europe/Paris)
```

## Usage Examples

### Basic Commands
- `/time` - Show current time in all timezones
- `/time 2pm` - Show 2:00 PM in all timezones
- `/time 14:30` - Show 2:30 PM in all timezones

### Natural Language
- `/time tomorrow 09:30` - Tomorrow at 9:30 AM
- `/time fri 9:30` - Next Friday at 9:30 AM
- `/time next monday 14:00` - Next Monday at 2:00 PM
- `/time today 5pm` - Today at 5:00 PM

### Output Format
```
🕐 Current Time
🇬🇧 London: Thu 2 Oct · 14:00
🇧🇧 Barbados: Thu 2 Oct · 10:00
🇫🇷 France: Thu 2 Oct · 15:00
```

## Testing

### Acceptance Tests

1. **Current Time Test**
   ```
   /time
   ```
   Should show current time in all three timezones

2. **Simple Time Test**
   ```
   /time 2pm
   ```
   Should show 14:00 in London and equivalent in Barbados and France

3. **Day + Time Test**
   ```
   /time fri 09:30
   ```
   Should show the correct day and times for all zones

4. **Invalid Input Test**
   ```
   /time blahblah
   ```
   Should show error message with usage examples

## Troubleshooting

### Common Issues

1. **"Command not found"**
   - Ensure the slash command is created in Slack App settings
   - Check that the Request URL matches your ngrok URL

2. **"Invalid signing secret"**
   - Verify your `SLACK_SIGNING_SECRET` in `.env`
   - Make sure there are no extra spaces or characters

3. **"Socket mode connection failed"**
   - Check your `SLACK_APP_TOKEN` in `.env`
   - Ensure Socket Mode is enabled in Slack App settings

4. **"User timezone not found"**
   - The bot defaults to Europe/London if user timezone is unavailable
   - This is expected behavior

### Debug Mode

To see detailed logs, set:
```bash
export DEBUG=slack-bolt*
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SLACK_BOT_TOKEN` | Bot User OAuth Token | Yes |
| `SLACK_SIGNING_SECRET` | App Signing Secret | Yes |
| `SLACK_APP_TOKEN` | App-Level Token for Socket Mode | Yes |
| `TZ1_ZONE` | Timezone for zone 1 | No (default: Europe/London) |
| `TZ1_EMOJI` | Emoji for zone 1 | No (default: :flag-gb:) |
| `TZ1_LABEL` | Label for zone 1 | No (default: London) |
| `TZ2_ZONE` | Timezone for zone 2 | No (default: America/Barbados) |
| `TZ2_EMOJI` | Emoji for zone 2 | No (default: :flag-bb:) |
| `TZ2_LABEL` | Label for zone 2 | No (default: Barbados) |
| `TZ3_ZONE` | Timezone for zone 3 | No (default: Europe/Paris) |
| `TZ3_EMOJI` | Emoji for zone 3 | No (default: :flag-fr:) |
| `TZ3_LABEL` | Label for zone 3 | No (default: France) |

## Architecture

- **Framework**: Slack Bolt for Node.js
- **Time Parsing**: chrono-node for natural language
- **Timezone Handling**: luxon for timezone conversions
- **Mode**: Socket Mode for real-time communication
- **Response Type**: Ephemeral (only visible to caller)
