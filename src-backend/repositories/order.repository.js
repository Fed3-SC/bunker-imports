'use strict';

const Order = require('../models/order.model');

const orderRepository = {
  async findAll(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.user) query.user = filters.user;

    return Order.find(query)
      .populate('user', 'name lastName email')
      .populate('items.product', 'name slug imageFile')
      .sort({ createdAt: -1 });
  },

  async findById(id) {
    return Order.findById(id)
      .populate('user', 'name lastName email phone')
      .populate('items.product', 'name slug imageFile brand');
  },

  async findByCode(orderCode) {
    return Order.findOne({ orderCode })
      .populate('user', 'name lastName email');
  },

  async create(data) {
    const order = new Order(data);
    return order.save();
  },

  async updateById(id, data) {
    return Order.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  },

  async count() {
    return Order.countDocuments();
  },

  async findByUserId(userId) {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
  }
};

module.exports = orderRepository;
