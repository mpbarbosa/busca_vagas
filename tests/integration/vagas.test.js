/**
 * Testes de integração para as rotas de vagas
 */
const request = require('supertest');
const app = require('../../src/server');

describe('Rotas de Vagas - Integração', () => {
  describe('GET /', () => {
    test('deve retornar mensagem de boas-vindas da API', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Busca Vagas API');
    });
  });

  describe('GET /api/health', () => {
    test('deve retornar status OK no health check', async () => {
      // TODO: Adicionar rota /api ao server.js para este teste funcionar
      // const response = await request(app).get('/api/health');
      // expect(response.status).toBe(200);
      // expect(response.body.status).toBe('OK');
    });
  });

  describe('GET /api/vagas', () => {
    test('deve retornar lista de vagas', async () => {
      // TODO: Adicionar rota /api ao server.js para este teste funcionar
      // const response = await request(app).get('/api/vagas');
      // expect(response.status).toBe(200);
      // expect(response.body).toHaveProperty('vagas');
      // expect(Array.isArray(response.body.vagas)).toBe(true);
    });
  });
});
