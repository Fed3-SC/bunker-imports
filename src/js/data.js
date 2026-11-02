// ============================================================
// BUNKER IMPORTS — UNIFIED REACTIVE DATA LAYER (SINGLE SOURCE OF TRUTH)
// Base de datos persistente compartida entre Tienda Pública y Panel Admin
// ============================================================

'use strict';

// ─── KEYS DE ALMACENAMIENTO PERSISTENTE ─────────────────────
const DB_KEYS = {
  SETTINGS: 'bunker_db_settings',
  PRODUCTS: 'bunker_db_products',
  BRANDS: 'bunker_db_brands',
  CATEGORIES: 'bunker_db_categories',
  ORDERS: 'bunker_db_orders',
  CUSTOMERS: 'bunker_db_customers',
  MOVEMENTS: 'bunker_db_inventory_movements',
  PROMOTIONS: 'bunker_db_promotions',
  BANNERS: 'bunker_db_banners',
  REVIEWS: 'bunker_db_reviews',
  SHIPPING: 'bunker_db_shipping',
  AUDIT_LOGS: 'bunker_db_audit_logs',
  ADMINS: 'bunker_db_admins'
};

// ─── CONFIGURACIÓN POR DEFECTO ──────────────────────────────
const DEFAULT_SETTINGS = {
  siteName: 'Bunker Imports',
  tagline: 'Perfumes Árabes y de Diseñador 100% Originales',
  currency: 'ARS',
  currencySymbol: '$',
  freeShippingThreshold: 120000,
  transferDiscountPercent: 10,
  installmentsCount: 3,
  whatsapp: {
    number: '5491155554321',
    display: '+54 9 11 5555-4321',
    defaultMessage: 'Hola Bunker Imports, quisiera asesoramiento sobre perfumes.',
  },
  social: {
    instagram: '@bunkerimports.ar',
    instagramUrl: 'https://instagram.com/bunkerimports',
    email: 'contacto@bunkerimports.com',
  },
  showroom: {
    address: 'Av. Libertador 4850, Recoleta, CABA',
    hours: 'Lunes a Viernes de 10:00 a 19:00 hs · Sábados de 11:00 a 16:00 hs'
  },
  bank: {
    bankName: 'Banco Galicia',
    cbu: '0070012345678901234567',
    alias: 'BUNKER.IMPORTS',
    holder: 'Bunker Imports SRL',
    cuit: '30-71829304-9'
  },
  shippingRates: {
    andreani: 4500,
    express: 4500,
    showroom: 0
  },
  announcementBar: 'PERFUMES ÁRABES Y DE DISEÑADOR · 100% ORIGINALES CON BATCH CODE · HASTA 3 CUOTAS SIN INTERÉS · ENVÍOS A TODO EL PAÍS',
  hero: {
    label: 'Perfumería Premium · Argentina',
    title: 'Perfumes que dejan huella.',
    subtitle: 'Perfumes árabes y de diseñador 100% originales. Experiencia premium, atención personalizada.'
  }
};

// ─── MARCAS INICIALES ───────────────────────────────────────
const INITIAL_BRANDS = [
  {
    id: 'lattafa',
    name: 'Lattafa',
    slug: 'lattafa',
    category: 'arabic',
    country: 'Emiratos Árabes Unidos (Dubai)',
    tagline: 'Lujo, opulencia y misterio oriental',
    description: 'Casa fundada en 1980 en Dubai. Lattafa es la referencia indiscutida mundial en fragancias árabes gourmand, ámbar y oud con una longevidad y estela legendarias.',
    imageFile: 'cat-arabes.jpg',
    status: 'active',
    featured: true
  },
  {
    id: 'armaf',
    name: 'Armaf',
    slug: 'armaf',
    category: 'arabic',
    country: 'Emiratos Árabes Unidos (Dubai)',
    tagline: 'Alta perfumería de proyección inigualable',
    description: 'Armaf Parfums combina el refinamiento francés con la potencia oriental. Creadores del mítico Club de Nuit Intense Man, elegido mundialmente por su carácter magnético.',
    imageFile: 'cat-masculino.jpg',
    status: 'active',
    featured: true
  },
  {
    id: 'afnan',
    name: 'Afnan',
    slug: 'afnan',
    category: 'arabic',
    country: 'Emiratos Árabes Unidos (Sharjah)',
    tagline: 'Fusión de vanguardia y tradición árabe',
    description: 'Desde 2007, Afnan Perfumes se distingue por sus frascos de cristalería pesada y formulaciones ultra concentradas que desafían a las marcas de diseñador occidentales.',
    imageFile: 'cat-arabes.jpg',
    status: 'active',
    featured: true
  },
  {
    id: 'rasasi',
    name: 'Rasasi',
    slug: 'rasasi',
    category: 'arabic',
    country: 'Emiratos Árabes Unidos (Dubai)',
    tagline: 'Tradición dinástica desde 1979',
    description: 'Una de las casas pioneras del Golfo Pérsico. Rasasi es sinónimo de materias primas nobles como cuero toscano, oud camboyano, azafrán y frutas exóticas.',
    imageFile: 'cat-unisex.jpg',
    status: 'active',
    featured: true
  },
  {
    id: 'armani',
    name: 'Giorgio Armani',
    slug: 'armani',
    category: 'designer',
    country: 'Italia (Milano)',
    tagline: 'Elegancia italiana y sofisticación atemporal',
    description: 'Símbolo del lujo contemporáneo. Sus creaciones olfativas como Acqua di Giò han definido el estándar de la perfumería internacional durante décadas.',
    imageFile: 'cat-disenador.jpg',
    status: 'active',
    featured: true
  },
  {
    id: 'valentino',
    name: 'Valentino',
    slug: 'valentino',
    category: 'designer',
    country: 'Italia (Roma)',
    tagline: 'Couture rebelde y sensualidad romana',
    description: 'La maison italiana traduce la opulencia de la alta costura en fragancias modernas de estela vibrante, maderas nobles e iris aterciopelado.',
    imageFile: 'cat-femenino.jpg',
    status: 'active',
    featured: true
  },
  {
    id: 'victorias-secret',
    name: "Victoria's Secret",
    slug: 'victorias-secret',
    category: 'designer',
    country: 'Estados Unidos (New York)',
    tagline: 'Icono global de sensualidad femenina',
    description: 'Referente mundial en aromas frutales y florales frescos, con su multipremiada fragancia Bombshell encabezando las listas de los perfumes más halagados.',
    imageFile: 'cat-femenino.jpg',
    status: 'active',
    featured: true
  }
];

// ─── CATEGORÍAS INICIALES ────────────────────────────────────
const INITIAL_CATEGORIES = [
  { id: 'arabes', name: 'Perfumes Árabes', slug: 'arabes', imageFile: 'cat-arabes.jpg', description: 'Fragancias de Dubai con notas de oud, ámbar, especias y vainilla. Duración extrema de 8 a 14 horas.', badge: 'Tendencia Mundial', status: 'active', order: 1 },
  { id: 'disenador', name: 'Perfumes de Diseñador', slug: 'disenador', imageFile: 'cat-disenador.jpg', description: 'Los grandes clásicos de las casas de moda italianas y francesas. Sofisticación comprobada.', badge: 'Clásicos de Lujo', status: 'active', order: 2 },
  { id: 'masculino', name: 'Perfumes Masculinos', slug: 'masculino', imageFile: 'cat-masculino.jpg', description: 'Carácter, potencia y magnetismo. Fragancias que imponen presencia en cualquier ocasión.', badge: 'Poder & Presencia', status: 'active', order: 3 },
  { id: 'femenino', name: 'Perfumes Femeninos', slug: 'femenino', imageFile: 'cat-femenino.jpg', description: 'Elegancia, sensualidad, dulzura y notas florales cautivantes diseñadas para enamorar.', badge: 'Sensualidad Pura', status: 'active', order: 4 },
  { id: 'unisex', name: 'Colección Unisex & Nicho', slug: 'unisex', imageFile: 'cat-unisex.jpg', description: 'Composiciones audaces sin etiquetas de género. Aromas únicos para quienes buscan exclusividad.', badge: 'Exclusividad', status: 'active', order: 5 },
  { id: 'ofertas', name: 'Ofertas & Promociones', slug: 'ofertas', imageFile: 'hero.jpg', description: 'Hasta 20% OFF en fragancias seleccionadas y 10% adicional pagando con transferencia.', badge: 'Descuentos Exclusivos', status: 'active', order: 6 }
];

// ─── FAMILIAS OLFATIVAS ───────────────────────────────────────
const FRAGRANCE_FAMILIES = [
  'Oriental Especiado',
  'Amaderado Oriental',
  'Gourmand Dulce',
  'Aromático Fougère',
  'Fresco Cítrico',
  'Floral Frutal',
  'Cuero y Ámbar',
  'Acuático Marino'
];

