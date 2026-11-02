'use strict';

const productService = require('../services/product.service');

const productController = {
  async getAll(req, res, next) {
    try {
      const filters = {
        search: req.query.search,
        brand: req.query.brand,
        category: req.query.category,
        gender: req.query.gender,
        featured: req.query.featured === 'true' ? true : undefined,
        inStock: req.query.inStock === 'true' ? true : undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        sort: req.query.sort
      };

      const products = await productService.getAll(filters);
      res.status(200).json({
        status: 'success',
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllAdmin(req, res, next) {
    try {
      const products = await productService.getAllAdmin();
      res.status(200).json({
        status: 'success',
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req, res, next) {
    try {
      const product = await productService.getBySlug(req.params.slug);
      res.status(200).json({
        status: 'success',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Producto creado exitosamente',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Producto actualizado exitosamente',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const product = await productService.remove(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Producto eliminado exitosamente',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStock(req, res, next) {
    try {
      const { stock, reason } = req.body;
      const product = await productService.updateStock(req.params.id, stock, reason);
      res.status(200).json({
        status: 'success',
        message: 'Stock actualizado exitosamente',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
