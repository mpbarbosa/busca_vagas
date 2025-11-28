import express from 'express';
import * as vagasController from '../controllers/vagasController.js';

/**
 * Rotas para gerenciamento de vagas
 */
const router = express.Router();

// GET /api/vagas - Lista todas as vagas
router.get('/', vagasController.listarVagas);

// GET /api/vagas/:id - Busca vaga por ID
router.get('/:id', vagasController.buscarVagaPorId);

// POST /api/vagas - Cria nova vaga
router.post('/', vagasController.criarVaga);

// PUT /api/vagas/:id - Atualiza vaga existente
router.put('/:id', vagasController.atualizarVaga);

// DELETE /api/vagas/:id - Remove vaga
router.delete('/:id', vagasController.removerVaga);

// GET /api/vagas/search/simple - Simple search for vacancies by day
router.get('/search/simple', vagasController.simpleSearch);

export default router;
