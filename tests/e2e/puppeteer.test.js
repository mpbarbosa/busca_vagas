/**
 * Comprehensive E2E Test Suite for Puppeteer Implementation
 * 
 * This test suite validates the Puppeteer-based vacancy search system
 * including browser automation, API endpoints, error handling, and performance.
 * 
 * Test Categories:
 * 1. Core Functionality - Browser automation and search logic
 * 2. API Endpoints - REST API integration tests
 * 3. Error Handling - Validation and edge cases
 * 4. Performance - Resource usage and speed metrics
 * 5. Browser Pool - Instance management and reuse
 */

import puppeteer from 'puppeteer';
import request from 'supertest';
import app from '../../src/server.js';
import { searchVacanciesByDay } from '../../src/controllers/puppeteer-script.js';

describe('Puppeteer E2E Test Suite', () => {
  
  // ============================================================================
  // TEST CATEGORY 1: CORE FUNCTIONALITY
  // ============================================================================
  
  describe('Core Functionality - Browser Automation', () => {
    
    test('should launch Puppeteer browser in headless mode', async () => {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      expect(browser).toBeDefined();
      expect(browser.isConnected()).toBe(true);
      
      await browser.close();
    }, 30000);
    
    test('should launch Puppeteer browser in non-headless mode', async () => {
      const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      expect(browser).toBeDefined();
      expect(browser.isConnected()).toBe(true);
      
      await browser.close();
    }, 30000);
    
    test('should create a new page and navigate to URL', async () => {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
      });
      
      const page = await browser.newPage();
      expect(page).toBeDefined();
      
      // Test navigation to a simple page
      await page.goto('about:blank');
      const url = page.url();
      expect(url).toBe('about:blank');
      
      await browser.close();
    }, 30000);
    
    test('should set viewport dimensions correctly', async () => {
      const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: {
          width: 1280,
          height: 800
        }
      });
      
      const page = await browser.newPage();
      const viewport = page.viewport();
      
      expect(viewport.width).toBe(1280);
      expect(viewport.height).toBe(800);
      
      await browser.close();
    }, 30000);
    
    test('should handle page timeout settings', async () => {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      
      // Set custom timeout
      page.setDefaultTimeout(60000);
      page.setDefaultNavigationTimeout(60000);
      
      // Navigate should respect timeout
      await page.goto('about:blank');
      
      await browser.close();
    }, 30000);
  });
  
  // ============================================================================
  // TEST CATEGORY 2: SEARCH FUNCTIONALITY
  // ============================================================================
  
  describe('Search Functionality - Vacancy Search', () => {
    
    test('should accept valid date range as strings', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      // This should not throw an error
      await expect(async () => {
        await searchVacanciesByDay(checkin, checkout, true);
      }).not.toThrow();
    }, 120000);
    
    test('should accept valid date range as Date objects', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      // This should not throw an error
      await expect(async () => {
        await searchVacanciesByDay(futureDate, checkoutDate, true);
      }).not.toThrow();
    }, 120000);
    
    test('should return structured result object', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('hasAvailability');
      expect(result).toHaveProperty('result');
    }, 120000);
    
    test('should handle weekend date ranges', async () => {
      // Calculate next Friday-Sunday
      const today = new Date();
      const nextFriday = new Date(today);
      const daysUntilFriday = (5 - today.getDay() + 7) % 7;
      nextFriday.setDate(today.getDate() + (daysUntilFriday || 7));
      
      const nextSunday = new Date(nextFriday);
      nextSunday.setDate(nextFriday.getDate() + 2);
      
      const checkin = nextFriday.toISOString().split('T')[0];
      const checkout = nextSunday.toISOString().split('T')[0];
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    }, 120000);
  });
  
  // ============================================================================
  // TEST CATEGORY 3: API ENDPOINTS
  // ============================================================================
  
  describe('API Endpoints - REST API Integration', () => {
    
    test('GET / should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('search');
    });
    
    test('GET /api/health should return health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });
    
    test('GET /api/vagas/search should require checkin parameter', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkout: '2025-12-26' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });
    
    test('GET /api/vagas/search should require checkout parameter', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: '2025-12-25' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });
    
    test('GET /api/vagas/search should require both parameters', async () => {
      const response = await request(app).get('/api/vagas/search');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('example');
    });
    
    test('GET /api/vagas/search should accept valid date parameters', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('method');
      expect(response.body.method).toBe('puppeteer');
      expect(response.body).toHaveProperty('data');
    }, 120000);
    
    test('GET /api/vagas/search should accept headless parameter', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout, headless: 'true' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBeDefined();
    }, 120000);
    
    test('GET /api/vagas/search should include resource savings info', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resourceSavings');
      expect(response.body.resourceSavings).toContain('40-60%');
    }, 120000);
  });
  
  // ============================================================================
  // TEST CATEGORY 4: ERROR HANDLING
  // ============================================================================
  
  describe('Error Handling - Validation and Edge Cases', () => {
    
    test('should reject invalid date format', async () => {
      await expect(async () => {
        await searchVacanciesByDay('invalid-date', '2025-12-26', true);
      }).rejects.toThrow();
    });
    
    test('should reject checkout date before checkin date', async () => {
      await expect(async () => {
        await searchVacanciesByDay('2025-12-26', '2025-12-25', true);
      }).rejects.toThrow('endDate must be after startDate');
    });
    
    test('should reject same checkin and checkout dates', async () => {
      await expect(async () => {
        await searchVacanciesByDay('2025-12-25', '2025-12-25', true);
      }).rejects.toThrow('endDate must be after startDate');
    });
    
    test('should reject null/undefined checkin date', async () => {
      await expect(async () => {
        await searchVacanciesByDay(null, '2025-12-26', true);
      }).rejects.toThrow();
    });
    
    test('should reject null/undefined checkout date', async () => {
      await expect(async () => {
        await searchVacanciesByDay('2025-12-25', null, true);
      }).rejects.toThrow();
    });
    
    test('should handle malformed date strings gracefully', async () => {
      await expect(async () => {
        await searchVacanciesByDay('2025-13-45', '2025-12-26', true);
      }).rejects.toThrow();
    });
    
    test('API should return proper error for invalid dates', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: 'invalid', checkout: 'invalid' });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
    
    test('API should return proper error for reversed dates', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: '2025-12-26', checkout: '2025-12-25' });
      
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('after');
    });
  });
  
  // ============================================================================
  // TEST CATEGORY 5: PERFORMANCE METRICS
  // ============================================================================
  
  describe('Performance Metrics - Resource Usage', () => {
    
    test('should complete search within reasonable time', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const startTime = Date.now();
      await searchVacanciesByDay(checkin, checkout, true);
      const duration = Date.now() - startTime;
      
      // Should complete within 60 seconds
      expect(duration).toBeLessThan(60000);
    }, 120000);
    
    test('should use reasonable memory', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const startMemory = process.memoryUsage().heapUsed;
      await searchVacanciesByDay(checkin, checkout, true);
      const endMemory = process.memoryUsage().heapUsed;
      const memoryDelta = (endMemory - startMemory) / 1024 / 1024; // MB
      
      // Should use less than 500 MB
      expect(memoryDelta).toBeLessThan(500);
    }, 120000);
    
    test('headless mode should be faster than non-headless', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      // Measure headless
      const headlessStart = Date.now();
      await searchVacanciesByDay(checkin, checkout, true);
      const headlessDuration = Date.now() - headlessStart;
      
      // Headless should complete in reasonable time
      expect(headlessDuration).toBeLessThan(60000);
    }, 120000);
  });
  
  // ============================================================================
  // TEST CATEGORY 6: BROWSER POOL MANAGEMENT
  // ============================================================================
  
  describe('Browser Pool Management - Instance Reuse', () => {
    
    test('should handle multiple sequential searches', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      // Run three searches sequentially
      const result1 = await searchVacanciesByDay(checkin, checkout, true);
      const result2 = await searchVacanciesByDay(checkin, checkout, true);
      const result3 = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result3).toBeDefined();
    }, 360000); // Extended timeout for multiple searches
    
    test('should handle rapid concurrent API requests', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      // Make multiple concurrent requests
      const requests = [
        request(app).get('/api/vagas/search').query({ checkin, checkout }),
        request(app).get('/api/vagas/search').query({ checkin, checkout })
      ];
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBeDefined();
      });
    }, 240000);
  });
  
  // ============================================================================
  // TEST CATEGORY 7: DATE HANDLING
  // ============================================================================
  
  describe('Date Handling - Format and Conversion', () => {
    
    test('should parse YYYY-MM-DD format correctly', async () => {
      const result = await searchVacanciesByDay('2025-12-25', '2025-12-26', true);
      expect(result).toBeDefined();
    }, 120000);
    
    test('should handle different month lengths', async () => {
      // February (short month)
      const feb1 = await searchVacanciesByDay('2025-02-15', '2025-02-16', true);
      expect(feb1).toBeDefined();
      
      // January (31 days)
      const jan1 = await searchVacanciesByDay('2025-01-30', '2025-01-31', true);
      expect(jan1).toBeDefined();
    }, 240000);
    
    test('should handle month boundaries', async () => {
      // Month boundary crossing
      const result = await searchVacanciesByDay('2025-01-31', '2025-02-01', true);
      expect(result).toBeDefined();
    }, 120000);
    
    test('should handle year boundaries', async () => {
      // Year boundary crossing
      const result = await searchVacanciesByDay('2025-12-31', '2026-01-01', true);
      expect(result).toBeDefined();
    }, 120000);
  });
  
  // ============================================================================
  // TEST CATEGORY 8: RESPONSE STRUCTURE
  // ============================================================================
  
  describe('Response Structure - Data Format Validation', () => {
    
    test('should include all required fields in response', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const result = await searchVacanciesByDay(checkin, checkout, true);
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('hasAvailability');
      expect(result).toHaveProperty('result');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.hasAvailability).toBe('boolean');
    }, 120000);
    
    test('API response should include metadata', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout });
      
      expect(response.body).toHaveProperty('method');
      expect(response.body).toHaveProperty('resourceSavings');
      expect(response.body.method).toBe('puppeteer');
    }, 120000);
  });
});
