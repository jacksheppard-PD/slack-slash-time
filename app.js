const { App } = require('@slack/bolt');
const { DateTime } = require('luxon');
const chrono = require('chrono-node');
const express = require('express');
require('dotenv').config();

// Initialize Express app
const expressApp = express();
expressApp.use(express.json());

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  expressApp: expressApp,
});

// Timezone configuration - easily customizable via environment variables
const TARGET_TIMEZONES = {
  zone1: {
    zone: process.env.TZ1_ZONE || 'Europe/London',
    emoji: process.env.TZ1_EMOJI || ':flag-gb:',
    label: process.env.TZ1_LABEL || 'London'
  },
  zone2: {
    zone: process.env.TZ2_ZONE || 'America/Barbados',
    emoji: process.env.TZ2_EMOJI || ':flag-bb:',
    label: process.env.TZ2_LABEL || 'Barbados'
  },
  zone3: {
    zone: process.env.TZ3_ZONE || 'Europe/Paris',
    emoji: process.env.TZ3_EMOJI || ':flag-fr:',
    label: process.env.TZ3_LABEL || 'France'
  }
};

// Format time for display
function formatTime(dt) {
  return dt.toFormat('HH:mm');
}

// Get user's timezone from Slack user info
async function getUserTimezone(userId) {
  try {
    const result = await app.client.users.info({ user: userId });
    return result.user?.tz || 'Europe/London'; // Default to London if not available
  } catch (error) {
    console.error('Error fetching user timezone:', error);
    return 'Europe/London';
  }
}

// Parse natural language time input with country-specific parsing
function parseTimeInput(input, userTimezone) {
  try {
    // Check if input contains a country name (e.g., "barbados 9am", "london 2pm")
    const countryPattern = /\b(barbados|london|france|paris|berlin|new york|los angeles|tokyo|shanghai|sydney)\b/i;
    const countryMatch = input.match(countryPattern);
    
    let targetTimezone = userTimezone; // Default to user's timezone
    let timeInput = input;
    
    if (countryMatch) {
      const country = countryMatch[0].toLowerCase();
      // Map country names to timezones
      const countryTimezones = {
        'barbados': 'America/Barbados',
        'london': 'Europe/London',
        'france': 'Europe/Paris',
        'paris': 'Europe/Paris',
        'berlin': 'Europe/Berlin',
        'new york': 'America/New_York',
        'los angeles': 'America/Los_Angeles',
        'tokyo': 'Asia/Tokyo',
        'shanghai': 'Asia/Shanghai',
        'sydney': 'Australia/Sydney'
      };
      
      if (countryTimezones[country]) {
        targetTimezone = countryTimezones[country];
        // Remove the country name from input for parsing
        timeInput = input.replace(countryPattern, '').trim();
      }
    }
    
    // Parse the time input - chrono will parse in the current system timezone
    const parsed = chrono.parse(timeInput, new Date());
    
    if (parsed.length === 0) {
      return null;
    }
    
    // Get the first parsed result
    const result = parsed[0];
    const parsedDate = result.start.date();
    
    // Create a DateTime from the parsed date
    const parsedDateTime = DateTime.fromJSDate(parsedDate);
    
    let targetDateTime;
    
    if (countryMatch) {
      // For country-specific parsing, we want to interpret the time as if it's in that country's timezone
      // So we take the time components and create a new DateTime in the target timezone
      const hour = parsedDateTime.hour;
      const minute = parsedDateTime.minute;
      const second = parsedDateTime.second;
      
      // Check if the parsed time includes a date (e.g., "tomorrow 2pm")
      const hasDate = result.start.isCertain('day') || result.start.isCertain('month') || result.start.isCertain('year');
      
      if (hasDate) {
        // If a specific date was parsed, use that date in the target timezone
        const parsedDate = parsedDateTime.toJSDate();
        targetDateTime = DateTime.fromJSDate(parsedDate).setZone(targetTimezone);
      } else {
        // If only time was parsed, use today's date in the target timezone
        const today = DateTime.now().setZone(targetTimezone);
        targetDateTime = today.set({ 
          hour, 
          minute, 
          second, 
          millisecond: 0 
        });
      }
      
      console.log(`Country-specific parsing: ${hour}:${minute} in ${targetTimezone}`);
    } else {
      // For regular parsing, use the parsed time as-is
      targetDateTime = parsedDateTime;
    }
    
    // Debug logging
    console.log(`Parsing "${timeInput}" in timezone ${targetTimezone}`);
    console.log(`Parsed date: ${parsedDate}`);
    console.log(`Target DateTime: ${targetDateTime.toISO()}`);
    console.log(`Target time in London: ${targetDateTime.setZone('Europe/London').toFormat('HH:mm')}`);
    console.log(`Target time in Barbados: ${targetDateTime.setZone('America/Barbados').toFormat('HH:mm')}`);
    console.log(`Target time in France: ${targetDateTime.setZone('Europe/Paris').toFormat('HH:mm')}`);
    
    return {
      date: targetDateTime.toJSDate(),
      timezone: targetTimezone,
      country: countryMatch ? countryMatch[0] : null
    };
  } catch (error) {
    console.error('Error parsing time:', error);
    return null;
  }
}

