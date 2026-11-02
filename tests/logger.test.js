'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src-backend/app');

describe('Módulo de Logging y Monitoreo con Winston — Tests Funcionales', () => {
  it('Debe responder exitosamente en el endpoint diagnóstico (GET /api/logger/test)', async () => {
    const res = await request(app).get('/api/logger/test');

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.levelsTested).to.be.an('array');

    // Verificar los 6 niveles exigidos por la pre-entrega 4
    const requiredLevels = ['debug', 'http', 'info', 'warning', 'error', 'fatal'];
    for (const level of requiredLevels) {
      expect(res.body.levelsTested).to.include(level);
    }
  });

  it('Debe registrar peticiones a rutas inexistentes con status 404', async () => {
    const res = await request(app).get('/api/ruta-totalmente-inexistente-12345');

    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
    expect(res.body.code).to.equal('NOT_FOUND');
  });
});
