'use strict';

const mongoose = require('mongoose');
const {
  ORDER_STATUS,
  PAYMENT_METHODS,
  SHIPPING_METHODS,
  PAYMENT_STATUS
} = require('../constants');

// Un ítem del pedido guarda snapshot del producto al momento de comprar
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  // Snapshot: guardamos nombre y precio para historial aunque el catálogo cambie
  name: { type: String, required: true },
  brandName: { type: String },
  sku: { type: String },
  size: { type: String },
  price: { type: Number, required: true }, // precio al momento de comprar
  qty: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1']
  },
  imageFile: { type: String }
}, { _id: false });

const deliveryAddressSchema = new mongoose.Schema({
  name: String,
  street: String,
  city: String,
  province: String,
  postalCode: String,
  phone: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderCode: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // No requerido: permite pedidos de invitados (guest checkout)
  },
  // Datos del cliente al momento del pedido (para historial)
  customerSnapshot: {
    name: String,
    email: String,
    phone: String,
    dni: String
  },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: (arr) => arr && arr.length > 0,
      message: 'El pedido debe tener al menos un producto'
    }
  },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: Object.values(PAYMENT_METHODS),
    required: true
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  shippingMethod: {
    type: String,
    enum: Object.values(SHIPPING_METHODS),
    required: true
  },
  deliveryAddress: { type: deliveryAddressSchema, default: () => ({}) },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
  },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

// Generar código de pedido antes de guardar
orderSchema.pre('save', function () {
  if (!this.orderCode) {
    const rand = Math.floor(10000 + Math.random() * 90000);
    this.orderCode = `BK-${rand}`;
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
