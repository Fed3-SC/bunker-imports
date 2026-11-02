'use strict';

const deliveryRepository = require('../repositories/delivery.repository');
const orderRepository = require('../repositories/order.repository');
const userRepository = require('../repositories/user.repository');
const CustomError = require('../errors/CustomError');
const { DELIVERY_STATUS, PRIORITY, ROLES } = require('../constants');
const logger = require('../logger/logger');

const deliveryService = {
  async getAll() {
    return deliveryRepository.findAll();
  },

  async getById(id) {
    const delivery = await deliveryRepository.findById(id);
    if (!delivery) throw new CustomError('DELIVERY_NOT_FOUND');
    return delivery;
  },

  async getByOrderId(orderId) {
    const delivery = await deliveryRepository.findByOrderId(orderId);
    if (!delivery) throw new CustomError('DELIVERY_NOT_FOUND');
    return delivery;
  },

  async create(data) {
    const { order: orderId, courier: courierId, shippingMethod, address, priority, notes } = data;

    // Validar pedido existente
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new CustomError('ORDER_NOT_FOUND', `El pedido asociado ${orderId} no existe.`);
    }

    // Si viene un repartidor, validar que tenga rol COURIER
    if (courierId) {
      const courier = await userRepository.findById(courierId);
      if (!courier || courier.role !== ROLES.COURIER) {
        throw new CustomError('INVALID_COURIER');
      }
    }

    const delivery = await deliveryRepository.create({
      order: orderId,
      courier: courierId || null,
      shippingMethod,
      address: address || order.deliveryAddress,
      priority: priority || PRIORITY.NORMAL,
      notes: notes || '',
      status: courierId ? DELIVERY_STATUS.ASSIGNED : DELIVERY_STATUS.PENDING,
      assignedAt: courierId ? new Date() : null
    });

    logger.info(`Entrega creada para pedido ${order.orderCode} (ID: ${delivery._id})`);
    return delivery;
  },

  async assignCourier(deliveryId, courierId) {
    const delivery = await deliveryRepository.findById(deliveryId);
    if (!delivery) throw new CustomError('DELIVERY_NOT_FOUND');

    const courier = await userRepository.findById(courierId);
    if (!courier || courier.role !== ROLES.COURIER) {
      throw new CustomError('INVALID_COURIER');
    }

    const updated = await deliveryRepository.updateById(deliveryId, {
      courier: courierId,
      status: DELIVERY_STATUS.ASSIGNED,
      assignedAt: new Date()
    });

    logger.info(`Repartidor ${courier.name} ${courier.lastName} asignado a entrega ${deliveryId}`);
    return updated;
  },

  async updateStatus(deliveryId, newStatus) {
    if (!Object.values(DELIVERY_STATUS).includes(newStatus)) {
      throw new CustomError('INVALID_DELIVERY_STATUS', `El estado "${newStatus}" no es válido.`);
    }

    const delivery = await deliveryRepository.findById(deliveryId);
    if (!delivery) throw new CustomError('DELIVERY_NOT_FOUND');

    const updates = { status: newStatus };
    if (newStatus === DELIVERY_STATUS.IN_TRANSIT && !delivery.dispatchedAt) {
      updates.dispatchedAt = new Date();
    } else if (newStatus === DELIVERY_STATUS.DELIVERED && !delivery.deliveredAt) {
      updates.deliveredAt = new Date();
    }

    const updated = await deliveryRepository.updateById(deliveryId, updates);
    logger.info(`Estado de entrega ${deliveryId} actualizado a: ${newStatus}`);
    return updated;
  }
};

module.exports = deliveryService;
