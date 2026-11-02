'use strict';

const app = require('./src-backend/app');
const config = require('./src-backend/config/env.config');
const connectDB = require('./src-backend/config/database');
const logger = require('./src-backend/logger/logger');

async function startServer() {
  try {
    // 1. Conectar a base de datos MongoDB
    await connectDB();

    // 2. Iniciar servidor HTTP
    const server = app.listen(config.port, () => {
      logger.info('====================================================');
      logger.info(`  BUNKER IMPORTS — Backend Server Activo`);
      logger.info(`  Entorno:       ${config.nodeEnv}`);
      logger.info(`  Puerto:        http://localhost:${config.port}`);
      logger.info(`  Swagger Docs:  http://localhost:${config.port}/api/docs`);
      logger.info(`  Tienda Online: http://localhost:${config.port}/index.html`);
      logger.info(`  Admin Panel:   http://localhost:${config.port}/admin/index.html`);
      logger.info('====================================================');
    });

    // Manejo de señales de terminación
    const shutdown = async () => {
      logger.info('Cerrando servidor HTTP y conexiones...');
      server.close(() => {
        logger.info('Servidor detenido de manera limpia.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.fatal(`Fallo fatal al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
}

startServer();
