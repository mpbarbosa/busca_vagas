/**
 * Unit Tests for Puppeteer Controller Functions
 * 
 * This test suite focuses on unit testing individual functions
 * from the Puppeteer controller in isolation.
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server.js';
import * as puppeteerController from '../../src/controllers/vagasControllerPuppeteer.js';

describe('Puppeteer Controller - Unit Tests', () => {
  
  // ============================================================================
  // CONTROLLER FUNCTION TESTS
  // ============================================================================
  
  describe('Controller Functions', () => {
    
    test('listarVagas should return empty array', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await puppeteerController.listarVagas(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ vagas: [] });
    });

    test('buscarVagaPorId should return placeholder message', async () => {
      const req = { params: { id: '123' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await puppeteerController.buscarVagaPorId(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ 
        id: '123', 
        message: 'Vaga não implementada' 
      });
    });

    test('criarVaga should return success message', async () => {
      const req = { body: { titulo: 'Test Vaga' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await puppeteerController.criarVaga(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Vaga criada com sucesso' 
      });
    });

    test('atualizarVaga should return success message', async () => {
      const req = { 
        params: { id: '123' },
        body: { titulo: 'Updated Vaga' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await puppeteerController.atualizarVaga(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Vaga atualizada com sucesso' 
      });
    });

    test('removerVaga should return success message', async () => {
      const req = { params: { id: '123' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await puppeteerController.removerVaga(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Vaga removida com sucesso' 
      });
    });
  });

  // ============================================================================
  // REQUEST VALIDATION TESTS
  // ============================================================================
  
  describe('Request Validation', () => {
    
    test('searchByDates should validate checkin parameter', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkout: '2025-12-26' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('required');
    });

    test('searchByDates should validate checkout parameter', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: '2025-12-25' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('required');
    });

    test('searchByDates should require both parameters', async () => {
      const response = await request(app)
        .get('/api/vagas/search');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('example');
    });

    test('searchByDates should provide example URL in error', async () => {
      const response = await request(app)
        .get('/api/vagas/search');
      
      expect(response.body.example).toContain('/api/vagas/search?');
      expect(response.body.example).toContain('checkin=');
      expect(response.body.example).toContain('checkout=');
    });
  });

  // ============================================================================
  // RESPONSE FORMAT TESTS
  // ============================================================================
  
  describe('Response Format', () => {
    
    test('searchByDates should return proper success response structure', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 90);
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
      expect(response.body).toHaveProperty('resourceSavings');
      expect(response.body).toHaveProperty('data');
    }, 180000);

    test('searchByDates should indicate Puppeteer method', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 95);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout });
      
      expect(response.body.method).toBe('puppeteer');
    }, 180000);

    test('searchByDates should include resource savings info', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 100);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout });
      
      expect(response.body.resourceSavings).toContain('40-60%');
      expect(response.body.resourceSavings).toContain('Selenium');
    }, 180000);

    test('error response should include proper structure', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: 'invalid', checkout: 'invalid' });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('method');
      expect(response.body.success).toBe(false);
      expect(response.body.method).toBe('puppeteer');
    });
  });

  // ============================================================================
  // PARAMETER HANDLING TESTS
  // ============================================================================
  
  describe('Parameter Handling', () => {
    
    test('should accept headless=true parameter', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 105);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout, headless: 'true' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBeDefined();
    }, 180000);

    test('should accept headless=true parameter', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 110);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout, headless: 'true' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBeDefined();
    }, 180000);

    test('should default to headless=true when not specified', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 115);
      const checkoutDate = new Date(futureDate);
      checkoutDate.setDate(checkoutDate.getDate() + 1);
      
      const checkin = futureDate.toISOString().split('T')[0];
      const checkout = checkoutDate.toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin, checkout });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBeDefined();
    }, 180000);

    test('should accept dates in YYYY-MM-DD format', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: '2025-12-25', checkout: '2025-12-26' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBeDefined();
    }, 180000);
  });

  // ============================================================================
  // ENDPOINT ROUTING TESTS
  // ============================================================================
  
  describe('Endpoint Routing', () => {
    
    test('GET /api/vagas should work', async () => {
      const response = await request(app).get('/api/vagas');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vagas');
    });

    test('GET /api/vagas/search should be accessible', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: '2025-12-25', checkout: '2025-12-26' });
      
      expect(response.status).toBe(200);
    }, 180000);

    test('POST /api/vagas should work', async () => {
      const response = await request(app)
        .post('/api/vagas')
        .send({ titulo: 'Test Vaga' });
      
      expect(response.status).toBe(201);
    });

    test('GET /api/vagas/:id should work', async () => {
      const response = await request(app).get('/api/vagas/123');
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe('123');
    });

    test('PUT /api/vagas/:id should work', async () => {
      const response = await request(app)
        .put('/api/vagas/123')
        .send({ titulo: 'Updated' });
      
      expect(response.status).toBe(200);
    });

    test('DELETE /api/vagas/:id should work', async () => {
      const response = await request(app).delete('/api/vagas/123');
      
      expect(response.status).toBe(200);
    });
  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================
  
  describe('Error Handling', () => {
    
    test('should handle internal errors gracefully', async () => {
      const response = await request(app)
        .get('/api/vagas/search')
        .query({ checkin: 'bad-format', checkout: 'bad-format' });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
    });

    test('should provide meaningful error messages', async () => {
      const response = await request(app)
        .get('/api/vagas/search');
      
      expect(response.body.error).toBeDefined();
      expect(typeof response.body.error).toBe('string');
      expect(response.body.error.length).toBeGreaterThan(0);
    });

    test('should handle missing query parameters', async () => {
      const response = await request(app)
        .get('/api/vagas/search');
      
      expect(response.status).toBe(400);
    });
  });
});
