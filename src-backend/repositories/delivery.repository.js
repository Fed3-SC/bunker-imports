'use strict';

const Delivery = require('../models/delivery.model');

const deliveryRepository = {
  async findAll() {
    return Delivery.find()
      .populate('order', 'orderCode status total')
      .populate('courier', 'name lastName email phone')
      .sort({ createdAt: -1 });
  },

  async findById(id) {
    return Delivery.findById(id)
      .populate('order', 'orderCode status total customerSnapshot deliveryAddress')
      .populate('courier', 'name lastName email phone');
  },

  async findByOrderId(orderId) {
    return Delivery.findOne({ order: orderId })
      .populate('order', 'orderCode status')
      .populate('courier', 'name lastName email phone');
  },

  async create(data) {
    const delivery = new Delivery(data);
    return delivery.save();
  },

  async updateById(id, data) {
    return Delivery.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  },

  async count() {
    return Delivery.countDocuments();
  }
};

module.exports = deliveryRepository;
