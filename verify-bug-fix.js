/**
 * Comprehensive test to verify the vacancy search bug fix
 * 
 * Run with: node verify-bug-fix.js
 * 
 * This test verifies that the Puppeteer script correctly:
 * 1. Waits for all hotels to load (progressive loading)
 * 2. Captures all room types and multiple date entries
 * 3. Returns results matching the AFPESP website
 */

import { searchVacanciesByDay } from './src/controllers/puppeteer-script.js';

const EXPECTED_MIN_HOTELS = 15;
const EXPECTED_MIN_ROOMS = 30;
const TEST_CHECKIN = '2025-12-03';
const TEST_CHECKOUT = '2025-12-05';

async function verifyBugFix() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║          VACANCY SEARCH BUG FIX VERIFICATION                     ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Test Parameters:');
  console.log(`  Check-in:  ${TEST_CHECKIN}`);
  console.log(`  Check-out: ${TEST_CHECKOUT}`);
  console.log('  Hotel:     Todas (All)');
  console.log('');
  console.log('Expected Results (based on AFPESP website):');
  console.log(`  Minimum hotels:  ${EXPECTED_MIN_HOTELS}`);
  console.log(`  Minimum rooms:   ${EXPECTED_MIN_ROOMS}`);
  console.log('');
  console.log('Running search...');
  console.log('');
  
  try {
    const result = await searchVacanciesByDay(TEST_CHECKIN, TEST_CHECKOUT, 'Todas');
    
    if (!result.success) {
      console.error('❌ Search failed:', result.error);
      return false;
    }
    
    const { hotelGroups, vacancies } = result.result;
    const hotelCount = Object.keys(hotelGroups).length;
    const roomCount = vacancies.length;
    
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                        TEST RESULTS                              ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`Hotels found:        ${hotelCount}`);
    console.log(`Room vacancies:      ${roomCount}`);
    console.log('');
    
    // Validation
    const tests = [];
    
    // Test 1: Minimum hotel count
    if (hotelCount >= EXPECTED_MIN_HOTELS) {
      console.log(`✅ PASS: Found ${hotelCount} hotels (minimum: ${EXPECTED_MIN_HOTELS})`);
      tests.push(true);
    } else {
      console.log(`❌ FAIL: Only ${hotelCount} hotels found (minimum: ${EXPECTED_MIN_HOTELS})`);
      tests.push(false);
    }
    
    // Test 2: Minimum room count
    if (roomCount >= EXPECTED_MIN_ROOMS) {
      console.log(`✅ PASS: Found ${roomCount} room entries (minimum: ${EXPECTED_MIN_ROOMS})`);
      tests.push(true);
    } else {
      console.log(`❌ FAIL: Only ${roomCount} room entries found (minimum: ${EXPECTED_MIN_ROOMS})`);
      tests.push(false);
    }
    
    // Test 3: Multiple entries for same room type
    const multiEntryRooms = ['JURUMIRIM', 'ITAPEVA', 'ARAUCÁRIA', 'THERMAS', 'SEIXAS', 
      'ALCALINA', 'BELA VISTA', 'Taraf Varanda'];
    let foundMultiEntry = false;
    
    for (const roomType of multiEntryRooms) {
      const entries = vacancies.filter(v => v.includes(roomType));
      if (entries.length > 1) {
        console.log(`✅ PASS: ${roomType} has multiple entries (${entries.length})`);
        foundMultiEntry = true;
        tests.push(true);
        break;
      }
    }
    
    if (!foundMultiEntry) {
      console.log('❌ FAIL: No rooms with multiple entries found');
      tests.push(false);
    }
    
    // Test 4: Verify specific hotels
    const mustHaveHotels = ['Amparo', 'Boraceia', 'Campos do Jordão', 'Fazenda Ibirá', 
      'São Lourenço', 'Socorro', 'Termas de Ibirá'];
    const missingHotels = mustHaveHotels.filter(h => !Object.keys(hotelGroups).includes(h));
    
    if (missingHotels.length === 0) {
      console.log('✅ PASS: All key hotels present');
      tests.push(true);
    } else {
      console.log(`❌ FAIL: Missing hotels: ${missingHotels.join(', ')}`);
      tests.push(false);
    }
    
    // Test 5: Check for adapted rooms
    const adaptedRooms = vacancies.filter(v => v.includes('adaptado'));
    if (adaptedRooms.length > 0) {
      console.log(`✅ PASS: Adapted rooms captured (${adaptedRooms.length} entries)`);
      tests.push(true);
    } else {
      console.log('⚠️  WARNING: No adapted rooms found');
      tests.push(true); // Not a failure
    }
    
    console.log('');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('Hotel Details:');
    console.log('─────────────────────────────────────────────────────────────────');
    
    Object.entries(hotelGroups).forEach(([hotel, rooms], index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${hotel.padEnd(20)} - ${rooms.length} room type${rooms.length > 1 ? 's' : ''}`);
    });
    
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    const allPassed = tests.every(t => t === true);
    if (allPassed) {
      console.log('║                  ✅ ALL TESTS PASSED                            ║');
    } else {
      console.log('║                  ❌ SOME TESTS FAILED                           ║');
    }
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log('');
    
    return allPassed;
    
  } catch (error) {
    console.error('');
    console.error('❌ ERROR during verification:', error.message);
    console.error('');
    console.error(error.stack);
    return false;
  }
}

// Run verification
verifyBugFix().then(success => {
  process.exit(success ? 0 : 1);
});
