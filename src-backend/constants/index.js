'use strict';

// ─── ROLES DE USUARIO ────────────────────────────────────────
const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  EDITOR: 'EDITOR',
  COURIER: 'COURIER'
});

// ─── ESTADOS DE PRODUCTOS ────────────────────────────────────
const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'active',
  OUT_OF_STOCK: 'soldout',
  INACTIVE: 'inactive'
});

// ─── ESTADOS DE PEDIDOS ──────────────────────────────────────
const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  PAID: 'paid',
  PREPARING: 'preparing',
  READY: 'ready',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
});

const ORDER_STATUS_LABELS = Object.freeze({
  pending: 'Pendiente de pago',
  paid: 'Pago confirmado',
  preparing: 'Preparando pedido',
  ready: 'Listo para despachar',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
});

// ─── ESTADOS DE ENTREGAS ─────────────────────────────────────
const DELIVERY_STATUS = Object.freeze({
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
});

// ─── PRIORIDADES ─────────────────────────────────────────────
const PRIORITY = Object.freeze({
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
});

// ─── MÉTODOS DE PAGO ─────────────────────────────────────────
const PAYMENT_METHODS = Object.freeze({
  TRANSFER: 'transfer',
  CREDIT_CARD: 'credit_card',
  CARD: 'credit_card',
  CASH: 'cash',
  MERCADO_PAGO: 'mercado_pago'
});

const PAYMENT_METHOD_LABELS = Object.freeze({
  transfer: 'Transferencia Bancaria',
  credit_card: 'Tarjeta de Crédito',
  cash: 'Efectivo',
  mercado_pago: 'Mercado Pago'
});

// ─── MÉTODOS DE ENVÍO ────────────────────────────────────────
const SHIPPING_METHODS = Object.freeze({
  ANDREANI: 'andreani',
  STANDARD: 'andreani',
  EXPRESS: 'express',
  SHOWROOM: 'showroom',
  PICKUP: 'showroom'
});

const SHIPPING_METHOD_LABELS = Object.freeze({
  andreani: 'Envío Domicilio Andreani',
  express: 'Moto Express 24hs CABA/GBA',
  showroom: 'Retiro Showroom Recoleta'
});

// ─── ESTADOS DE PAGO ─────────────────────────────────────────
const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PAID: 'confirmed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
});

// ─── GÉNEROS DE PRODUCTOS ────────────────────────────────────
const GENDERS = Object.freeze({
  MASCULINO: 'masculino',
  FEMENINO: 'femenino',
  UNISEX: 'unisex'
});

// ─── FAMILIAS OLFATIVAS ──────────────────────────────────────
const FRAGRANCE_FAMILIES = Object.freeze([
  'Oriental Especiado',
  'Amaderado Oriental',
  'Gourmand Dulce',
  'Aromático Fougère',
  'Fresco Cítrico',
  'Floral Frutal',
  'Cuero y Ámbar',
  'Acuático Marino'
]);

module.exports = {
  ROLES,
  PRODUCT_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  DELIVERY_STATUS,
  PRIORITY,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  SHIPPING_METHODS,
  SHIPPING_METHOD_LABELS,
  PAYMENT_STATUS,
  GENDERS,
  FRAGRANCE_FAMILIES
};
