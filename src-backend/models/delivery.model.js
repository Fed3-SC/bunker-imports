'use strict';

const mongoose = require('mongoose');
const { DELIVERY_STATUS, PRIORITY, SHIPPING_METHODS } = require('../constants');

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'El pedido es requerido']
  },
  courier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
    // Solo usuarios con rol COURIER - se valida en el Service
  },
  shippingMethod: {
    type: String,
    enum: Object.values(SHIPPING_METHODS),
    required: true
  },
  address: {
    street: String,
    city: String,
    province: String,
    postalCode: String
  },
  status: {
    type: String,
    enum: Object.values(DELIVERY_STATUS),
    default: DELIVERY_STATUS.PENDING
  },
  priority: {
    type: String,
    enum: Object.values(PRIORITY),
    default: PRIORITY.NORMAL
  },
  trackingCode: {
    type: String,
    default: null
  },
  assignedAt: { type: Date, default: null },
  dispatchedAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

// Generar código de seguimiento al asignar un repartidor
deliverySchema.pre('save', function () {
  if (this.courier && !this.trackingCode) {
    const rand = Math.floor(10000000 + Math.random() * 90000000);
    this.trackingCode = `AND-${rand}AR`;
  }
});

const Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;
