'use strict';

const mockService = require('../services/mock.service');

const mockController = {
  getUsers(req, res, next) {
    try {
      const qty = req.query.qty || 5;
      const data = mockService.generateUsers(qty);
      res.status(200).json({
        status: 'success',
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  },

  getCouriers(req, res, next) {
    try {
      const qty = req.query.qty || 5;
      const data = mockService.generateCouriers(qty);
      res.status(200).json({
        status: 'success',
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  },

  async getOrders(req, res, next) {
    try {
      const qty = req.query.qty || 5;
      const data = await mockService.generateOrders(qty);
      res.status(200).json({
        status: 'success',
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  },

  getDeliveries(req, res, next) {
    try {
      const qty = req.query.qty || 5;
      const data = mockService.generateDeliveries(qty);
      res.status(200).json({
        status: 'success',
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  },

  async seed(req, res, next) {
    try {
      const params = {
        users: req.body.users || req.query.users || req.query.qty || 5,
        couriers: req.body.couriers || req.query.couriers || 2,
        orders: req.body.orders || req.query.orders || 5,
        deliveries: req.body.deliveries || req.query.deliveries || 3
      };

      const result = await mockService.seed(params);
      res.status(201).json({
        status: 'success',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = mockController;
