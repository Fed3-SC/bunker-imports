'use strict';

const dotenv = require('dotenv');

dotenv.config();

// Variables requeridas para que la aplicación funcione
const REQUIRED_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV', 'JWT_SECRET'];

function validateEnv() {
  // En entorno de testing podemos usar valores por defecto si no vienen especificados
  if (process.env.NODE_ENV === 'test') {
    process.env.PORT = process.env.PORT || '3001';
    process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bunker_imports_test';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'bunker_test_jwt_secret_key_123';
    return;
  }

  const missing = REQUIRED_VARS.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[CONFIG] Variables de entorno faltantes: ${missing.join(', ')}`);
    console.error('[CONFIG] Revisá tu archivo .env (copiá .env.example como punto de partida)');
    process.exit(1);
  }
}

validateEnv();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGODB_URI,
  mongoTestUri: process.env.MONGODB_TEST_URI || (process.env.MONGODB_URI ? process.env.MONGODB_URI.replace('/bunker_imports', '/bunker_imports_test') : 'mongodb://127.0.0.1:27017/bunker_imports_test'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  transferDiscountPercent: parseInt(process.env.TRANSFER_DISCOUNT_PERCENT, 10) || 10,
  freeShippingThreshold: parseInt(process.env.FREE_SHIPPING_THRESHOLD, 10) || 80000,
  admin: {
    name: process.env.ADMIN_INITIAL_NAME || 'Admin Bunker',
    email: process.env.ADMIN_INITIAL_EMAIL || 'admin@bunkerimports.com',
    password: process.env.ADMIN_INITIAL_PASSWORD || 'Admin123!'
  },
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test'
};

module.exports = config;
