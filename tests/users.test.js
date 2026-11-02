'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src-backend/app');
const { createAndAuthUser } = require('./setup');
const { ROLES } = require('../src-backend/constants');

describe('Módulo de Usuarios y Autenticación — Tests Funcionales', () => {
  it('Debe registrar un nuevo cliente correctamente (POST /api/users/register)', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Carlos',
        lastName: 'Albarracín',
        email: 'carlos.albarracin@example.com',
        password: 'Password123!',
        phone: '+54 11 9999-8888'
      });

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal('success');
    expect(res.body.data).to.have.property('token');
    expect(res.body.data.user.email).to.equal('carlos.albarracin@example.com');
    expect(res.body.data.user.role).to.equal(ROLES.USER);
    expect(res.body.data.user).to.not.have.property('password');
  });

  it('No debe permitir registrar dos usuarios con el mismo email (409 Conflict)', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Prueba',
        lastName: 'Uno',
        email: 'repetido@example.com',
        password: 'Password123!'
      });

    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Prueba',
        lastName: 'Dos',
        email: 'repetido@example.com',
        password: 'Password123!'
      });

    expect(res.status).to.equal(409);
    expect(res.body.status).to.equal('error');
    expect(res.body.code).to.equal('EMAIL_ALREADY_EXISTS');
  });

  it('No debe permitir que un cliente se registre a sí mismo como ADMIN (403 Forbidden)', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Hacker',
        lastName: 'Fake',
        email: 'fakeadmin@example.com',
        password: 'Password123!',
        role: ROLES.ADMIN
      });

    expect(res.status).to.equal(403);
    expect(res.body.status).to.equal('error');
    expect(res.body.code).to.equal('CANNOT_SELF_ASSIGN_ADMIN');
  });

  it('Debe autenticar un usuario existente y devolver un token JWT (POST /api/users/login)', async () => {
    await createAndAuthUser(ROLES.USER, {
      email: 'login.test@example.com',
      password: 'MiPasswordSegura!'
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login.test@example.com',
        password: 'MiPasswordSegura!'
      });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.data).to.have.property('token');
    expect(res.body.data.user.email).to.equal('login.test@example.com');
  });

  it('Debe rechazar login con credenciales inválidas (401 Unauthorized)', async () => {
    await createAndAuthUser(ROLES.USER, {
      email: 'user.passwrong@example.com',
      password: 'CorrectPassword123!'
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'user.passwrong@example.com',
        password: 'IncorrectPassword!'
      });

    expect(res.status).to.equal(401);
    expect(res.body.status).to.equal('error');
    expect(res.body.code).to.equal('INVALID_CREDENTIALS');
  });

  it('Debe obtener el perfil del usuario autenticado (GET /api/users/me)', async () => {
    const { token, user } = await createAndAuthUser(ROLES.USER);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.email).to.equal(user.email);
  });

  it('Un administrador debe poder listar usuarios (GET /api/users)', async () => {
    const { token } = await createAndAuthUser(ROLES.ADMIN);

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an('array');
  });

  it('Un usuario común no debe poder listar todos los usuarios (403 Forbidden)', async () => {
    const { token } = await createAndAuthUser(ROLES.USER);

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(403);
    expect(res.body.code).to.equal('FORBIDDEN');
  });

  it('Debe responder 404 al consultar un usuario inexistente', async () => {
    const { token } = await createAndAuthUser(ROLES.ADMIN);

    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(404);
    expect(res.body.code).to.equal('USER_NOT_FOUND');
  });
});
