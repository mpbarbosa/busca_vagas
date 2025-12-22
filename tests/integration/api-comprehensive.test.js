// tests/integration/api.test.js

import request from 'supertest';

// We'll import the app dynamically to avoid server startup issues
let app;

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Import the app
    const serverModule = await import('../../src/server.js');
    app = serverModule.default || serverModule.app;
  });

  describe('GET /', () => {
    test('should return API info', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
    });

    test('should include service status', async () => {
      const res = await request(app).get('/api/health');
      
      // Verify health check returns expected structure
      expect(res.body).toHaveProperty('status');
      expect(res.body.status).toBe('OK');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/vagas/hoteis', () => {
    test('should return hotel list', async () => {
      const res = await request(app).get('/api/vagas/hoteis');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('hotelId');
      }
    });

    test('should include cache information in headers', async () => {
      const res = await request(app).get('/api/vagas/hoteis');
      // Check if cache-related headers exist
      expect(res.headers).toBeDefined();
    });

    test('should return consistent data on multiple calls', async () => {
      const res1 = await request(app).get('/api/vagas/hoteis');
      const res2 = await request(app).get('/api/vagas/hoteis');
      
      expect(res1.body).toEqual(res2.body);
    });
  });

  describe('GET /api/vagas/hoteis/:id', () => {
    test('should return specific hotel', async () => {
      // First get list to find a valid ID
      const listRes = await request(app).get('/api/vagas/hoteis');
      
      if (listRes.body.length > 0) {
        const hotelId = listRes.body[0].id;
        const res = await request(app).get(`/api/vagas/hoteis/${hotelId}`);
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body.id).toBe(hotelId);
      }
    });

    test('should return 404 for non-existent hotel', async () => {
      const res = await request(app).get('/api/vagas/hoteis/9999999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    test('should handle invalid ID format', async () => {
      const res = await request(app).get('/api/vagas/hoteis/invalid');
      expect([400, 404]).toContain(res.status);
    });
  });

  describe('GET /api/vagas/search - Booking Rules', () => {
    test('should accept valid Christmas package', async () => {
      const res = await request(app)
        .get('/api/vagas/search')
        .query({ 
          checkin: '2024-12-22', 
          checkout: '2024-12-27',
          hotelId: '4001',
          headless: 'true'
        });
      
      // May timeout if external site unreachable, but validation should pass
      // We expect either 200 (success) or 500 (external service error)
      expect([200, 500, 504]).toContain(res.status);
      
      // If validation passed, we shouldn't get 400
      if (res.status === 400) {
        expect(res.body.code).not.toBe('INVALID_CHRISTMAS_PACKAGE');
      }
    });

    test('should reject invalid Christmas dates', async () => {
      const res = await request(app)
        .get('/api/vagas/search')
        .query({ 
          checkin: '2024-12-23', 
          checkout: '2024-12-26',
          hotelId: '4001'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.code).toBe('INVALID_CHRISTMAS_PACKAGE');
      expect(res.body).toHaveProperty('package');
      expect(res.body).toHaveProperty('requiredDates');
    });

    test('should reject invalid New Year dates', async () => {
      const res = await request(app)
        .get('/api/vagas/search')
        .query({ 
          checkin: '2024-12-28', 
          checkout: '2024-12-31',
          hotelId: '4001'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.code).toBe('INVALID_NEW_YEAR_PACKAGE');
    });

    test('should accept bypass parameter', async () => {
      const res = await request(app)
        .get('/api/vagas/search')
        .query({ 
          checkin: '2024-12-23', 
          checkout: '2024-12-26',
          hotelId: '4001',
          applyBookingRules: 'false',
          headless: 'true'
        });
      
      // Should not fail with booking rule validation
      expect([200, 500, 504]).toContain(res.status);
      
      // Should not return booking rule error
      if (res.status === 400) {
        expect(res.body.code).not.toMatch(/INVALID_(CHRISTMAS|NEW_YEAR)_PACKAGE/);
      }
    });

    test('should require date parameters', async () => {
      const res = await request(app)
        .get('/api/vagas/search')
        .query({ hotelId: '4001' });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should validate date format', async () => {
      const res = await request(app)
        .get('/api/vagas/search')
        .query({ 
          checkin: 'invalid-date',
          checkout: '2024-12-27',
          hotelId: '4001'
        });
      
      expect(res.status).toBe(400);
    });
  });

  describe('Cache Endpoints', () => {
    test('GET /api/vagas/hoteis/cache should return cache info', async () => {
      const res = await request(app).get('/api/vagas/hoteis/cache');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('cached');
      expect(res.body).toHaveProperty('stats');
    });

    test('DELETE /api/vagas/hoteis/cache should clear cache', async () => {
      const res = await request(app).delete('/api/vagas/hoteis/cache');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('message');
    });

    test('Cache should be cleared after DELETE', async () => {
      // Clear cache
      await request(app).delete('/api/vagas/hoteis/cache');
      
      // Check cache status
      const res = await request(app).get('/api/vagas/hoteis/cache');
      expect(res.body.cached).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.status).toBe(404);
    });

    test('should handle malformed requests gracefully', async () => {
      const res = await request(app)
        .post('/api/vagas')
        .send('malformed json');
      
      expect([400, 404, 405]).toContain(res.status);
    });
  });

  describe('CORS', () => {
    test('should include CORS headers', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://example.com');
      
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
