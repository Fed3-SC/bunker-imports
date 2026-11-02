'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/env.config');
const userRepository = require('../repositories/user.repository');
const CustomError = require('../errors/CustomError');
const { ROLES } = require('../constants');
const logger = require('../logger/logger');

const userService = {
  // Registrar nuevo usuario (cliente)
  async register(userData) {
    // No permitir que se registren como admin/editor
    const forbiddenRoles = [ROLES.ADMIN, ROLES.EDITOR];
    if (userData.role && forbiddenRoles.includes(userData.role)) {
      throw new CustomError('CANNOT_SELF_ASSIGN_ADMIN');
    }

    // Verificar email duplicado
    const existing = await userRepository.findByEmail(userData.email);
    if (existing) {
      throw new CustomError('EMAIL_ALREADY_EXISTS');
    }

    const user = await userRepository.create({
      ...userData,
      role: userData.role === ROLES.COURIER ? ROLES.COURIER : ROLES.USER
    });

    logger.info(`Nuevo usuario registrado: ${user.email} (${user.role})`);

    const token = generateToken(user);
    return { user, token };
  },

  // Login
  async login(email, password) {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user || user.status !== 'active') {
      throw new CustomError('INVALID_CREDENTIALS');
    }

    const passwordOk = await user.comparePassword(password);
    if (!passwordOk) {
      throw new CustomError('INVALID_CREDENTIALS');
    }

    logger.info(`Login exitoso: ${user.email}`);

    const token = generateToken(user);
    return { user, token };
  },

  // Obtener todos los usuarios
  async getAll() {
    return userRepository.findAll();
  },

  // Obtener usuario por ID
  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new CustomError('USER_NOT_FOUND');
    return user;
  },

  // Actualizar usuario
  async update(id, data) {
    // No permitir cambiar contraseña por aquí (usar endpoint dedicado)
    delete data.password;

    const user = await userRepository.updateById(id, data);
    if (!user) throw new CustomError('USER_NOT_FOUND');
    return user;
  },

  // Eliminar usuario
  async remove(id) {
    const user = await userRepository.deleteById(id);
    if (!user) throw new CustomError('USER_NOT_FOUND');
    return user;
  },

  // Obtener repartidores
  async getCouriers() {
    return userRepository.findByRole(ROLES.COURIER);
  }
};

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

module.exports = userService;
