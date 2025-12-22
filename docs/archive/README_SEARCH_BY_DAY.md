# searchVacanciesByDay - Quick Start Guide

## Overview

The `searchVacanciesByDay()` function searches for hotel vacancies in all hotels for a specific date.

## Quick Usage

```bash
# Run the example
node example-search-by-day.cjs
```

## Programmatic Usage

```javascript
const { searchVacanciesByDay } = require('./selenium-script.cjs');

// Search for a specific date
searchVacanciesByDay('2024-12-25')
  .then(result => {
    if (result.hasAvailability) {
      console.log('✅ Vacancies found!');
      console.log(`Hotels with availability: ${Object.keys(result.result.hotelGroups).length}`);
    } else {
      console.log('❌ No vacancies available');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## Date Formats Accepted

```javascript
// ISO format (recommended)
searchVacanciesByDay('2024-12-25');

// Date object
searchVacanciesByDay(new Date(2024, 11, 25));

// Any parseable date string
searchVacanciesByDay('December 25, 2024');
```

## Important Notes

- 📁 **File Extension**: Uses `.cjs` because the project is configured as ES module but this script uses CommonJS
- 🏨 **Hotel Selection**: Automatically searches ALL hotels
- 📅 **Stay Duration**: Searches for single night (check-out is next day)
- ⏱️ **Rate Limiting**: Add 3+ second delays between multiple searches
- 🌐 **Browser**: Requires Chrome browser installed

## Running Options

### Option 1: Run the example file
```bash
node example-search-by-day.cjs
```

### Option 2: Run selenium-script directly
Edit `selenium-script.cjs` to uncomment desired option, then:
```bash
node selenium-script.cjs
```

### Option 3: Import in your own script
```javascript
const { searchVacanciesByDay } = require('./selenium-script.cjs');
// Your code here
```

## Full Documentation

📚 For complete documentation, see:
- `docs/SEARCH_BY_DAY.md` - Complete usage guide
- `docs/QUICK_REFERENCE.md` - Quick reference
- `docs/IMPLEMENTATION_SUMMARY.md` - Technical details

## Troubleshooting

**Error: require is not defined**
- Solution: Use `.cjs` extension (not `.js`)

**Error: Module not found**
- Solution: Use `require('./selenium-script.cjs')` (include `.cjs` extension)

**Browser doesn't open**
- Solution: Ensure Chrome browser is installed
- Solution: Check if ChromeDriver is compatible with your Chrome version

## Examples in example-search-by-day.cjs

The example file includes several commented examples:
- Search with ISO date string
- Search with Date object
- Search for next Friday
- Search multiple dates with delays

Uncomment any example to try it out!
