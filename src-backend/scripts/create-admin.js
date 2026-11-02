'use strict';

const connectDB = require('../config/database');
const config = require('../config/env.config');
const User = require('../models/user.model');
const { ROLES } = require('../constants');
const logger = require('../logger/logger');

async function createAdmin() {
  try {
    await connectDB();

    const adminEmail = config.admin.email;
    const adminPassword = config.admin.password || 'Admin123!';

    // Verificar si ya existe
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.role = ROLES.ADMIN;
      admin.status = 'active';
      admin.password = adminPassword;
      await admin.save();
      logger.info(`Administrador existente actualizado: ${adminEmail}`);
    } else {
      admin = await User.create({
        name: config.admin.name || 'Admin Bunker',
        lastName: 'Imports',
        email: adminEmail,
        password: adminPassword,
        role: ROLES.ADMIN,
        status: 'active',
        phone: '+54 11 5555-4321',
        address: {
          street: 'Av. Libertador 4850',
          city: 'CABA',
          province: 'Buenos Aires',
          postalCode: '1425'
        }
      });
      logger.info(`Administrador inicial creado exitosamente: ${adminEmail}`);
    }

    // Crear o asegurar repartidor demo para módulo de entregas
    const courierEmail = 'courier@bunkerimports.com';
    let courier = await User.findOne({ email: courierEmail });
    if (!courier) {
      await User.create({
        name: 'Carlos',
        lastName: 'Méndez',
        email: courierEmail,
        password: 'Courier123!',
        role: ROLES.COURIER,
        status: 'active',
        phone: '+54 11 6666-7777',
        address: {
          street: 'Corrientes 2450',
          city: 'CABA',
          province: 'Buenos Aires',
          postalCode: '1046'
        }
      });
      logger.info(`Repartidor demo creado exitosamente: ${courierEmail}`);
    }

    logger.info('Proceso de creación de usuarios administrativos y repartidor completado.');
    process.exit(0);
  } catch (error) {
    logger.error(`Error al crear usuarios administrativos: ${error.message}`);
    process.exit(1);
  }
}

createAdmin();
