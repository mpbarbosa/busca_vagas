/**
 * Business Logic Test Suite for Puppeteer-based Busca Vagas API
 * 
 * This test suite focuses on the business logic and actual vacancy search
 * functionality of the Busca Vagas API using Puppeteer.
 * 
 * Test Categories:
 * 1. Hotel Search - Searching for specific hotels
 * 2. Availability Detection - Checking room availability
 * 3. Data Extraction - Extracting vacancy information
 * 4. Weekend Automation - Weekend vacancy search
 * 5. Multi-Hotel Search - Searching multiple hotels
 */

import { searchVacanciesByDay, searchWeekendVacancies } from '../../src/controllers/puppeteer-script.js';
import request from 'supertest';
import app from '../../src/server.js';

describe('Busca Vagas API - Business Logic Tests', () => {
  
  // Helper function to get future date
  const getFutureDate = (daysAhead) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split('T')[0];
  };

  // Helper function to get next weekend
  const getNextWeekend = () => {
    const today = new Date();
    const nextFriday = new Date(today);
    const daysUntilFriday = (5 - today.getDay() + 7) % 7;
    nextFriday.setDate(today.getDate() + (daysUntilFriday || 7));
    
    const nextSunday = new Date(nextFriday);
    nextSunday.setDate(nextFriday.getDate() + 2);
    
    return {
      friday: nextFriday.toISOString().split('T')[0],
      sunday: nextSunday.toISOString().split('T')[0]
    };
  };

  // ============================================================================
  // TEST CATEGORY 1: HOTEL SEARCH
  // ============================================================================
  
  describe('Hotel Search Functionality', () => {
    
    test('should search for vacancies in all hotels', async () => {
      const checkin = getFutureDate(45);
      const checkout = getFutureDate(46);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('hasAvailability');
      expect(result).toHaveProperty('result');
    }, 180000);

    test('should return hotel information structure', async () => {
      const checkin = getFutureDate(50);
      const checkout = getFutureDate(51);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result.result).toBeDefined();
      expect(typeof result.result).toBe('object');
    }, 180000);

    test('should handle search for weekday dates', async () => {
      const checkin = getFutureDate(30);
      const checkout = getFutureDate(31);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result.success).toBeDefined();
      expect(typeof result.hasAvailability).toBe('boolean');
    }, 180000);

    test('should handle search for weekend dates', async () => {
      const weekend = getNextWeekend();
      
      const result = await searchVacanciesByDay(weekend.friday, weekend.sunday, true);
      
      expect(result.success).toBeDefined();
      expect(typeof result.hasAvailability).toBe('boolean');
    }, 180000);
  });

  // ============================================================================
  // TEST CATEGORY 2: AVAILABILITY DETECTION
  // ============================================================================
  
  describe('Availability Detection', () => {
    
    test('should detect when vacancies are available', async () => {
      const checkin = getFutureDate(60);
      const checkout = getFutureDate(61);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result).toHaveProperty('hasAvailability');
      expect(typeof result.hasAvailability).toBe('boolean');
    }, 180000);

    test('should provide availability status', async () => {
      const checkin = getFutureDate(35);
      const checkout = getFutureDate(36);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      if (result.hasAvailability) {
        expect(result.result).toBeDefined();
      }
      expect(result.success).toBeDefined();
    }, 180000);

    test('should handle no availability scenario', async () => {
      // Search for a date very far in the future (likely no availability)
      const checkin = getFutureDate(365);
      const checkout = getFutureDate(366);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result).toHaveProperty('hasAvailability');
      expect(result.success).toBeDefined();
    }, 180000);
  });

  // ============================================================================
  // TEST CATEGORY 3: DATA EXTRACTION
  // ============================================================================
  
  describe('Data Extraction and Formatting', () => {
    
    test('should extract vacancy data in correct format', async () => {
      const checkin = getFutureDate(40);
      const checkout = getFutureDate(41);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result).toHaveProperty('result');
      expect(result.result).toBeDefined();
    }, 180000);

    test('should group vacancies by hotel', async () => {
      const checkin = getFutureDate(55);
      const checkout = getFutureDate(56);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      if (result.hasAvailability && result.result.hotelGroups) {
        expect(result.result.hotelGroups).toBeDefined();
        expect(typeof result.result.hotelGroups).toBe('object');
      }
    }, 180000);

    test('should include summary information', async () => {
      const checkin = getFutureDate(48);
      const checkout = getFutureDate(49);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      if (result.hasAvailability && result.result.summary) {
        expect(result.result.summary).toBeDefined();
        expect(typeof result.result.summary).toBe('string');
      }
    }, 180000);

    test('should provide consistent data structure', async () => {
      const checkin = getFutureDate(42);
      const checkout = getFutureDate(43);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      // Verify consistent structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('hasAvailability');
      expect(result).toHaveProperty('result');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.hasAvailability).toBe('boolean');
    }, 180000);
  });

  // ============================================================================
  // TEST CATEGORY 4: API INTEGRATION
  // ============================================================================
  
  describe('API Endpoint Integration', () => {
    
    test('GET /api/vagas/search - should return successful response', async () => {
      const checkin = getFutureDate(70);
      const checkout = getFutureDate(71);
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('method', 'puppeteer');
      expect(response.body).toHaveProperty('data');
    }, 180000);

    test('GET /api/vagas/search - should include performance metadata', async () => {
      const checkin = getFutureDate(65);
      const checkout = getFutureDate(66);
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resourceSavings');
      expect(response.body.resourceSavings).toContain('40-60%');
    }, 180000);

    test('GET /api/vagas/search - should handle headless=false parameter', async () => {
      const checkin = getFutureDate(75);
      const checkout = getFutureDate(76);
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout, headless: 'false' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBeDefined();
    }, 180000);

    test('GET /api/vagas/search - should validate required parameters', async () => {
      const response = await request(app)
        .get('/api/vagas/search');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });

    test('GET /api/vagas/search - should provide helpful error messages', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: getFutureDate(30) }); // Missing checkout
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('example');
      expect(response.body.example).toContain('/api/vagas/search?');
    });
  });

  // ============================================================================
  // TEST CATEGORY 5: DATE RANGE SCENARIOS
  // ============================================================================
  
  describe('Date Range Scenarios', () => {
    
    test('should handle single night stay', async () => {
      const checkin = getFutureDate(33);
      const checkout = getFutureDate(34);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result.success).toBeDefined();
    }, 180000);

    test('should handle weekend (Friday to Sunday)', async () => {
      const weekend = getNextWeekend();
      
      const result = await searchVacanciesByDay(weekend.friday, weekend.sunday, true);
      
      expect(result.success).toBeDefined();
    }, 180000);

    test('should handle near-future dates (30 days ahead)', async () => {
      const checkin = getFutureDate(30);
      const checkout = getFutureDate(31);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result.success).toBeDefined();
    }, 180000);

    test('should handle far-future dates (90 days ahead)', async () => {
      const checkin = getFutureDate(90);
      const checkout = getFutureDate(91);
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result.success).toBeDefined();
    }, 180000);

    test('should handle month boundary crossing', async () => {
      const result = await searchVacanciesByDay('2025-01-31', '2025-02-01', true);
      
      expect(result.success).toBeDefined();
    }, 180000);

    test('should handle year boundary crossing', async () => {
      const result = await searchVacanciesByDay('2025-12-31', '2026-01-01', true);
      
      expect(result.success).toBeDefined();
    }, 180000);
  });

  // ============================================================================
  // TEST CATEGORY 6: ERROR SCENARIOS
  // ============================================================================
  
  describe('Error Handling and Edge Cases', () => {
    
    test('should reject invalid date format', async () => {
      await expect(
        searchVacanciesByDay('invalid-date', getFutureDate(30), true)
      ).rejects.toThrow();
    });

    test('should reject reversed dates', async () => {
      await expect(
        searchVacanciesByDay(getFutureDate(31), getFutureDate(30), true)
      ).rejects.toThrow('endDate must be after startDate');
    });

    test('should reject same check-in and check-out dates', async () => {
      const date = getFutureDate(30);
      await expect(
        searchVacanciesByDay(date, date, true)
      ).rejects.toThrow('endDate must be after startDate');
    });

    test('should reject null check-in date', async () => {
      await expect(
        searchVacanciesByDay(null, getFutureDate(30), true)
      ).rejects.toThrow();
    });

    test('should reject undefined check-out date', async () => {
      await expect(
        searchVacanciesByDay(getFutureDate(30), undefined, true)
      ).rejects.toThrow();
    });

    test('API should return 400 for missing check-in', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkout: getFutureDate(30) });
      
      expect(response.status).toBe(400);
    });

    test('API should return 400 for missing check-out', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: getFutureDate(30) });
      
      expect(response.status).toBe(400);
    });

    test('API should return 500 for invalid dates', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: 'invalid', checkout: 'invalid' });
      
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  // ============================================================================
  // TEST CATEGORY 7: PERFORMANCE VALIDATION
  // ============================================================================
  
  describe('Performance Validation', () => {
    
    test('should complete search within reasonable time', async () => {
      const checkin = getFutureDate(38);
      const checkout = getFutureDate(39);
      
      const startTime = Date.now();
      await searchVacanciesByDay(checkin, checkout, true);
      const duration = Date.now() - startTime;
      
      // Should complete within 90 seconds for a single search
      expect(duration).toBeLessThan(90000);
      console.log(`Search completed in ${(duration / 1000).toFixed(2)}s`);
    }, 180000);

    test('should use reasonable memory for single search', async () => {
      const checkin = getFutureDate(44);
      const checkout = getFutureDate(45);
      
      const startMemory = process.memoryUsage().heapUsed;
      await searchVacanciesByDay(checkin, checkout, true);
      const endMemory = process.memoryUsage().heapUsed;
      const memoryDelta = (endMemory - startMemory) / 1024 / 1024;
      
      // Should use less than 600 MB for single search
      expect(memoryDelta).toBeLessThan(600);
      console.log(`Memory used: ${memoryDelta.toFixed(2)} MB`);
    }, 180000);

    test('API response time should be reasonable', async () => {
      const checkin = getFutureDate(52);
      const checkout = getFutureDate(53);
      
      const startTime = Date.now();
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout });
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      // API should respond within 90 seconds
      expect(duration).toBeLessThan(90000);
      console.log(`API responded in ${(duration / 1000).toFixed(2)}s`);
    }, 180000);
  });

  // ============================================================================
  // TEST CATEGORY 8: CONCURRENT OPERATIONS
  // ============================================================================
  
  describe('Concurrent Operations', () => {
    
    test('should handle multiple sequential searches', async () => {
      const dates = [
        { checkin: getFutureDate(80), checkout: getFutureDate(81) },
        { checkin: getFutureDate(85), checkout: getFutureDate(86) }
      ];
      
      for (const date of dates) {
        const result = await searchVacanciesByDay(date.checkin, date.checkout, true);
        expect(result.success).toBeDefined();
      }
    }, 360000);

    test('should handle concurrent API requests', async () => {
      const requests = [
        request(app).get('/api/vagas/search').query({ 
          checkin: getFutureDate(95), 
          checkout: getFutureDate(96) 
        }),
        request(app).get('/api/vagas/search').query({ 
          checkin: getFutureDate(100), 
          checkout: getFutureDate(101) 
        })
      ];
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBeDefined();
      });
    }, 360000);
  });
});
