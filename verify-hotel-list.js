/**
 * Quick test to verify hotel list update
 */

import { getAllHotels } from './src/services/hoteisService.js';

const hotels = getAllHotels();

console.log('Hotel List Verification');
console.log('======================\n');

console.log(`Total hotels: ${hotels.length}`);
console.log('Expected: 25\n');

if (hotels.length !== 25) {
  console.error('❌ FAIL: Expected 25 hotels, got', hotels.length);
  process.exit(1);
}

console.log('✅ PASS: Correct number of hotels\n');

// Check required fields
const requiredFields = ['id', 'hotelId', 'name', 'type', 'description'];
let allFieldsPresent = true;

hotels.forEach((hotel, index) => {
  const missingFields = requiredFields.filter(field => !hotel[field]);
  if (missingFields.length > 0) {
    console.error(`❌ Hotel ${index + 1} missing fields:`, missingFields);
    allFieldsPresent = false;
  }
});

if (!allFieldsPresent) {
  console.error('\n❌ FAIL: Some hotels have missing fields');
  process.exit(1);
}

console.log('✅ PASS: All hotels have required fields\n');

// Check for "Todas" option
const todasOption = hotels.find(h => h.name === 'Todas');
if (!todasOption) {
  console.error('❌ FAIL: "Todas" option not found');
  process.exit(1);
}

console.log('✅ PASS: "Todas" option present\n');

// Check for specific hotels mentioned in bug fix
const expectedHotels = [
  'Amparo', 'Appenzell', 'Areado', 'Avaré', 'Boraceia',
  'Campos do Jordão', 'Fazenda Ibirá', 'São Lourenço',
  'Socorro', 'Termas de Ibirá', 'Unidade Capital'
];

const missingHotels = expectedHotels.filter(name => 
  !hotels.find(h => h.name === name)
);

if (missingHotels.length > 0) {
  console.error('❌ FAIL: Missing expected hotels:', missingHotels);
  process.exit(1);
}

console.log('✅ PASS: All expected hotels present\n');

// Display hotel list
console.log('Hotel List:');
console.log('-----------');
hotels.forEach(hotel => {
  console.log(`${hotel.id.toString().padStart(2)}. ${hotel.name.padEnd(20)} (ID: ${hotel.hotelId})`);
});

console.log('\n✅ ALL TESTS PASSED');
console.log('\nHotel list successfully updated from scrape endpoint!');
