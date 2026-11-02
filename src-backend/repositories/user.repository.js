'use strict';

const User = require('../models/user.model');

const userRepository = {
  // Obtener todos los usuarios (sin contraseña)
  async findAll() {
    return User.find().sort({ createdAt: -1 });
  },

  // Buscar por ID
  async findById(id) {
    return User.findById(id);
  },

  // Buscar por email (sin contraseña por defecto)
  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  },

  // Buscar por email incluyendo la contraseña (solo para login)
  async findByEmailWithPassword(email) {
    return User.findOne({ email: email.toLowerCase() }).select('+password');
  },

  // Crear usuario
  async create(userData) {
    const user = new User(userData);
    return user.save();
  },

  // Actualizar usuario
  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  },

  // Eliminar usuario
  async deleteById(id) {
    return User.findByIdAndDelete(id);
  },

  // Buscar usuarios por rol
  async findByRole(role) {
    return User.find({ role }).sort({ createdAt: -1 });
  },

  // Contar usuarios
  async count() {
    return User.countDocuments();
  }
};

module.exports = userRepository;
