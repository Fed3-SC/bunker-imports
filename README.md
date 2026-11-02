# BUNKER IMPORTS — Plataforma E-Commerce & Backend API
> Tienda online argentina especializada en perfumería árabe y fragancias de diseñador 100% originales.

---

## 1. Presentación de Bunker Imports

**Bunker Imports** es un emprendimiento comercial dedicado a la importación y comercialización de fragancias exclusivas en Argentina. Su catálogo se enfoca fuertemente en perfumería árabe de alta gama (marcas líderes como Lattafa, Armaf, Afnan, Rasasi) combinada con clásicos consagrados de diseñador internacional (Giorgio Armani, Valentino, Victoria's Secret, entre otros).

El proyecto nació para responder a la necesidad de contar con una plataforma web completa, confiable y moderna que permita exhibir productos, gestionar inventarios con precisión de stock, procesar pedidos en línea con validaciones del lado del servidor y brindar una experiencia de compra fluida tanto a los clientes finales como al equipo de administración y logística.

---

## 2. Descripción del Proyecto

Este repositorio contiene la plataforma Full Stack completa de **Bunker Imports**, combinando:

1. **Backend REST API:** Desarrollado con Node.js, Express 5 y MongoDB a través de Mongoose ODM, estructurado bajo una arquitectura por capas desacoplada y escalable.
2. **Frontend Comercial:** Sitio web responsivo orientado al consumidor final con catálogo filtrable por familias olfativas y marcas, detalle de productos, pirámide olfativa, carrito interactivo y proceso de checkout integrado.
3. **Panel Administrativo:** Interfaz privada para la gestión del catálogo, control de stock e inventario, administración de pedidos, estados de entrega y asignación de repartidores.

El backend resuelve toda la lógica de negocio crítica: autenticación segura con JWT y roles, validación de stock y cálculos de precios exclusivamente en servidor, manejo centralizado de excepciones mediante diccionario de errores, logging estructurado con rotación diaria de archivos, generación de datos sintéticos con mocks y una suite completa de pruebas funcionales automatizadas.

---

## 3. Tecnologías Utilizadas

- **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (versión 18 o superior).
- **Framework Web:** [Express.js](https://expressjs.com/) (v5.x).
- **Base de Datos Principal:** [MongoDB](https://www.mongodb.com/) con [Mongoose ODM](https://mongoosejs.com/) (v9.x).
- **Base de Datos en Memoria:** `mongodb-memory-server` (utilizada para tests automatizados y como fallback transparente en desarrollo local).
- **Autenticación y Criptografía:** `jsonwebtoken` (JWT), `bcryptjs` para hashing de contraseñas.
- **Seguridad HTTP:** `helmet`, `cors`, `express-rate-limit`.
- **Documentación de API:** `swagger-ui-express` y `swagger-jsdoc` (OpenAPI 3.0).
- **Generación de Mocks:** `@faker-js/faker` para datos de prueba realistas.
- **Sistema de Logging:** `winston` y `winston-daily-rotate-file`.
- **Testing Automatizado:** `mocha`, `chai` (v4), `supertest` y `cross-env`.
- **Frontend:** HTML5 semántico, CSS3 con variables personalizadas y JavaScript modular nativo.

---

## 4. Requisitos para Instalarlo

Para clonar y ejecutar el proyecto en tu máquina local necesitás:

- **Node.js:** v18.0.0 o superior (recomendado Node.js 20 LTS o 22 LTS).
- **npm:** v9.0.0 o superior (incluido habitualmente con Node.js).
- **Git:** Instalado en el sistema para clonar el repositorio.
- **MongoDB (Opcional en desarrollo):** Podés utilizar un servidor local de MongoDB (`mongodb://localhost:27017`) o un clúster en la nube (MongoDB Atlas). Si no contás con MongoDB instalado localmente, el servidor detecta automáticamente el entorno de desarrollo y levanta una base de datos integrada en memoria, permitiéndote ejecutar el proyecto de inmediato.

---

## 5. Instrucciones de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Fed3-SC/bunker-imports.git
   cd bunker-imports
   ```

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Crear el archivo de configuración `.env`:**
   Copiá la plantilla de ejemplo `.env.example` en un nuevo archivo llamado `.env`:
   ```bash
   # En Windows PowerShell:
   Copy-Item .env.example .env

   # En Linux / macOS / Git Bash:
   cp .env.example .env
   ```

4. **Poblar la base de datos inicial con catálogo y usuarios:**
   ```bash
   npm run seed
   ```
   *Este comando inserta el catálogo original de perfumes de Bunker Imports, crea el usuario administrador inicial y un repartidor de prueba.*

---

## 6. Configuración del Archivo `.env`

El archivo `.env` permite definir las credenciales y configuraciones del entorno local sin exponer datos sensibles. Abrí el archivo `.env` recién creado y ajustá las variables según tu configuración:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/bunker_imports
MONGODB_TEST_URI=mongodb://127.0.0.1:27017/bunker_imports_test
JWT_SECRET=tu_clave_secreta_jwt_de_al_menos_32_caracteres_aleatorios
JWT_EXPIRES_IN=8h
TRANSFER_DISCOUNT_PERCENT=10
FREE_SHIPPING_THRESHOLD=80000
ADMIN_INITIAL_NAME=Admin Bunker
ADMIN_INITIAL_EMAIL=admin@bunkerimports.com
ADMIN_INITIAL_PASSWORD=Admin123!
```

---

## 7. Variables de Entorno Necesarias

A continuación se detalla el propósito de cada variable requerida por el backend:

| Variable | Tipo | Obligatoria | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Numérico | Sí | `3000` / `5000` | Puerto en el que escuchará el servidor HTTP. |
| `NODE_ENV` | String | Sí | `development` | Entorno de ejecución: `development`, `production` o `test`. |
| `MONGODB_URI` | String (URI) | Sí | — | Cadena de conexión a la base de datos MongoDB principal. |
| `MONGODB_TEST_URI` | String (URI) | No | `.../bunker_imports_test` | Cadena de conexión para la base de datos aislada de pruebas. |
| `JWT_SECRET` | String | Sí | — | Clave secreta criptográfica utilizada para firmar y verificar tokens JWT. |
| `JWT_EXPIRES_IN` | String | No | `8h` | Período de vigencia de las sesiones emitidas (ej: `8h`, `1d`, `7d`). |
| `TRANSFER_DISCOUNT_PERCENT` | Numérico | No | `10` | Porcentaje de descuento aplicado automáticamente en checkout por transferencia bancaria. |
| `FREE_SHIPPING_THRESHOLD` | Numérico | No | `80000` | Monto mínimo en ARS del subtotal a partir del cual el costo de envío es bonificado ($0). |
| `ADMIN_INITIAL_NAME` | String | No | `Admin Bunker` | Nombre visible del administrador creado durante la inicialización (`seed`). |
| `ADMIN_INITIAL_EMAIL` | String | No | `admin@bunkerimports.com` | Correo electrónico de acceso del administrador inicial. |
| `ADMIN_INITIAL_PASSWORD` | String | No | `Admin123!` | Contraseña inicial para el login del administrador. |

---

## 8. Cómo Iniciar el Servidor

El archivo `package.json` incluye scripts predefinidos para iniciar la aplicación:

### Modo Desarrollo (con reinicio automático al guardar cambios):
```bash
npm run dev
```

### Modo Producción:
```bash
npm start
```

### Acceso a las interfaces:
Una vez que el servidor esté activo, abrí tu navegador en:
- **Tienda Pública (Catálogo y Compra):** [http://localhost:5000/index.html](http://localhost:5000/index.html)
- **Panel Administrativo:** [http://localhost:5000/admin/index.html](http://localhost:5000/admin/index.html)
- **Login Administrativo:** [http://localhost:5000/admin/login.html](http://localhost:5000/admin/login.html)
- **Documentación Swagger / OpenAPI:** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Health Check de la API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 9. Arquitectura General

El backend implementa un patrón estricto de **Arquitectura en 5 Capas**, garantizando una clara separación de responsabilidades y facilitando el mantenimiento y testing:

```text
                     ┌────────────────────────────────────────┐
                     │ CLIENTE (Web / Admin / Swagger / Postman)│
                     └───────────────────┬────────────────────┘
                                         │  HTTP / JSON
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 1. RUTAS (Routes)                                                                │
│    - Define endpoints HTTP y métodos (GET, POST, PUT, PATCH, DELETE).            │
│    - Aplica middlewares: autenticación JWT, control de roles y rate limit.       │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 2. CONTROLADORES (Controllers)                                                   │
│    - Extrae parámetros de la petición (req.body, req.params, req.query).         │
│    - Delega el trabajo a la capa de servicios.                                   │
│    - Envía la respuesta HTTP estandarizada (sin tocar la base de datos).        │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 3. SERVICIOS (Services)                                                          │
│    - Contiene toda la lógica de negocio y validaciones comerciales.             │
│    - Calcula subtotales, descuentos de transferencia y costo de envíos.          │
│    - Verifica y actualiza stock de manera atómica.                              │
│    - Dispara creación de entregas asociadas a pedidos que requieren despacho.   │
│    - Emite y valida tokens JWT con expiración controlada.                        │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 4. REPOSITORIOS (Repositories)                                                   │
│    - Encapsula exclusivamente las consultas a la base de datos (queries Mongoose).│
│    - Aplica populate de referencias cruzadas (pedidos con productos y usuarios). │
│    - Maneja proyecciones para proteger campos sensibles (ej: costPrice).        │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 5. MODELOS (Models) & BASE DE DATOS (Mongoose / MongoDB)                         │
│    - Esquemas tipados con validaciones y valores por defecto.                   │
│    - Hooks pre-save (hashing de contraseñas con bcryptjs).                       │
│    - Índices únicos y optimizados (email de usuarios, códigos de pedido).        │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### ¿Por qué se separa Service de Repository?
- **Independencia de la Base de Datos:** Los servicios no saben si los datos provienen de MongoDB, de una base SQL o de una caché en memoria; solo coordinan reglas de negocio.
- **Reutilización:** Una misma consulta de repositorio puede ser aprovechada por múltiples servicios.
- **Testeabilidad:** Facilita el aislamiento en pruebas unitarias y de integración.

---

## 10. Principales Funcionalidades

### Catálogo y Tienda Online
- **Catálogo Inteligente:** Filtros dinámicos por género (masculino, femenino, unisex), concentración (EDP, EDT, Parfum), origen (árabe o diseñador) y marcas.
- **Ficha Técnica Detallada:** Presentación de volumen (ml), pirámide olfativa (notas de salida, corazón y fondo), estado de disponibilidad e imágenes optimizadas.
- **Carrito de Compras:** Cálculo en tiempo real, persistencia en almacenamiento local y sincronización reactiva contra el backend.
- **Checkout Seguro:**
  - Validación de stock en servidor antes de procesar la compra.
  - Aplicación automática del 10% de descuento al elegir pago por transferencia bancaria.
  - Bonificación de costo de envío en compras superiores al umbral configurado ($80.000 ARS).
  - Generación de código único de pedido alfanumérico (ej: `BNK-20261102-ABC1`).
  - Creación automática de la orden de entrega asociada para despacho.

### Autenticación y Autorización por Roles
- **Registro de Clientes:** Cifrado seguro de contraseñas con `bcryptjs` (salt rounds: 10). Protección contra auto-asignación de privilegios administrativos en registro público.
- **Login con JWT:** Emisión de tokens con expiración de 8 horas.
- **Control de Acceso Basado en Roles (RBAC):**
  - `USER`: Clientes estándar. Pueden ver su perfil y consultar sus propios pedidos.
  - `ADMIN`: Administradores con control total sobre productos, costos, pedidos, clientes y despachos.
  - `COURIER`: Repartidores de logística. Pueden actualizar el estado de las entregas que tienen asignadas.

### Panel Administrativo
- **Dashboard General:** Métricas en tiempo real de facturación, pedidos pendientes, total de productos y stock crítico.
- **Gestión de Productos:** Alta, baja y modificación de perfumes, precios de venta y precios de costo.
- **Control de Inventario:** Visualización de stock actual y actualización directa.
- **Gestión de Pedidos:** Listado de órdenes, filtrado por estado (`pending`, `paid`, `shipped`, `delivered`, `cancelled`) y reposición automática de stock en caso de cancelación.
- **Logística y Entregas:** Asignación de pedidos a repartidores (`COURIER`) y seguimiento de estados de despacho (`PENDING`, `IN_TRANSIT`, `DELIVERED`, `FAILED`).

---

## 11. Endpoints de la API

La API REST expone los siguientes endpoints bajo el prefijo `/api`:

### Autenticación y Usuarios (`/api/users`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Público | Registra un nuevo cliente (rol `USER`). |
| `POST` | `/api/users/login` | Público | Autentica un usuario y retorna el token JWT. |
| `GET` | `/api/users/me` | Autenticado | Devuelve los datos del perfil del usuario en sesión. |
| `GET` | `/api/users` | Solo `ADMIN` | Lista todos los usuarios registrados. |
| `GET` | `/api/users/:id` | Autenticado / `ADMIN` | Obtiene los datos de un usuario por su ID. |
| `PATCH` | `/api/users/:id/role` | Solo `ADMIN` | Modifica el rol de un usuario (`USER`, `ADMIN`, `COURIER`). |

### Catálogo de Productos (`/api/products`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Público | Lista los productos activos (oculta `costPrice`). Soporta filtros por marca, género y búsqueda. |
| `GET` | `/api/products/admin` | Solo `ADMIN` | Lista todos los productos incluyendo precios de costo y productos agotados. |
| `GET` | `/api/products/:id` | Público | Obtiene el detalle de un perfume por su ObjectId de MongoDB. |
| `GET` | `/api/products/slug/:slug` | Público | Obtiene el detalle de un perfume por su slug amigable para URLs. |
| `POST` | `/api/products` | Solo `ADMIN` | Crea un nuevo producto en el catálogo. |
| `PUT` | `/api/products/:id` | Solo `ADMIN` | Actualiza los datos completos de un producto. |
| `PATCH` | `/api/products/:id/stock` | Solo `ADMIN` | Actualiza exclusivamente el inventario de un producto. |
| `DELETE` | `/api/products/:id` | Solo `ADMIN` | Elimina un producto del catálogo. |

### Pedidos (`/api/orders`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Público / Cliente | Crea un nuevo pedido, valida y reserva stock, calcula totales y registra la entrega. |
| `GET` | `/api/orders` | Solo `ADMIN` | Lista todas las órdenes registradas en el sistema. |
| `GET` | `/api/orders/:id` | Autenticado / `ADMIN` | Obtiene el detalle de un pedido por su ID. |
| `GET` | `/api/orders/code/:code` | Público | Permite a un cliente rastrear su pedido utilizando su código alfanumérico. |
| `PATCH` | `/api/orders/:id/status` | Solo `ADMIN` | Actualiza el estado del pedido. Si se pasa a `cancelled`, repone stock automáticamente. |

### Entregas y Logística (`/api/deliveries`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/deliveries` | Solo `ADMIN` | Lista todas las órdenes de entrega y su estado de despacho. |
| `GET` | `/api/deliveries/:id` | Autenticado | Consulta el estado detallado de una entrega específica. |
| `POST` | `/api/deliveries` | Solo `ADMIN` | Crea una orden de entrega manual vinculada a un pedido existente. |
| `PATCH` | `/api/deliveries/:id/courier` | Solo `ADMIN` | Asigna un repartidor (con rol `COURIER`) a la entrega. |
| `PATCH` | `/api/deliveries/:id/status` | `ADMIN` / `COURIER` | Actualiza el estado logístico (`IN_TRANSIT`, `DELIVERED`, `FAILED`). |

### Generador de Mocks (`/api/mocks`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/mocks/users?qty=10` | Público | Genera usuarios ficticios en memoria sin persistir. |
| `GET` | `/api/mocks/couriers?qty=5` | Público | Genera repartidores simulados en memoria con rol `COURIER`. |
| `GET` | `/api/mocks/orders?qty=10` | Público | Genera órdenes de compra simuladas en memoria. |
| `GET` | `/api/mocks/deliveries?qty=5` | Público | Genera órdenes de entrega simuladas en memoria. |
| `POST` | `/api/mocks/seed` | Solo Dev / Test | Inserta registros sintéticos relacionales directamente en la base de datos. |

### Diagnóstico de Logging y Health
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Público | Health check de la API (retorna estado de conexión y uptime). |
| `GET` | `/api/logger/test` | Público | Emite registros de prueba en los 6 niveles jerárquicos de Winston. |

---

## 12. Acceso a Swagger

La API cuenta con documentación interactiva generada con **Swagger / OpenAPI 3.0**:

- **URL de la documentación:** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

### Uso de la interfaz interactiva:
1. Navegá a la URL indicada con el servidor en marcha.
2. Podés inspeccionar cada endpoint, los parámetros admitidos y los esquemas de respuesta JSON esperados.
3. **Autenticación en Swagger:**
   - Hacé una petición al endpoint `POST /api/users/login` con tus credenciales administrativas.
   - Copiá el token JWT recibido en la respuesta.
   - Hacé clic en el botón verde **Authorize** (arriba a la derecha en Swagger).
   - Pegá el token en el campo `Value` (sin necesidad de escribir "Bearer ") y hacé clic en **Authorize**.
   - A partir de ese momento, podrás ejecutar peticiones protegidas directamente desde Swagger.

---

## 13. Sistema de Mocks

El módulo de mocks utiliza la librería `@faker-js/faker` y permite generar grandes volúmenes de datos sintéticos realistas con nombres hispanos, direcciones locales, teléfonos y montos consistentes:

- **Generación en Memoria (Lectura inmediata):**
  - Permite evaluar el formato de respuesta sin escribir en la base de datos ni alterar datos reales.
  - Parámetro de consulta `qty` configurable (mínimo: 1, máximo: 100).
  - Validación de cantidad: si se pasa un número negativo, cero o un texto no numérico, el sistema responde con error `400 INVALID_MOCK_QUANTITY`.
- **Carga de Datos de Prueba en Base de Datos (`POST /api/mocks/seed`):**
  - Permite poblar masivamente la base con usuarios, couriers, pedidos y entregas vinculadas.
  - Por seguridad, este endpoint está bloqueado automáticamente en entornos de producción (`NODE_ENV=production`).

---

## 14. Sistema de Logging

El logging de la aplicación está implementado con **Winston** y sigue buenas prácticas de observabilidad:

### Niveles de Registro Personalizados:
Implementa 6 niveles jerárquicos ordenados por severidad:
1. `fatal` (0) — Errores críticos que impiden la continuidad del servicio.
2. `error` (1) — Errores de ejecución en peticiones o servicios.
3. `warning` (2) — Advertencias operativas (ej: stock bajo, desconexiones recuperadas).
4. `info` (3) — Información de ciclo de vida (inicio del servidor, conexión a BD).
5. `http` (4) — Registro de peticiones entrantes.
6. `debug` (5) — Información detallada para depuración en desarrollo.

### Comportamiento según Entorno:
- **Desarrollo (`development`):** Muestra mensajes coloreados por consola con marcas de tiempo legibles y nivel `debug` habilitado. Además, escribe en archivos locales.
- **Testing (`test`):** Consola silenciada para no ensuciar la salida de los tests de Mocha.
- **Producción (`production`):** Registra eventos desde nivel `info` en adelante, con salida estructurada en formato JSON para herramientas de monitoreo.

### Rotación Diaria de Archivos (`logs/`):
- `logs/error-YYYY-MM-DD.log`: Almacena exclusivamente advertencias y errores (`warning`, `error`, `fatal`), con rotación diaria y retención de 14 días.
- `logs/combined-YYYY-MM-DD.log`: Almacena el historial completo de eventos, con tamaño máximo de 20 MB por archivo y retención de 7 días.

---

## 15. Cómo Ejecutar los Tests

El proyecto cuenta con una suite completa de **41 tests funcionales automatizados** desarrollados con **Mocha**, **Chai** y **Supertest**:

### Ejecución de los tests:
```bash
npm test
```

### Ejecución en modo observador (re-ejecuta al modificar archivos de test):
```bash
npm run test:watch
```

### Características de la suite:
- **Aislamiento Total con Base en Memoria:** Los tests utilizan `mongodb-memory-server`. No tocan la base de datos de desarrollo ni requieren tener un servidor de MongoDB encendido.
- **Limpieza Automática:** Tras cada prueba individual (`afterEach`), se limpian las colecciones de prueba para asegurar independencia total entre casos.
- **Idempotencia:** La suite se puede ejecutar consecutivamente tantas veces como se desee con resultados 100% predecibles y sin efectos colaterales.
- **Cobertura de la Suite:**
  - `tests/users.test.js`: Registro de clientes, prevención de duplicados, hashing de contraseñas, login con JWT, validación de credenciales inválidas, consulta de perfil y control de accesos administrativos.
  - `tests/products.test.js`: Catálogo público sin costos, visibilidad de `costPrice` para rol `ADMIN`, consultas por ID y por slug, creación de productos y rechazo de precios o stocks inválidos.
  - `tests/orders.test.js`: Creación de pedidos con cálculo automático de totales en servidor, verificación de stock insuficiente, rechazo de pedidos vacíos o cantidades negativas, búsqueda por código y reposición automática de stock tras cancelación.
  - `tests/deliveries.test.js`: Creación de entregas vinculadas a pedidos, asignación de repartidores con rol `COURIER`, rechazo si el usuario asignado no es repartidor y transición de estados logísticos.
  - `tests/mocks.test.js`: Endpoints en memoria de usuarios, repartidores, pedidos y entregas, validaciones de límite y el endpoint de inserción en base de datos.
  - `tests/logger.test.js`: Diagnóstico de los 6 niveles en `/api/logger/test` y captura de rutas inexistentes (404).
  - `tests/swagger.test.js`: Disponibilidad de la interfaz Swagger UI y health check de la API.

---

## 16. Credenciales de Prueba

Para probar el sistema completo tras ejecutar `npm run seed`:

### Usuario Administrador (Acceso al panel y operaciones protegidas)
- **URL de Login:** [http://localhost:5000/admin/login.html](http://localhost:5000/admin/login.html)
- **Email:** `admin@bunkerimports.com`
- **Contraseña:** `Admin123!`
- **Rol:** `ADMIN`

### Usuario Repartidor (Logística y despachos)
- **Email:** `courier@bunkerimports.com`
- **Contraseña:** `Courier123!`
- **Rol:** `COURIER`

---

## 17. Licencia y Créditos

Proyecto desarrollado como trabajo integrador de Backend para la plataforma **BUNKER IMPORTS**. Todos los derechos reservados.
