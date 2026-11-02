'use strict';

const productRepository = require('../repositories/product.repository');
const CustomError = require('../errors/CustomError');
const logger = require('../logger/logger');

const productService = {
  // Catálogo público (sin costPrice)
  async getAll(filters = {}) {
    return productRepository.findAll(filters);
  },

  // Lista admin (incluye costPrice)
  async getAllAdmin() {
    return productRepository.findAllAdmin();
  },

  async getById(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new CustomError('PRODUCT_NOT_FOUND');
    return product;
  },

  async getByIdAdmin(id) {
    const product = await productRepository.findByIdAdmin(id);
    if (!product) throw new CustomError('PRODUCT_NOT_FOUND');
    return product;
  },

  async getBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new CustomError('PRODUCT_NOT_FOUND');
    return product;
  },

  async create(data) {
    // Validar precio
    if (!data.price || Number(data.price) <= 0) {
      throw new CustomError('INVALID_PRICE');
    }

    // Validar stock
    if (data.stock !== undefined && Number(data.stock) < 0) {
      throw new CustomError('INVALID_STOCK');
    }

    // Generar slug si no viene
    if (!data.slug) {
      data.slug = slugify(data.name);
    }

    const product = await productRepository.create(data);
    logger.info(`Producto creado: ${product.name} (SKU: ${product.sku})`);
    return product;
  },

  async update(id, data) {
    if (data.price !== undefined && Number(data.price) <= 0) {
      throw new CustomError('INVALID_PRICE');
    }
    if (data.stock !== undefined && Number(data.stock) < 0) {
      throw new CustomError('INVALID_STOCK');
    }

    const product = await productRepository.updateById(id, data);
    if (!product) throw new CustomError('PRODUCT_NOT_FOUND');
    logger.info(`Producto actualizado: ${product.name}`);
    return product;
  },

  async remove(id) {
    const product = await productRepository.deleteById(id);
    if (!product) throw new CustomError('PRODUCT_NOT_FOUND');
    logger.warning(`Producto eliminado: ${product.name} (ID: ${id})`);
    return product;
  },

  async updateStock(id, newStock, reason = 'Ajuste manual') {
    if (newStock < 0) throw new CustomError('INVALID_STOCK');

    const product = await productRepository.updateStock(id, newStock);
    if (!product) throw new CustomError('PRODUCT_NOT_FOUND');
    logger.info(`Stock actualizado: ${product.name} → ${newStock} unidades (${reason})`);
    return product;
  }
};

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

module.exports = productService;
