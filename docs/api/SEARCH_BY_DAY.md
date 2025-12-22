# Search Vacancies by Day - Documentation

## Overview

The `searchVacanciesByDay()` function allows you to search for hotel vacancies in all hotels for a specific date. This function was added to the `selenium-script.cjs` file to provide more flexible searching capabilities.

## Function Signature

```javascript
async function searchVacanciesByDay(searchDate)
```

### Parameters

- **searchDate** (Date | string): The date to search for vacancies
  - Can be a JavaScript Date object
  - Can be a date string in ISO format (YYYY-MM-DD)
  - Can be any valid date string that JavaScript's Date constructor can parse

### Returns

Returns a Promise that resolves to an object with the following structure:

```javascript
{
  success: boolean,           // Whether the search was successful
  date: string,              // The searched date in locale format
  hasAvailability: boolean,  // Whether vacancies were found
  result: {                  // Detailed results (if successful)
    hasAvailability: boolean,
    status: string,
    summary: string,
    vacancies: string[],
    hotelGroups: {
      [hotelName]: string[]  // Array of vacancy descriptions per hotel
    }
  },
  error: string              // Error message (if failed)
}
```

## Usage Examples

### Example 1: Search using ISO date string

```javascript
const { searchVacanciesByDay } = require('./selenium-script.cjs');

// Search for Christmas Day 2024
searchVacanciesByDay('2024-12-25')
  .then(result => {
    console.log('Search completed:', result);
    if (result.hasAvailability) {
      console.log('Vacancies found!');
    } else {
      console.log('No vacancies available');
    }
  })
  .catch(error => {
    console.error('Search failed:', error);
  });
```

### Example 2: Search using Date object

```javascript
const { searchVacanciesByDay } = require('./selenium-script.cjs');

// Create a Date object for New Year's Eve
const newYearsEve = new Date(2024, 11, 31); // Month is 0-indexed

searchVacanciesByDay(newYearsEve)
  .then(result => {
    console.log('Result:', result);
  })
  .catch(console.error);
```

### Example 3: Search for next Friday

```javascript
const { searchVacanciesByDay } = require('./selenium-script.cjs');

// Calculate next Friday
const today = new Date();
const nextFriday = new Date(today);
const daysUntilFriday = (5 - today.getDay() + 7) % 7;

if (daysUntilFriday === 0 && today.getDay() !== 5) {
  nextFriday.setDate(today.getDate() + 7);
} else {
  nextFriday.setDate(today.getDate() + daysUntilFriday);
}

searchVacanciesByDay(nextFriday)
  .then(result => {
    console.log(`Searching for next Friday: ${nextFriday.toLocaleDateString()}`);
    console.log('Has availability:', result.hasAvailability);
  })
  .catch(console.error);
```

### Example 4: Search multiple dates

```javascript
const { searchVacanciesByDay } = require('./selenium-script.cjs');

async function searchMultipleDates() {
  const dates = ['2024-12-20', '2024-12-27', '2025-01-03'];
  
  for (const date of dates) {
    console.log(`\nSearching ${date}...`);
    const result = await searchVacanciesByDay(date);
    
    if (result.hasAvailability) {
      console.log(`✅ Found ${Object.keys(result.result.hotelGroups).length} hotel(s) with availability`);
    } else {
      console.log('🔴 No availability');
    }
    
    // Wait between searches to be respectful to the server
    if (date !== dates[dates.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

searchMultipleDates().catch(console.error);
```

## Running the Examples

An example file has been created to demonstrate usage:

```bash
node example-search-by-day.cjs
```

You can also run directly from the main script by uncommenting one of the options at the bottom of `selenium-script.cjs`:

```javascript
// Option 1: Search for vacancies on a specific day
searchVacanciesByDay('2024-12-25').catch(console.error);
```

## Important Notes

1. **Server Etiquette**: When searching multiple dates, add delays between requests (3+ seconds) to be respectful to the server.

2. **Browser Requirements**: This function uses Selenium WebDriver and requires Chrome browser to be installed.

3. **Date Format**: The function automatically converts the provided date to the DD/MM/YYYY format required by the hotel booking system.

4. **Checkout Date**: The function automatically sets the checkout date to the day after the search date (single night stay).

5. **Hotel Selection**: The function searches ALL hotels by default (selects "Todas" option).

6. **Holiday Package Rules**: ⚠️ **Important Booking Restrictions**
   - **Christmas Package** (Dec 22-27): Only full package bookings are allowed during this period (by default)
   - **New Year Package** (Dec 27-Jan 2): Only full package bookings are allowed during this period (by default)
   - **Bypass Option**: Use `applyBookingRules=false` parameter to search custom dates during holiday periods
   - Single-day searches during these periods may return results, but actual bookings must follow package rules (unless bypassed)
   - See [Functional Requirements](./FUNCTIONAL_REQUIREMENTS.md#631-booking-rules) for complete details

## Error Handling

The function includes comprehensive error handling:

```javascript
try {
  const result = await searchVacanciesByDay('2024-12-25');
  if (!result.success) {
    console.error('Search failed:', result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error.message);
}
```

## Output Example

```
================================================================================
🔍 SEARCHING VACANCIES FOR: 12/25/2024
   Check-in: 12/25/2024 (Wednesday)
   Check-out: 12/26/2024 (Thursday)
================================================================================

✅ VACANCIES FOUND for 12/25/2024
📊 Found vacancies in 3 hotel(s): Hotel A, Hotel B, Hotel C

🏨 HOTELS WITH AVAILABILITY (3 total):

1. 🏨 Hotel A (2 room types)
   a. Standard (até 2 pessoas) 12/25 - 12/26 (1 diária) - 5 Quarto(s)
   b. Deluxe (até 4 pessoas) 12/25 - 12/26 (1 diária) - 2 Quarto(s)

2. 🏨 Hotel B (1 room type)
   a. Suite (até 3 pessoas) 12/25 - 12/26 (1 diária) - 3 Quarto(s)

3. 🏨 Hotel C (3 room types)
   a. Standard (até 2 pessoas) 12/25 - 12/26 (1 diária) - 8 Quarto(s)
   b. Superior (até 3 pessoas) 12/25 - 12/26 (1 diária) - 4 Quarto(s)
   c. Deluxe (até 4 pessoas) 12/25 - 12/26 (1 diária) - 1 Quarto(s)
```

## Integration with Existing Code

The new function integrates seamlessly with the existing codebase:

- **Uses same core function**: `openVagasPage()` is used internally
- **Consistent output format**: Returns same structure as weekend search
- **Module exports**: Properly exported for use in other scripts
- **No breaking changes**: Existing functionality remains unchanged

## See Also

- `searchWeekendVacancies()` - Search all upcoming weekends
- `openVagasPage()` - Core search function with custom check-in/check-out dates
