'use strict';

const logger = require('../logger/logger');

// Middleware para rutas no encontradas (404)
function notFoundHandler(req, res) {
  logger.warning(`Ruta inexistente solicitada: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: `La ruta solicitada ${req.method} ${req.originalUrl} no existe en este servidor.`
  });
}

module.exports = notFoundHandler;
