#!/usr/bin/env node
/**
 * Manual Test Script for Booking Rules
 * Tests the booking rules validation without starting the full server
 * 
 * Usage: node test-booking-rules.js
 */

import { validateBookingDates, getHolidayPackageInfo, isHolidayPackage } from './src/utils/bookingRules.js';

console.log('🧪 Testing Booking Rules Implementation\n');
console.log('=' .repeat(60));

const tests = [
  // Valid packages
  {
    name: 'Valid Christmas Package',
    checkin: '2024-12-22',
    checkout: '2024-12-27',
    expectValid: true
  },
  {
    name: 'Valid New Year Package',
    checkin: '2024-12-27',
    checkout: '2025-01-02',
    expectValid: true
  },
  
  // Invalid Christmas
  {
    name: 'Invalid Christmas - Partial Period',
    checkin: '2024-12-23',
    checkout: '2024-12-26',
    expectValid: false,
    expectCode: 'INVALID_CHRISTMAS_PACKAGE'
  },
  {
    name: 'Invalid Christmas - Wrong Check-in',
    checkin: '2024-12-21',
    checkout: '2024-12-27',
    expectValid: false,
    expectCode: 'INVALID_CHRISTMAS_PACKAGE'
  },
  {
    name: 'Invalid Christmas - Wrong Check-out',
    checkin: '2024-12-22',
    checkout: '2024-12-28',
    expectValid: false,
    expectCode: 'INVALID_CHRISTMAS_PACKAGE'
  },
  
  // Invalid New Year
  {
    name: 'Invalid New Year - Partial Period',
    checkin: '2024-12-28',
    checkout: '2025-01-01',
    expectValid: false,
    expectCode: 'INVALID_NEW_YEAR_PACKAGE'
  },
  {
    name: 'Invalid New Year - Wrong Check-in',
    checkin: '2024-12-29',
    checkout: '2025-01-02',
    expectValid: false,
    expectCode: 'INVALID_NEW_YEAR_PACKAGE'
  },
  {
    name: 'Invalid New Year - Wrong Check-out',
    checkin: '2024-12-27',
    checkout: '2025-01-01',
    expectValid: false,
    expectCode: 'INVALID_NEW_YEAR_PACKAGE'
  },
  
  // Valid non-holiday dates
  {
    name: 'Valid Normal Dates',
    checkin: '2024-11-15',
    checkout: '2024-11-20',
    expectValid: true
  },
  {
    name: 'Valid January After New Year',
    checkin: '2025-01-10',
    checkout: '2025-01-15',
    expectValid: true
  },
  {
    name: 'Valid December Before Christmas',
    checkin: '2024-12-15',
    checkout: '2024-12-20',
    expectValid: true
  },
  
  // Edge cases
  {
    name: 'Invalid Date Format',
    checkin: '12-25-2024',
    checkout: '12-26-2024',
    expectValid: false,
    expectCode: 'INVALID_DATE_FORMAT'
  },
  {
    name: 'Invalid Date Range (checkout before checkin)',
    checkin: '2024-11-20',
    checkout: '2024-11-15',
    expectValid: false,
    expectCode: 'INVALID_DATE_RANGE'
  }
];

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log(`   Check-in: ${test.checkin}, Check-out: ${test.checkout}`);
  
  const result = validateBookingDates(test.checkin, test.checkout);
  
  // Check if validation result matches expectation
  if (result.valid === test.expectValid) {
    // If we expect it to be invalid, also check the error code
    if (!test.expectValid && test.expectCode && result.code !== test.expectCode) {
      console.log(`   ❌ FAILED - Expected code: ${test.expectCode}, Got: ${result.code}`);
      failed++;
    } else {
      console.log('   ✅ PASSED');
      if (!result.valid) {
        console.log(`   Error: ${result.error}`);
        console.log(`   Code: ${result.code}`);
      } else if (isHolidayPackage(test.checkin, test.checkout)) {
        const packageInfo = getHolidayPackageInfo(test.checkin, test.checkout);
        console.log(`   Package: ${packageInfo.name} (${packageInfo.duration})`);
      }
      passed++;
    }
  } else {
    console.log(`   ❌ FAILED - Expected valid: ${test.expectValid}, Got: ${result.valid}`);
    if (!result.valid) {
      console.log(`   Error: ${result.error}`);
    }
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`);

if (failed === 0) {
  console.log('\n✅ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n❌ ${failed} test(s) failed`);
  process.exit(1);
}
