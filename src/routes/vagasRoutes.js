import express from 'express';
import * as vagasController from '../controllers/vagasController.js';
import * as vagasControllerPuppeteer from '../controllers/vagasControllerPuppeteer.js';
import * as hoteisController from '../controllers/hoteisController.js';

/**
 * Rotas para gerenciamento de vagas
 */
const router = express.Router();

// GET /api/vagas - Lista todas as vagas
router.get('/', vagasController.listarVagas);

// GET /api/vagas/hoteis - Lista todos os hotéis disponíveis
router.get('/hoteis', hoteisController.listarHoteis);

// GET /api/vagas/hoteis/scrape - Scrape hotel list from AFPESP website
router.get('/hoteis/scrape', hoteisController.scrapeHoteis);

// GET /api/vagas/hoteis/:id - Get hotel by ID
router.get('/hoteis/:id', hoteisController.buscarHotelPorId);

// GET /api/vagas/search - Search for vacancies by dates (Puppeteer - RECOMMENDED)
// Example: /api/vagas/search?checkin=2024-12-25&checkout=2024-12-26
router.get('/search', vagasControllerPuppeteer.searchByDates);

// GET /api/vagas/search/weekends - Search all upcoming weekends (Puppeteer - RECOMMENDED)
router.get('/search/weekends', vagasControllerPuppeteer.searchWeekends);

// GET /api/vagas/search/selenium - Search for vacancies by dates (Selenium - Legacy)
// Kept for backward compatibility
router.get('/search/selenium', vagasController.searchByDates);

// Legacy endpoint alias (redirects to Puppeteer)
router.get('/search/bydates', vagasControllerPuppeteer.searchByDates);

// GET /api/vagas/:id - Busca vaga por ID
router.get('/:id', vagasController.buscarVagaPorId);

// POST /api/vagas - Cria nova vaga
router.post('/', vagasController.criarVaga);

// PUT /api/vagas/:id - Atualiza vaga existente
router.put('/:id', vagasController.atualizarVaga);

// DELETE /api/vagas/:id - Remove vaga
router.delete('/:id', vagasController.removerVaga);

export default router;
