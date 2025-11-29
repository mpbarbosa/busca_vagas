import express from 'express';
import vagasRoutes from './vagasRoutes.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));

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