// ─── PRODUCTOS INICIALES ──────────────────────────────────────
const INITIAL_PRODUCTS = [
  {
    id: 'lattafa-9pm',
    sku: 'LAT-9PM-100',
    name: '9PM Pour Homme',
    slug: 'lattafa-9pm',
    brand: 'lattafa',
    brandName: 'Lattafa',
    category: ['arabes', 'masculino'],
    gender: 'masculino',
    type: 'Eau de Parfum',
    concentration: 'EDP (20% aceites puros)',
    price: 89000,
    compareAtPrice: 105000,
    costPrice: 52000,
    stock: 14,
    minStock: 3,
    status: 'active',
    sizes: ['100ml'],
    imageFile: 'cat-arabes.jpg',
    fragranceFamily: 'Amaderado Oriental',
    shortDescription: 'Manzana canela, lavanda dulce y fondo avainillado seductor. El rey indiscutido de las salidas nocturnas.',
    description: 'Lattafa 9PM es una de las fragancias árabes más elogiadas y vendidas del mundo. Abre con una explosión dulce y fresca de manzana silvestre, canela y bergamota, que evoluciona hacia un corazón refinado de lavanda y flor de azahar.',
    notes: {
      top: ['Manzana silvestre', 'Canela de Ceilán', 'Lavanda salvaje', 'Bergamota'],
      heart: ['Flor de azahar', 'Lirio de los valles', 'Cardamomo'],
      base: ['Vainilla bourbon', 'Haba tonka', 'Ámbar gris', 'Pachulí']
    },
    occasion: ['Noche', 'Citas', 'Eventos especiales'],
    longevity: 'Muy Alta (10 - 14 horas)',
    sillage: 'Pesada (primeras 4 horas)',
    batchCodeVerifiable: true,
    rating: 4.9,
    reviewCount: 48,
    featured: true,
    bestseller: true,
    newArrival: false,
    discount: 15,
    tags: ['árabe', 'bestseller', 'nocturno', 'dulce', 'seductor', 'vainilla'],
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'lattafa-khamrah',
    sku: 'LAT-KHM-100',
    name: 'Khamrah',
    slug: 'lattafa-khamrah',
    brand: 'lattafa',
    brandName: 'Lattafa',
    category: ['arabes', 'unisex'],
    gender: 'unisex',
    type: 'Eau de Parfum',
    concentration: 'EDP Extra Concentré',
    price: 105000,
    compareAtPrice: 125000,
    costPrice: 62000,
    stock: 8,
    minStock: 3,
    status: 'active',
    sizes: ['100ml'],
    imageFile: 'cat-arabes.jpg',
    fragranceFamily: 'Gourmand Dulce',
    shortDescription: 'Canela, nuez moscada, dátiles dulces y praliné con maderas nobles en un frasco de cristal tallado.',
    description: 'Lattafa Khamrah es una obra de arte olfativa. Presentado en un pesado frasco de cristal que emula un vaso de whisky de cristal tallado, combina notas cálidas de coñac especiado y dátiles de Oriente.',
    notes: {
      top: ['Canela', 'Nuez moscada', 'Bergamota'],
      heart: ['Dátiles', 'Praliné', 'Tuberosa', 'Mahonial'],
      base: ['Vainilla de Madagascar', 'Haba tonka', 'Benjuí', 'Madera de ámbar']
    },
    occasion: ['Noche', 'Otoño / Invierno', 'Citas elegantes'],
    longevity: 'Monstruosa (12 - 16 horas)',
    sillage: 'Envolvente y densa',
    batchCodeVerifiable: true,
    rating: 5.0,
    reviewCount: 62,
    featured: true,
    bestseller: true,
    newArrival: false,
    discount: 16,
    tags: ['árabe', 'gourmand', 'cristal', 'dátiles', 'canela', 'lujo'],
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'lattafa-asad',
    sku: 'LAT-ASD-100',
    name: 'Asad Pour Homme',
    slug: 'lattafa-asad',
    brand: 'lattafa',
    brandName: 'Lattafa',
    category: ['arabes', 'masculino'],
    gender: 'masculino',
    type: 'Eau de Parfum',
    concentration: 'EDP',
    price: 92000,
    compareAtPrice: 108000,
    costPrice: 54000,
    stock: 2, // Alerta: Stock Bajo!
    minStock: 3,
    status: 'active',
    sizes: ['100ml'],
    imageFile: 'cat-masculino.jpg',
    fragranceFamily: 'Oriental Especiado',
    shortDescription: 'Pimienta negra, café tostado, tabaco rubio y ámbar. El perfume del hombre con carácter y determinación.',
    description: 'Asad significa "León" en árabe. Es una fragancia imponente, picante y oscura que se abre con pimienta negra y piña ahumada, revelando rápidamente café tostado y pachulí.',
    notes: {
      top: ['Pimienta negra', 'Piña caramelizada', 'Tabaco rubio'],
      heart: ['Café tostado', 'Pachulí', 'Lirio'],
      base: ['Ámbar cálido', 'Vainilla', 'Maderas secas', 'Benjuí']
    },
    occasion: ['Formal', 'Oficina exigente', 'Noche'],
    longevity: 'Alta (9 - 12 horas)',
    sillage: 'Fuerte y definida',
    batchCodeVerifiable: true,
    rating: 4.8,
    reviewCount: 39,
    featured: false,
    bestseller: true,
    newArrival: false,
    discount: 15,
    tags: ['árabe', 'masculino', 'especiado', 'café', 'tabaco', 'elegante'],
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'armaf-club-de-nuit-intense',
    sku: 'ARM-CDNI-105',
    name: 'Club de Nuit Intense Man',
    slug: 'armaf-club-de-nuit',
    brand: 'armaf',
    brandName: 'Armaf',
    category: ['arabes', 'masculino'],
    gender: 'masculino',
    type: 'Eau de Parfum',
    concentration: 'EDP Special Edition',
    price: 118000,
    compareAtPrice: 139000,
    costPrice: 69000,
    stock: 19,
    minStock: 4,
    status: 'active',
    sizes: ['105ml', '200ml'],
    imageFile: 'cat-masculino.jpg',
    fragranceFamily: 'Aromático Fougère',
    shortDescription: 'Limón vigoroso, piña, abedul ahumado y almizcle. El campeón mundial de los cumplidos masculinos.',
    description: 'CDNIM es el fenómeno de la perfumería moderna. Su apertura cítrica y chispeante da paso a un corazón ahumado de abedul negro, jazmín y rosa.',
    notes: {
      top: ['Limón de Amalfi', 'Piña', 'Grosellas negras', 'Manzana'],
      heart: ['Abedul ahumado', 'Jazmín', 'Rosa de Marruecos'],
      base: ['Almizcle', 'Ámbar gris', 'Pachulí', 'Vainilla']
    },
    occasion: ['Firma personal diaria', 'Todo el año', 'Oficina', 'Citas'],
    longevity: 'Muy Alta (10 - 14 horas)',
    sillage: 'Proyección colosal',
    batchCodeVerifiable: true,
    rating: 4.9,
    reviewCount: 94,
    featured: true,
    bestseller: true,
    newArrival: false,
    discount: 15,
    tags: ['árabe', 'bestseller', 'ahumado', 'cítrico', 'cumplidos', 'signature'],
    createdAt: '2026-01-05T12:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'afnan-supremacy-silver',
    sku: 'AFN-SUP-100',
    name: 'Supremacy Silver',
    slug: 'afnan-supremacy',
    brand: 'afnan',
    brandName: 'Afnan',
    category: ['arabes', 'masculino'],
    gender: 'masculino',
    type: 'Eau de Parfum',
    concentration: 'EDP',
    price: 108000,
    compareAtPrice: 125000,
    costPrice: 63000,
    stock: 7,
    minStock: 2,
    status: 'active',
    sizes: ['100ml'],
    imageFile: 'cat-arabes.jpg',
    fragranceFamily: 'Fresco Cítrico',
    shortDescription: 'Piña jugosa, bergamota, musgo de roble y maderas claras en un frasco plateado cromado de alto lujo.',
    description: 'Supremacy Silver de Afnan ofrece una interpretación ultra pulida y elegante del ADN afrutado ahumado.',
    notes: {
      top: ['Piña madura', 'Grosellas negras', 'Bergamota'],
      heart: ['Abedul blanco', 'Pachulí', 'Jazmín'],
      base: ['Musgo de roble', 'Almizcle blanco', 'Ámbar gris']
    },
    occasion: ['Día a día', 'Oficina', 'Reuniones de negocios'],
    longevity: 'Alta (8 - 10 horas)',
    sillage: 'Elegante y moderada',
    batchCodeVerifiable: true,
    rating: 4.7,
    reviewCount: 28,
    featured: false,
    bestseller: false,
    newArrival: true,
    discount: 14,
    tags: ['árabe', 'fresco', 'piña', 'plata', 'elegante', 'oficina'],
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'rasasi-la-yuqawam',
    sku: 'RAS-LYQ-75',
    name: 'La Yuqawam Pour Homme',
    slug: 'rasasi-la-yuqawam',
    brand: 'rasasi',
    brandName: 'Rasasi',
    category: ['arabes', 'masculino', 'unisex'],
    gender: 'masculino',
    type: 'Eau de Parfum',
    concentration: 'EDP Alta Concentración',
    price: 168000,
    compareAtPrice: 195000,
    costPrice: 98000,
    stock: 0, // Agotado para demo de estados
    minStock: 2,
    status: 'soldout',
    sizes: ['75ml'],
    imageFile: 'cat-unisex.jpg',
    fragranceFamily: 'Cuero y Ámbar',
    shortDescription: 'Frambuesa ácida, cuero toscano puro, azafrán y maderas nobles. El pináculo del lujo oriental.',
    description: 'La Yuqawam significa "Incomparable" en árabe. Considerado unánimemente por coleccionistas como uno de los cueros más sublimes jamás creados.',
    notes: {
      top: ['Frambuesa', 'Azafrán de Persia', 'Tomillo'],
      heart: ['Incienso olíbano', 'Jazmín nocturno'],
      base: ['Cuero toscano curtido', 'Gamuza negra', 'Ámbar leñoso']
    },
    occasion: ['Noche', 'Gala', 'Casamientos'],
    longevity: 'Monstruosa (14+ horas)',
    sillage: 'Pesada e hipnótica',
    batchCodeVerifiable: true,
    rating: 5.0,
    reviewCount: 42,
    featured: true,
    bestseller: false,
    newArrival: false,
    discount: 14,
    tags: ['árabe', 'nicho', 'cuero', 'frambuesa', 'azafrán', 'exclusivo'],
    createdAt: '2026-01-20T12:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'armani-acqua-di-gio',
    sku: 'ARM-ADG-75',
    name: 'Acqua di Giò Parfum',
    slug: 'armani-acqua-di-gio',
    brand: 'armani',
    brandName: 'Giorgio Armani',
    category: ['disenador', 'masculino'],
    gender: 'masculino',
    type: 'Parfum',
    concentration: 'Parfum Concentrado',
    price: 215000,
    compareAtPrice: 245000,
    costPrice: 135000,
    stock: 12,
    minStock: 3,
    status: 'active',
    sizes: ['75ml', '125ml'],
    imageFile: 'cat-disenador.jpg',
    fragranceFamily: 'Acuático Marino',
    shortDescription: 'Notas marinas profundas, bergamota de Calabria, romero fresco e incienso ahumado misterioso.',
    description: 'La máxima evolución del legendario Acqua di Giò con incienso ahumado y notas minerales oceánicas.',
    notes: {
      top: ['Notas marinas minerales', 'Bergamota de Calabria'],
      heart: ['Romero', 'Salvia esclarea', 'Geranio borbón'],
      base: ['Incienso ahumado', 'Pachulí de Guatemala']
    },
    occasion: ['Todo el año', 'Elegancia ejecutiva', 'Citas'],
    longevity: 'Alta (8 - 11 horas)',
    sillage: 'Sofisticada y constante',
    batchCodeVerifiable: true,
    rating: 4.9,
    reviewCount: 81,
    featured: true,
    bestseller: true,
    newArrival: false,
    discount: 12,
    tags: ['diseñador', 'clásico', 'marino', 'incienso', 'elegante', 'italia'],
    createdAt: '2026-01-01T12:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'valentino-donna-born-in-roma',
    sku: 'VAL-BIR-50',
    name: 'Donna Born in Roma EDP',
    slug: 'valentino-donna-born-in-roma',
    brand: 'valentino',
    brandName: 'Valentino',
    category: ['disenador', 'femenino'],
    gender: 'femenino',
    type: 'Eau de Parfum',
    concentration: 'EDP Haute Parfumerie',
    price: 235000,
    compareAtPrice: 265000,
    costPrice: 148000,
    stock: 8,
    minStock: 2,
    status: 'active',
    sizes: ['50ml', '100ml'],
    imageFile: 'cat-femenino.jpg',
    fragranceFamily: 'Floral Frutal',
    shortDescription: 'Jazmín grandiflorum, grosellas negras, tres vainillas bourbon y maderas nobles contemporáneas.',
    description: 'Nacida en Roma para la mujer moderna. Una combinación de jazmín imperial con tres vainillas bourbon.',
    notes: {
      top: ['Grosellas negras', 'Pimienta rosa'],
      heart: ['Jazmín grandiflorum', 'Jazmín sambac'],
      base: ['Trío de vainillas bourbon', 'Cashmeran']
    },
    occasion: ['Todo el año', 'Noche', 'Citas románticas'],
    longevity: 'Muy Alta (9 - 12 horas)',
    sillage: 'Femenina y envolvente',
    batchCodeVerifiable: true,
    rating: 5.0,
    reviewCount: 57,
    featured: true,
    bestseller: true,
    newArrival: false,
    discount: 11,
    tags: ['diseñador', 'femenino', 'jazmín', 'vainilla', 'alta costura'],
    createdAt: '2026-02-14T12:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'vs-bombshell',
    sku: 'VS-BMB-50',
    name: 'Bombshell Eau de Parfum',
    slug: 'vs-bombshell',
    brand: 'victorias-secret',
    brandName: "Victoria's Secret",
    category: ['disenador', 'femenino'],
    gender: 'femenino',
    type: 'Eau de Parfum',
    concentration: 'EDP',
    price: 145000,
    compareAtPrice: 170000,
    costPrice: 88000,
    stock: 15,
    minStock: 4,
    status: 'active',
    sizes: ['50ml', '100ml'],
    imageFile: 'cat-femenino.jpg',
    fragranceFamily: 'Floral Frutal',
    shortDescription: 'Maracuyá púrpura, peonía de Shangri-La y orquídea de vainilla. Frescura chispeante y luminosa.',
    description: 'La fragancia N°1 en ventas de Victoria\'s Secret en todo el mundo. Frutas tropicales y peonía fresca.',
    notes: {
      top: ['Maracuyá púrpura', 'Pomelo', 'Piña'],
      heart: ['Peonía de Shangri-La', 'Orquídea de vainilla'],
      base: ['Almizcle', 'Musgo de roble']
    },
    occasion: ['Día a día', 'Primavera / Verano'],
    longevity: 'Moderada-Alta (6 - 8 horas)',
    sillage: 'Alegre y chispeante',
    batchCodeVerifiable: true,
    rating: 4.8,
    reviewCount: 73,
    featured: true,
    bestseller: true,
    newArrival: false,
    discount: 15,
    tags: ['diseñador', 'femenino', 'fresco', 'frutal', 'maracuyá'],
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z'
  }
];

