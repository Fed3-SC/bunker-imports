'use strict';

const orderService = require('../services/order.service');

const orderController = {
  async getAll(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        user: req.query.user
      };
      const orders = await orderService.getAll(filters);
      res.status(200).json({
        status: 'success',
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const order = await orderService.getById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: order
      });
    } catch (error) {
      next(error);
    }
  },

  async getByCode(req, res, next) {
    try {
      const order = await orderService.getByCode(req.params.code);
      res.status(200).json({
        status: 'success',
        data: order
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyOrders(req, res, next) {
    try {
      const orders = await orderService.getByUser(req.user._id);
      res.status(200).json({
        status: 'success',
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const orderData = {
        ...req.body,
        user: req.user ? req.user._id : req.body.user || null
      };

      const order = await orderService.create(orderData);
      res.status(201).json({
        status: 'success',
        message: 'Pedido creado exitosamente',
        data: order
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const order = await orderService.updateStatus(req.params.id, status);
      res.status(200).json({
        status: 'success',
        message: 'Estado del pedido actualizado exitosamente',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
