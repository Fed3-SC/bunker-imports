// ============================================================
// BUNKER IMPORTS — CLIENT API ADAPTER
// Comunicación HTTP centralizada con el Backend Node.js / MongoDB
// ============================================================

'use strict';

(function (window) {
  const BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? `${window.location.origin}/api`
    : '/api';

  const TOKEN_KEY = 'bunker_auth_token';
  const USER_KEY = 'bunker_auth_user';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  function getCurrentUser() {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }

  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const res = await fetch(url, config);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const error = new Error((data && data.message) || `Error ${res.status}: ${res.statusText}`);
        error.status = res.status;
        error.code = data && data.code;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      console.warn(`[BunkerAPI] Error en ${options.method || 'GET'} ${endpoint}:`, err.message);
      throw err;
    }
  }

  const BunkerAPI = {
    BASE_URL,
    getToken,
    setToken,
    getCurrentUser,

    // ── Autenticación ─────────────────────────────
    auth: {
      async login(email, password) {
        const res = await request('/users/login', {
          method: 'POST',
          body: { email, password }
        });
        if (res.data && res.data.token) {
          setToken(res.data.token);
          setCurrentUser(res.data.user);
        }
        return res.data;
      },

      async register(userData) {
        const res = await request('/users/register', {
          method: 'POST',
          body: userData
        });
        if (res.data && res.data.token) {
          setToken(res.data.token);
          setCurrentUser(res.data.user);
        }
        return res.data;
      },

      async getMe() {
        const res = await request('/users/me');
        setCurrentUser(res.data);
        return res.data;
      },

      logout() {
        setToken(null);
        setCurrentUser(null);
      }
    },

    // ── Productos ─────────────────────────────────
    products: {
      async getAll(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.category) params.append('category', filters.category);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.featured) params.append('featured', 'true');

        const qs = params.toString() ? `?${params.toString()}` : '';
        return request(`/products${qs}`);
      },

      async getAllAdmin() {
        return request('/products/admin');
      },

      async getById(id) {
        return request(`/products/${id}`);
      },

      async getBySlug(slug) {
        return request(`/products/slug/${slug}`);
      },

      async create(productData) {
        return request('/products', {
          method: 'POST',
          body: productData
        });
      },

      async update(id, productData) {
        return request(`/products/${id}`, {
          method: 'PUT',
          body: productData
        });
      },

      async updateStock(id, stock, reason = 'Ajuste manual') {
        return request(`/products/${id}/stock`, {
          method: 'PATCH',
          body: { stock, reason }
        });
      },

      async remove(id) {
        return request(`/products/${id}`, {
          method: 'DELETE'
        });
      }
    },

    // ── Pedidos (Checkout y Admin) ────────────────
    orders: {
      async create(orderData) {
        return request('/orders', {
          method: 'POST',
          body: orderData
        });
      },

      async getAll(filters = {}) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        const qs = params.toString() ? `?${params.toString()}` : '';
        return request(`/orders${qs}`);
      },

      async getById(id) {
        return request(`/orders/${id}`);
      },

      async getByCode(code) {
        return request(`/orders/code/${code}`);
      },

      async updateStatus(id, status) {
        return request(`/orders/${id}/status`, {
          method: 'PATCH',
          body: { status }
        });
      }
    },

    // ── Entregas ──────────────────────────────────
    deliveries: {
      async getAll() {
        return request('/deliveries');
      },

      async getById(id) {
        return request(`/deliveries/${id}`);
      },

      async assignCourier(deliveryId, courierId) {
        return request(`/deliveries/${deliveryId}/courier`, {
          method: 'PATCH',
          body: { courierId }
        });
      },

      async updateStatus(deliveryId, status) {
        return request(`/deliveries/${deliveryId}/status`, {
          method: 'PATCH',
          body: { status }
        });
      }
    },

    // ── Mocks y Diagnóstico ───────────────────────
    mocks: {
      async seed(options = {}) {
        return request('/mocks/seed', {
          method: 'POST',
          body: options
        });
      }
    },

    logger: {
      async test() {
        return request('/logger/test');
      }
    },

    // ── Sincronización Progresiva con DataStore ───
    async syncWithBackend() {
      try {
        const response = await this.products.getAll();
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Adaptar productos de MongoDB al esquema frontend
          const syncedProducts = response.data.map(p => ({
            id: p._id || p.id,
            sku: p.sku,
            name: p.name,
            slug: p.slug,
            brand: p.brand ? p.brand.toLowerCase() : 'bunker',
            brandName: p.brand,
            category: p.category || ['arabes'],
            gender: p.gender || 'unisex',
            type: p.fragranceType || 'Eau de Parfum',
            concentration: p.concentration || 'EDP',
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            costPrice: p.costPrice || 0,
            stock: p.stock,
            minStock: p.minStock || 2,
            status: p.stock > 0 ? 'active' : 'soldout',
            sizes: p.sizes && p.sizes.length ? p.sizes : ['100ml'],
            imageFile: p.imageFile || 'cat-arabes.jpg',
            fragranceFamily: p.fragranceFamily || 'Amaderado Oriental',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            notes: p.notes || {},
            occasion: p.occasion || [],
            longevity: p.longevity || 'Alta (8-10 hs)',
            sillage: p.sillage || 'Moderada',
            rating: p.rating || 5.0,
            reviewCount: p.reviewCount || 0,
            featured: Boolean(p.featured),
            bestseller: Boolean(p.bestseller),
            newArrival: Boolean(p.newArrival),
            discount: p.discount || 0,
            tags: p.tags || []
          }));

          if (window.BunkerData && window.BunkerData.DataStore) {
            localStorage.setItem(window.BunkerData.DB_KEYS.PRODUCTS, JSON.stringify(syncedProducts));
            window.BunkerData.PRODUCTS = syncedProducts;
            document.dispatchEvent(new CustomEvent('bunker:products:synced', { detail: syncedProducts }));
            console.log(`[BunkerAPI] Catálogo sincronizado exitosamente desde MongoDB (${syncedProducts.length} productos).`);
          }
        }
      } catch (err) {
        console.info('[BunkerAPI] Backend no disponible o modo offline. Usando datos locales.');
      }
    }
  };

  window.BunkerAPI = BunkerAPI;

  // Ejecutar sincronización al cargar el script en el navegador
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => BunkerAPI.syncWithBackend());
    } else {
      BunkerAPI.syncWithBackend();
    }
  }
})(typeof window !== 'undefined' ? window : global);
