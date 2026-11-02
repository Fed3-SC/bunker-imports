'use strict';

const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const deliveryRoutes = require('./delivery.routes');
const mockRoutes = require('./mock.routes');
const loggerRoutes = require('./logger.routes');

// Montaje de rutas con prefijo de dominio
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/mocks', mockRoutes);
router.use('/logger', loggerRoutes);

// Endpoint de salud
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Bunker Imports API operativa',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
