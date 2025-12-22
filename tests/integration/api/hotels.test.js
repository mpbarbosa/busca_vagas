/**
 * Integration Tests - Hotels API
 */
import request from 'supertest';

// We'll import the app dynamically
let app;

describe('Hotels API', () => {
  beforeAll(async () => {
    // Import the app
    const serverModule = await import('../../../src/server.js');
    app = serverModule.default || serverModule.app;
  });

  describe('GET /api/vagas/hoteis', () => {
    test('should return list of hotels', async () => {
      const response = await request(app).get('/api/vagas/hoteis');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should return hotels with correct structure', async () => {
      const response = await request(app).get('/api/vagas/hoteis');
      const hotel = response.body.data[0];
      
      expect(hotel).toHaveProperty('id');
      expect(hotel).toHaveProperty('hotelId');
      expect(hotel).toHaveProperty('name');
      expect(hotel).toHaveProperty('type');
    });

    test('should include cache information', async () => {
      const response = await request(app).get('/api/vagas/hoteis');
      expect(response.body).toHaveProperty('cache');
    });

    test('should bypass cache with nocache=true', async () => {
      const response = await request(app)
        .get('/api/vagas/hoteis')
        .query({ nocache: 'true' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/vagas/hoteis/:id', () => {
    test('should return specific hotel by ID', async () => {
      // First get a valid hotel ID
      const listResponse = await request(app).get('/api/vagas/hoteis');
      const hotelId = listResponse.body.data[0].id;
      
      const response = await request(app).get(`/api/vagas/hoteis/${hotelId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(hotelId);
    });

    test('should return 404 for non-existent hotel ID', async () => {
      const response = await request(app).get('/api/vagas/hoteis/99999');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/vagas/hoteis/cache', () => {
    test('should return cache information', async () => {
      const response = await request(app).get('/api/vagas/hoteis/cache');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('cached');
    });
  });

  describe('DELETE /api/vagas/hoteis/cache', () => {
    test('should clear hotel cache', async () => {
      const response = await request(app).delete('/api/vagas/hoteis/cache');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should have empty cache after clearing', async () => {
      // Clear cache
      await request(app).delete('/api/vagas/hoteis/cache');
      
      // Check cache status
      const response = await request(app).get('/api/vagas/hoteis/cache');
      expect(response.body.data.cached).toBe(false);
    });
  });
});
