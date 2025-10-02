# 🕐 Slack Time Bot - Configuration Guide

## 🌍 **Customizing Timezones**

The bot is now **fully configurable**! You can easily change the timezones, labels, and emojis for your team.

### **Environment Variables**

Add these to your `.env` file to customize the bot:

```bash
# Timezone 1 (default: London)
TZ1_ZONE=Europe/London
TZ1_LABEL=London
TZ1_EMOJI=:flag-gb:

# Timezone 2 (default: Barbados)
TZ2_ZONE=America/Barbados
TZ2_LABEL=Barbados
TZ2_EMOJI=:flag-bb:

# Timezone 3 (default: France)
TZ3_ZONE=Europe/Paris
TZ3_LABEL=France
TZ3_EMOJI=:flag-fr:
```

## 🎯 **Example Configurations**

### **US Team**
```bash
TZ1_ZONE=America/New_York
TZ1_LABEL=New York
TZ1_EMOJI=:flag-us:

TZ2_ZONE=America/Los_Angeles
TZ2_LABEL=Los Angeles
TZ2_EMOJI=:flag-us:

TZ3_ZONE=Europe/London
TZ3_LABEL=London
TZ3_EMOJI=:flag-gb:
```

### **European Team**
```bash
TZ1_ZONE=Europe/London
TZ1_LABEL=London
TZ1_EMOJI=:flag-gb:

TZ2_ZONE=Europe/Paris
TZ2_LABEL=Paris
TZ2_EMOJI=:flag-fr:

TZ3_ZONE=Europe/Berlin
TZ3_LABEL=Berlin
TZ3_EMOJI=:flag-de:
```

### **Asia-Pacific Team**
```bash
TZ1_ZONE=Asia/Tokyo
TZ1_LABEL=Tokyo
TZ1_EMOJI=:flag-jp:

TZ2_ZONE=Asia/Shanghai
TZ2_LABEL=Shanghai
TZ2_EMOJI=:flag-cn:

TZ3_ZONE=Australia/Sydney
TZ3_LABEL=Sydney
TZ3_EMOJI=:flag-au:
```

## 🔧 **How to Change**

1. **Edit your `.env` file**
2. **Update the timezone variables**
3. **Restart the bot**: `pkill -f "node app.js" && node app.js`

## 📋 **Available Timezones**

Common timezone identifiers:
- `America/New_York` (Eastern Time)
- `America/Chicago` (Central Time)
- `America/Denver` (Mountain Time)
- `America/Los_Angeles` (Pacific Time)
- `Europe/London` (GMT/BST)
- `Europe/Paris` (CET/CEST)
- `Europe/Berlin` (CET/CEST)
- `Asia/Tokyo` (JST)
- `Asia/Shanghai` (CST)
- `Australia/Sydney` (AEST/AEDT)

## 🎨 **Emoji Options**

Use any Slack emoji:
- `:flag-us:` 🇺🇸
- `:flag-gb:` 🇬🇧
- `:flag-fr:` 🇫🇷
- `:flag-de:` 🇩🇪
- `:flag-jp:` 🇯🇵
- `:flag-cn:` 🇨🇳
- `:flag-au:` 🇦🇺
- `:clock1:` 🕐
- `:earth_americas:` 🌎
- `:earth_africa:` 🌍
- `:earth_asia:` 🌏

## 🚀 **Team Setup**

1. **Configure your timezones** in `.env`
2. **Share the bot** with your team
3. **Each team can customize** their own timezones
4. **No code changes needed** - just environment variables!

---

**Perfect for distributed teams!** 🌍
