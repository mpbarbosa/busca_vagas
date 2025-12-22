/**
 * Booking Rules Integration Tests
 * Tests for API endpoint validation of holiday packages (BR-18, BR-19, BR-20)
 * 
 * @module tests/integration/bookingRules
 * @version 1.5.0
 * @since 1.4.0
 * @updated 1.5.0 - Added tests for applyBookingRules parameter (BR-20)
 */

import request from 'supertest';
import express from 'express';
import vagasRoutes from '../../src/routes/vagasRoutes.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/vagas', vagasRoutes);

describe('Booking Rules API Integration Tests', () => {
  
  describe('GET /api/vagas/search - Christmas Package', () => {
    
    test('should accept valid Christmas package dates', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-22',
          checkout: '2024-12-27',
          hotel: 'Todas'
        });
      
      // Should not return validation error (may timeout or succeed)
      if (response.status === 400) {
        expect(response.body.code).not.toBe('INVALID_CHRISTMAS_PACKAGE');
      }
    }, 30000); // Longer timeout for scraping
    
    test('should reject partial Christmas period with proper error', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-23',
          checkout: '2024-12-26'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('INVALID_CHRISTMAS_PACKAGE');
      expect(response.body.error).toContain('December 22');
      expect(response.body.error).toContain('December 27');
      expect(response.body.package).toBe('Christmas Package');
      expect(response.body.documentation.businessRules).toContain('BR-18');
      expect(response.body.documentation.businessRules).toContain('BR-19');
      expect(response.body.documentation.businessRules).toContain('BR-20');
      expect(response.body.documentation.bypassOption).toContain('applyBookingRules=false');
    });
    
    test('should reject Christmas dates with wrong check-in', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-24',
          checkout: '2024-12-27'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_CHRISTMAS_PACKAGE');
      expect(response.body.requiredDates.checkin).toBe('December 22');
    });
    
    test('should reject Christmas dates with wrong check-out', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-22',
          checkout: '2024-12-25'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_CHRISTMAS_PACKAGE');
      expect(response.body.requiredDates.checkout).toBe('December 27');
    });
    
  });
  
  describe('GET /api/vagas/search - New Year Package', () => {
    
    test('should accept valid New Year package dates', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-27',
          checkout: '2025-01-02',
          hotel: 'Todas'
        });
      
      // Should not return validation error
      if (response.status === 400) {
        expect(response.body.code).not.toBe('INVALID_NEW_YEAR_PACKAGE');
      }
    }, 30000);
    
    test('should reject partial New Year period with proper error', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-28',
          checkout: '2025-01-01'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('INVALID_NEW_YEAR_PACKAGE');
      expect(response.body.error).toContain('December 27');
      expect(response.body.error).toContain('January 2');
      expect(response.body.package).toBe('New Year Package');
    });
    
    test('should reject New Year dates with wrong check-in', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-29',
          checkout: '2025-01-02'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_NEW_YEAR_PACKAGE');
      expect(response.body.requiredDates.checkin).toBe('December 27');
    });
    
    test('should reject New Year dates with wrong check-out', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-27',
          checkout: '2024-12-31'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_NEW_YEAR_PACKAGE');
      expect(response.body.requiredDates.checkout).toContain('January 2');
    });
    
  });
  
  describe('GET /api/vagas/search - Non-Holiday Dates', () => {
    
    test('should accept normal dates outside holiday periods', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-11-15',
          checkout: '2024-11-20'
        });
      
      // Should not return booking rule validation error
      if (response.status === 400) {
        expect(response.body.code).not.toBe('INVALID_CHRISTMAS_PACKAGE');
        expect(response.body.code).not.toBe('INVALID_NEW_YEAR_PACKAGE');
      }
    }, 30000);
    
    test('should accept dates before Christmas period', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-15',
          checkout: '2024-12-20'
        });
      
      if (response.status === 400) {
        expect(response.body.code).not.toMatch(/INVALID_.*_PACKAGE/);
      }
    }, 30000);
    
  });
  
  describe('GET /api/vagas/search - Error Response Format', () => {
    
    test('should return properly formatted error response', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-23',
          checkout: '2024-12-26'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('package');
      expect(response.body).toHaveProperty('requiredDates');
      expect(response.body).toHaveProperty('providedDates');
      expect(response.body).toHaveProperty('documentation');
      
      expect(response.body.success).toBe(false);
      expect(response.body.providedDates.checkin).toBe('2024-12-23');
      expect(response.body.providedDates.checkout).toBe('2024-12-26');
      expect(response.body.documentation.reference).toContain('FUNCTIONAL_REQUIREMENTS.md');
    });
    
    test('should include business rule references in error', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-27',
          checkout: '2025-01-01'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.documentation.businessRules).toEqual(['BR-18', 'BR-19']);
      expect(response.body.documentation.reference).toContain('631-booking-rules');
    });
    
  });
  
  describe('GET /api/vagas/search - Date Format Validation', () => {
    
    test('should reject invalid date format', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '12-25-2024',
          checkout: '12-26-2024'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_DATE_FORMAT');
    });
    
    test('should reject checkout before checkin', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-11-20',
          checkout: '2024-11-15'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_DATE_RANGE');
      expect(response.body.error).toContain('after');
    });
    
  });
  
  describe('GET /api/vagas/search/selenium - Legacy Endpoint', () => {
    
    test('should also validate booking rules on legacy endpoint', async () => {
      const response = await request(app)
        .get('/api/vagas/search/selenium')
        .query({
          checkin: '2024-12-23',
          checkout: '2024-12-26'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_CHRISTMAS_PACKAGE');
    });
    
  });
  
  describe('GET /api/vagas/search/bydates - Alias Endpoint', () => {
    
    test('should also validate booking rules on alias endpoint', async () => {
      const response = await request(app)
        .get('/api/vagas/search/bydates')
        .query({
          checkin: '2024-12-28',
          checkout: '2025-01-01'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_NEW_YEAR_PACKAGE');
    });
    
  });
  
  describe('Missing Parameters', () => {
    
    test('should handle missing dates gracefully', async () => {
      const response = await request(app)
        .get('/api/vagas/search');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });
    
  });
  
  describe('GET /api/vagas/search - applyBookingRules Parameter (BR-20)', () => {
    
    test('should bypass Christmas rules when applyBookingRules=false', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-23',
          checkout: '2024-12-26',
          hotel: 'Todas',
          applyBookingRules: 'false'
        });
      
      // Should NOT return validation error (may timeout or succeed with scraping)
      expect(response.status).not.toBe(400);
      
      // If successful, check response structure
      if (response.status === 200) {
        expect(response.body.query.applyBookingRules).toBe(false);
        expect(response.body.note).toContain('bypassed');
      }
    }, 30000);
    
    test('should bypass New Year rules when applyBookingRules=false', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-28',
          checkout: '2025-01-01',
          hotel: 'Todas',
          applyBookingRules: 'false'
        });
      
      // Should NOT return validation error
      expect(response.status).not.toBe(400);
      
      // If successful, check response structure
      if (response.status === 200) {
        expect(response.body.query.applyBookingRules).toBe(false);
        expect(response.body.note).toContain('bypassed');
      }
    }, 30000);
    
    test('should enforce rules by default when applyBookingRules is omitted', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-23',
          checkout: '2024-12-26'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_CHRISTMAS_PACKAGE');
    });
    
    test('should enforce rules when applyBookingRules=true', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-23',
          checkout: '2024-12-26',
          applyBookingRules: 'true'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_CHRISTMAS_PACKAGE');
    });
    
    test('should accept valid Christmas package with applyBookingRules=true', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-22',
          checkout: '2024-12-27',
          hotel: 'Todas',
          applyBookingRules: 'true'
        });
      
      // Should not return validation error
      if (response.status === 400) {
        expect(response.body.code).not.toBe('INVALID_CHRISTMAS_PACKAGE');
      }
    }, 30000);
    
    test('should accept valid Christmas package with applyBookingRules=false', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-12-22',
          checkout: '2024-12-27',
          hotel: 'Todas',
          applyBookingRules: 'false'
        });
      
      // Should not return validation error
      if (response.status === 400) {
        expect(response.body.code).not.toBe('INVALID_CHRISTMAS_PACKAGE');
      }
      
      // If successful, should include note about bypassed rules
      if (response.status === 200) {
        expect(response.body.query.applyBookingRules).toBe(false);
      }
    }, 30000);
    
    test('should work with non-holiday dates and applyBookingRules=false', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({
          checkin: '2024-11-15',
          checkout: '2024-11-20',
          hotel: 'Todas',
          applyBookingRules: 'false'
        });
      
      // Should not return validation error
      expect(response.status).not.toBe(400);
    }, 30000);
    
  });
  
});
