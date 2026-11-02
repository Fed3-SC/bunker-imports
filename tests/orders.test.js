'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src-backend/app');
const Product = require('../src-backend/models/product.model');
const { createAndAuthUser } = require('./setup');
const { ROLES, PAYMENT_METHODS, SHIPPING_METHODS, ORDER_STATUS } = require('../src-backend/constants');

describe('Módulo de Pedidos — Tests Funcionales', () => {
  let sampleProduct;
  let adminToken;

  beforeEach(async () => {
    const admin = await createAndAuthUser(ROLES.ADMIN);
    adminToken = admin.token;

    sampleProduct = await Product.create({
      name: 'Yara Lattafa Eau de Parfum',
      sku: 'LAT-YAR-100',
      slug: 'yara-lattafa',
      brand: 'Lattafa',
      price: 78000,
      costPrice: 42000,
      stock: 10,
      category: ['arabes', 'femenino']
    });
  });

  it('Debe crear un pedido exitosamente con cálculo de totales en servidor (POST /api/orders)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [
          { productId: sampleProduct._id.toString(), qty: 2 }
        ],
        paymentMethod: PAYMENT_METHODS.TRANSFER, // Debe aplicar 10% de descuento
        shippingMethod: SHIPPING_METHODS.EXPRESS, // Costo $4500
        deliveryAddress: {
          name: 'Comprador Demo',
          street: 'Av. Santa Fe 1234',
          city: 'CABA',
          province: 'Buenos Aires'
        }
      });

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal('success');
    expect(res.body.data).to.have.property('orderCode');

    const order = res.body.data;
    expect(order.subtotal).to.equal(78000 * 2); // 156000
    expect(order.discount).to.equal(Math.round(156000 * 0.10)); // 15600
    expect(order.shippingCost).to.equal(4500);
    expect(order.total).to.equal(156000 - 15600 + 4500);

    // Verificar que se descontó el stock del producto
    const updatedProd = await Product.findById(sampleProduct._id);
    expect(updatedProd.stock).to.equal(8);
  });

  it('Debe rechazar compra si el stock es insuficiente (409 INSUFFICIENT_STOCK)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [
          { productId: sampleProduct._id.toString(), qty: 99 } // Stock actual es 10
        ],
        paymentMethod: PAYMENT_METHODS.CARD,
        shippingMethod: SHIPPING_METHODS.STANDARD
      });

    expect(res.status).to.equal(409);
    expect(res.body.code).to.equal('INSUFFICIENT_STOCK');
  });

  it('Debe rechazar pedidos con array de ítems vacío (400 EMPTY_ORDER)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [],
        paymentMethod: PAYMENT_METHODS.CARD,
        shippingMethod: SHIPPING_METHODS.STANDARD
      });

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('EMPTY_ORDER');
  });

  it('Debe rechazar cantidades menores o iguales a cero (400 INVALID_QUANTITY)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [{ productId: sampleProduct._id.toString(), qty: 0 }],
        paymentMethod: PAYMENT_METHODS.CARD,
        shippingMethod: SHIPPING_METHODS.STANDARD
      });

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('INVALID_QUANTITY');
  });

  it('Debe consultar pedido por código único (GET /api/orders/code/:code)', async () => {
    const created = await request(app)
      .post('/api/orders')
      .send({
        items: [{ productId: sampleProduct._id.toString(), qty: 1 }],
        paymentMethod: PAYMENT_METHODS.CASH,
        shippingMethod: SHIPPING_METHODS.PICKUP
      });

    const code = created.body.data.orderCode;
    const res = await request(app).get(`/api/orders/code/${code}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.orderCode).to.equal(code);
  });

  it('Debe reponer stock automáticamente si se cancela un pedido (PATCH /api/orders/:id/status)', async () => {
    const created = await request(app)
      .post('/api/orders')
      .send({
        items: [{ productId: sampleProduct._id.toString(), qty: 4 }],
        paymentMethod: PAYMENT_METHODS.CARD,
        shippingMethod: SHIPPING_METHODS.STANDARD
      });

    const orderId = created.body.data._id;

    // Stock pasó de 10 a 6
    let prod = await Product.findById(sampleProduct._id);
    expect(prod.stock).to.equal(6);

    // Cancelar pedido
    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: ORDER_STATUS.CANCELLED });

    expect(res.status).to.equal(200);
    expect(res.body.data.status).to.equal(ORDER_STATUS.CANCELLED);

    // El stock debe haber vuelto a 10
    prod = await Product.findById(sampleProduct._id);
    expect(prod.stock).to.equal(10);
  });
});
