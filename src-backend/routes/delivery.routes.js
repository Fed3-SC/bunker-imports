'use strict';

const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants');

// Lista de entregas y consulta por ID
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR, ROLES.COURIER), deliveryController.getAll);
router.get('/:id', authenticate, deliveryController.getById);
router.get('/order/:orderId', authenticate, deliveryController.getByOrderId);

// Creación y actualización de entregas
router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), deliveryController.create);
router.patch('/:id/courier', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), deliveryController.assignCourier);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR, ROLES.COURIER), deliveryController.updateStatus);

module.exports = router;
