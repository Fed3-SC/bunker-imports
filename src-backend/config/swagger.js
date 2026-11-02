'use strict';

const swaggerJSDoc = require('swagger-jsdoc');
const config = require('./env.config');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Bunker Imports API',
    version: '1.0.0',
    description: 'Documentación oficial de la API REST de BUNKER IMPORTS — Perfumería Árabe y de Diseñador. Desarrollada para gestionar catálogo, pedidos, clientes, entregas y herramientas diagnósticas.',
    contact: {
      name: 'Soporte BUNKER IMPORTS',
      email: 'soporte@bunkerimports.com'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: 'Servidor local de desarrollo'
    }
  ],
  tags: [
    { name: 'Users', description: 'Gestión y autenticación de usuarios (clientes, administradores, repartidores)' },
    { name: 'Products', description: 'Catálogo de perfumes, inventario, precios y detalles olfativos' },
    { name: 'Orders', description: 'Gestión de pedidos de compra, checkout y estados de pago' },
    { name: 'Deliveries', description: 'Logística de despachos, asignación de repartidores y seguimiento' },
    { name: 'Mocks', description: 'Módulo de generación de información sintética y seed para pruebas' },
    { name: 'Logger', description: 'Diagnóstico y verificación de niveles de logging con Winston' }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese su token JWT con el formato: Bearer <token>'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '661fa89b123456789abcdef0' },
          name: { type: 'string', example: 'Emir' },
          lastName: { type: 'string', example: 'Valenzuela' },
          email: { type: 'string', example: 'emir@bunkerimports.com' },
          phone: { type: 'string', example: '+54 11 5555-0199' },
          role: { type: 'string', enum: ['USER', 'ADMIN', 'EDITOR', 'COURIER'], example: 'USER' },
          status: { type: 'string', example: 'active' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string', example: 'Av. Libertador 1500' },
              city: { type: 'string', example: 'CABA' },
              province: { type: 'string', example: 'Buenos Aires' },
              postalCode: { type: 'string', example: '1425' }
            }
          }
        }
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '661fa89b123456789abcdef1' },
          name: { type: 'string', example: 'Khamrah Lattafa Eau de Parfum 100ml' },
          sku: { type: 'string', example: 'LAT-KHM-100' },
          slug: { type: 'string', example: 'khamrah-lattafa-edp' },
          brand: { type: 'string', example: 'Lattafa' },
          price: { type: 'number', example: 85000 },
          stock: { type: 'number', example: 15 },
          gender: { type: 'string', enum: ['unisex', 'masculino', 'femenino'], example: 'unisex' },
          status: { type: 'string', enum: ['AVAILABLE', 'OUT_OF_STOCK', 'INACTIVE'], example: 'AVAILABLE' },
          imageFile: { type: 'string', example: 'khamrah.jpg' }
        }
      },
      OrderItem: {
        type: 'object',
        properties: {
          product: { type: 'string', example: '661fa89b123456789abcdef1' },
          name: { type: 'string', example: 'Khamrah Lattafa EDP' },
          price: { type: 'number', example: 85000 },
          qty: { type: 'integer', example: 2 },
          size: { type: 'string', example: '100ml' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '661fa89b123456789abcdef2' },
          orderCode: { type: 'string', example: 'BK-45812' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' }
          },
          subtotal: { type: 'number', example: 170000 },
          discount: { type: 'number', example: 17000 },
          shippingCost: { type: 'number', example: 0 },
          total: { type: 'number', example: 153000 },
          paymentMethod: { type: 'string', example: 'transfer' },
          paymentStatus: { type: 'string', example: 'PAID' },
          shippingMethod: { type: 'string', example: 'standard' },
          status: { type: 'string', example: 'PENDING' }
        }
      },
      Delivery: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '661fa89b123456789abcdef3' },
          order: { type: 'string', example: '661fa89b123456789abcdef2' },
          courier: { type: 'string', example: '661fa89b123456789abcdef0' },
          trackingCode: { type: 'string', example: 'AND-54219801AR' },
          status: { type: 'string', example: 'ASSIGNED' },
          priority: { type: 'string', example: 'NORMAL' }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          message: { type: 'string', example: 'Operación realizada correctamente' },
          data: { type: 'object' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          code: { type: 'string', example: 'PRODUCT_NOT_FOUND' },
          message: { type: 'string', example: 'No se encontró el producto solicitado' }
        }
      }
    }
  },
  paths: {
    '/api/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Autenticar usuario y obtener JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@bunkerimports.com' },
                  password: { type: 'string', example: 'Admin123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login exitoso', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          401: { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/users/register': {
      post: {
        tags: ['Users'],
        summary: 'Registrar un nuevo cliente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'lastName', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Juan' },
                  lastName: { type: 'string', example: 'Pérez' },
                  email: { type: 'string', example: 'juan.perez@example.com' },
                  password: { type: 'string', example: 'Password123' },
                  phone: { type: 'string', example: '+54 11 4444-5555' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Usuario registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          409: { description: 'Email duplicado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Obtener catálogo público de productos con filtros',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Buscar por nombre o marca' },
          { name: 'brand', in: 'query', schema: { type: 'string' }, description: 'Filtrar por marca' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filtrar por categoría' },
          { name: 'gender', in: 'query', schema: { type: 'string' }, description: 'Filtrar por género' }
        ],
        responses: {
          200: { description: 'Lista de productos', content: { 'application/json': { schema: { type: 'object', properties: { count: { type: 'integer' }, data: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } } } }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Crear un nuevo producto (Admin/Editor)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          201: { description: 'Producto creado exitosamente' },
          400: { description: 'Datos inválidos' },
          401: { description: 'No autorizado' }
        }
      }
    },
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Crear nuevo pedido de compra (Checkout)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items', 'paymentMethod', 'shippingMethod'],
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string', example: '661fa89b123456789abcdef1' },
                        qty: { type: 'integer', example: 1 }
                      }
                    }
                  },
                  paymentMethod: { type: 'string', example: 'transfer' },
                  shippingMethod: { type: 'string', example: 'standard' },
                  deliveryAddress: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Pedido creado exitosamente' },
          409: { description: 'Stock insuficiente' }
        }
      }
    },
    '/api/mocks/users': {
      get: {
        tags: ['Mocks'],
        summary: 'Generar usuarios de prueba en memoria con Faker',
        parameters: [{ name: 'qty', in: 'query', schema: { type: 'integer', default: 5 } }],
        responses: { 200: { description: 'Lista de usuarios ficticios' } }
      }
    },
    '/api/mocks/seed': {
      post: {
        tags: ['Mocks'],
        summary: 'Insertar datos de prueba masivos en base de datos',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  users: { type: 'integer', default: 5 },
                  couriers: { type: 'integer', default: 2 },
                  orders: { type: 'integer', default: 5 },
                  deliveries: { type: 'integer', default: 3 }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Datos insertados exitosamente' } }
      }
    },
    '/api/logger/test': {
      get: {
        tags: ['Logger'],
        summary: 'Probar emisión de logs en los 6 niveles (debug, http, info, warning, error, fatal)',
        responses: { 200: { description: 'Prueba completada' } }
      }
    }
  }
};

const swaggerOptions = {
  swaggerDefinition,
  apis: []
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
