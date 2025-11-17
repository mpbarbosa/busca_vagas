const express = require('express');
const router = express.Router();
const vagasRoutes = require('./vagasRoutes');

/**
 * Arquivo principal de rotas
 * Centraliza todas as rotas da API
 */

// Rota de health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API está funcionando' });
});

// Rotas de vagas
router.use('/vagas', vagasRoutes);

module.exports = router;
