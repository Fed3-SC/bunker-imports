'use strict';

const mongoose = require('mongoose');
const config = require('./env.config');
const logger = require('../logger/logger');

let memoryServerInstance = null;

async function connectDB() {
  const uri = config.isTest ? config.mongoTestUri : config.mongoUri;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    logger.info(`MongoDB conectado: ${uri.replace(/\/\/.*@/, '//<credenciales>@')}`);
  } catch (error) {
    if (config.isDev || config.isTest) {
      logger.warning(`Servicio MongoDB local no disponible en ${uri} (${error.message}).`);
      logger.info('Iniciando instancia integrada de MongoDB en memoria para desarrollo...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
        const memUri = memoryServerInstance.getUri();
        await mongoose.connect(memUri);
        logger.info(`MongoDB en memoria iniciado y conectado exitosamente: ${memUri}`);

        // Inicializar datos base automáticamente en la instancia en memoria si está vacía
        try {
          const Product = require('../models/product.model');
          const count = await Product.countDocuments();
          if (count === 0) {
            const initialSeed = require('../scripts/seed-runner');
            if (typeof initialSeed === 'function') {
              await initialSeed();
            }
          }
        } catch {
          // Si el runner no existe o falla, continuar normalmente
        }

        return memoryServerInstance;
      } catch (memErr) {
        logger.fatal(`Fallo al iniciar MongoDB en memoria: ${memErr.message}`);
        process.exit(1);
      }
    } else {
      logger.fatal(`Error fatal conectando a MongoDB: ${error.message}`);
      process.exit(1);
    }
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warning('MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  logger.error(`Error de MongoDB: ${err.message}`);
});

module.exports = connectDB;
