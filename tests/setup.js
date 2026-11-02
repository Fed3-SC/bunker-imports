'use strict';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const config = require('../src-backend/config/env.config');
const User = require('../src-backend/models/user.model');
const { ROLES } = require('../src-backend/constants');

let mongoServer;

before(async function () {
  this.timeout(20000);
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

after(async function () {
  this.timeout(10000);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async function () {
  // Limpiar todas las colecciones entre pruebas para garantizar independencia
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

/**
 * Helper para generar un token JWT de prueba
 */
function createTestToken(userPayload) {
  return jwt.sign(
    {
      id: userPayload._id || userPayload.id,
      email: userPayload.email,
      role: userPayload.role || ROLES.USER
    },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
}

/**
 * Helper para crear usuario en base de datos con rol específico y retornar usuario + token
 */
async function createAndAuthUser(role = ROLES.USER, overrides = {}) {
  const email = overrides.email || `test.${role.toLowerCase()}.${Date.now()}@bunkerimports.com`;
  const user = await User.create({
    name: 'Usuario',
    lastName: 'Test',
    email,
    password: 'Password123!',
    role,
    status: 'active',
    ...overrides
  });

  const token = createTestToken(user);
  return { user, token };
}

module.exports = {
  createTestToken,
  createAndAuthUser
};
