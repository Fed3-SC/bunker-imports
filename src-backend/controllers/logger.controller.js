'use strict';

const logger = require('../logger/logger');

const loggerController = {
  test(req, res, next) {
    try {
      // Registrar en los 6 niveles exigidos por la pre-entrega 4
      logger.debug('Logger Test: Nivel DEBUG ejecutado correctamente.');
      logger.http('Logger Test: Nivel HTTP registrado.');
      logger.info('Logger Test: Nivel INFO registrado.');
      logger.warning('Logger Test: Nivel WARNING registrado.');
      logger.error('Logger Test: Nivel ERROR registrado (prueba controlada).');
      logger.fatal('Logger Test: Nivel FATAL registrado (prueba controlada).');

      res.status(200).json({
        status: 'success',
        message: 'Prueba de logging ejecutada en todos los niveles (debug, http, info, warning, error, fatal)',
        levelsTested: ['debug', 'http', 'info', 'warning', 'error', 'fatal'],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = loggerController;
