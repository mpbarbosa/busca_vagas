# Quick Reference: searchVacanciesByDay()

## Basic Usage

```javascript
const { searchVacanciesByDay } = require('./selenium-script.cjs');

// Search for a specific date
searchVacanciesByDay('2024-12-25')
  .then(result => {
    if (result.hasAvailability) {
      console.log('Vacancies found!');
    }
  })
  .catch(console.error);
```

## Date Formats Supported

```javascript
// ISO format (recommended)
searchVacanciesByDay('2024-12-25');

// Date object
searchVacanciesByDay(new Date(2024, 11, 25));

// Any valid date string
searchVacanciesByDay('December 25, 2024');
```

## Command Line Usage

```bash
# Run example file
node example-search-by-day.cjs

# Run main script (edit first to uncomment desired option)
node selenium-script.cjs
```

## Result Object

```javascript
{
  success: true/false,
  date: "12/25/2024",
  hasAvailability: true/false,
  result: {
    hotelGroups: {
      "Hotel Name": ["vacancy details..."]
    }
  }
}
```

## Complete Example

```javascript
const { searchVacanciesByDay } = require('./selenium-script.cjs');

async function searchMyDate() {
  try {
    const result = await searchVacanciesByDay('2024-12-31');
    
    if (result.success && result.hasAvailability) {
      console.log(`✅ Found vacancies at ${Object.keys(result.result.hotelGroups).length} hotels`);
      
      // List hotels
      Object.keys(result.result.hotelGroups).forEach(hotel => {
        console.log(`  - ${hotel}`);
      });
    } else {
      console.log('❌ No vacancies available');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

searchMyDate();
```

## Important Notes

- ✅ Searches ALL hotels by default
- ✅ Check-out is automatically set to day after check-in
- ⏱️ Add 3+ second delays between multiple searches
- 🌐 Requires Chrome browser installed

## See Full Documentation

📚 See `docs/api/SEARCH_BY_DAY.md` for complete documentation
