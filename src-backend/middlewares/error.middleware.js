'use strict';

const config = require('../config/env.config');
const logger = require('../logger/logger');

// Middleware global de manejo de errores
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'Ocurrió un error interno del servidor.';
  let details = err.details || null;

  // Manejo de errores específicos de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    const validationErrors = Object.values(err.errors).map(e => e.message);
    message = validationErrors.join('. ');
    details = validationErrors;
  } else if (err.code === 11000) {
    statusCode = 409;
    code = 'EMAIL_ALREADY_EXISTS';
    message = 'Ya existe un registro con esos datos únicos (ej. email).';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Identificador inválido: ${err.value}`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    message = 'Token de autenticación inválido.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'El token de sesión ha expirado.';
  }

  // Registrar en Winston
  if (statusCode >= 500) {
    logger.error(`[${req.method} ${req.originalUrl}] 500 - ${message} | Stack: ${err.stack}`);
  } else {
    logger.warning(`[${req.method} ${req.originalUrl}] ${statusCode} - ${message}`);
  }

  const response = {
    status: 'error',
    code,
    message
  };

  if (details) {
    response.details = details;
  }

  // En desarrollo incluimos el stack trace para debugging
  if (config.isDev && statusCode >= 500 && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;
