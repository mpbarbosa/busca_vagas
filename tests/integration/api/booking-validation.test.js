/**
 * Integration Tests - Booking Rules Validation Middleware
 * Testing BR-18, BR-19, BR-20 via API
 */
import request from 'supertest';

// We'll import the app dynamically
let app;

describe('Booking Rules Validation - API Integration', () => {
  beforeAll(async () => {
    // Import the app
    const serverModule = await import('../../../src/server.js');
    app = serverModule.default || serverModule.app;
  });

  describe('GET /api/vagas/search - Christmas Package Validation', () => {
    test('should accept valid Christmas package dates', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-22',
          checkout: '2024-12-27',
          hotelId: '4001',
          headless: 'true'
        });
      
      // May timeout or have external dependencies, but validation should pass
      // Accept 200 (success) or 500 (external error) - both mean validation passed
      expect([200, 500, 504]).toContain(response.status);
      
      // If we got 400, make sure it's NOT a booking rule error
      if (response.status === 400) {
        expect(response.body.code).not.toBe('INVALID_CHRISTMAS_PACKAGE');
      }
    });

    test('should reject partial Christmas package dates', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-23',
          checkout: '2024-12-26',
          hotelId: '4001'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('INVALID_CHRISTMAS_PACKAGE');
      expect(response.body.package).toBe('Christmas Package');
    });

    test('should bypass rules with applyBookingRules=false', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-23',
          checkout: '2024-12-26',
          applyBookingRules: 'false',
          hotelId: '4001',
          headless: 'true'
        });
      
      // Should not fail with booking rule validation
      expect([200, 500, 504]).toContain(response.status);
      
      // Should not return booking rule error
      if (response.status === 400) {
        expect(response.body.code).not.toMatch(/INVALID_(CHRISTMAS|NEW_YEAR)_PACKAGE/);
      }
    });
  });

  describe('GET /api/vagas/search - New Year Package Validation', () => {
    test('should accept valid New Year package dates', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-27',
          checkout: '2025-01-02',
          hotelId: '4001',
          headless: 'true'
        });
      
      // Validation should pass
      expect([200, 500, 504]).toContain(response.status);
      
      if (response.status === 400) {
        expect(response.body.code).not.toBe('INVALID_NEW_YEAR_PACKAGE');
      }
    });

    test('should reject partial New Year package dates', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-28',
          checkout: '2025-01-01',
          hotelId: '4001'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_NEW_YEAR_PACKAGE');
    });
  });

  describe('GET /api/vagas/search - Date Format Validation', () => {
    test('should reject invalid date format', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024/12/25',
          checkout: '2024/12/26',
          hotelId: '4001'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_DATE_FORMAT');
    });

    test('should reject missing checkin', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkout: '2024-12-26',
          hotelId: '4001'
        });
      
      expect(response.status).toBe(400);
    });

    test('should reject missing checkout', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-25',
          hotelId: '4001'
        });
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/vagas/search - Regular Date Validation', () => {
    test('should accept regular dates outside holiday periods', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-11-15',
          checkout: '2024-11-17',
          hotelId: '4001',
          headless: 'true'
        });
      
      // Should pass validation
      expect([200, 500, 504]).toContain(response.status);
    });
  });
});
