const express = require('express');
const router = express.Router();
const vagasController = require('../controllers/vagasController');

/**
 * Rotas para gerenciamento de vagas
 */

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

module.exports = router;