// Generate time display for both timezones
function generateTimeDisplay(targetTime, userTimezone) {
  const zone1Time = targetTime.setZone(TARGET_TIMEZONES.zone1.zone);
  const zone2Time = targetTime.setZone(TARGET_TIMEZONES.zone2.zone);
  const zone3Time = targetTime.setZone(TARGET_TIMEZONES.zone3.zone);
  
  return {
    zone1: `${TARGET_TIMEZONES.zone1.emoji} ${formatTime(zone1Time)}`,
    zone2: `${TARGET_TIMEZONES.zone2.emoji} ${formatTime(zone2Time)}`,
    zone3: `${TARGET_TIMEZONES.zone3.emoji} ${formatTime(zone3Time)}`
  };
}

// Handle /time slash command
app.command('/time', async ({ command, ack, respond }) => {
  // Acknowledge the command
  await ack();
  
  try {
    const userId = command.user_id;
    const text = command.text?.trim() || '';
    
    // Get user's timezone
    const userTimezone = await getUserTimezone(userId);
    
    let targetTime;
    
    if (text === '') {
      // No arguments - show current time
      targetTime = DateTime.now().setZone(userTimezone);
    } else {
      // Parse natural language input
      const parsedTime = parseTimeInput(text, userTimezone);
      
      if (!parsedTime) {
        // Invalid input - show error with usage examples
        await respond({
          response_type: 'in_channel',
          text: `❌ *Invalid time format*

*Usage examples:*
• \`/time\` - Show current time
• \`/time 2pm\` - Show 2:00 PM in all timezones
• \`/time barbados 9am\` - Show 9:00 AM from Barbados perspective
• \`/time london 2pm\` - Show 2:00 PM from London perspective
• \`/time tomorrow 09:30\` - Show tomorrow at 9:30 AM
• \`/time fri 9:30\` - Show next Friday at 9:30 AM

*Supported formats:*
• Time: 2pm, 14:00, 9:30 AM
• Countries: barbados, london, france, paris, berlin, new york, tokyo
• Days: today, tomorrow, monday, fri, next friday
• Combinations: tomorrow 2pm, fri 09:30, barbados 9am`
        });
        return;
      }
      
      // Handle the new parsedTime format
      if (parsedTime.date) {
        // The parsedTime.date is already in the correct timezone
        // We need to create a DateTime that represents the same moment in time
        // Use the timezone from the parsed result to preserve the correct timezone
        targetTime = DateTime.fromJSDate(parsedTime.date, { zone: parsedTime.timezone });
        console.log(`Target time created: ${targetTime.toISO()}`);
        console.log(`Target time in London: ${targetTime.setZone('Europe/London').toFormat('HH:mm')}`);
        console.log(`Target time in Barbados: ${targetTime.setZone('America/Barbados').toFormat('HH:mm')}`);
        console.log(`Target time in France: ${targetTime.setZone('Europe/Paris').toFormat('HH:mm')}`);
      } else {
        // Fallback for old format
        targetTime = DateTime.fromJSDate(parsedTime, { zone: userTimezone });
      }
    }
    
    // Generate time display for both timezones
    const timeDisplay = generateTimeDisplay(targetTime, userTimezone);
    
    // Create response message
    let responseText;
    if (text === '') {
      responseText = `*Current Time*`;
    } else {
      const parsedTime = parseTimeInput(text, userTimezone);
      if (parsedTime && parsedTime.country) {
        responseText = `*Time zones for "${text}" (from ${parsedTime.country} perspective)*`;
      } else {
        responseText = `*Time zones for "${text}"*`;
      }
    }
    
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: responseText
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${timeDisplay.zone1}\n${timeDisplay.zone2}\n${timeDisplay.zone3}`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Post time in this channel'
            },
            style: 'primary',
            action_id: 'post_time',
            value: JSON.stringify({
              timeDisplay: timeDisplay,
              responseText: responseText
            })
          }
        ]
      }
    ];
    
    // Send ephemeral response with button
    await respond({
      response_type: 'ephemeral',
      text: responseText,
      blocks: blocks
    });
    
  } catch (error) {
    console.error('Error handling /time command:', error);
    
    await respond({
      response_type: 'in_channel',
      text: '❌ *Error processing time command*\n\nPlease try again or contact support if the issue persists.'
    });
  }
});

// Add health check endpoint
expressApp.get('/', (req, res) => {
  res.json({ status: 'Slack Time Bot is running!' });
});

// Handle button clicks
app.action('post_time', async ({ ack, body, client }) => {
  await ack();
  
  try {
    console.log('Button clicked! Body:', JSON.stringify(body, null, 2));
    
    // Validate that we have the required data
    if (!body.actions || !body.actions[0] || !body.actions[0].value) {
      console.error('Missing action data in button click');
      return;
    }
    
    let data;
    try {
      data = JSON.parse(body.actions[0].value);
    } catch (parseError) {
      console.error('Failed to parse button action data:', parseError);
      return;
    }
    
    const { timeDisplay, responseText } = data;
    
    // Validate required fields
    if (!timeDisplay || !responseText) {
      console.error('Missing required fields in button action data');
      return;
    }
    
    // Use the response_url to post back to the same conversation
    // This is the correct way to post in the same channel/DM where the command was used
    const responseUrl = body.response_url;
    
    if (!responseUrl) {
      console.error('No response_url found in button action');
      return;
    }
    
    console.log('Posting to response_url:', responseUrl);
    
    // Post the time publicly using the response URL
    const response = await fetch(responseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response_type: 'in_channel',
        replace_original: false,
        text: responseText,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: responseText
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `${timeDisplay.zone1}\n${timeDisplay.zone2}\n${timeDisplay.zone3}`
            }
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('Successfully posted message:', result.ts);
    
  } catch (error) {
    console.error('Error posting time:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      data: error.data
    });
  }
});

// Error handling
app.error((error) => {
  console.error('Slack app error:', error);
});

// Start the app
(async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`⚡️ Slack Time Bot is running on port ${port}!`);
    console.log('🌍 Target timezones:');
    console.log(`   ${TARGET_TIMEZONES.zone1.emoji} ${TARGET_TIMEZONES.zone1.label} (${TARGET_TIMEZONES.zone1.zone})`);
    console.log(`   ${TARGET_TIMEZONES.zone2.emoji} ${TARGET_TIMEZONES.zone2.label} (${TARGET_TIMEZONES.zone2.zone})`);
    console.log(`   ${TARGET_TIMEZONES.zone3.emoji} ${TARGET_TIMEZONES.zone3.label} (${TARGET_TIMEZONES.zone3.zone})`);
  } catch (error) {
    console.error('Failed to start app:', error);
    process.exit(1);
  }
})();