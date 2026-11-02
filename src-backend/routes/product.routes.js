'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants');

// Rutas públicas (catálogo general)
router.get('/', productController.getAll);
router.get('/slug/:slug', productController.getBySlug);

// Rutas administrativas (deben ir antes de /:id para no colisionar)
router.get('/admin', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), productController.getAllAdmin);

// Detalle público por ID
router.get('/:id', productController.getById);

// Operaciones de gestión protegidas
router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), productController.create);
router.put('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), productController.update);
router.patch('/:id/stock', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), productController.updateStock);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), productController.remove);

module.exports = router;
