/**
 * Example: How to use searchVacanciesByDay function
 * 
 * This file demonstrates different ways to search for hotel vacancies
 * for a date range using the searchVacanciesByDay function.
 */

const { searchVacanciesByDay } = require('./src/controllers/selenium-script.cjs');

// Example usage functions (uncomment to use)

// Example 1: Search using date strings (ISO format: YYYY-MM-DD)
// async function example1() {
//   console.log('Example 1: Searching with ISO date strings');
//   const result = await searchVacanciesByDay('2024-12-25', '2024-12-26');
//   console.log('Result:', result);
// }

// Example 2: Search using Date objects
// async function example2() {
//   console.log('\nExample 2: Searching with Date objects');
//   const checkIn = new Date(2024, 11, 25); // December 25, 2024 (month is 0-indexed)
//   const checkOut = new Date(2024, 11, 26); // December 26, 2024
//   const result = await searchVacanciesByDay(checkIn, checkOut);
//   console.log('Result:', result);
// }

// Example 3: Search for next Friday to Sunday
// async function example3() {
//   console.log('\nExample 3: Searching for next Friday to Sunday');
//   const today = new Date();
//   const nextFriday = new Date(today);
//   const daysUntilFriday = (5 - today.getDay() + 7) % 7;
//   if (daysUntilFriday === 0 && today.getDay() !== 5) {
//     nextFriday.setDate(today.getDate() + 7);
//   } else {
//     nextFriday.setDate(today.getDate() + daysUntilFriday);
//   }
//   
//   const nextSunday = new Date(nextFriday);
//   nextSunday.setDate(nextFriday.getDate() + 2);
//   
//   const result = await searchVacanciesByDay(nextFriday, nextSunday);
//   console.log('Result:', result);
// }

// Example 4: Search multiple date ranges
async function searchMultipleDateRanges() {
  console.log('\nExample 4: Searching multiple date ranges');
  const rangesToSearch = [
    { start: '2024-12-20', end: '2024-12-21' },
    { start: '2024-12-27', end: '2024-12-28' },
    { start: '2025-01-03', end: '2025-01-04' }
  ];
  
  for (const range of rangesToSearch) {
    console.log(`\n--- Searching from ${range.start} to ${range.end} ---`);
    const result = await searchVacanciesByDay(range.start, range.end);
    console.log(`Has availability: ${result.hasAvailability}`);
    
    // Wait 3 seconds between searches to be respectful to the server
    if (range !== rangesToSearch[rangesToSearch.length - 1]) {
      console.log('Waiting 3 seconds before next search...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

// Run examples - uncomment to use:
// example1().catch(console.error);
// example2().catch(console.error);
// example3().catch(console.error);
// searchMultipleDateRanges().catch(console.error);

// Or run a custom search (tomorrow to day after):
let checkIn = new Date();
checkIn.setDate(checkIn.getDate() + 1);
let checkOut = new Date(checkIn);
checkOut.setDate(checkIn.getDate() + 1);
searchVacanciesByDay(checkIn, checkOut).catch(console.error);
