# BUNKER IMPORTS — Backend & Plataforma Full Stack
## Perfumería Árabe y de Diseñador 100% Originales

Plataforma web Full Stack para **BUNKER IMPORTS**, tienda online argentina especializada en fragancias árabes (Lattafa, Armaf, Afnan, Rasasi) y de diseñador (Giorgio Armani, Valentino, Victoria's Secret).

El proyecto integra una arquitectura Backend en Node.js, Express y MongoDB (Mongoose) con el frontend comercial y panel administrativo preexistentes, cumpliendo los requisitos técnicos de las seis pre-entregas del curso de Programación Backend.

---

## 📑 Tabla de Contenidos

1. [Tecnologías Utilizadas](#-tecnolog%C3%ADas-utilizadas)
2. [Arquitectura por Capas](#-arquitectura-por-capas)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Requisitos e Instalación](#-requisitos-e-instalaci%C3%B3n)
5. [Variables de Entorno](#-variables-de-entorno)
6. [Comandos de Ejecución](#-comandos-de-ejecuci%C3%B3n)
7. [Documentación de los 6 Módulos](#-documentaci%C3%B3n-de-los-6-m%C3%B3dulos)
   - [Módulo 1: Arquitectura por Capas y Entorno](#m%C3%B3dulo-1-arquitectura-por-capas-y-configuraci%C3%B3n-de-entorno)
   - [Módulo 2: Mocking y Carga de Datos Sintéticos](#m%C3%B3dulo-2-mocking-y-carga-de-datos-de-prueba)
   - [Módulo 3: Manejo Profesional y Centralizado de Errores](#m%C3%B3dulo-3-manejo-profesional-de-errores)
   - [Módulo 4: Logging y Monitoreo con Winston](#m%C3%B3dulo-4-logging-y-monitoreo-con-winston)
   - [Módulo 5: Documentación de API con Swagger / OpenAPI](#m%C3%B3dulo-5-documentaci%C3%B3n-con-swagger--openapi)
   - [Módulo 6: Tests Funcionales con Mocha, Chai y Supertest](#m%C3%B3dulo-6-testing-funcional-automatizado)
8. [Integración Frontend y Panel de Administración](#-integraci%C3%B3n-frontend-y-panel-administrativo)
9. [Credenciales Administrativas de Prueba](#-credenciales-administrativas-de-prueba)

---

## 🛠 Tecnologías Utilizadas

- **Entorno de Ejecución:** Node.js (v18+)
- **Framework Web:** Express 5
- **Base de Datos:** MongoDB & Mongoose ODM
- **Base de Datos en Memoria (Testing & Dev):** `mongodb-memory-server`
- **Autenticación & Seguridad:** JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `cors`, `express-rate-limit`
- **Documentación OpenAPI:** `swagger-ui-express`, `swagger-jsdoc`
- **Generación de Datos Ficticios:** `@faker-js/faker`
- **Sistema de Logs:** `winston`, `winston-daily-rotate-file`
- **Testing Automatizado:** `mocha`, `chai`, `supertest`, `cross-env`

---

## 🏛 Arquitectura por Capas

El backend implementa una arquitectura desacoplada y estricta en 5 capas:

```text
CLIENTE (Tienda Pública / Panel Admin / Postman / Swagger)
   │
   ▼
[ROUTES]            → Enrutamiento Express, middlewares de auth y validación inicial
   │
   ▼
[CONTROLLERS]       → Recibe req/res, extrae datos y delega al servicio (sin tocar Mongoose)
   │
   ▼
[SERVICES]          → Reglas de negocio (cálculo de totales, stock, validaciones, JWT)
   │
   ▼
[REPOSITORIES]      → Único acceso a la base de datos (queries, filtros, proyecciones Mongoose)
   │
   ▼
[MODELS / MONGOOSE] → Esquemas, tipos, validadores y ganchos pre-save
   │
   ▼
[MONGODB]
```

### ¿Por qué se separa Service de Repository?
- **Responsabilidad Única:** El **Service** contiene las políticas comerciales de Bunker Imports (ej. aplicar 10% de descuento por transferencia, validar stock disponible antes de vender, coordinar la creación de una entrega logística cuando un pedido requiere envío).
- **Abstracción de Datos:** El **Repository** se encarga exclusivamente de cómo se leen y escriben los datos en MongoDB (usando `populate`, proyecciones que excluyen campos sensibles como `costPrice` en clientes, filtros de paginación o búsqueda).
- **Mantenibilidad:** Si en el futuro se reemplaza la base de datos o se agregan cachés en Redis, los servicios y la lógica de negocio permanecen inalterados.

---

## 📂 Estructura del Proyecto

```text
BUNKER IMPORTS/
├── admin/                      # Panel de administración web (HTML, CSS, JS)
│   ├── index.html              # Dashboard analítico
│   ├── productos.html          # Gestión de catálogo y stock
│   ├── pedidos.html            # Gestión de órdenes y estados
│   ├── inventario.html         # Movimientos de stock
│   ├── login.html              # Login administrativo
│   └── js/admin-core.js        # Script compartido del panel
├── src/                        # Tienda online pública
│   ├── css/styles.css          # Estilos premium (negro, dorado, violeta)
│   ├── images/                 # Fotografías y banners de fragancias
│   ├── js/
│   │   ├── api.js              # Adaptador HTTP cliente (BunkerAPI)
│   │   ├── data.js             # DataStore unificado e inicializadores
│   │   └── app.js              # Carrito, modales, checkout y vistas
│   └── pages/                  # Catálogo, carrito, checkout, login
├── src-backend/                # Servidor Backend Node.js
│   ├── config/
│   │   ├── env.config.js       # Variables de entorno validadas
│   │   ├── database.js         # Conexión Mongoose con fallback a memoria
│   │   └── swagger.js          # Especificación OpenAPI 3.0
│   ├── constants/              # Constantes congeladas (Object.freeze)
│   │   └── index.js            # Roles, estados, métodos de pago y envío
│   ├── errors/
│   │   ├── CustomError.js      # Clase unificada de error
│   │   └── error.dictionary.js # Diccionario centralizado de códigos y estados
│   ├── logger/
│   │   └── logger.js           # Logger Winston con 6 niveles y rotación
│   ├── middlewares/
│   │   ├── auth.middleware.js  # Verificación JWT y roles (ADMIN, EDITOR, COURIER)
│   │   ├── error.middleware.js # Manejador global uniforme de errores
│   │   └── not-found.middleware.js # Respuesta 404 estructurada
│   ├── models/
│   │   ├── user.model.js       # Esquema de usuarios con bcryptjs
│   │   ├── product.model.js    # Esquema de perfumes (costPrice oculto)
│   │   ├── order.model.js      # Esquema de pedidos con snapshot histórico
│   │   └── delivery.model.js   # Esquema de logística y despachos
│   ├── repositories/           # Capa de persistencia Mongoose
│   ├── services/               # Lógica de negocio y reglas comerciales
│   ├── controllers/            # Controladores HTTP desacoplados
│   ├── routes/                 # Rutas REST agrupadas
│   ├── scripts/                # Scripts de seed y creación de administradores
│   └── app.js                  # Instancia Express (desacoplada del puerto)
├── tests/                      # Suite de tests funcionales automatizados
│   ├── setup.js                # Setup con MongoMemoryServer y limpieza
│   ├── users.test.js           # Tests de autenticación y usuarios
│   ├── products.test.js        # Tests de catálogo y privacidad de costos
│   ├── orders.test.js          # Tests de pedidos, stock y descuentos
│   ├── deliveries.test.js      # Tests de logística y repartidores
│   ├── mocks.test.js           # Tests de generación sintética y seed
│   ├── logger.test.js          # Tests de diagnóstico de logs
│   └── swagger.test.js         # Tests de documentación OpenAPI
├── server.js                   # Punto de entrada HTTP y arranque del servidor
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Requisitos e Instalación

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd "BUNKER IMPORTS"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copiar el archivo de plantilla `.env.example` creando `.env`:
```bash
cp .env.example .env
```

---

## ⚙️ Variables de Entorno

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `PORT` | Puerto de escucha del servidor HTTP | `5000` |
| `NODE_ENV` | Entorno de ejecución (`development`, `production`, `test`) | `development` |
| `MONGODB_URI` | Cadena de conexión principal a MongoDB | `mongodb://127.0.0.1:27017/bunker_imports` |
| `MONGODB_TEST_URI` | Cadena de conexión para testing (si no se usa en memoria) | `mongodb://127.0.0.1:27017/bunker_imports_test` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | *Cadena segura obligatoria* |
| `JWT_EXPIRES_IN` | Tiempo de expiración de sesión | `8h` |
| `TRANSFER_DISCOUNT_PERCENT`| Porcentaje de descuento por pago con transferencia | `10` |
| `FREE_SHIPPING_THRESHOLD` | Monto mínimo en ARS para envío gratuito | `80000` |
| `ADMIN_INITIAL_EMAIL` | Email del usuario administrador inicial | `admin@bunkerimports.com` |
| `ADMIN_INITIAL_PASSWORD` | Contraseña del usuario administrador inicial | `Admin123!` |

> **Nota:** En caso de que no tengas MongoDB instalado localmente, el servidor detecta el entorno de desarrollo e inicia automáticamente una instancia de base de datos integrada en memoria, permitiéndote probar la aplicación inmediatamente sin bloqueos.

---

## 💻 Comandos de Ejecución

### Iniciar en modo desarrollo
```bash
npm run dev
```

### Iniciar en producción
```bash
npm start
```

### Ejecutar tests automatizados
```bash
npm test
```

### Ejecutar tests en modo observador (watch)
```bash
npm run test:watch
```

### Poblar la base de datos con el catálogo original de Bunker Imports
```bash
npm run seed
```

### Crear o restablecer el usuario administrador y repartidor inicial
```bash
npm run seed:admin
```

---

## 📦 Documentación de los 6 Módulos

### Módulo 1: Arquitectura por Capas y Configuración de Entorno
- **Configuración centralizada (`src-backend/config/env.config.js`):** Valida al arranque la presencia de variables obligatorias (`PORT`, `MONGODB_URI`, `NODE_ENV`, `JWT_SECRET`), abortando con mensaje claro si falta alguna. Ningún módulo externo accede directamente a `process.env`.
- **Constantes congeladas (`src-backend/constants/index.js`):** Uso de `Object.freeze()` para roles (`ADMIN`, `USER`, `EDITOR`, `COURIER`), estados de pedidos, entregas, métodos de pago y envío.
- **Seguridad en Modelos:** La contraseña se hashea con `bcryptjs` en el hook `pre('save')` y se excluye de las consultas (`select: false`). El precio de costo (`costPrice`) está protegido y nunca se devuelve en rutas públicas.

### Módulo 2: Mocking y Carga de Datos de Prueba
- **Ruta base:** `/api/mocks`
- **Herramienta:** `@faker-js/faker`
- **Endpoints de generación en memoria (sin persistir):**
  - `GET /api/mocks/users?qty=5`
  - `GET /api/mocks/couriers?qty=5`
  - `GET /api/mocks/orders?qty=5`
  - `GET /api/mocks/deliveries?qty=5`
- **Endpoint de inserción en base de datos:**
  - `POST /api/mocks/seed`: Admite en el cuerpo JSON `{ "users": 5, "couriers": 2, "orders": 5, "deliveries": 3 }`. Mantiene relaciones consistentes entre entidades reales y está deshabilitado en producción por seguridad.
- **Validaciones:** Cantidad obligatoria entre 1 y 100, rechazo de valores negativos, cero o strings no numéricos con código `INVALID_MOCK_QUANTITY`.

### Módulo 3: Manejo Profesional de Errores
- **Diccionario (`src-backend/errors/error.dictionary.js`):** Centraliza códigos internos, mensajes en español y status HTTP (400, 401, 403, 404, 409, 500).
- **Clase `CustomError` (`src-backend/errors/CustomError.js`):** Permite lanzar errores con `throw new CustomError('PRODUCT_NOT_FOUND')`.
- **Middleware Global (`src-backend/middlewares/error.middleware.js`):** Captura todas las excepciones y responde con formato JSON uniforme:
```json
{
  "status": "error",
  "code": "INSUFFICIENT_STOCK",
  "message": "No hay stock suficiente para uno o más productos del pedido."
}
```
- Transforma automáticamente errores de Mongoose (`ValidationError`, `CastError`, duplicados de índice 11000) y oculta el stack trace en producción.

### Módulo 4: Logging y Monitoreo con Winston
- **Configuración (`src-backend/logger/logger.js`):** Implementa 6 niveles jerárquicos: `debug`, `http`, `info`, `warning`, `error`, `fatal`.
- **Diferenciación por entorno:** En desarrollo muestra formato colorido en consola con timestamps. En producción reduce volumen y registra en archivos.
- **Persistencia y rotación:**
  - `logs/error-YYYY-MM-DD.log`: Solamente errores (`error`, `fatal`).
  - `logs/combined-YYYY-MM-DD.log`: Historial general.
  - Rotación diaria con límite de tamaño de 20MB y retención de 14 días.
- **Endpoint de diagnóstico:** `GET /api/logger/test` emite un registro de prueba en cada uno de los 6 niveles para verificar el funcionamiento del logger.

### Módulo 5: Documentación con Swagger / OpenAPI
- **Ruta de acceso:** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Especificación OpenAPI 3.0:** Describe esquemas reutilizables (`User`, `Product`, `Order`, `OrderItem`, `Delivery`, `SuccessResponse`, `ErrorResponse`).
- **Autenticación en Swagger:** Configuración con Bearer JWT (`BearerAuth`) que permite autorizar peticiones directamente desde la interfaz web de Swagger con el botón **Authorize**.
- **Tags organizados:** Users, Products, Orders, Deliveries, Mocks, Logger.

### Módulo 6: Testing Funcional Automatizado
- **Frameworks:** Mocha, Chai (v4) y Supertest.
- **Aislamiento Total:** Utiliza `mongodb-memory-server` levantando una base de datos efímera en memoria. Cada test limpia las colecciones en el hook `afterEach()`.
- **Cobertura:** 41 tests funcionales automáticos cubriendo casos de éxito, validaciones y rechazos de permisos.
- **Idempotencia:** La suite se puede ejecutar consecutivamente tantas veces como se desee sin requerir limpieza manual.

---

## 🌐 Integración Frontend y Panel Administrativo

Se creó la capa cliente `src/js/api.js` (`window.BunkerAPI`), la cual:
1. **Sincroniza el Catálogo:** Al cargar cualquier página, consulta `GET /api/products` desde MongoDB y actualiza reactivamente el `DataStore` local.
2. **Autenticación Real:** El panel administrativo (`admin/login.html`) y el login de clientes (`src/pages/login.html`) se comunican con `/api/users/login`, almacenando el token JWT recibido. Se eliminaron contraseñas en texto plano hardcodeadas.
3. **Persistencia de Checkout:** Cuando un cliente finaliza una compra, el pedido se valida en el servidor (descontando stock y aplicando el 10% de descuento bancario) y se guarda directamente en la colección `orders` de MongoDB.

---

## 🔑 Credenciales Administrativas de Prueba

Para acceder al Panel Administrativo tras ejecutar `npm run seed`:

- **URL:** [http://localhost:5000/admin/login.html](http://localhost:5000/admin/login.html)
- **Email:** `admin@bunkerimports.com`
- **Contraseña:** `Admin123!`
- **Rol:** `ADMIN`

Usuario Repartidor de prueba:
- **Email:** `courier@bunkerimports.com`
- **Contraseña:** `Courier123!`
- **Rol:** `COURIER`
