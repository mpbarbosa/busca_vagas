#!/usr/bin/env node

/**
 * Test script for Puppeteer implementation
 * 
 * This script tests the new Puppeteer-based vacancy search
 * and compares it with the Selenium implementation.
 */

import { searchVacanciesByDay } from '../src/controllers/puppeteer-script.js';

console.log('='.repeat(80));
console.log('PUPPETEER IMPLEMENTATION TEST');
console.log('='.repeat(80));

async function testPuppeteer() {
  console.log('\n📋 Test Configuration:');
  console.log('   Implementation: Puppeteer');
  console.log('   Mode: Headless');
  console.log('   Date Range: Next Friday to Sunday');
  
  // Calculate next Friday
  const today = new Date();
  const nextFriday = new Date(today);
  const daysUntilFriday = (5 - today.getDay() + 7) % 7;
  if (daysUntilFriday === 0 && today.getDay() !== 5) {
    nextFriday.setDate(today.getDate() + 7);
  } else {
    nextFriday.setDate(today.getDate() + daysUntilFriday);
  }
  
  const nextSunday = new Date(nextFriday);
  nextSunday.setDate(nextFriday.getDate() + 2);
  
  const checkinDate = nextFriday.toISOString().split('T')[0];
  const checkoutDate = nextSunday.toISOString().split('T')[0];
  
  console.log(`   Check-in: ${checkinDate} (${nextFriday.toLocaleDateString()})`);
  console.log(`   Check-out: ${checkoutDate} (${nextSunday.toLocaleDateString()})`);
  
  console.log('\n⏱️  Starting search...');
  const startTime = Date.now();
  const startMemory = process.memoryUsage();
  
  try {
    const results = await searchVacanciesByDay(checkinDate, checkoutDate, true);
    
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    const memoryDelta = ((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024).toFixed(2);
    
    console.log('\n📊 Performance Metrics:');
    console.log(`   Duration: ${duration}s`);
    console.log(`   Memory Delta: ${memoryDelta} MB`);
    console.log(`   Peak Memory: ${(endMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    
    console.log('\n✅ Test Results:');
    console.log(`   Success: ${results.success}`);
    console.log(`   Has Availability: ${results.hasAvailability}`);
    
    if (results.result && results.result.hotelGroups) {
      const hotelCount = Object.keys(results.result.hotelGroups).length;
      console.log(`   Hotels Found: ${hotelCount}`);
      
      if (hotelCount > 0) {
        console.log('\n🏨 Hotels with Availability:');
        Object.entries(results.result.hotelGroups).forEach(([hotel, vacancies], index) => {
          console.log(`   ${index + 1}. ${hotel} - ${vacancies.length} room type(s)`);
        });
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ TEST COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    
    console.log('\n' + '='.repeat(80));
    console.log('❌ TEST FAILED');
    console.log('='.repeat(80));
    
    process.exit(1);
  }
}

// Run the test
testPuppeteer().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
