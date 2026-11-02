'use strict';

const Product = require('../models/product.model');

const productRepository = {
  // Obtener todos (sin costPrice)
  async findAll(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.brand) query.brand = filters.brand;
    if (filters.gender) query.gender = filters.gender;
    if (filters.category) query.category = filters.category;
    if (filters.featured) query.featured = true;
    if (filters.bestseller) query.bestseller = true;
    if (filters.newArrival) query.newArrival = true;
    if (filters.hasDiscount) query.discount = { $gt: 0 };
    if (filters.search) {
      const q = new RegExp(filters.search, 'i');
      query.$or = [
        { name: q }, { brandName: q }, { tags: q },
        { shortDescription: q }, { fragranceFamily: q }
      ];
    }
    if (filters.priceMin || filters.priceMax) {
      query.price = {};
      if (filters.priceMin) query.price.$gte = Number(filters.priceMin);
      if (filters.priceMax) query.price.$lte = Number(filters.priceMax);
    }

    const sortMap = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'name-asc': { name: 1 },
      'name-desc': { name: -1 },
      'rating': { rating: -1 },
      'bestseller': { bestseller: -1 }
    };
    const sort = sortMap[filters.sortBy] || { featured: -1, createdAt: -1 };

    return Product.find(query).sort(sort);
  },

  // Obtener todos para admin (incluye costPrice y inactivos)
  async findAllAdmin() {
    return Product.find().sort({ createdAt: -1 }).select('+costPrice');
  },

  async findById(id) {
    return Product.findById(id);
  },

  async findByIdAdmin(id) {
    return Product.findById(id).select('+costPrice');
  },

  async findBySlug(slug) {
    return Product.findOne({ slug: slug.toLowerCase() });
  },

  async create(data) {
    const product = new Product(data);
    return product.save();
  },

  async updateById(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async deleteById(id) {
    return Product.findByIdAndDelete(id);
  },

  // Actualizar stock directamente (operación atómica)
  async updateStock(id, newStock) {
    const status = newStock <= 0 ? 'soldout' : 'active';
    return Product.findByIdAndUpdate(
      id,
      { stock: newStock, status },
      { new: true }
    );
  },

  // Decrementar stock de varios productos (usado al crear pedido)
  async decrementStocks(items) {
    const promises = items.map(item =>
      Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.qty } },
        { new: true }
      ).then(product => {
        if (product && product.stock <= 0) {
          product.status = 'soldout';
          return product.save();
        }
        return product;
      })
    );
    return Promise.all(promises);
  },

  // Incrementar stock (para devoluciones por cancelación)
  async incrementStocks(items) {
    const promises = items.map(item =>
      Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.qty } },
        { new: true }
      ).then(product => {
        if (product && product.stock > 0 && product.status === 'soldout') {
          product.status = 'active';
          return product.save();
        }
        return product;
      })
    );
    return Promise.all(promises);
  },

  async count() {
    return Product.countDocuments();
  }
};

module.exports = productRepository;
