require('dotenv').config();
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Busca Vagas API' });
});

// API Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

export default app;
