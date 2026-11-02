'use strict';

const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const deliveryRepository = require('../repositories/delivery.repository');
const CustomError = require('../errors/CustomError');
const { ORDER_STATUS, PAYMENT_METHODS, PAYMENT_STATUS, SHIPPING_METHODS, DELIVERY_STATUS, PRIORITY } = require('../constants');
const logger = require('../logger/logger');

const orderService = {
  async getAll(filters = {}) {
    return orderRepository.findAll(filters);
  },

  async getById(id) {
    const order = await orderRepository.findById(id);
    if (!order) throw new CustomError('ORDER_NOT_FOUND');
    return order;
  },

  async getByCode(code) {
    const order = await orderRepository.findByCode(code);
    if (!order) throw new CustomError('ORDER_NOT_FOUND');
    return order;
  },

  async getByUser(userId) {
    return orderRepository.findByUserId(userId);
  },

  async create(orderData) {
    const { items, paymentMethod, shippingMethod, deliveryAddress, customerSnapshot, user, notes } = orderData;

    // Validar ítems
    if (!Array.isArray(items) || items.length === 0) {
      throw new CustomError('EMPTY_ORDER');
    }

    // Validar productos y calcular importes en el servidor (nunca confiar en el cliente)
    let subtotal = 0;
    const processedItems = [];
    const stockDeductions = [];

    for (const item of items) {
      const qty = Number(item.qty);
      if (!qty || qty <= 0) {
        throw new CustomError('INVALID_QUANTITY', `Cantidad inválida para el producto.`);
      }

      const product = await productRepository.findById(item.productId || item.product);
      if (!product) {
        throw new CustomError('PRODUCT_NOT_FOUND', `Producto con ID ${item.productId || item.product} no encontrado.`);
      }

      if (product.stock < qty) {
        throw new CustomError(
          'INSUFFICIENT_STOCK',
          `Stock insuficiente para "${product.name}". Solicitado: ${qty}, Disponible: ${product.stock}`
        );
      }

      const itemPrice = Number(product.price);
      subtotal += itemPrice * qty;

      processedItems.push({
        product: product._id,
        name: product.name,
        brandName: product.brand || '',
        sku: product.sku || '',
        size: item.size || (product.sizes && product.sizes[0]) || '100ml',
        price: itemPrice,
        qty,
        imageFile: product.imageFile || product.image || ''
      });

      stockDeductions.push({
        productId: product._id,
        newStock: product.stock - qty,
        productName: product.name
      });
    }

    // Validar métodos
    if (!Object.values(PAYMENT_METHODS).includes(paymentMethod)) {
      throw new CustomError('VALIDATION_ERROR', `Método de pago inválido: ${paymentMethod}`);
    }
    if (!Object.values(SHIPPING_METHODS).includes(shippingMethod)) {
      throw new CustomError('VALIDATION_ERROR', `Método de envío inválido: ${shippingMethod}`);
    }

    // 10% de descuento si abona por transferencia bancaria (regla comercial Bunker Imports)
    let discount = 0;
    if (paymentMethod === PAYMENT_METHODS.TRANSFER) {
      discount = Math.round(subtotal * 0.10);
    }

    // Costo de envío según método
    let shippingCost = 0;
    if (shippingMethod === SHIPPING_METHODS.EXPRESS) {
      shippingCost = 4500;
    } else if (shippingMethod === SHIPPING_METHODS.STANDARD) {
      shippingCost = subtotal >= 80000 ? 0 : 2500; // Envío gratis superando $80.000
    } else if (shippingMethod === SHIPPING_METHODS.PICKUP) {
      shippingCost = 0;
    }

    const total = Math.max(0, subtotal - discount + shippingCost);

    // Descontar stock
    for (const deduction of stockDeductions) {
      await productRepository.updateStock(deduction.productId, deduction.newStock);
    }

    // Crear pedido
    const newOrder = await orderRepository.create({
      user: user || null,
      customerSnapshot: customerSnapshot || {},
      items: processedItems,
      subtotal,
      discount,
      shippingCost,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === PAYMENT_METHODS.CASH ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PAID,
      shippingMethod,
      deliveryAddress: deliveryAddress || {},
      status: ORDER_STATUS.PENDING,
      notes: notes || ''
    });

    logger.info(`Pedido creado exitosamente: ${newOrder.orderCode} (Total: $${newOrder.total})`);

    // Crear registro de entrega automático si requiere envío
    if (shippingMethod !== SHIPPING_METHODS.PICKUP) {
      try {
        await deliveryRepository.create({
          order: newOrder._id,
          courier: null,
          shippingMethod,
          address: deliveryAddress || {},
          status: DELIVERY_STATUS.PENDING,
          priority: shippingMethod === SHIPPING_METHODS.EXPRESS ? PRIORITY.HIGH : PRIORITY.NORMAL,
          notes: notes || ''
        });
      } catch (err) {
        logger.warning(`No se pudo crear automáticamente la entrega para el pedido ${newOrder.orderCode}: ${err.message}`);
      }
    }

    return newOrder;
  },

  async updateStatus(id, newStatus) {
    if (!Object.values(ORDER_STATUS).includes(newStatus)) {
      throw new CustomError('INVALID_ORDER_STATUS', `El estado "${newStatus}" no es válido.`);
    }

    const order = await orderRepository.findById(id);
    if (!order) throw new CustomError('ORDER_NOT_FOUND');

    // Si se cancela el pedido, reponer stock
    if (newStatus === ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.CANCELLED) {
      for (const item of order.items) {
        const prod = await productRepository.findById(item.product);
        if (prod) {
          await productRepository.updateStock(prod._id, prod.stock + item.qty);
        }
      }
      logger.info(`Pedido cancelado ${order.orderCode}: stock restituido.`);
    }

    const updated = await orderRepository.updateById(id, { status: newStatus });
    logger.info(`Estado del pedido ${order.orderCode} actualizado a: ${newStatus}`);
    return updated;
  }
};

module.exports = orderService;
