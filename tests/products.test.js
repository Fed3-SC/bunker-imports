'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src-backend/app');
const Product = require('../src-backend/models/product.model');
const { createAndAuthUser } = require('./setup');
const { ROLES } = require('../src-backend/constants');

describe('Módulo de Productos y Catálogo — Tests Funcionales', () => {
  let adminToken;
  let sampleProduct;

  beforeEach(async () => {
    const admin = await createAndAuthUser(ROLES.ADMIN);
    adminToken = admin.token;

    sampleProduct = await Product.create({
      name: 'Club de Nuit Intense Man',
      sku: 'ARM-CDN-105',
      slug: 'club-de-nuit-intense-man',
      brand: 'Armaf',
      price: 95000,
      costPrice: 50000,
      stock: 20,
      category: ['arabes', 'masculino'],
      gender: 'masculino'
    });
  });

  it('Debe listar productos públicos sin exponer costPrice (GET /api/products)', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.data).to.be.an('array');
    expect(res.body.data.length).to.be.greaterThan(0);

    // Regla de negocio crítica: el precio de costo nunca debe exponerse públicamente
    const prod = res.body.data.find(p => p.sku === 'ARM-CDN-105');
    expect(prod).to.exist;
    expect(prod).to.not.have.property('costPrice');
  });

  it('Debe exponer costPrice en el endpoint administrativo para ADMIN (GET /api/products/admin)', async () => {
    const res = await request(app)
      .get('/api/products/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    const prod = res.body.data.find(p => p.sku === 'ARM-CDN-105');
    expect(prod).to.exist;
    expect(prod).to.have.property('costPrice', 50000);
  });

  it('Debe consultar producto por ID (GET /api/products/:id)', async () => {
    const res = await request(app).get(`/api/products/${sampleProduct._id}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal('Club de Nuit Intense Man');
  });

  it('Debe consultar producto por Slug (GET /api/products/slug/:slug)', async () => {
    const res = await request(app).get(`/api/products/slug/${sampleProduct.slug}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.sku).to.equal('ARM-CDN-105');
  });

  it('Debe permitir a un administrador crear un producto (POST /api/products)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Asad Lattafa Eau de Parfum 100ml',
        sku: 'LAT-ASD-100',
        brand: 'Lattafa',
        price: 88000,
        costPrice: 46000,
        stock: 12,
        category: ['arabes', 'masculino'],
        gender: 'masculino'
      });

    expect(res.status).to.equal(201);
    expect(res.body.data.sku).to.equal('LAT-ASD-100');
    expect(res.body.data.slug).to.exist;
  });

  it('Debe rechazar la creación de producto con precio inválido (400 INVALID_PRICE)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Perfume Precio Negativo',
        sku: 'BAD-PRICE-001',
        brand: 'Test',
        price: -500,
        stock: 5
      });

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('INVALID_PRICE');
  });

  it('Debe rechazar stock negativo al actualizar inventario (400 INVALID_STOCK)', async () => {
    const res = await request(app)
      .patch(`/api/products/${sampleProduct._id}/stock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ stock: -10 });

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('INVALID_STOCK');
  });

  it('Debe responder 404 al consultar un producto inexistente', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/api/products/${fakeId}`);

    expect(res.status).to.equal(404);
    expect(res.body.code).to.equal('PRODUCT_NOT_FOUND');
  });
});
