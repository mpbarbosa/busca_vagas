import express from 'express';
import vagasRoutes from './vagasRoutes.js';
/* eslint-disable */
import packageJson from '../../package.json' with { type: 'json' };
/* eslint-enable */

/**
 * Arquivo principal de rotas
 * Centraliza todas as rotas da API
 */
const router = express.Router();

// Rota de health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API está funcionando',
    version: packageJson.version,
    name: packageJson.name,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rotas de vagas
router.use('/vagas', vagasRoutes);

export default router;