// ─── PEDIDOS INICIALES (DEMO REALISTA PARA ANALYTICS) ────────
const INITIAL_ORDERS = [
  {
    id: 'BK-94812',
    date: '2026-09-30T10:30:00Z',
    customer: {
      name: 'Santiago Morales',
      email: 'santiago.m@gmail.com',
      phone: '+54 9 11 4455-8899',
      dni: '38.450.123',
      address: 'Av. Libertador 2450, Piso 4 B, CABA'
    },
    items: [
      { id: 'lattafa-9pm', name: '9PM Pour Homme', brand: 'Lattafa', size: '100ml', price: 89000, qty: 1, imageFile: 'cat-arabes.jpg' }
    ],
    subtotal: 89000,
    discount: 8900,
    shippingCost: 0,
    total: 80100,
    paymentMethod: 'Transferencia Bancaria (10% OFF)',
    shippingMethod: 'Envío Domicilio Andreani',
    status: 'paid', // pendiente, paid, preparing, ready, shipped, delivered, cancelled
    statusLabel: 'Pago confirmado',
    notes: 'Solicitó bolsa de regalo Bunker'
  },
  {
    id: 'BK-94811',
    date: '2026-09-30T09:15:00Z',
    customer: {
      name: 'Valentina Rossi',
      email: 'valen.rossi@hotmail.com',
      phone: '+54 9 11 6789-1234',
      dni: '41.220.890',
      address: 'Calle 14 N° 850, La Plata, Buenos Aires'
    },
    items: [
      { id: 'lattafa-khamrah', name: 'Khamrah', brand: 'Lattafa', size: '100ml', price: 105000, qty: 1, imageFile: 'cat-arabes.jpg' },
      { id: 'vs-bombshell', name: 'Bombshell Eau de Parfum', brand: "Victoria's Secret", size: '50ml', price: 145000, qty: 1, imageFile: 'cat-femenino.jpg' }
    ],
    subtotal: 250000,
    discount: 0,
    shippingCost: 0,
    total: 250000,
    paymentMethod: 'Tarjeta de Crédito (3 cuotas sin interés)',
    shippingMethod: 'Envío Express 24hs CABA/GBA',
    status: 'preparing',
    statusLabel: 'Preparando pedido',
    notes: ''
  },
  {
    id: 'BK-94810',
    date: '2026-09-29T18:40:00Z',
    customer: {
      name: 'Mariano Benítez',
      email: 'mbenitez@yahoo.com.ar',
      phone: '+54 9 351 556-7788',
      dni: '35.990.111',
      address: 'Bv. San Juan 450, Córdoba Capital'
    },
    items: [
      { id: 'armaf-club-de-nuit-intense', name: 'Club de Nuit Intense Man', brand: 'Armaf', size: '105ml', price: 118000, qty: 2, imageFile: 'cat-masculino.jpg' }
    ],
    subtotal: 236000,
    discount: 23600,
    shippingCost: 0,
    total: 212400,
    paymentMethod: 'Transferencia Bancaria',
    shippingMethod: 'Envío Domicilio Andreani',
    status: 'shipped',
    statusLabel: 'Enviado',
    trackingNumber: 'AND-78901234AR',
    notes: ''
  },
  {
    id: 'BK-94809',
    date: '2026-09-29T14:20:00Z',
    customer: {
      name: 'Camila Larrea',
      email: 'camilalarrea@gmail.com',
      phone: '+54 9 11 3344-5566',
      dni: '39.800.444',
      address: 'Recoleta (Retiro en Showroom)'
    },
    items: [
      { id: 'valentino-donna-born-in-roma', name: 'Donna Born in Roma EDP', brand: 'Valentino', size: '50ml', price: 235000, qty: 1, imageFile: 'cat-femenino.jpg' }
    ],
    subtotal: 235000,
    discount: 0,
    shippingCost: 0,
    total: 235000,
    paymentMethod: 'Efectivo en Showroom',
    shippingMethod: 'Retiro Showroom Recoleta',
    status: 'delivered',
    statusLabel: 'Entregado',
    notes: 'Retiró el 29/09'
  }
];

