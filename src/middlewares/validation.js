/**
 * Validation Middleware
 * Validates input data for API requests
 * 
 * @module middlewares/validation
 * @version 1.4.0
 * @since 1.0.0
 */

export const validarVaga = (req, res, next) => {
  const { titulo, hotel, sindicato } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'Título é obrigatório' });
  }

  if (!hotel) {
    return res.status(400).json({ error: 'Hotel é obrigatório' });
  }

  if (!sindicato) {
    return res.status(400).json({ error: 'Sindicato é obrigatório' });
  }

  next();
};
