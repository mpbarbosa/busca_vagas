/**
 * E2E Test for Simple Search Endpoint
 * Tests the /api/vagas/search/simple endpoint using Selenium
 * 
 * IMPORTANT: The API server must be running before executing these tests.
 * Start the server with: npm run dev (in a separate terminal)
 * Then run: npm run test:e2e
 */
const { Builder, By, until } = require('selenium-webdriver');
const http = require('http');

// Helper function to check if server is running
async function isServerRunning(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: '/',
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

describe('E2E - Simple Search Endpoint', () => {
  let driver;
  let serverRunning = false;
  const BASE_URL = process.env.API_URL || 'http://localhost:3005';

  beforeAll(async () => {
    // Check if server is running
    serverRunning = await isServerRunning(BASE_URL);
    
    if (!serverRunning) {
      console.warn(`\n⚠️  WARNING: API server is not running at ${BASE_URL}`);
      console.warn('   Start the server with: npm run dev\n');
      return;
    }
    
    driver = await new Builder().forBrowser('chrome').build();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe('GET /api/vagas/search/simple', () => {
    test('should return 400 when date parameter is missing', async () => {
      if (!serverRunning) {
        console.log('   Skipping test - server not running');
        return;
      }
      
      const url = `${BASE_URL}/api/vagas/search/simple`;
      
      await driver.get(url);
      await driver.wait(until.elementLocated(By.css('body')), 10000);
      
      const bodyText = await driver.findElement(By.css('body')).getText();
      const response = JSON.parse(bodyText);
      
      expect(response).toHaveProperty('error');
      expect(response.error).toBe('Date parameter is required');
    }, 30000);

    test('should return results when valid date is provided', async () => {
      if (!serverRunning) {
        console.log('   Skipping test - server not running');
        return;
      }
      
      // Calculate a future date for testing (30 days from now)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const dateString = futureDate.toISOString().split('T')[0];
      
      const url = `${BASE_URL}/api/vagas/search/simple?date=${dateString}`;
      
      await driver.get(url);
      await driver.wait(until.elementLocated(By.css('body')), 60000);
      
      const bodyText = await driver.findElement(By.css('body')).getText();
      const response = JSON.parse(bodyText);
      
      // Verify response structure
      expect(response).toBeDefined();
      // The response should contain search results from searchVacanciesByDay
      expect(typeof response).toBe('object');
    }, 120000); // Extended timeout for Selenium automation

    test('should handle invalid date format gracefully', async () => {
      if (!serverRunning) {
        console.log('   Skipping test - server not running');
        return;
      }
      
      const url = `${BASE_URL}/api/vagas/search/simple?date=invalid-date`;
      
      await driver.get(url);
      await driver.wait(until.elementLocated(By.css('body')), 10000);
      
      const bodyText = await driver.findElement(By.css('body')).getText();
      const response = JSON.parse(bodyText);
      
      expect(response).toHaveProperty('error');
    }, 30000);

    test('should accept date in YYYY-MM-DD format', async () => {
      if (!serverRunning) {
        console.log('   Skipping test - server not running');
        return;
      }
      
      const url = `${BASE_URL}/api/vagas/search/simple?date=2025-12-25`;
      
      await driver.get(url);
      await driver.wait(until.elementLocated(By.css('body')), 60000);
      
      const bodyText = await driver.findElement(By.css('body')).getText();
      
      // Should not throw JSON parse error (valid response)
      expect(() => JSON.parse(bodyText)).not.toThrow();
    }, 120000);
  });
});
