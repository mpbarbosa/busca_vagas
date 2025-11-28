/**
 * Example: How to use searchVacanciesByDay function
 * 
 * This file demonstrates different ways to search for hotel vacancies
 * on a specific day using the searchVacanciesByDay function.
 */

const { searchVacanciesByDay } = require('./src/controllers/selenium-script.cjs');

// Example usage functions (uncomment to use)

// Example 1: Search using a date string (ISO format: YYYY-MM-DD)
// async function example1() {
//   console.log('Example 1: Searching with ISO date string');
//   const result = await searchVacanciesByDay('2024-12-25');
//   console.log('Result:', result);
// }

// Example 2: Search using a Date object
// async function example2() {
//   console.log('\nExample 2: Searching with Date object');
//   const christmasDate = new Date(2024, 11, 25); // December 25, 2024 (month is 0-indexed)
//   const result = await searchVacanciesByDay(christmasDate);
//   console.log('Result:', result);
// }

// Example 3: Search for next Friday
// async function example3() {
//   console.log('\nExample 3: Searching for next Friday');
//   const today = new Date();
//   const nextFriday = new Date(today);
//   const daysUntilFriday = (5 - today.getDay() + 7) % 7;
//   if (daysUntilFriday === 0 && today.getDay() !== 5) {
//     nextFriday.setDate(today.getDate() + 7);
//   } else {
//     nextFriday.setDate(today.getDate() + daysUntilFriday);
//   }
//   
//   const result = await searchVacanciesByDay(nextFriday);
//   console.log('Result:', result);
// }

// Example 4: Search multiple specific dates
async function searchMultipleDates() {
  console.log('\nExample 4: Searching multiple specific dates');
  const datesToSearch = [
    '2024-12-20',
    '2024-12-27',
    '2025-01-03'
  ];
  
  for (const date of datesToSearch) {
    console.log(`\n--- Searching for ${date} ---`);
    const result = await searchVacanciesByDay(date);
    console.log(`Has availability: ${result.hasAvailability}`);
    
    // Wait 3 seconds between searches to be respectful to the server
    if (date !== datesToSearch[datesToSearch.length - 1]) {
      console.log('Waiting 3 seconds before next search...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

// Run examples - uncomment to use:
// example1().catch(console.error);
// example2().catch(console.error);
// example3().catch(console.error);
// searchMultipleDates().catch(console.error);

// Or run a custom search:
let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
searchVacanciesByDay(tomorrow).catch(console.error);
