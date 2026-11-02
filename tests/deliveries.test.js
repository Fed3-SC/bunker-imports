'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src-backend/app');
const Product = require('../src-backend/models/product.model');
const Order = require('../src-backend/models/order.model');
const { createAndAuthUser } = require('./setup');
const { ROLES, SHIPPING_METHODS, DELIVERY_STATUS, PAYMENT_METHODS } = require('../src-backend/constants');

describe('Módulo de Entregas y Envíos — Tests Funcionales', () => {
  let adminToken;
  let courierUser;
  let standardUser;
  let testOrder;

  beforeEach(async () => {
    const admin = await createAndAuthUser(ROLES.ADMIN);
    adminToken = admin.token;

    const courier = await createAndAuthUser(ROLES.COURIER);
    courierUser = courier.user;

    const normal = await createAndAuthUser(ROLES.USER);
    standardUser = normal.user;

    const prod = await Product.create({
      name: 'Perfume Test Entrega',
      sku: 'DEL-PRF-001',
      brand: 'Lattafa',
      price: 50000,
      stock: 10
    });

    testOrder = await Order.create({
      orderCode: 'BK-DEL-12345',
      items: [{ product: prod._id, name: prod.name, price: 50000, qty: 1 }],
      subtotal: 50000,
      total: 50000,
      paymentMethod: PAYMENT_METHODS.CARD,
      shippingMethod: SHIPPING_METHODS.STANDARD,
      deliveryAddress: { street: 'Callao 500', city: 'CABA', province: 'Buenos Aires' }
    });
  });

  it('Debe crear una entrega vinculada a un pedido (POST /api/deliveries)', async () => {
    const res = await request(app)
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        order: testOrder._id.toString(),
        shippingMethod: SHIPPING_METHODS.STANDARD,
        address: testOrder.deliveryAddress
      });

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal('success');
    expect(res.body.data.order).to.equal(testOrder._id.toString());
  });

  it('Debe asignar un repartidor con rol COURIER correctamente (PATCH /api/deliveries/:id/courier)', async () => {
    const created = await request(app)
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        order: testOrder._id.toString(),
        shippingMethod: SHIPPING_METHODS.STANDARD
      });

    const deliveryId = created.body.data._id;

    const res = await request(app)
      .patch(`/api/deliveries/${deliveryId}/courier`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ courierId: courierUser._id.toString() });

    expect(res.status).to.equal(200);
    expect(res.body.data.courier).to.equal(courierUser._id.toString());
    expect(res.body.data.status).to.equal(DELIVERY_STATUS.ASSIGNED);
  });

  it('Debe rechazar la asignación si el usuario no tiene rol COURIER (400 INVALID_COURIER)', async () => {
    const created = await request(app)
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        order: testOrder._id.toString(),
        shippingMethod: SHIPPING_METHODS.STANDARD
      });

    const deliveryId = created.body.data._id;

    const res = await request(app)
      .patch(`/api/deliveries/${deliveryId}/courier`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ courierId: standardUser._id.toString() });

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('INVALID_COURIER');
  });

  it('Debe rechazar creación de entrega si el pedido no existe (404 ORDER_NOT_FOUND)', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app)
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        order: fakeId,
        shippingMethod: SHIPPING_METHODS.STANDARD
      });

    expect(res.status).to.equal(404);
    expect(res.body.code).to.equal('ORDER_NOT_FOUND');
  });

  it('Debe actualizar el estado de la entrega a IN_TRANSIT (PATCH /api/deliveries/:id/status)', async () => {
    const created = await request(app)
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        order: testOrder._id.toString(),
        shippingMethod: SHIPPING_METHODS.STANDARD
      });

    const deliveryId = created.body.data._id;

    const res = await request(app)
      .patch(`/api/deliveries/${deliveryId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: DELIVERY_STATUS.IN_TRANSIT });

    expect(res.status).to.equal(200);
    expect(res.body.data.status).to.equal(DELIVERY_STATUS.IN_TRANSIT);
    expect(res.body.data.dispatchedAt).to.exist;
  });
});