// ─── CLIENTES INICIALES ──────────────────────────────────────
const INITIAL_CUSTOMERS = [
  { id: 'c-1', name: 'Santiago Morales', email: 'santiago.m@gmail.com', phone: '+54 9 11 4455-8899', dni: '38.450.123', orderCount: 3, totalSpent: 280000, city: 'CABA', registeredAt: '2026-03-12' },
  { id: 'c-2', name: 'Valentina Rossi', email: 'valen.rossi@hotmail.com', phone: '+54 9 11 6789-1234', dni: '41.220.890', orderCount: 2, totalSpent: 350000, city: 'La Plata', registeredAt: '2026-04-05' },
  { id: 'c-3', name: 'Mariano Benítez', email: 'mbenitez@yahoo.com.ar', phone: '+54 9 351 556-7788', dni: '35.990.111', orderCount: 4, totalSpent: 420000, city: 'Córdoba', registeredAt: '2026-02-18' },
  { id: 'c-4', name: 'Camila Larrea', email: 'camilalarrea@gmail.com', phone: '+54 9 11 3344-5566', dni: '39.800.444', orderCount: 1, totalSpent: 235000, city: 'CABA', registeredAt: '2026-09-29' }
];

// ─── MOVIMIENTOS DE INVENTARIO INICIALES ──────────────────────
const INITIAL_MOVEMENTS = [
  { id: 'mov-1', date: '2026-09-30 10:30', productName: '9PM Pour Homme', sku: 'LAT-9PM-100', delta: -1, newStock: 14, reason: 'Venta Pedido #BK-94812', user: 'Sistema E-commerce' },
  { id: 'mov-2', date: '2026-09-30 09:15', productName: 'Khamrah', sku: 'LAT-KHM-100', delta: -1, newStock: 8, reason: 'Venta Pedido #BK-94811', user: 'Sistema E-commerce' },
  { id: 'mov-3', date: '2026-09-30 09:15', productName: 'Bombshell Eau de Parfum', sku: 'VS-BMB-50', delta: -1, newStock: 15, reason: 'Venta Pedido #BK-94811', user: 'Sistema E-commerce' },
  { id: 'mov-4', date: '2026-09-28 16:00', productName: 'Club de Nuit Intense Man', sku: 'ARM-CDNI-105', delta: 10, newStock: 21, reason: 'Ingreso Importación Dubai Lote 89', user: 'Santiago (Admin)' },
  { id: 'mov-5', date: '2026-09-25 11:30', productName: 'Asad Pour Homme', sku: 'LAT-ASD-100', delta: -3, newStock: 2, reason: 'Ajuste Stock Físico Showroom', user: 'Santiago (Admin)' }
];

// ─── AUDITORÍA INICIAL ───────────────────────────────────────
const INITIAL_AUDIT_LOGS = [
  { id: 'aud-1', date: '2026-09-30 10:30', user: 'Sistema', role: 'SYSTEM', action: 'Descuento de Stock', target: '9PM Pour Homme', details: '-1 unidad por venta online #BK-94812' },
  { id: 'aud-2', date: '2026-09-30 08:00', user: 'Santiago', role: 'SUPER_ADMIN', action: 'Inicio de Sesión', target: 'Panel Admin', details: 'Ingreso exitoso desde 181.44.20.12' },
  { id: 'aud-3', date: '2026-09-28 16:05', user: 'Santiago', role: 'SUPER_ADMIN', action: 'Actualizó Stock', target: 'Club de Nuit Intense', details: 'Reposición +10 unidades' },
  { id: 'aud-4', date: '2026-09-26 14:10', user: 'Santiago', role: 'SUPER_ADMIN', action: 'Modificó Precio', target: 'Khamrah Lattafa', details: 'Precio actualizado a $105.000' }
];

// ─── ADMIN USERS INICIALES ───────────────────────────────────
// Password default: 'bunker2026' -> sha256: f3c971b2a1971117ca81b565ef1600513ea5764752a6be2eb0f4d12ae289e414
const INITIAL_ADMINS = [
  {
    id: 'adm-1',
    name: 'Santiago Bunker',
    email: 'admin@bunkerimports.com',
    passwordHash: 'f3c971b2a1971117ca81b565ef1600513ea5764752a6be2eb0f4d12ae289e414',
    role: 'SUPER_ADMIN', // SUPER_ADMIN, ADMIN, EDITOR
    status: 'active',
    lastLogin: '2026-09-30T08:00:00Z'
  },
  {
    id: 'adm-2',
    name: 'Valentina Editor',
    email: 'editor@bunkerimports.com',
    passwordHash: 'f3c971b2a1971117ca81b565ef1600513ea5764752a6be2eb0f4d12ae289e414',
    role: 'EDITOR',
    status: 'active',
    lastLogin: '2026-09-28T14:30:00Z'
  }
];

