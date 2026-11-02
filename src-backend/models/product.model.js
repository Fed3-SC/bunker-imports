'use strict';

const mongoose = require('mongoose');
const { PRODUCT_STATUS, GENDERS, FRAGRANCE_FAMILIES } = require('../constants');

const notesSchema = new mongoose.Schema({
  top: [String],
  heart: [String],
  base: [String]
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'El SKU es requerido'],
    unique: true,
    trim: true,
    uppercase: true
  },
  slug: {
    type: String,
    required: [true, 'El slug es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'La marca es requerida'],
    trim: true
  },
  brandName: {
    type: String,
    trim: true
  },
  category: [{ type: String }],
  gender: {
    type: String,
    enum: Object.values(GENDERS),
    default: GENDERS.UNISEX
  },
  type: { type: String, default: 'Eau de Parfum' }, // EDP, EDT, Parfum
  concentration: { type: String },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [1, 'El precio debe ser mayor a cero']
  },
  compareAtPrice: { type: Number, default: null }, // precio tachado
  costPrice: {
    type: Number,
    default: 0,
    select: false // NUNCA devolver en endpoints públicos
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
  minStock: { type: Number, default: 2 },
  status: {
    type: String,
    enum: Object.values(PRODUCT_STATUS),
    default: PRODUCT_STATUS.AVAILABLE
  },
  sizes: [{ type: String }],
  imageFile: { type: String, default: 'cat-arabes.jpg' },
  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  notes: { type: notesSchema, default: () => ({}) },
  fragranceFamily: {
    type: String,
    enum: [...FRAGRANCE_FAMILIES, ''],
    default: ''
  },
  longevity: { type: String, default: '' },
  sillage: { type: String, default: '' },
  occasion: [String],
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  tags: [String],
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  batchCodeVerifiable: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Auto-generar slug y gender por defecto si no vienen
productSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (!this.gender) {
    this.gender = GENDERS.UNISEX;
  }
});

// Actualizar estado automáticamente si el stock llega a 0 (sin callback next para Mongoose 8/9)
productSchema.pre('save', function () {
  if (this.stock <= 0 && this.status === PRODUCT_STATUS.AVAILABLE) {
    this.status = PRODUCT_STATUS.OUT_OF_STOCK;
  } else if (this.stock > 0 && this.status === PRODUCT_STATUS.OUT_OF_STOCK) {
    this.status = PRODUCT_STATUS.AVAILABLE;
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
