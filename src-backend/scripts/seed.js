'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const connectDB = require('../config/database');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { ROLES } = require('../constants');
const logger = require('../logger/logger');

async function seed() {
  try {
    await connectDB();
    logger.info('Iniciando proceso de inicialización (Seed) de BUNKER IMPORTS...');

    // 1. Asegurar Admin inicial
    const adminEmail = 'admin@bunkerimports.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        lastName: 'Bunker',
        email: adminEmail,
        password: 'Admin123!',
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
      logger.info(`Usuario Administrador creado: ${adminEmail}`);
    } else {
      logger.info(`Usuario Administrador ya existe: ${adminEmail}`);
    }

    // 2. Asegurar Courier demo
    const courierEmail = 'courier@bunkerimports.com';
    let courier = await User.findOne({ email: courierEmail });
    if (!courier) {
      courier = await User.create({
        name: 'Carlos',
        lastName: 'Méndez',
        email: courierEmail,
        password: 'Courier123!',
        role: ROLES.COURIER,
        status: 'active',
        phone: '+54 11 6666-7777',
        address: {
          street: 'Av. Corrientes 2450',
          city: 'CABA',
          province: 'Buenos Aires',
          postalCode: '1046'
        }
      });
      logger.info(`Repartidor demo creado: ${courierEmail}`);
    } else {
      logger.info(`Repartidor demo ya existe: ${courierEmail}`);
    }

    // 3. Cargar productos desde src/js/data.js
    const dataJsPath = path.join(__dirname, '..', '..', 'src', 'js', 'data.js');
    const dataContent = fs.readFileSync(dataJsPath, 'utf8');

    const sandbox = {
      window: { location: { pathname: '/' } },
      document: { dispatchEvent: () => {} },
      localStorage: {
        getItem: () => null,
        setItem: () => {}
      },
      console: { log: () => {}, error: () => {}, warn: () => {} }
    };
    vm.createContext(sandbox);
    vm.runInContext(dataContent, sandbox);

    const initialProducts = (sandbox.window && sandbox.window.BunkerData && sandbox.window.BunkerData.PRODUCTS) || [];

    logger.info(`Cargando ${initialProducts.length} productos originales de Bunker Imports...`);

    let insertedCount = 0;
    let updatedCount = 0;

    for (const p of initialProducts) {
      const productPayload = {
        name: p.name,
        sku: p.sku || `BK-${p.id.toUpperCase()}`,
        slug: p.slug || p.id,
        brand: p.brandName || p.brand || 'Bunker Imports',
        category: Array.isArray(p.category) ? p.category : [p.category || 'arabes'],
        gender: p.gender || 'unisex',
        fragranceType: p.type || 'Eau de Parfum',
        concentration: p.concentration || 'EDP',
        price: Number(p.price) || 80000,
        compareAtPrice: Number(p.compareAtPrice) || 0,
        costPrice: Number(p.costPrice) || 45000,
        stock: Number(p.stock) || 10,
        minStock: Number(p.minStock) || 3,
        status: (p.stock > 0) ? 'AVAILABLE' : 'OUT_OF_STOCK',
        sizes: p.sizes || ['100ml'],
        imageFile: p.imageFile || 'cat-arabes.jpg',
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        fragranceFamily: p.fragranceFamily || 'Amaderado Oriental',
        notes: p.notes || { top: [], heart: [], base: [] },
        occasion: p.occasion || [],
        longevity: p.longevity || 'Alta (8-10 hs)',
        sillage: p.sillage || 'Moderada a pesada',
        batchCodeVerifiable: p.batchCodeVerifiable !== false,
        featured: Boolean(p.featured),
        bestseller: Boolean(p.bestseller),
        newArrival: Boolean(p.newArrival),
        discount: Number(p.discount) || 0,
        tags: p.tags || []
      };

      const existing = await Product.findOne({ sku: productPayload.sku });
      if (existing) {
        await Product.updateOne({ sku: productPayload.sku }, productPayload);
        updatedCount++;
      } else {
        await Product.create(productPayload);
        insertedCount++;
      }
    }

    logger.info(`Seed finalizado con éxito: ${insertedCount} productos nuevos insertados, ${updatedCount} productos actualizados.`);
    process.exit(0);

  } catch (error) {
    logger.error(`Error durante la ejecución del seed: ${error.message}`);
    process.exit(1);
  }
}

seed();
