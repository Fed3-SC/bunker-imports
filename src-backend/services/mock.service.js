'use strict';

const { fakerES: faker } = require('@faker-js/faker');
const config = require('../config/env.config');
const CustomError = require('../errors/CustomError');
const { ROLES, ORDER_STATUS, DELIVERY_STATUS, PRIORITY, PAYMENT_METHODS, PAYMENT_STATUS, SHIPPING_METHODS } = require('../constants');
const userRepository = require('../repositories/user.repository');
const productRepository = require('../repositories/product.repository');
const orderRepository = require('../repositories/order.repository');
const deliveryRepository = require('../repositories/delivery.repository');
const logger = require('../logger/logger');

function validateQuantity(qty) {
  const num = Number(qty);
  if (isNaN(num) || num <= 0 || num > 100) {
    throw new CustomError('INVALID_MOCK_QUANTITY');
  }
  return num;
}

const mockService = {
  generateUsers(qty = 5) {
    const count = validateQuantity(qty);
    const users = [];

    for (let i = 0; i < count; i++) {
      users.push({
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number({ style: 'national' }),
        role: ROLES.USER,
        status: 'active',
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          province: 'Buenos Aires',
          postalCode: faker.location.zipCode('####')
        }
      });
    }

    return users;
  },

  generateCouriers(qty = 5) {
    const count = validateQuantity(qty);
    const couriers = [];

    for (let i = 0; i < count; i++) {
      couriers.push({
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `courier.${faker.internet.email().toLowerCase()}`,
        phone: faker.phone.number({ style: 'national' }),
        role: ROLES.COURIER,
        status: 'active',
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          province: 'Buenos Aires',
          postalCode: faker.location.zipCode('####')
        }
      });
    }

    return couriers;
  },

  async generateOrders(qty = 5) {
    const count = validateQuantity(qty);
    const products = await productRepository.findAll();
    const fallbackPrice = 75000;

    const orders = [];
    const paymentMethodsList = Object.values(PAYMENT_METHODS);
    const shippingMethodsList = Object.values(SHIPPING_METHODS);
    const orderStatusesList = Object.values(ORDER_STATUS);

    for (let i = 0; i < count; i++) {
      const selectedProduct = products.length > 0
        ? products[Math.floor(Math.random() * products.length)]
        : null;

      const itemPrice = selectedProduct ? selectedProduct.price : fallbackPrice;
      const itemQty = faker.number.int({ min: 1, max: 3 });
      const subtotal = itemPrice * itemQty;
      const paymentMethod = faker.helpers.arrayElement(paymentMethodsList);
      const discount = paymentMethod === PAYMENT_METHODS.TRANSFER ? Math.round(subtotal * 0.1) : 0;
      const total = subtotal - discount;

      orders.push({
        orderCode: `BK-MOCK-${faker.number.int({ min: 10000, max: 99999 })}`,
        customerSnapshot: {
          name: `${faker.person.firstName()} ${faker.person.lastName()}`,
          email: faker.internet.email().toLowerCase(),
          phone: faker.phone.number({ style: 'national' })
        },
        items: [
          {
            product: selectedProduct ? selectedProduct._id : null,
            name: selectedProduct ? selectedProduct.name : 'Perfume Mock Test 100ml',
            price: itemPrice,
            qty: itemQty,
            sku: selectedProduct ? selectedProduct.sku : 'MOCK-SKU-001'
          }
        ],
        subtotal,
        discount,
        shippingCost: 0,
        total,
        paymentMethod,
        paymentStatus: PAYMENT_STATUS.PAID,
        shippingMethod: faker.helpers.arrayElement(shippingMethodsList),
        status: faker.helpers.arrayElement(orderStatusesList),
        deliveryAddress: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          province: 'Buenos Aires'
        }
      });
    }

    return orders;
  },

  generateDeliveries(qty = 5) {
    const count = validateQuantity(qty);
    const deliveries = [];
    const statusesList = Object.values(DELIVERY_STATUS);
    const prioritiesList = Object.values(PRIORITY);

    for (let i = 0; i < count; i++) {
      deliveries.push({
        trackingCode: `AND-${faker.number.int({ min: 10000000, max: 99999999 })}AR`,
        shippingMethod: SHIPPING_METHODS.STANDARD,
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          province: 'Buenos Aires'
        },
        status: faker.helpers.arrayElement(statusesList),
        priority: faker.helpers.arrayElement(prioritiesList),
        notes: 'Entrega generada por módulo mock'
      });
    }

    return deliveries;
  },

  async seed({ users = 5, couriers = 2, orders = 5, deliveries = 3 } = {}) {
    if (config.isProduction) {
      throw new CustomError('MOCKS_DISABLED_IN_PROD');
    }

    const numUsers = validateQuantity(users);
    const numCouriers = validateQuantity(couriers);
    const numOrders = validateQuantity(orders);
    const numDeliveries = validateQuantity(deliveries);

    // 1. Insertar usuarios
    const generatedUsers = this.generateUsers(numUsers);
    const insertedUsers = [];
    for (const u of generatedUsers) {
      const user = await userRepository.create({ ...u, password: 'password123' });
      insertedUsers.push(user);
    }

    // 2. Insertar repartidores
    const generatedCouriers = this.generateCouriers(numCouriers);
    const insertedCouriers = [];
    for (const c of generatedCouriers) {
      const courier = await userRepository.create({ ...c, password: 'password123' });
      insertedCouriers.push(courier);
    }

    // 3. Insertar pedidos
    let products = await productRepository.findAll();
    if (products.length === 0) {
      // Crear un producto base para que los pedidos tengan relación válida
      const fallbackProd = await productRepository.create({
        name: 'Khamrah Lattafa Eau de Parfum 100ml',
        brand: 'Lattafa',
        sku: 'LAT-KHM-100',
        slug: 'khamrah-lattafa',
        price: 85000,
        costPrice: 45000,
        stock: 50
      });
      products = [fallbackProd];
    }

    const insertedOrders = [];
    for (let i = 0; i < numOrders; i++) {
      const prod = products[i % products.length];
      const buyer = insertedUsers[i % insertedUsers.length];
      const order = await orderRepository.create({
        orderCode: `BK-TEST-${faker.number.int({ min: 10000, max: 99999 })}`,
        user: buyer._id,
        customerSnapshot: {
          name: `${buyer.name} ${buyer.lastName}`,
          email: buyer.email,
          phone: buyer.phone
        },
        items: [
          {
            product: prod._id,
            name: prod.name,
            price: prod.price,
            qty: 1,
            sku: prod.sku
          }
        ],
        subtotal: prod.price,
        discount: 0,
        shippingCost: 0,
        total: prod.price,
        paymentMethod: PAYMENT_METHODS.TRANSFER,
        paymentStatus: PAYMENT_STATUS.PAID,
        shippingMethod: SHIPPING_METHODS.STANDARD,
        status: ORDER_STATUS.PAID,
        deliveryAddress: buyer.address
      });
      insertedOrders.push(order);
    }

    // 4. Insertar entregas
    const insertedDeliveries = [];
    for (let i = 0; i < numDeliveries; i++) {
      const relatedOrder = insertedOrders[i % insertedOrders.length];
      const courier = insertedCouriers.length > 0 ? insertedCouriers[i % insertedCouriers.length] : null;

      const delivery = await deliveryRepository.create({
        order: relatedOrder._id,
        courier: courier ? courier._id : null,
        shippingMethod: SHIPPING_METHODS.STANDARD,
        address: relatedOrder.deliveryAddress,
        status: courier ? DELIVERY_STATUS.ASSIGNED : DELIVERY_STATUS.PENDING,
        priority: PRIORITY.NORMAL,
        trackingCode: `AND-${faker.number.int({ min: 10000000, max: 99999999 })}AR`
      });
      insertedDeliveries.push(delivery);
    }

    logger.info(`Seed mock ejecutado: ${insertedUsers.length} usuarios, ${insertedCouriers.length} couriers, ${insertedOrders.length} pedidos, ${insertedDeliveries.length} entregas.`);

    return {
      message: 'Datos de prueba insertados exitosamente',
      inserted: {
        users: insertedUsers.length,
        couriers: insertedCouriers.length,
        orders: insertedOrders.length,
        deliveries: insertedDeliveries.length
      }
    };
  }
};

module.exports = mockService;
