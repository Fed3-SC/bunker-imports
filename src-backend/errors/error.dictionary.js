'use strict';

// Diccionario centralizado de errores de la aplicación
// Cada error tiene: código interno, mensaje y status HTTP

const ERROR_DICTIONARY = {
  // ─── Autenticación y autorización ───
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Credenciales inválidas. Verificá tu email y contraseña.',
    status: 401
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'No estás autenticado. Iniciá sesión para continuar.',
    status: 401
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'No tenés permisos para realizar esta acción.',
    status: 403
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Tu sesión expiró. Iniciá sesión nuevamente.',
    status: 401
  },

  // ─── Usuarios ───
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'No se encontró el usuario solicitado.',
    status: 404
  },
  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'Ya existe una cuenta registrada con ese email.',
    status: 409
  },
  CANNOT_SELF_ASSIGN_ADMIN: {
    code: 'CANNOT_SELF_ASSIGN_ADMIN',
    message: 'No podés asignarte el rol de administrador al registrarte.',
    status: 403
  },

  // ─── Productos ───
  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    message: 'No se encontró el producto solicitado.',
    status: 404
  },
  INVALID_PRICE: {
    code: 'INVALID_PRICE',
    message: 'El precio debe ser mayor a cero.',
    status: 400
  },
  INVALID_STOCK: {
    code: 'INVALID_STOCK',
    message: 'El stock no puede ser negativo.',
    status: 400
  },

  // ─── Pedidos ───
  ORDER_NOT_FOUND: {
    code: 'ORDER_NOT_FOUND',
    message: 'No se encontró el pedido solicitado.',
    status: 404
  },
  INSUFFICIENT_STOCK: {
    code: 'INSUFFICIENT_STOCK',
    message: 'No hay stock suficiente para uno o más productos del pedido.',
    status: 409
  },
  EMPTY_ORDER: {
    code: 'EMPTY_ORDER',
    message: 'El pedido debe contener al menos un producto.',
    status: 400
  },
  INVALID_ORDER_STATUS: {
    code: 'INVALID_ORDER_STATUS',
    message: 'El estado del pedido no es válido.',
    status: 400
  },
  INVALID_QUANTITY: {
    code: 'INVALID_QUANTITY',
    message: 'La cantidad debe ser mayor a cero.',
    status: 400
  },

  // ─── Entregas ───
  DELIVERY_NOT_FOUND: {
    code: 'DELIVERY_NOT_FOUND',
    message: 'No se encontró la entrega solicitada.',
    status: 404
  },
  INVALID_COURIER: {
    code: 'INVALID_COURIER',
    message: 'El usuario asignado no tiene el rol de repartidor (COURIER).',
    status: 400
  },
  INVALID_DELIVERY_STATUS: {
    code: 'INVALID_DELIVERY_STATUS',
    message: 'El estado de la entrega no es válido.',
    status: 400
  },

  // ─── Mocks ───
  INVALID_MOCK_QUANTITY: {
    code: 'INVALID_MOCK_QUANTITY',
    message: 'La cantidad debe ser un número entre 1 y 100.',
    status: 400
  },
  MOCKS_DISABLED_IN_PROD: {
    code: 'MOCKS_DISABLED_IN_PROD',
    message: 'La carga de datos de prueba está deshabilitada en producción.',
    status: 403
  },

  // ─── Validación y generales ───
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Los datos enviados contienen errores.',
    status: 400
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'El recurso solicitado no existe.',
    status: 404
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Ocurrió un error interno del servidor.',
    status: 500
  }
};

module.exports = ERROR_DICTIONARY;
