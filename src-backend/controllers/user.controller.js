'use strict';

const userService = require('../services/user.service');

const userController = {
  async register(req, res, next) {
    try {
      const result = await userService.register(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.status(200).json({
        status: 'success',
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  async getCurrentUser(req, res, next) {
    try {
      res.status(200).json({
        status: 'success',
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      res.status(200).json({
        status: 'success',
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Usuario actualizado correctamente',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const user = await userService.remove(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Usuario eliminado correctamente',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  async getCouriers(req, res, next) {
    try {
      const couriers = await userService.getCouriers();
      res.status(200).json({
        status: 'success',
        count: couriers.length,
        data: couriers
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
