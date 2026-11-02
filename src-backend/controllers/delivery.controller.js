'use strict';

const deliveryService = require('../services/delivery.service');

const deliveryController = {
  async getAll(req, res, next) {
    try {
      const deliveries = await deliveryService.getAll();
      res.status(200).json({
        status: 'success',
        count: deliveries.length,
        data: deliveries
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const delivery = await deliveryService.getById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: delivery
      });
    } catch (error) {
      next(error);
    }
  },

  async getByOrderId(req, res, next) {
    try {
      const delivery = await deliveryService.getByOrderId(req.params.orderId);
      res.status(200).json({
        status: 'success',
        data: delivery
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const delivery = await deliveryService.create(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Entrega registrada exitosamente',
        data: delivery
      });
    } catch (error) {
      next(error);
    }
  },

  async assignCourier(req, res, next) {
    try {
      const { courierId } = req.body;
      const delivery = await deliveryService.assignCourier(req.params.id, courierId);
      res.status(200).json({
        status: 'success',
        message: 'Repartidor asignado exitosamente',
        data: delivery
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const delivery = await deliveryService.updateStatus(req.params.id, status);
      res.status(200).json({
        status: 'success',
        message: 'Estado de la entrega actualizado',
        data: delivery
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = deliveryController;
