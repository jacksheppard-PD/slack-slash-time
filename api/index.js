const { App } = require('@slack/bolt');
const { DateTime } = require('luxon');
const chrono = require('chrono-node');
require('dotenv').config();

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Timezone configuration
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
    zone: process.env.TZ3_ZONE || 'America/New_York',
    emoji: process.env.TZ3_EMOJI || ':flag-us:',
    label: process.env.TZ3_LABEL || 'New York'
  }
};

// Parse time input with country-specific logic
function parseTimeInput(input) {
  const now = DateTime.now();
  
  // Check for country-specific input
  const countryMatch = input.match(/^(london|barbados|new york|ny)\s+(.+)$/i);
  
  if (countryMatch) {
    const [, country, timeInput] = countryMatch;
    const countryLower = country.toLowerCase();
    
    let targetTimezone;
    if (countryLower === 'london') targetTimezone = TARGET_TIMEZONES.zone1.zone;
    else if (countryLower === 'barbados') targetTimezone = TARGET_TIMEZONES.zone2.zone;
    else if (countryLower === 'new york' || countryLower === 'ny') targetTimezone = TARGET_TIMEZONES.zone3.zone;
    
    if (targetTimezone) {
      const parsedTime = chrono.parseDate(timeInput);
      if (parsedTime) {
        // Check if the parsed time includes a date
        const hasDate = timeInput.toLowerCase().includes('tomorrow') || 
                       timeInput.toLowerCase().includes('today') ||
                       /\d{1,2}\/\d{1,2}/.test(timeInput) ||
                       /\d{4}-\d{2}-\d{2}/.test(timeInput);
        
        if (hasDate) {
          // If date is specified, interpret the time in the target country's timezone
          return DateTime.fromJSDate(parsedTime).setZone(targetTimezone);
        } else {
          // If only time is specified, use today's date in the target country's timezone
          const today = now.setZone(targetTimezone).startOf('day');
          const timeOnly = DateTime.fromJSDate(parsedTime).setZone(targetTimezone);
          return today.plus({
            hours: timeOnly.hour,
            minutes: timeOnly.minute,
            seconds: timeOnly.second
          });
        }
      }
    }
  }
  
  // Default parsing for general time input
  const parsedTime = chrono.parseDate(input);
  if (parsedTime) {
    return DateTime.fromJSDate(parsedTime);
  }
  
  return null;
}

// Generate time display for all timezones
function generateTimeDisplay(targetTime) {
  const times = {
    zone1: targetTime.setZone(TARGET_TIMEZONES.zone1.zone),
    zone2: targetTime.setZone(TARGET_TIMEZONES.zone2.zone),
    zone3: targetTime.setZone(TARGET_TIMEZONES.zone3.zone)
  };
  
  return {
    zone1: `${TARGET_TIMEZONES.zone1.emoji} *${TARGET_TIMEZONES.zone1.label}*: ${times.zone1.toFormat('HH:mm')} (${times.zone1.toFormat('EEE, MMM d')})`,
    zone2: `${TARGET_TIMEZONES.zone2.emoji} *${TARGET_TIMEZONES.zone2.label}*: ${times.zone2.toFormat('HH:mm')} (${times.zone2.toFormat('EEE, MMM d')})`,
    zone3: `${TARGET_TIMEZONES.zone3.emoji} *${TARGET_TIMEZONES.zone3.label}*: ${times.zone3.toFormat('HH:mm')} (${times.zone3.toFormat('EEE, MMM d')})`
  };
}

// Handle /time command
app.command('/time', async ({ ack, respond, command }) => {
  await ack();
  
  try {
    const input = command.text.trim();
    let targetTime;
    
    if (input) {
      targetTime = parseTimeInput(input);
      if (!targetTime) {
        await respond({
          text: '❌ *Invalid time format*\n\nPlease use formats like:\n• `2pm` or `14:30`\n• `tomorrow 9am`\n• `barbados 2pm`\n• `london tomorrow 10:30`'
        });
        return;
      }
    } else {
      targetTime = DateTime.now();
    }
    
    const timeDisplay = generateTimeDisplay(targetTime);
    const responseText = input 
      ? `🕐 *Time conversion for "${input}"*`
      : '🕐 *Current times across timezones*';
    
    await respond({
      response_type: 'ephemeral',
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
              action_id: 'post_time',
              value: JSON.stringify({
                timeDisplay,
                responseText
              })
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error processing /time command:', error);
    await respond({
      text: '❌ *Error processing time command*\n\nPlease try again or contact support if the issue persists.'
    });
  }
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

// Export the app for Vercel
module.exports = app;
