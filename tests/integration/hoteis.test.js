/**
 * Integration tests for hotel endpoints
 */

import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import router from '../../src/routes/index.js';

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Hotel Endpoints', () => {
  describe('GET /api/vagas/hoteis', () => {
    test('should return list of static hotels', async () => {
      const response = await request(app)
        .get('/api/vagas/hoteis')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    test('should return hotels with correct structure', async () => {
      const response = await request(app)
        .get('/api/vagas/hoteis')
        .expect(200);

      const hotels = response.body.data;
      expect(hotels.length).toBeGreaterThan(0);

      hotels.forEach(hotel => {
        expect(hotel).toHaveProperty('id');
        expect(hotel).toHaveProperty('name');
        expect(hotel).toHaveProperty('type');
      });
    });
  });

  describe('GET /api/vagas/hoteis/:id', () => {
    test('should return hotel when valid ID is provided', async () => {
      const response = await request(app)
        .get('/api/vagas/hoteis/1')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(1);
    });

    test('should return 404 when hotel not found', async () => {
      const response = await request(app)
        .get('/api/vagas/hoteis/9999')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/vagas/hoteis/scrape', () => {
    test('should be accessible', async () => {
      // Note: Actual scraping requires browser and network
      // This just tests the endpoint exists and responds
      const response = await request(app)
        .get('/api/vagas/hoteis/scrape');

      // Will either succeed or fail with proper error structure
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('source');
      } else {
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error');
      }
    }, 60000); // 60 second timeout for scraping
  });
});
