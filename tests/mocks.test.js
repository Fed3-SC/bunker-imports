'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src-backend/app');
const User = require('../src-backend/models/user.model');
const Order = require('../src-backend/models/order.model');
const { ROLES } = require('../src-backend/constants');

describe('Módulo de Mocks y Datos Sintéticos — Tests Funcionales', () => {
  it('Debe generar usuarios ficticios en memoria sin guardarlos en BD (GET /api/mocks/users)', async () => {
    const res = await request(app).get('/api/mocks/users?qty=3');

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.count).to.equal(3);
    expect(res.body.data).to.be.an('array').with.lengthOf(3);
    expect(res.body.data[0]).to.have.property('email');
    expect(res.body.data[0].role).to.equal(ROLES.USER);

    // Verificar que no se guardaron en la base de datos
    const dbUsers = await User.countDocuments();
    expect(dbUsers).to.equal(0);
  });

  it('Debe generar repartidores con rol COURIER (GET /api/mocks/couriers)', async () => {
    const res = await request(app).get('/api/mocks/couriers?qty=2');

    expect(res.status).to.equal(200);
    expect(res.body.count).to.equal(2);
    expect(res.body.data[0].role).to.equal(ROLES.COURIER);
  });

  it('Debe generar pedidos simulados (GET /api/mocks/orders)', async () => {
    const res = await request(app).get('/api/mocks/orders?qty=2');

    expect(res.status).to.equal(200);
    expect(res.body.count).to.equal(2);
    expect(res.body.data[0]).to.have.property('orderCode');
  });

  it('Debe generar entregas simuladas (GET /api/mocks/deliveries)', async () => {
    const res = await request(app).get('/api/mocks/deliveries?qty=2');

    expect(res.status).to.equal(200);
    expect(res.body.count).to.equal(2);
    expect(res.body.data[0]).to.have.property('trackingCode');
  });

  it('Debe rechazar cantidad negativa (400 INVALID_MOCK_QUANTITY)', async () => {
    const res = await request(app).get('/api/mocks/users?qty=-5');

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('INVALID_MOCK_QUANTITY');
  });

  it('Debe rechazar cantidad igual a cero (400 INVALID_MOCK_QUANTITY)', async () => {
    const res = await request(app).get('/api/mocks/users?qty=0');

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('INVALID_MOCK_QUANTITY');
  });

  it('Debe rechazar cantidad excesiva mayor a 100 (400 INVALID_MOCK_QUANTITY)', async () => {
    const res = await request(app).get('/api/mocks/users?qty=150');

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('INVALID_MOCK_QUANTITY');
  });

  it('Debe rechazar valor no numérico en cantidad (400 INVALID_MOCK_QUANTITY)', async () => {
    const res = await request(app).get('/api/mocks/users?qty=muchos');

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('INVALID_MOCK_QUANTITY');
  });

  it('Debe insertar datos de prueba en la base de datos (POST /api/mocks/seed)', async () => {
    const res = await request(app)
      .post('/api/mocks/seed')
      .send({
        users: 3,
        couriers: 1,
        orders: 2,
        deliveries: 2
      });

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal('success');
    expect(res.body.inserted.users).to.equal(3);
    expect(res.body.inserted.couriers).to.equal(1);
    expect(res.body.inserted.orders).to.equal(2);
    expect(res.body.inserted.deliveries).to.equal(2);

    // Verificar persistencia real en MongoDB
    const usersInDb = await User.countDocuments({ role: ROLES.USER });
    expect(usersInDb).to.equal(3);

    const couriersInDb = await User.countDocuments({ role: ROLES.COURIER });
    expect(couriersInDb).to.equal(1);

    const ordersInDb = await Order.countDocuments();
    expect(ordersInDb).to.equal(2);
  });
});