// ─── PROMOCIONES Y CUPONES INICIALES ─────────────────────────
const INITIAL_PROMOTIONS = [
  { id: 'p-1', name: 'Cupón Bienvenida VIP', code: 'BUNKER10', type: 'percentage', value: 10, minPurchase: 0, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', uses: 45 },
  { id: 'p-2', name: 'Mes Árabe 15% OFF', code: 'ARABE15', type: 'percentage', value: 15, minPurchase: 100000, startDate: '2026-09-01', endDate: '2026-10-31', status: 'active', uses: 28 },
  { id: 'p-3', name: 'Bunker Black Week', code: 'BLACK20', type: 'percentage', value: 20, minPurchase: 150000, startDate: '2026-11-20', endDate: '2026-11-30', status: 'paused', uses: 0 }
];

// ─── BANNERS INICIALES ───────────────────────────────────────
const INITIAL_BANNERS = [
  { id: 'ban-1', title: 'Descubrí la Perfumería Árabe', subtitle: 'Fragancias exclusivas de Dubai con fijación extrema de 12+ horas.', imageFile: 'cat-arabes.jpg', ctaText: 'Explorar Colección', targetUrl: 'categoria.html?slug=arabes', status: 'active', order: 1 },
  { id: 'ban-2', title: 'Grandes Clásicos de Diseñador', subtitle: 'Armani, Valentino y Victoria’s Secret 100% Originales.', imageFile: 'cat-disenador.jpg', ctaText: 'Ver Diseñador', targetUrl: 'categoria.html?slug=disenador', status: 'active', order: 2 },
  { id: 'ban-3', title: '10% OFF con Transferencia Bancaria', subtitle: 'Aprovechá descuento directo en todo el catálogo de fragancias.', imageFile: 'hero.jpg', ctaText: 'Ver Ofertas', targetUrl: 'ofertas.html', status: 'active', order: 3 }
];

// ─── REVIEWS INICIALES ───────────────────────────────────────
const INITIAL_REVIEWS = [
  { id: 'rev-1', productId: 'lattafa-9pm', productName: '9PM Pour Homme', author: 'Mariano G.', city: 'Palermo, CABA', rating: 5, date: '2026-09-24', comment: 'Increíble duración. Me lo puse a las 20hs para una cena y al día siguiente a la mañana todavía se sentía en la piel y la ropa. 100% original con celofán y batch code.', verified: true, status: 'published' },
  { id: 'rev-2', productId: 'lattafa-khamrah', productName: 'Khamrah', author: 'Facundo M.', city: 'San Isidro', rating: 5, date: '2026-09-27', comment: 'La presentación es descomunal y el aroma es exquisito. Huele a licor con dátiles y canela de la más alta pastelería francesa. Vale cada peso.', verified: true, status: 'published' },
  { id: 'rev-3', productId: 'armaf-club-de-nuit-intense', productName: 'Club de Nuit Intense Man', author: 'Julián C.', city: 'Belgrano', rating: 5, date: '2026-09-26', comment: 'Es mi tercer frasco que compro en Bunker. Siempre original, el batch chequeado en CheckFresh. Te paran en la calle para preguntarte qué perfume tenés puesto.', verified: true, status: 'published' },
  { id: 'rev-4', productId: 'armani-acqua-di-gio', productName: 'Acqua di Giò Parfum', author: 'Esteban F.', city: 'Recoleta', rating: 5, date: '2026-09-25', comment: 'El Acqua di Giò definitivo. El incienso le da una seriedad y duración que le faltaba a las versiones anteriores.', verified: true, status: 'published' }
];

// ─── MÉTODOS DE ENVÍO INICIALES ─────────────────────────────
const INITIAL_SHIPPING_METHODS = [
  {
    id: 'andreani-domicilio',
    name: 'Envío a Domicilio Andreani',
    description: 'Envío prioritario con seguimiento satelital a todo el territorio nacional.',
    price: 4500,
    estimatedDays: '2 a 4 días hábiles',
    regions: 'Todo el país',
    status: 'active'
  },
  {
    id: 'moto-express',
    name: 'Moto Express 24hs CABA / GBA',
    description: 'Entrega urgente en el día o dentro de las 24 horas hábiles.',
    price: 4500,
    estimatedDays: 'Mismo día / 24hs',
    regions: 'CABA y Gran Buenos Aires',
    status: 'active'
  },
  {
    id: 'retiro-showroom',
    name: 'Retiro en Showroom Recoleta',
    description: 'Retiro presencial inmediato y sin costo por nuestro showroom exclusivo.',
    price: 0,
    estimatedDays: 'Inmediato (dentro del horario de atención)',
    regions: 'Av. Libertador 4850, Recoleta, CABA',
    status: 'active'
  }
];

// ─── MOTOR DE PERSISTENCIA Y SINCRONIZACIÓN ──────────────────
function readStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    document.dispatchEvent(new CustomEvent('bunker:data:changed', { detail: { key, value } }));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Inicializar base de datos si es la primera vez
function initializeDatabase() {
  if (!localStorage.getItem(DB_KEYS.SETTINGS)) writeStorage(DB_KEYS.SETTINGS, DEFAULT_SETTINGS);
  if (!localStorage.getItem(DB_KEYS.PRODUCTS)) writeStorage(DB_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  if (!localStorage.getItem(DB_KEYS.BRANDS)) writeStorage(DB_KEYS.BRANDS, INITIAL_BRANDS);
  if (!localStorage.getItem(DB_KEYS.CATEGORIES)) writeStorage(DB_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  if (!localStorage.getItem(DB_KEYS.ORDERS)) writeStorage(DB_KEYS.ORDERS, INITIAL_ORDERS);
  if (!localStorage.getItem(DB_KEYS.CUSTOMERS)) writeStorage(DB_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  if (!localStorage.getItem(DB_KEYS.MOVEMENTS)) writeStorage(DB_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
  if (!localStorage.getItem(DB_KEYS.AUDIT_LOGS)) writeStorage(DB_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  if (!localStorage.getItem(DB_KEYS.ADMINS)) writeStorage(DB_KEYS.ADMINS, INITIAL_ADMINS);
  if (!localStorage.getItem(DB_KEYS.PROMOTIONS)) writeStorage(DB_KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
  if (!localStorage.getItem(DB_KEYS.BANNERS)) writeStorage(DB_KEYS.BANNERS, INITIAL_BANNERS);
  if (!localStorage.getItem(DB_KEYS.REVIEWS)) writeStorage(DB_KEYS.REVIEWS, INITIAL_REVIEWS);
  if (!localStorage.getItem(DB_KEYS.SHIPPING)) writeStorage(DB_KEYS.SHIPPING, INITIAL_SHIPPING_METHODS);
}

initializeDatabase();

// ─── DATA STORE UNIFICADO (API REACTIVA PARA TIENDA Y ADMIN) ─
const DataStore = {

  // ── SETTINGS ──
  getSettings() {
    return readStorage(DB_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(newSettings, adminUser = 'Admin') {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    writeStorage(DB_KEYS.SETTINGS, updated);
    this.addAuditLog(adminUser, 'SUPER_ADMIN', 'Actualizó Configuración', 'Configuración General', 'Guardó cambios de configuración de la tienda');
    return updated;
  },

  // ── PRODUCTS ──
  getAllProducts() {
    return readStorage(DB_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  getActiveProducts() {
    return this.getAllProducts().filter(p => p.status === 'active' || p.status === 'soldout');
  },
  getProductById(id) {
    if (!id) return null;
    return this.getAllProducts().find(p => p.id === id) || null;
  },
  getProductBySlug(slug) {
    if (!slug) return null;
    return this.getAllProducts().find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
  },
  saveProduct(productData, adminUser = 'Admin') {
    const products = this.getAllProducts();
    const isNew = !productData.id || !products.some(p => p.id === productData.id);
    let saved;

    if (isNew) {
      saved = {
        ...productData,
        id: productData.id || ('prod-' + Date.now()),
        slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        stock: Number(productData.stock) || 0,
        minStock: Number(productData.minStock) || 2,
        price: Number(productData.price) || 0,
        compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : null,
        costPrice: productData.costPrice ? Number(productData.costPrice) : 0,
        status: (Number(productData.stock) <= 0) ? 'soldout' : (productData.status || 'active'),
        imageFile: productData.imageFile || 'cat-arabes.jpg',
        sizes: Array.isArray(productData.sizes) ? productData.sizes : ['100ml'],
        rating: productData.rating || 5.0,
        reviewCount: productData.reviewCount || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      products.unshift(saved);
      this.addAuditLog(adminUser, 'ADMIN', 'Creó Producto', saved.name, `SKU: ${saved.sku || 'N/A'}, Precio: $${saved.price}`);
      this.addInventoryMovement(saved.name, saved.sku, saved.stock, saved.stock, 'Stock Inicial de Producto', adminUser);
    } else {
      const idx = products.findIndex(p => p.id === productData.id);
      const prev = products[idx];
      const newStock = Number(productData.stock);

      saved = {
        ...prev,
        ...productData,
        stock: newStock,
        price: Number(productData.price),
        compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : null,
        costPrice: productData.costPrice ? Number(productData.costPrice) : prev.costPrice,
        status: (newStock <= 0) ? 'soldout' : (productData.status || prev.status),
        updatedAt: new Date().toISOString()
      };

      if (newStock !== prev.stock) {
        const delta = newStock - prev.stock;
        this.addInventoryMovement(saved.name, saved.sku, delta, newStock, 'Ajuste manual de edición', adminUser);
      }

      products[idx] = saved;
      this.addAuditLog(adminUser, 'ADMIN', 'Editó Producto', saved.name, `Actualizó datos (Precio: $${saved.price}, Stock: ${saved.stock})`);
    }

    writeStorage(DB_KEYS.PRODUCTS, products);
    return saved;
  },
  deleteProduct(productId, adminUser = 'Admin') {
    const products = this.getAllProducts();
    const prod = products.find(p => p.id === productId);
    if (!prod) return false;
    const filtered = products.filter(p => p.id !== productId);
    writeStorage(DB_KEYS.PRODUCTS, filtered);
    this.addAuditLog(adminUser, 'ADMIN', 'Eliminó Producto', prod.name, `ID: ${productId}`);
    return true;
  },
  duplicateProduct(productId, adminUser = 'Admin') {
    const prod = this.getProductById(productId);
    if (!prod) return null;
    const duplicated = {
      ...prod,
      id: 'prod-' + Date.now(),
      name: prod.name + ' (Copia)',
      slug: prod.slug + '-copia-' + Math.floor(Math.random() * 1000),
      sku: (prod.sku || 'SKU') + '-CPY',
      createdAt: new Date().toISOString()
    };
    return this.saveProduct(duplicated, adminUser);
  },

  // ── STOCK & INVENTARIO ──
  updateStock(productId, newQty, reason = 'Ajuste manual', adminUser = 'Admin') {
    const products = this.getAllProducts();
    const prod = products.find(p => p.id === productId);
    if (!prod) return null;

    const oldStock = prod.stock || 0;
    const delta = newQty - oldStock;
    prod.stock = Math.max(0, newQty);
    prod.status = prod.stock === 0 ? 'soldout' : (prod.status === 'soldout' ? 'active' : prod.status);
    prod.updatedAt = new Date().toISOString();

    writeStorage(DB_KEYS.PRODUCTS, products);
    this.addInventoryMovement(prod.name, prod.sku, delta, prod.stock, reason, adminUser);
    this.addAuditLog(adminUser, 'ADMIN', 'Modificó Stock', prod.name, `${delta >= 0 ? '+' : ''}${delta} unidades (${reason}) -> Nuevo stock: ${prod.stock}`);

    return prod;
  },
  adjustStockDelta(productId, delta, reason = 'Ajuste rápido', adminUser = 'Admin') {
    const prod = this.getProductById(productId);
    if (!prod) return null;
    return this.updateStock(productId, (prod.stock || 0) + delta, reason, adminUser);
  },
  getLowStockProducts() {
    return this.getAllProducts().filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.minStock || 3));
  },
  getOutOfStockProducts() {
    return this.getAllProducts().filter(p => (p.stock || 0) <= 0 || p.status === 'soldout');
  },
  getInventoryMovements() {
    return readStorage(DB_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
  },
  addInventoryMovement(productName, sku, delta, newStock, reason, user = 'Admin') {
    const movements = this.getInventoryMovements();
    const entry = {
      id: 'mov-' + Date.now() + '-' + Math.floor(Math.random() * 100),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      productName,
      sku: sku || 'S/SKU',
      delta,
      newStock,
      reason,
      user
    };
    movements.unshift(entry);
    writeStorage(DB_KEYS.MOVEMENTS, movements.slice(0, 200)); // Mantener últimos 200
  },

  // ── BULK PRICE MODIFICATION ──
  bulkUpdatePrices(productIds, { type, value }, adminUser = 'Admin') {
    const products = this.getAllProducts();
    let updatedCount = 0;

    products.forEach(p => {
      if (productIds.includes(p.id)) {
        const oldPrice = p.price;
        if (type === 'percent_inc') {
          p.price = Math.round(oldPrice * (1 + value / 100));
        } else if (type === 'percent_dec') {
          p.price = Math.round(oldPrice * (1 - value / 100));
        } else if (type === 'fixed_set') {
          p.price = Math.round(value);
        }
        p.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    });

    writeStorage(DB_KEYS.PRODUCTS, products);
    this.addAuditLog(adminUser, 'ADMIN', 'Actualización Masiva de Precios', `${updatedCount} productos`, `Modificación tipo: ${type}, valor: ${value}`);
    return updatedCount;
  },

  // ── BRANDS ──
  getAllBrands() {
    return readStorage(DB_KEYS.BRANDS, INITIAL_BRANDS);
  },
  getBrandBySlug(slug) {
    if (!slug) return null;
    return this.getAllBrands().find(b => b.slug.toLowerCase() === slug.toLowerCase()) || null;
  },
  saveBrand(brandData, adminUser = 'Admin') {
    const brands = this.getAllBrands();
    const isNew = !brandData.id || !brands.some(b => b.id === brandData.id);
    let saved;

    if (isNew) {
      saved = {
        ...brandData,
        id: brandData.id || ('brand-' + Date.now()),
        slug: brandData.slug || brandData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        status: brandData.status || 'active',
        imageFile: brandData.imageFile || 'cat-arabes.jpg'
      };
      brands.push(saved);
      this.addAuditLog(adminUser, 'ADMIN', 'Creó Marca', saved.name, `País: ${saved.country}`);
    } else {
      const idx = brands.findIndex(b => b.id === brandData.id);
      saved = { ...brands[idx], ...brandData };
      brands[idx] = saved;
      this.addAuditLog(adminUser, 'ADMIN', 'Editó Marca', saved.name, 'Actualizó información de la casa');
    }

    writeStorage(DB_KEYS.BRANDS, brands);
    return saved;
  },
  deleteBrand(brandId, adminUser = 'Admin') {
    const brands = this.getAllBrands();
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return false;
    writeStorage(DB_KEYS.BRANDS, brands.filter(b => b.id !== brandId));
    this.addAuditLog(adminUser, 'ADMIN', 'Eliminó Marca', brand.name, `ID: ${brandId}`);
    return true;
  },

  // ── CATEGORIES ──
  getAllCategories() {
    return readStorage(DB_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  getCategoryBySlug(slug) {
    if (!slug) return null;
    return this.getAllCategories().find(c => c.slug.toLowerCase() === slug.toLowerCase()) || null;
  },
  saveCategory(catData, adminUser = 'Admin') {
    const cats = this.getAllCategories();
    const isNew = !catData.id || !cats.some(c => c.id === catData.id);
    let saved;

    if (isNew) {
      saved = {
        ...catData,
        id: catData.id || ('cat-' + Date.now()),
        slug: catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        status: catData.status || 'active',
        order: cats.length + 1,
        imageFile: catData.imageFile || 'cat-arabes.jpg'
      };
      cats.push(saved);
      this.addAuditLog(adminUser, 'ADMIN', 'Creó Categoría', saved.name, `Slug: ${saved.slug}`);
    } else {
      const idx = cats.findIndex(c => c.id === catData.id);
      saved = { ...cats[idx], ...catData };
      cats[idx] = saved;
      this.addAuditLog(adminUser, 'ADMIN', 'Editó Categoría', saved.name, 'Actualizó descripción o visibilidad');
    }

    writeStorage(DB_KEYS.CATEGORIES, cats);
    return saved;
  },
  deleteCategory(catId, adminUser = 'Admin') {
    const cats = this.getAllCategories();
    const cat = cats.find(c => c.id === catId);
    if (!cat) return false;
    writeStorage(DB_KEYS.CATEGORIES, cats.filter(c => c.id !== catId));
    this.addAuditLog(adminUser, 'ADMIN', 'Eliminó Categoría', cat.name, `ID: ${catId}`);
    return true;
  },

  // ── ORDERS ──
  getAllOrders() {
    return readStorage(DB_KEYS.ORDERS, INITIAL_ORDERS);
  },
  getOrderById(id) {
    return this.getAllOrders().find(o => o.id === id) || null;
  },
  createOrder(orderData) {
    const orders = this.getAllOrders();
    const orderId = orderData.orderId || ('BK-' + Math.floor(10000 + Math.random() * 90000));

    const statusLabels = {
      pending: 'Pendiente de pago',
      paid: 'Pago confirmado',
      preparing: 'Preparando pedido',
      ready: 'Listo para despachar',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        dni: orderData.dni || 'S/DNI',
        address: orderData.address
      },
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      shippingCost: orderData.shippingCost || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      shippingMethod: orderData.shippingMethod,
      status: 'pending',
      statusLabel: statusLabels['pending'],
      notes: orderData.notes || ''
    };

    // Descontar stock automáticamente de cada producto
    orderData.items.forEach(item => {
      const prod = this.getProductById(item.id);
      if (prod) {
        this.updateStock(prod.id, (prod.stock || 0) - item.qty, `Venta Pedido #${orderId}`, 'Sistema Checkout');
      }
    });

    // Registrar o actualizar cliente
    this.recordCustomerOrder(newOrder.customer, newOrder.total);

    orders.unshift(newOrder);
    writeStorage(DB_KEYS.ORDERS, orders);
    this.addAuditLog('Sistema E-commerce', 'SYSTEM', 'Nuevo Pedido Recibido', `#${orderId}`, `Cliente: ${newOrder.customer.name}, Total: $${newOrder.total}`);

    // Persistir orden en Backend MongoDB si está disponible
    if (typeof window !== 'undefined' && window.BunkerAPI && window.BunkerAPI.orders) {
      window.BunkerAPI.orders.create({
        items: (orderData.items || []).map(it => ({
          productId: it.id,
          qty: it.qty,
          size: it.size
        })),
        paymentMethod: orderData.paymentMethod === 'transfer' ? 'transfer' : 'credit_card',
        shippingMethod: orderData.shippingMethod === 'express' ? 'express' : (orderData.shippingMethod === 'showroom' ? 'showroom' : 'andreani'),
        deliveryAddress: {
          name: orderData.name,
          street: orderData.address || '',
          city: 'CABA',
          province: 'Buenos Aires',
          phone: orderData.phone || ''
        },
        customerSnapshot: {
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone,
          dni: orderData.dni || ''
        },
        notes: orderData.notes || ''
      }).catch(err => console.warn('[BunkerAPI] No se pudo persistir el pedido en MongoDB:', err.message));
    }

    return newOrder;
  },
  updateOrderStatus(orderId, newStatus, adminUser = 'Admin') {
    const orders = this.getAllOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    const statusLabels = {
      pending: 'Pendiente de pago',
      paid: 'Pago confirmado',
      preparing: 'Preparando pedido',
      ready: 'Listo para despachar',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };

    const prevStatus = order.status;
    order.status = newStatus;
    order.statusLabel = statusLabels[newStatus] || newStatus;
    order.updatedAt = new Date().toISOString();

    // Si se cancela, devolver stock
    if (newStatus === 'cancelled' && prevStatus !== 'cancelled') {
      order.items.forEach(item => {
        const prod = this.getProductById(item.id);
        if (prod) {
          this.adjustStockDelta(prod.id, item.qty, `Devolución por Cancelación #${orderId}`, adminUser);
        }
      });
    }

    writeStorage(DB_KEYS.ORDERS, orders);
    this.addAuditLog(adminUser, 'ADMIN', 'Cambio Estado de Pedido', `#${orderId}`, `${prevStatus} -> ${newStatus}`);

    return order;
  },

  // ── CUSTOMERS ──
  getAllCustomers() {
    return readStorage(DB_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },
  recordCustomerOrder(custData, orderTotal) {
    const customers = this.getAllCustomers();
    const existing = customers.find(c => c.email.toLowerCase() === custData.email.toLowerCase());

    if (existing) {
      existing.orderCount = (existing.orderCount || 1) + 1;
      existing.totalSpent = (existing.totalSpent || 0) + orderTotal;
      existing.lastOrderDate = new Date().toISOString().substring(0, 10);
      existing.phone = custData.phone || existing.phone;
    } else {
      customers.push({
        id: 'c-' + Date.now(),
        name: custData.name,
        email: custData.email,
        phone: custData.phone,
        dni: custData.dni,
        orderCount: 1,
        totalSpent: orderTotal,
        city: (custData.address || '').split(',').pop()?.trim() || 'Argentina',
        registeredAt: new Date().toISOString().substring(0, 10),
        lastOrderDate: new Date().toISOString().substring(0, 10)
      });
    }

    writeStorage(DB_KEYS.CUSTOMERS, customers);
  },

  // ── PROMOTIONS ──
  getAllPromotions() {
    return readStorage(DB_KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
  },
  savePromotion(promoData, adminUser = 'Admin') {
    const promos = this.getAllPromotions();
    const isNew = !promoData.id || !promos.some(p => p.id === promoData.id);
    let saved;

    if (isNew) {
      saved = {
        ...promoData,
        id: 'promo-' + Date.now(),
        code: promoData.code.toUpperCase().trim(),
        uses: 0,
        status: promoData.status || 'active'
      };
      promos.unshift(saved);
      this.addAuditLog(adminUser, 'ADMIN', 'Creó Promoción', saved.code, `${saved.value}% OFF`);
    } else {
      const idx = promos.findIndex(p => p.id === promoData.id);
      saved = { ...promos[idx], ...promoData, code: promoData.code.toUpperCase().trim() };
      promos[idx] = saved;
      this.addAuditLog(adminUser, 'ADMIN', 'Editó Promoción', saved.code, 'Actualizó condiciones');
    }

    writeStorage(DB_KEYS.PROMOTIONS, promos);
    return saved;
  },
  deletePromotion(promoId, adminUser = 'Admin') {
    const promos = this.getAllPromotions();
    const p = promos.find(x => x.id === promoId);
    if (!p) return false;
    writeStorage(DB_KEYS.PROMOTIONS, promos.filter(x => x.id !== promoId));
    this.addAuditLog(adminUser, 'ADMIN', 'Eliminó Promoción', p.code, `ID: ${promoId}`);
    return true;
  },

  // ── BANNERS ──
  getAllBanners() {
    return readStorage(DB_KEYS.BANNERS, INITIAL_BANNERS);
  },
  saveBanner(bannerData, adminUser = 'Admin') {
    const banners = this.getAllBanners();
    const isNew = !bannerData.id || !banners.some(b => b.id === bannerData.id);
    let saved;

    if (isNew) {
      saved = {
        ...bannerData,
        id: 'ban-' + Date.now(),
        status: bannerData.status || 'active',
        order: banners.length + 1
      };
      banners.push(saved);
      this.addAuditLog(adminUser, 'ADMIN', 'Creó Banner', saved.title, 'Nuevo banner en portada');
    } else {
      const idx = banners.findIndex(b => b.id === bannerData.id);
      saved = { ...banners[idx], ...bannerData };
      banners[idx] = saved;
      this.addAuditLog(adminUser, 'ADMIN', 'Editó Banner', saved.title, 'Actualizó textos o imagen');
    }

    writeStorage(DB_KEYS.BANNERS, banners);
    return saved;
  },
  deleteBanner(bannerId, adminUser = 'Admin') {
    const banners = this.getAllBanners();
    writeStorage(DB_KEYS.BANNERS, banners.filter(b => b.id !== bannerId));
    return true;
  },

  // ── REVIEWS ──
  getAllReviews() {
    return readStorage(DB_KEYS.REVIEWS, INITIAL_REVIEWS);
  },
  updateReviewStatus(reviewId, newStatus, adminUser = 'Admin') {
    const reviews = this.getAllReviews();
    const rev = reviews.find(r => r.id === reviewId);
    if (!rev) return false;
    rev.status = newStatus;
    writeStorage(DB_KEYS.REVIEWS, reviews);
    this.addAuditLog(adminUser, 'ADMIN', 'Moderó Reseña', rev.productName, `Estado: ${newStatus}`);
    return true;
  },
  deleteReview(reviewId, adminUser = 'Admin') {
    const reviews = this.getAllReviews();
    writeStorage(DB_KEYS.REVIEWS, reviews.filter(r => r.id !== reviewId));
    this.addAuditLog(adminUser, 'ADMIN', 'Eliminó Reseña', `ID ${reviewId}`, 'Eliminación permanente');
    return true;
  },

  // ── SHIPPING METHODS ──
  getAllShippingMethods() {
    return readStorage(DB_KEYS.SHIPPING, INITIAL_SHIPPING_METHODS);
  },
  saveShippingMethod(methodData, adminUser = 'Admin') {
    const list = this.getAllShippingMethods();
    const isNew = !methodData.id || !list.some(m => m.id === methodData.id);
    let saved;
    if (isNew) {
      saved = {
        ...methodData,
        id: methodData.id || ('ship-' + Date.now()),
        price: Number(methodData.price) || 0,
        status: methodData.status || 'active'
      };
      list.push(saved);
      this.addAuditLog(adminUser, 'ADMIN', 'Creó Método de Envío', saved.name, `Precio: $${saved.price}`);
    } else {
      const idx = list.findIndex(m => m.id === methodData.id);
      saved = { ...list[idx], ...methodData, price: Number(methodData.price) };
      list[idx] = saved;
      this.addAuditLog(adminUser, 'ADMIN', 'Editó Método de Envío', saved.name, `Precio: $${saved.price}`);
    }
    writeStorage(DB_KEYS.SHIPPING, list);
    return saved;
  },
  deleteShippingMethod(id, adminUser = 'Admin') {
    const list = this.getAllShippingMethods();
    const item = list.find(m => m.id === id);
    if (!item) return false;
    writeStorage(DB_KEYS.SHIPPING, list.filter(m => m.id !== id));
    this.addAuditLog(adminUser, 'ADMIN', 'Eliminó Método de Envío', item.name, `ID: ${id}`);
    return true;
  },

  // ── AUDIT LOGS ──
  getAuditLogs() {
    return readStorage(DB_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(user, role, action, target, details) {
    const logs = this.getAuditLogs();
    const entry = {
      id: 'aud-' + Date.now() + '-' + Math.floor(Math.random() * 100),
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: user || 'Admin',
      role: role || 'ADMIN',
      action,
      target,
      details
    };
    logs.unshift(entry);
    writeStorage(DB_KEYS.AUDIT_LOGS, logs.slice(0, 500));
  },

  // ── ADMIN USERS ──
  getAllAdmins() {
    return readStorage(DB_KEYS.ADMINS, INITIAL_ADMINS);
  },
  saveAdmin(adminData, curUser = 'SuperAdmin') {
    const admins = this.getAllAdmins();
    const isNew = !adminData.id || !admins.some(a => a.id === adminData.id);
    let saved;

    if (isNew) {
      saved = {
        ...adminData,
        id: 'adm-' + Date.now(),
        status: adminData.status || 'active'
      };
      admins.push(saved);
      this.addAuditLog(curUser, 'SUPER_ADMIN', 'Creó Usuario Admin', saved.email, `Rol: ${saved.role}`);
    } else {
      const idx = admins.findIndex(a => a.id === adminData.id);
      saved = { ...admins[idx], ...adminData };
      admins[idx] = saved;
      this.addAuditLog(curUser, 'SUPER_ADMIN', 'Editó Usuario Admin', saved.email, 'Actualizó permisos');
    }

    writeStorage(DB_KEYS.ADMINS, admins);
    return saved;
  },

  // ── CONSULTAS & FILTRADO TIENDA PÚBLICA ──
  filterProducts({
    brand = null,
    gender = null,
    category = null,
    fragranceFamily = null,
    priceMin = 0,
    priceMax = 9999999,
    featured = false,
    bestseller = false,
    newArrival = false,
    hasDiscount = false,
    sortBy = 'default',
    query = ''
  } = {}) {
    let list = this.getAllProducts().filter(p => p.status !== 'inactive');

    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        (p.fragranceFamily && p.fragranceFamily.toLowerCase().includes(q)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (brand && brand !== 'all') {
      list = list.filter(p => p.brand === brand);
    }

    if (gender && gender !== 'all') {
      list = list.filter(p => p.gender === gender || p.gender === 'unisex');
    }

    if (category && category !== 'all') {
      if (category === 'ofertas') {
        list = list.filter(p => p.discount > 0);
      } else {
        list = list.filter(p => (p.category && p.category.includes(category)) || p.gender === category);
      }
    }

    if (fragranceFamily && fragranceFamily !== 'all') {
      list = list.filter(p => p.fragranceFamily === fragranceFamily);
    }

    if (priceMin > 0) list = list.filter(p => p.price >= priceMin);
    if (priceMax < 9999999) list = list.filter(p => p.price <= priceMax);

    if (featured) list = list.filter(p => p.featured);
    if (bestseller) list = list.filter(p => p.bestseller);
    if (newArrival) list = list.filter(p => p.newArrival);
    if (hasDiscount) list = list.filter(p => p.discount > 0);

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'bestseller':
        list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        break;
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  },

  getProductsByBrand(brandSlug) {
    if (!brandSlug) return [];
    return this.getAllProducts().filter(p => p.brand.toLowerCase() === brandSlug.toLowerCase() && p.status !== 'inactive');
  },

  getProductsByCategory(catSlug) {
    if (!catSlug) return [];
    if (catSlug === 'ofertas') return this.getAllProducts().filter(p => p.discount > 0 && p.status !== 'inactive');
    return this.getAllProducts().filter(p => ((p.category && p.category.includes(catSlug)) || p.gender === catSlug) && p.status !== 'inactive');
  },

  getBrandsByCategory(catType) {
    return this.getAllBrands().filter(b => b.category === catType && b.status !== 'inactive');
  },

  getRelatedProducts(product, limit = 4) {
    if (!product) return [];
    return this.getAllProducts()
      .filter(p => p.id !== product.id && p.status !== 'inactive' && (
        p.brand === product.brand ||
        p.fragranceFamily === product.fragranceFamily ||
        (p.category && p.category.some(c => product.category && product.category.includes(c)))
      ))
      .slice(0, limit);
  },

  searchProducts(query) {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    return this.getAllProducts().filter(p =>
      p.status !== 'inactive' && (
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        (p.fragranceFamily && p.fragranceFamily.toLowerCase().includes(q)) ||
        (p.type && p.type.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      )
    ).slice(0, 8);
  },

  // ── HELPERS DE PRECIOS & FINANCIACIÓN ──
  formatPrice(amount) {
    if (typeof amount !== 'number') return '$0';
    return `$${amount.toLocaleString('es-AR')}`;
  },

  getInstallmentText(price) {
    if (!price) return '';
    const settings = this.getSettings();
    const count = settings.installmentsCount || 3;
    const part = Math.round(price / count);
    return `${count} cuotas sin interés de $${part.toLocaleString('es-AR')}`;
  },

  getTransferPrice(price) {
    if (!price) return 0;
    const settings = this.getSettings();
    const pct = settings.transferDiscountPercent || 10;
    return Math.round(price * (1 - pct / 100));
  },

  getWhatsAppLink(customMsg = null, productName = null) {
    const settings = this.getSettings();
    let msg = customMsg;
    if (!msg && productName) {
      msg = `Hola Bunker Imports! Quiero consultar por el perfume *${productName}*. ¿Está disponible para entrega inmediata?`;
    } else if (!msg) {
      msg = settings.whatsapp.defaultMessage;
    }
    return `https://wa.me/${settings.whatsapp.number}?text=${encodeURIComponent(msg)}`;
  },

  getCheckoutWhatsAppLink(orderData) {
    const settings = this.getSettings();
    const itemsText = orderData.items.map(i => `• ${i.name} (${i.size || '100ml'}) x${i.qty} - $${(i.price * i.qty).toLocaleString('es-AR')}`).join('\n');
    const msg = `*NUEVO PEDIDO — BUNKER IMPORTS*\n\n` +
      `*Nº de Orden:* #${orderData.orderId || 'WEB'}\n` +
      `*Cliente:* ${orderData.name}\n` +
      `*Teléfono:* ${orderData.phone}\n` +
      `*Email:* ${orderData.email}\n` +
      `*Entrega:* ${orderData.shippingMethod} (${orderData.address || 'CABA'})\n` +
      `*Medio de Pago:* ${orderData.paymentMethod}\n\n` +
      `*Productos:*\n${itemsText}\n\n` +
      `*Subtotal:* $${orderData.subtotal.toLocaleString('es-AR')}\n` +
      (orderData.discount > 0 ? `*Descuento Aplicado:* -$${orderData.discount.toLocaleString('es-AR')}\n` : '') +
      `*Envío:* ${orderData.shippingCost === 0 ? '¡GRATIS!' : '$' + orderData.shippingCost.toLocaleString('es-AR')}\n` +
      `*TOTAL:* *$${orderData.total.toLocaleString('es-AR')}*\n\n` +
      `Por favor indíquenme los pasos para abonar y coordinar el despacho. ¡Muchas gracias!`;
    return `https://wa.me/${settings.whatsapp.number}?text=${encodeURIComponent(msg)}`;
  }
};

// ─── FINDER LOGIC (RECOMENDADOR DE FRAGANCIAS) ─────────────────
const FINDER_LOGIC = {
  recommend({ gender, style, occasion, preference }) {
    let results = DataStore.getActiveProducts();

    if (gender && gender !== 'unisex') {
      results = results.filter(p => p.gender === gender || p.gender === 'unisex');
    }

    const styleToFamily = {
      dulce: 'Gourmand Dulce',
      fresco: 'Fresco Cítrico',
      intenso: 'Amaderado Oriental',
      elegante: 'Aromático Fougère',
      seductor: 'Oriental Especiado',
      versatil: null
    };

    const targetFamily = styleToFamily[style];
    if (targetFamily) {
      const matched = results.filter(p => p.fragranceFamily === targetFamily);
      const others = results.filter(p => p.fragranceFamily !== targetFamily);
      results = [...matched, ...others];
    }

    if (preference && preference !== 'me-da-igual') {
      const catMap = { arabe: 'arabes', disenador: 'disenador' };
      const cat = catMap[preference];
      if (cat) {
        const pref = results.filter(p => p.category && p.category.includes(cat));
        if (pref.length > 0) results = pref;
      }
    }

    return results.slice(0, 4);
  }
};

// ─── SERVICIO DE AUTENTICACIÓN ADMIN ─────────────────────────
const AuthService = {
  SESSION_KEY: 'bunker_admin_session',

  async hashPassword(plainText) {
    if (window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(plainText);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback simple si no hay crypto.subtle
    return 'f3c971b2a1971117ca81b565ef1600513ea5764752a6be2eb0f4d12ae289e414';
  },

  async login(email, password) {
    // 1. Intentar autenticación real contra el Backend Node.js / MongoDB
    if (typeof window !== 'undefined' && window.BunkerAPI && window.BunkerAPI.auth) {
      try {
        const result = await window.BunkerAPI.auth.login(email, password);
        if (result && result.user) {
          const session = {
            token: result.token,
            user: {
              id: result.user._id || result.user.id,
              name: `${result.user.name} ${result.user.lastName || ''}`.trim(),
              email: result.user.email,
              role: result.user.role
            },
            loginTime: new Date().toISOString(),
            expiresAt: Date.now() + (8 * 60 * 60 * 1000)
          };

          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
          DataStore.addAuditLog(session.user.name, session.user.role, 'Inicio de Sesión (JWT)', 'Panel Admin', 'Autenticación exitosa en MongoDB');
          return { success: true, user: session.user };
        }
      } catch (backendErr) {
        console.warn('[AuthService] Backend login falló o no disponible:', backendErr.message);
      }
    }

    // 2. Fallback local si el backend no responde
    const admins = DataStore.getAllAdmins();
    const hash = await this.hashPassword(password);
    const admin = admins.find(a => a.email.toLowerCase() === email.toLowerCase().trim() && a.status === 'active');

    if (!admin) {
      DataStore.addAuditLog(email, 'GUEST', 'Intento de Login Fallido', 'Admin Login', 'Usuario no encontrado');
      return { success: false, error: 'Credenciales inválidas. Comprobá tu usuario y contraseña.' };
    }

    if (admin.passwordHash !== hash) {
      DataStore.addAuditLog(email, 'GUEST', 'Intento de Login Fallido', 'Admin Login', 'Contraseña incorrecta');
      return { success: false, error: 'Contraseña incorrecta. Por favor reintentá.' };
    }

    const session = {
      token: 'tok-' + Date.now() + '-' + Math.random().toString(36).substring(2),
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      loginTime: new Date().toISOString(),
      expiresAt: Date.now() + (8 * 60 * 60 * 1000)
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    admin.lastLogin = new Date().toISOString();
    DataStore.saveAdmin(admin, admin.name);
    DataStore.addAuditLog(admin.name, admin.role, 'Inicio de Sesión', 'Panel Admin', 'Autenticación exitosa');

    return { success: true, user: session.user };
  },

  logout() {
    const user = this.getCurrentUser();
    if (user) {
      DataStore.addAuditLog(user.name, user.role, 'Cierre de Sesión', 'Panel Admin', 'Sesión cerrada por el usuario');
    }
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'login.html';
  },

  getSession() {
    try {
      const s = sessionStorage.getItem(this.SESSION_KEY) || localStorage.getItem(this.SESSION_KEY);
      if (!s) return null;
      const session = JSON.parse(s);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  getCurrentUser() {
    const s = this.getSession();
    return s ? s.user : null;
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  requireAuth(allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR']) {
    const user = this.getCurrentUser();
    if (!user) {
      const isInsideAdmin = window.location.pathname.includes('/admin/');
      const loginUrl = isInsideAdmin ? 'login.html' : 'admin/login.html';
      window.location.href = loginUrl;
      return false;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      alert('Acceso no autorizado para tu nivel de permisos.');
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }
};

// ─── RESOLUCIÓN UNIVERSAL DE RUTAS ────────────────────────────
function getAssetPath(filename) {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('data:')) {
    return filename;
  }
  const cleanName = filename.replace(/^(\.\.\/)+/, '').replace(/^src\//, '').replace(/^images\//, '');
  const path = window.location.pathname;

  if (path.includes('/admin/')) {
    return `../src/images/${cleanName}`;
  } else if (path.includes('/pages/')) {
    return `../images/${cleanName}`;
  }
  return `src/images/${cleanName}`;
}

function getPagePath(pageName) {
  const path = window.location.pathname;
  const isInsideAdmin = path.includes('/admin/');
  const isInsidePages = path.includes('/pages/');

  if (isInsideAdmin) {
    if (pageName === 'index.html') return '../index.html';
    return pageName.startsWith('admin') ? pageName : `../src/pages/${pageName}`;
  }

  if (isInsidePages) {
    if (pageName === 'index.html') return '../../index.html';
    return pageName;
  }

  return `src/pages/${pageName}`;
}

// Exponer en window
window.BunkerData = {
  DB_KEYS,
  CONFIG: DataStore.getSettings(),
  BRANDS: DataStore.getAllBrands(),
  CATEGORIES: DataStore.getAllCategories(),
  PRODUCTS: DataStore.getAllProducts(),
  FRAGRANCE_FAMILIES,
  DataStore,
  FINDER_LOGIC,
  AuthService,
  getAssetPath,
  getPagePath
};
