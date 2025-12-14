# How to Search Vacancies by Day

## Quick Start

```bash
# Run the example (searches for Dec 31, 2024)
node example-search-by-day.cjs
```

## Custom Date Search

Edit `example-search-by-day.cjs` and change the last line:

```javascript
// Change this line to your desired date
searchVacanciesByDay('2024-12-31').catch(console.error);
```

Or create your own script:

```javascript
const { searchVacanciesByDay } = require('./selenium-script.cjs');

// Search for your date
searchVacanciesByDay('2025-01-15')
  .then(result => {
    console.log('Has availability:', result.hasAvailability);
  })
  .catch(console.error);
```

## Available Functions

```javascript
const { 
  searchVacanciesByDay,     // Search a specific date
  searchWeekendVacancies,   // Search upcoming weekends
  openVagasPage            // Low-level search function
} = require('./selenium-script.cjs');
```

## Documentation

- 📖 [README_SEARCH_BY_DAY.md](README_SEARCH_BY_DAY.md) - Quick start guide
- 📚 [docs/SEARCH_BY_DAY.md](docs/SEARCH_BY_DAY.md) - Complete documentation
- 🔧 [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) - Quick reference
- 💡 [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) - Technical details

## Requirements

- Node.js installed
- Chrome browser installed
- Internet connection

## ⚠️ Important Booking Rules

**Holiday Package Restrictions:**

When searching for dates during Christmas and New Year periods, be aware that bookings must follow pre-defined package dates:

- **Christmas Package:** December 22-27 (full period required)
- **New Year Package:** December 27 - January 2 (full period required)

For complete details, see [Booking Rules](docs/api/FUNCTIONAL_REQUIREMENTS.md#631-booking-rules).
