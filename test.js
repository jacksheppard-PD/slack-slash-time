// Test script for the Slack Time Bot functionality
const { DateTime } = require('luxon');
const chrono = require('chrono-node');

// Test timezone configuration - matches app.js structure
const TARGET_TIMEZONES = {
  zone1: {
    zone: 'Europe/London',
    emoji: ':flag-gb:',
    label: 'London'
  },
  zone2: {
    zone: 'America/Barbados',
    emoji: ':flag-bb:',
    label: 'Barbados'
  },
  zone3: {
    zone: 'Europe/Paris',
    emoji: ':flag-fr:',
    label: 'France'
  }
};

// Format time for display
function formatTime(dt) {
  return dt.toFormat('EEE d MMM · HH:mm');
}

// Parse natural language time input
function parseTimeInput(input, userTimezone = 'Europe/London') {
  try {
    const parsed = chrono.parse(input, new Date(), { 
      timezone: userTimezone 
    });
    
    if (parsed.length === 0) {
      return null;
    }
    
    return parsed[0].start.date();
  } catch (error) {
    console.error('Error parsing time:', error);
    return null;
  }
}

// Generate time display for all timezones
function generateTimeDisplay(targetTime, userTimezone) {
  const zone1Time = targetTime.setZone(TARGET_TIMEZONES.zone1.zone);
  const zone2Time = targetTime.setZone(TARGET_TIMEZONES.zone2.zone);
  const zone3Time = targetTime.setZone(TARGET_TIMEZONES.zone3.zone);
  
  return {
    zone1: `${TARGET_TIMEZONES.zone1.emoji} ${TARGET_TIMEZONES.zone1.label}: ${formatTime(zone1Time)}`,
    zone2: `${TARGET_TIMEZONES.zone2.emoji} ${TARGET_TIMEZONES.zone2.label}: ${formatTime(zone2Time)}`,
    zone3: `${TARGET_TIMEZONES.zone3.emoji} ${TARGET_TIMEZONES.zone3.label}: ${formatTime(zone3Time)}`
  };
}

// Test cases
function runTests() {
  console.log('🧪 Testing Slack Time Bot functionality...\n');
  
  const testCases = [
    {
      name: 'Current Time',
      input: '',
      userTimezone: 'Europe/London'
    },
    {
      name: 'Simple Time (2pm)',
      input: '2pm',
      userTimezone: 'Europe/London'
    },
    {
      name: 'Day + Time (fri 09:30)',
      input: 'fri 09:30',
      userTimezone: 'Europe/London'
    },
    {
      name: 'Tomorrow Time',
      input: 'tomorrow 14:00',
      userTimezone: 'Europe/London'
    },
    {
      name: 'Invalid Input',
      input: 'blahblah',
      userTimezone: 'Europe/London'
    }
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`Input: "${testCase.input}"`);
    
    if (testCase.input === '') {
      // Current time test
      const targetTime = DateTime.now().setZone(testCase.userTimezone);
      const timeDisplay = generateTimeDisplay(targetTime, testCase.userTimezone);
      console.log(`Output:`);
      console.log(`  ${timeDisplay.zone1}`);
      console.log(`  ${timeDisplay.zone2}`);
      console.log(`  ${timeDisplay.zone3}`);
    } else if (testCase.input === 'blahblah') {
      // Invalid input test
      const parsedTime = parseTimeInput(testCase.input, testCase.userTimezone);
      if (!parsedTime) {
        console.log(`Output: ❌ Invalid time format (expected)`);
      } else {
        console.log(`Output: ⚠️  Unexpectedly parsed invalid input`);
      }
    } else {
      // Valid input test
      const parsedTime = parseTimeInput(testCase.input, testCase.userTimezone);
      if (parsedTime) {
        const targetTime = DateTime.fromJSDate(parsedTime, { zone: testCase.userTimezone });
        const timeDisplay = generateTimeDisplay(targetTime, testCase.userTimezone);
        console.log(`Output:`);
        console.log(`  ${timeDisplay.zone1}`);
        console.log(`  ${timeDisplay.zone2}`);
        console.log(`  ${timeDisplay.zone3}`);
      } else {
        console.log(`Output: ❌ Failed to parse time`);
      }
    }
    
    console.log(''); // Empty line
  });
  
  console.log('✅ Tests completed!');
}

// Run tests
runTests();
