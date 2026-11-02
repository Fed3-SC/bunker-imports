'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src-backend/app');

describe('Módulo de Documentación Swagger / OpenAPI — Tests Funcionales', () => {
  it('Debe responder exitosamente en la ruta de documentación (GET /api/docs/)', async () => {
    const res = await request(app).get('/api/docs/');

    // Swagger UI responde con 200 (HTML) o 301/302 si redirige a la barra final
    expect([200, 301, 302]).to.include(res.status);
  });

  it('Debe responder 200 en el health check de la API (GET /api/health)', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.message).to.include('Bunker Imports API operativa');
  });
});
