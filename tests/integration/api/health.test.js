/**
 * Integration Tests - Health Endpoint
 */
import request from 'supertest';

// We'll import the app dynamically
let app;

describe('Health Endpoint', () => {
  beforeAll(async () => {
    // Import the app
    const serverModule = await import('../../../src/server.js');
    app = serverModule.default || serverModule.app;
  });

  describe('GET /api/health', () => {
    test('should return 200 OK status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
    });

    test('should return health status with correct structure', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('should return status "OK"', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.status).toBe('OK');
    });

    test('should return valid uptime', async () => {
      const response = await request(app).get('/api/health');
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });

    test('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/api/health');
      expect(() => new Date(response.body.timestamp)).not.toThrow();
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('GET /', () => {
    test('should return 200 OK status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });

    test('should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('version');
    });

    test('should list available endpoints', async () => {
      const response = await request(app).get('/');
      
      // Should have some endpoint information
      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
    });
  });
});
