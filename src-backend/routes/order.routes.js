'use strict';

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize, optionalAuth } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants');

// Crear pedido: permite compra anónima (guest) o con usuario autenticado
router.post('/', optionalAuth, orderController.create);

// Consulta de código de pedido (para seguimiento de compra de cliente)
router.get('/code/:code', orderController.getByCode);

// Mis pedidos (usuario logueado)
router.get('/my-orders', authenticate, orderController.getMyOrders);

// Panel de administración de pedidos
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), orderController.getAll);
router.get('/:id', authenticate, orderController.getById);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), orderController.updateStatus);

module.exports = router;
