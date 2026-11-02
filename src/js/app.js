// ============================================================
// BUNKER IMPORTS — APP CORE
// Carrito, Favoritos, Búsqueda, Navbar, Drawer, Notificaciones
// ============================================================

'use strict';

// ─── HELPER DE RUTA ─────────────────────────────────────────
function resolvePageUrl(pageWithQuery) {
  const isInsidePages = window.location.pathname.includes('/pages/');
  if (pageWithQuery === 'index.html' || pageWithQuery === '') {
    return isInsidePages ? '../../index.html' : 'index.html';
  }
  return isInsidePages ? pageWithQuery : `src/pages/${pageWithQuery}`;
}

function resolveAssetUrl(filename) {
  if (window.BunkerData && window.BunkerData.getAssetPath) {
    return window.BunkerData.getAssetPath(filename);
  }
  const isInsidePages = window.location.pathname.includes('/pages/');
  const clean = (filename || '').replace(/^(\.\.\/)+/, '').replace(/^src\//, '').replace(/^images\//, '');
  return isInsidePages ? `../images/${clean}` : `src/images/${clean}`;
}

// ─── CART STORE (LOCALSTORAGE & EVENTOS) ─────────────────────
const Cart = (() => {
  const STORAGE_KEY = 'bunker_cart_v2';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: items }));
  }

  function getItems() {
    return load();
  }

  function addItem(product, size = null, qty = 1) {
    const items = load();
    const chosenSize = size || (product.sizes && product.sizes[0]) || '100ml';
    const key = `${product.id}_${chosenSize}`;
    const existing = items.find(i => i.key === key);

    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 99);
    } else {
      items.push({
        key,
        id: product.id,
        slug: product.slug,
        name: product.name,
        brandName: product.brandName,
        type: product.type,
        size: chosenSize,
        price: product.price || 0,
        imageFile: product.imageFile || 'cat-arabes.jpg',
        qty: qty
      });
    }
    save(items);
    Toast.show(`<strong>${product.name}</strong> agregado al carrito`, 'success');
    CartDrawer.open();
  }

  function removeItem(key) {
    const items = load().filter(i => i.key !== key);
    save(items);
    Toast.show('Producto eliminado del carrito', 'info');
  }

  function updateQty(key, delta) {
    const items = load();
    const item = items.find(i => i.key === key);
    if (!item) return;
    const newQty = (item.qty || 1) + delta;
    if (newQty <= 0) {
      removeItem(key);
      return;
    }
    item.qty = Math.min(99, newQty);
    save(items);
  }

  function getCount() {
    return load().reduce((sum, item) => sum + (item.qty || 1), 0);
  }

  function getSubtotal() {
    return load().reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  }

  function clear() {
    save([]);
  }

  return { getItems, addItem, removeItem, updateQty, getCount, getSubtotal, clear };
})();

// ─── FAVORITES STORE ─────────────────────────────────────────
const Favorites = (() => {
  const STORAGE_KEY = 'bunker_favorites_v2';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function save(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    document.dispatchEvent(new CustomEvent('favorites:changed', { detail: ids }));
  }

  function toggle(productId) {
    const ids = load();
    const idx = ids.indexOf(productId);
    let isNowFav = false;
    if (idx > -1) {
      ids.splice(idx, 1);
      Toast.show('Eliminado de tus favoritos', 'info');
    } else {
      ids.push(productId);
      Toast.show('Guardado en tus favoritos ♡', 'success');
      isNowFav = true;
    }
    save(ids);
    updateBadges();
    return isNowFav;
  }

  function isFavorite(productId) {
    return load().includes(productId);
  }

  function getAll() {
    return load();
  }

  function getCount() {
    return load().length;
  }

  function updateBadges() {
    const count = getCount();
    document.querySelectorAll('.fav-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  return { toggle, isFavorite, getAll, getCount, updateBadges };
})();

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────
const Toast = (() => {
  let container = null;

  function getContainer() {
    if (!container) {
      container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
    }
    return container;
  }

  function show(message, type = 'info', duration = 3200) {
    const c = getContainer();
    const toast = document.createElement('div');
    const icons = {
      success: '✓',
      info: '◆',
      error: '✕'
    };
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '◆'}</span>
      <span class="toast-text">${message}</span>
    `;
    c.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  return { show };
})();

// ─── CART DRAWER ─────────────────────────────────────────────
const CartDrawer = (() => {
  let drawer = null;
  let backdrop = null;

  function initElements() {
    drawer = document.getElementById('cartDrawer');
    backdrop = document.getElementById('cartBackdrop');
  }

  function open() {
    initElements();
    if (!drawer) return;
    render();
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    initElements();
    if (!drawer) return;
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function render() {
    initElements();
    const items = Cart.getItems();
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const countEl = document.getElementById('cartCountBadge');

    if (!itemsEl) return;

    const count = Cart.getCount();
    if (countEl) countEl.textContent = count;

    if (items.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart-empty" style="text-align:center;padding:48px 24px;">
          <div style="font-size:2.8rem;margin-bottom:16px;opacity:0.6;">🛒</div>
          <p style="font-family:var(--font-heading);font-weight:700;font-size:1.1rem;color:var(--white-warm);margin-bottom:8px;">Tu carrito está vacío</p>
          <p style="font-size:0.85rem;color:var(--white-subtle);margin-bottom:24px;">Descubrí las mejores fragancias árabes y de diseñador 100% originales.</p>
          <a href="${resolvePageUrl('perfumes.html')}" class="btn btn-outline btn-sm" onclick="CartDrawer.close()">Explorar Perfumes</a>
        </div>
      `;
      if (footerEl) footerEl.innerHTML = '';
      return;
    }

    const subtotal = Cart.getSubtotal();
    const threshold = (window.BunkerData && window.BunkerData.CONFIG) ? window.BunkerData.CONFIG.freeShippingThreshold : 120000;
    const missingForFree = Math.max(0, threshold - subtotal);
    const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));

    // Shipping progress bar
    const shippingBarHTML = `
      <div style="background:var(--black-elevated);border-radius:var(--radius-md);padding:12px 16px;margin:0 16px 16px;border:1px solid var(--black-border);">
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:6px;">
          <span style="color:var(--white-muted);">
            ${missingForFree === 0 ? '✨ <strong>¡Tenés ENVÍO GRATIS a todo el país!</strong>' : `Te faltan <strong>$${missingForFree.toLocaleString('es-AR')}</strong> para <strong>Envío Gratis</strong>`}
          </span>
          <span style="font-weight:700;color:var(--gold-primary);">${progressPercent}%</span>
        </div>
        <div style="width:100%;height:5px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden;">
          <div style="width:${progressPercent}%;height:100%;background:var(--grad-gold);border-radius:99px;transition:width 0.4s ease;"></div>
        </div>
      </div>
    `;

    itemsEl.innerHTML = shippingBarHTML + items.map(item => `
      <div class="cart-item" data-key="${item.key}">
        <img class="cart-item-img" src="${resolveAssetUrl(item.imageFile)}" alt="${item.name}" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-brand">${item.brandName}</div>
          <div class="cart-item-name">${item.name}</div>
          <div style="font-size:0.75rem;color:var(--gold-primary);margin-bottom:4px;">${item.size || '100ml'}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-AR')}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" aria-label="Disminuir cantidad" onclick="Cart.updateQty('${item.key}', -1); CartDrawer.render();">−</button>
            <span class="qty-num">${item.qty || 1}</span>
            <button class="qty-btn" aria-label="Aumentar cantidad" onclick="Cart.updateQty('${item.key}', 1); CartDrawer.render();">+</button>
          </div>
        </div>
        <button class="cart-item-remove" title="Eliminar del carrito" aria-label="Eliminar" onclick="Cart.removeItem('${item.key}'); CartDrawer.render();">✕</button>
      </div>
    `).join('');

    const installments = Math.round(subtotal / 3);
    const transferTotal = Math.round(subtotal * 0.9);

    if (footerEl) {
      footerEl.innerHTML = `
        <div class="cart-subtotal">
          <div>
            <span class="cart-subtotal-label">Subtotal</span>
            <div style="font-size:0.75rem;color:var(--gold-light);">3 cuotas sin interés de $${installments.toLocaleString('es-AR')}</div>
            <div style="font-size:0.75rem;color:var(--green-success);">10% OFF transf: $${transferTotal.toLocaleString('es-AR')}</div>
          </div>
          <span class="cart-subtotal-amount">$${subtotal.toLocaleString('es-AR')}</span>
        </div>
        <div class="cart-actions" style="display:flex;flex-direction:column;gap:8px;">
          <a href="${resolvePageUrl('checkout.html')}" class="btn btn-primary w-full" style="padding:14px;">
            <span>🔒</span> Iniciar Compra Segura
          </a>
          <a href="${resolvePageUrl('carrito.html')}" class="btn btn-ghost w-full btn-sm">
            Ver detalle del carrito
          </a>
        </div>
      `;
    }
  }

  return { open, close, render };
})();

// ─── LIVE SEARCH OVERLAY ─────────────────────────────────────
const Search = (() => {
  function open() {
    const overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const inp = overlay.querySelector('.search-input');
      if (inp) inp.focus();
    }, 120);
  }

  function close() {
    const overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    const inp = overlay.querySelector('.search-input');
    if (inp) inp.value = '';
    const results = document.getElementById('searchResults');
    if (results) results.innerHTML = '';
  }

  function performSearch(query) {
    const { DataStore } = window.BunkerData || {};
    if (!DataStore) return;

    const container = document.getElementById('searchResults');
    if (!container) return;

    if (!query || query.trim().length < 2) {
      container.innerHTML = `
        <div style="padding:24px;text-align:center;color:var(--white-subtle);font-size:0.85rem;">
          <p>Búsquedas populares:</p>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
            <button class="search-tag" onclick="document.querySelector('.search-input').value='9PM'; Search.perform('9PM');" style="padding:6px 14px;background:var(--black-elevated);border:1px solid var(--black-border);border-radius:99px;color:var(--gold-primary);font-size:0.75rem;">Lattafa 9PM</button>
            <button class="search-tag" onclick="document.querySelector('.search-input').value='Club de Nuit'; Search.perform('Club de Nuit');" style="padding:6px 14px;background:var(--black-elevated);border:1px solid var(--black-border);border-radius:99px;color:var(--gold-primary);font-size:0.75rem;">Club de Nuit</button>
            <button class="search-tag" onclick="document.querySelector('.search-input').value='Khamrah'; Search.perform('Khamrah');" style="padding:6px 14px;background:var(--black-elevated);border:1px solid var(--black-border);border-radius:99px;color:var(--gold-primary);font-size:0.75rem;">Khamrah</button>
            <button class="search-tag" onclick="document.querySelector('.search-input').value='Acqua di Gio'; Search.perform('Acqua di Gio');" style="padding:6px 14px;background:var(--black-elevated);border:1px solid var(--black-border);border-radius:99px;color:var(--gold-primary);font-size:0.75rem;">Acqua di Giò</button>
          </div>
        </div>
      `;
      return;
    }

    const results = DataStore.searchProducts(query);

    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-empty" style="text-align:center;padding:40px 16px;">
          <p style="font-size:1.1rem;color:var(--white-warm);margin-bottom:8px;">No encontramos fragancias para "${query}"</p>
          <p style="font-size:0.85rem;color:var(--white-subtle);margin-bottom:20px;">Probá buscando por marca (Lattafa, Armaf), notas (vainilla, oud) o estilo (dulce, fresco).</p>
          <a href="${resolvePageUrl('perfumes.html')}" class="btn btn-outline btn-sm" onclick="Search.close()">Ver Catálogo Completo</a>
        </div>
      `;
      return;
    }

    container.innerHTML = results.map(p => `
      <a class="search-result-item" href="${resolvePageUrl('producto.html?slug=' + p.slug)}">
        <img class="search-result-img" src="${resolveAssetUrl(p.imageFile)}" alt="${p.name}" loading="lazy">
        <div class="search-result-info">
          <div class="search-result-brand">${p.brandName} · ${p.type}</div>
          <div class="search-result-name">${p.name}</div>
          <div class="search-result-price">$${p.price.toLocaleString('es-AR')} · <span style="color:var(--gold-primary);font-size:0.75rem;">${p.fragranceFamily}</span></div>
        </div>
        <span class="search-result-arrow">→</span>
      </a>
    `).join('') + `
      <div style="text-align:center;padding:16px;border-top:1px solid var(--black-border);">
        <a href="${resolvePageUrl('perfumes.html?q=' + encodeURIComponent(query))}" class="btn btn-outline btn-sm" onclick="Search.close()">
          Ver todos los resultados (${results.length}) →
        </a>
      </div>
    `;
  }

  function init() {
    const overlay = document.getElementById('searchOverlay');
    if (!overlay) return;

    const input = overlay.querySelector('.search-input');
    const closeBtn = overlay.querySelector('.search-close');

    if (input) {
      let debounceTimer;
      input.addEventListener('input', e => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => performSearch(e.target.value), 180);
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });

    document.querySelectorAll('[data-search-open]').forEach(el => {
      el.addEventListener('click', open);
    });
  }

  return { open, close, perform: performSearch, init };
})();

// ─── PRODUCT CARD BUILDER (COMPONENTIZADO) ────────────────────
function buildProductCard(product, isSlide = false) {
  const isFav = Favorites.isFavorite(product.id);
  const currentPrice = `$${product.price.toLocaleString('es-AR')}`;
  const oldPrice = product.compareAtPrice ? `$${product.compareAtPrice.toLocaleString('es-AR')}` : '';
  const installmentText = window.BunkerData?.DataStore?.getInstallmentText(product.price) || `3 cuotas sin interés`;

  const badges = [];
  if (product.discount > 0) badges.push(`<span class="badge-tag badge-sale">-${product.discount}%</span>`);
  if (product.bestseller) badges.push(`<span class="badge-tag badge-bestseller">Top Ventas</span>`);
  if (product.newArrival) badges.push(`<span class="badge-tag badge-new">Nuevo</span>`);
  badges.push(`<span class="badge-tag badge-original">100% Original</span>`);

  const productUrl = resolvePageUrl(`producto.html?slug=${product.slug}`);
  const wrapperClass = isSlide ? 'class="carousel-slide"' : '';

  return `
    <div ${wrapperClass}>
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-card-media">
          <a href="${productUrl}" aria-label="Ver detalles de ${product.name}">
            <img class="product-card-img" src="${resolveAssetUrl(product.imageFile)}" alt="${product.brandName} ${product.name}" loading="lazy">
          </a>
          <div class="product-card-badges">${badges.join('')}</div>
          <button class="product-card-fav${isFav ? ' active' : ''}" title="Guardar en favoritos" aria-label="Guardar en favoritos" onclick="Favorites.toggle('${product.id}'); this.classList.toggle('active')">
            ${isFav ? '♥' : '♡'}
          </button>
          <a href="${productUrl}" class="btn btn-primary btn-sm product-card-quick">Ver fragancia</a>
        </div>
        <div class="product-card-body">
          <div class="product-card-brand">${product.brandName}</div>
          <h3 class="product-card-name">
            <a href="${productUrl}">${product.name}</a>
          </h3>
          <div class="product-card-type">${product.type} · ${product.fragranceFamily || ''}</div>
          <div class="product-card-price" style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
            <span class="price-current">${currentPrice}</span>
            ${oldPrice ? `<span style="font-size:0.78rem;text-decoration:line-through;color:var(--white-faint);">${oldPrice}</span>` : ''}
          </div>
          <div style="font-size:0.72rem;color:var(--gold-light);margin-top:2px;">
            ${installmentText}
          </div>
        </div>
        <div class="product-card-footer">
          <button class="btn-add-cart" onclick="Cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')}, '${product.sizes[0] || '100ml'}', 1)">
            <span>🛒</span> Agregar al carrito
          </button>
        </div>
      </article>
    </div>
  `;
}

// ─── CAROUSEL CONTROLLER ─────────────────────────────────────
const Carousel = (() => {
  function init(id) {
    const wrap = document.getElementById(id);
    if (!wrap) return;

    const track = wrap.querySelector('.carousel-track');
    const slides = wrap.querySelectorAll('.carousel-slide');
    const prevBtn = wrap.querySelector('.carousel-btn-prev');
    const nextBtn = wrap.querySelector('.carousel-btn-next');

    if (!track || slides.length === 0) return;

    let current = 0;

    function getSlidesVisible() {
      const w = window.innerWidth;
      if (w < 480) return 1.25;
      if (w < 768) return 2;
      if (w < 1024) return 3;
      return 4;
    }

    function update() {
      const slidesVisible = getSlidesVisible();
      const maxIndex = Math.max(0, slides.length - Math.floor(slidesVisible));
      current = Math.min(current, maxIndex);
      const slideW = slides[0]?.offsetWidth || 0;
      const gap = 16;
      track.style.transform = `translateX(-${current * (slideW + gap)}px)`;
      if (prevBtn) prevBtn.style.opacity = current > 0 ? '1' : '0.25';
      if (nextBtn) nextBtn.style.opacity = current < maxIndex ? '1' : '0.25';
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) { current--; update(); } });
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, slides.length - Math.floor(getSlidesVisible()));
        if (current < maxIndex) { current++; update(); }
      });
    }

    // Touch Swipe
    let startX = 0;
    const outer = wrap.querySelector('.carousel-track-outer');
    if (outer) {
      outer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      outer.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        const maxIndex = Math.max(0, slides.length - Math.floor(getSlidesVisible()));
        if (Math.abs(diff) > 40) {
          if (diff > 0 && current < maxIndex) { current++; update(); }
          else if (diff < 0 && current > 0) { current--; update(); }
        }
      });
    }

    window.addEventListener('resize', update, { passive: true });
    update();
  }

  return { init };
})();

// ─── PERFUME FINDER (TEST INTERACTIVO) ───────────────────────
const PerfumeFinder = (() => {
  let step = 0;
  let answers = {};
  const steps = ['gender', 'style', 'occasion', 'preference'];

  function init() {
    const startBtn = document.getElementById('finderStart');
    if (startBtn) startBtn.addEventListener('click', start);
  }

  function start() {
    step = 0;
    answers = {};
    document.getElementById('finderStart')?.classList.add('hidden');
    document.getElementById('finderIntro')?.classList.add('hidden');
    document.getElementById('finderSteps')?.classList.remove('hidden');
    renderStep();
  }

  function renderStep() {
    const container = document.getElementById('finderSteps');
    if (!container) return;

    const questions = {
      gender: {
        q: '¿Para quién es la fragancia?',
        options: [
          { val: 'masculino', label: 'Hombre 👔' },
          { val: 'femenino', label: 'Mujer 👗' },
          { val: 'unisex', label: 'Unisex / Nicho ✨' }
        ]
      },
      style: {
        q: '¿Qué aroma te define mejor?',
        options: [
          { val: 'dulce', label: 'Dulce & Vainilla 🍯' },
          { val: 'fresco', label: 'Fresco & Cítrico 🍋' },
          { val: 'intenso', label: 'Intenso & Amaderado 🌲' },
          { val: 'seductor', label: 'Seductor & Especiado 🌶️' }
        ]
      },
      occasion: {
        q: '¿Para qué momento lo vas a usar?',
        options: [
          { val: 'diario', label: 'Uso Diario & Oficina' },
          { val: 'noche', label: 'Noche, Citas & Salidas' },
          { val: 'evento', label: 'Eventos Especiales & Galas' }
        ]
      },
      preference: {
        q: '¿Tenés preferencia de origen?',
        options: [
          { val: 'arabe', label: 'Perfumes Árabes (Dubai) 🇦🇪' },
          { val: 'disenador', label: 'Diseñador Internacional 🇮🇹' },
          { val: 'me-da-igual', label: 'Me da igual, busco el mejor aroma' }
        ]
      },
    };

    const current = questions[steps[step]];
    const dots = steps.map((_, i) => `<div class="finder-dot${i <= step ? ' active' : ''}"></div>`).join('');

    container.innerHTML = `
      <div class="finder-progress">${dots}</div>
      <p class="finder-question">${current.q}</p>
      <div class="finder-options">
        ${current.options.map(opt => `
          <button class="finder-option" onclick="PerfumeFinder.select('${steps[step]}', '${opt.val}', this)">
            ${opt.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  function select(key, val, btn) {
    answers[key] = val;
    btn.closest('.finder-options').querySelectorAll('.finder-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    setTimeout(() => {
      step++;
      if (step >= steps.length) {
        showResults();
      } else {
        renderStep();
      }
    }, 320);
  }

  function showResults() {
    const { FINDER_LOGIC } = window.BunkerData || {};
    if (!FINDER_LOGIC) return;

    const products = FINDER_LOGIC.recommend(answers);
    const container = document.getElementById('finderSteps');
    if (!container) return;

    container.innerHTML = `
      <div class="text-center" style="margin-bottom:32px;">
        <span class="section-label">Resultado personalizado</span>
        <h3 class="section-title" style="font-size:1.8rem;">Fragancias Recomendadas Para Vos</h3>
        <p style="color:var(--white-subtle);font-size:0.85rem;max-width:480px;margin:0 auto;">
          Basado en tus preferencias de notas, ocasiones y estilo, estas creaciones son ideales para tu firma olfativa:
        </p>
      </div>
      <div class="products-grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;">
        ${products.map(p => buildProductCard(p)).join('')}
      </div>
      <div class="text-center" style="margin-top:32px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-outline" onclick="PerfumeFinder.reset()">Reintentar test</button>
        <a href="${resolvePageUrl('perfumes.html')}" class="btn btn-primary">Ver catálogo completo</a>
      </div>
    `;
  }

  function reset() {
    step = 0;
    answers = {};
    const stepsEl = document.getElementById('finderSteps');
    const intro = document.getElementById('finderIntro');
    const startBtn = document.getElementById('finderStart');
    if (stepsEl) stepsEl.classList.add('hidden');
    if (intro) intro.classList.remove('hidden');
    if (startBtn) startBtn.classList.remove('hidden');
  }

  return { init, select, reset };
})();

// ─── FAQ ACCORDION ───────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ─── NAVBAR CONTROLLER ───────────────────────────────────────
const Navbar = (() => {
  function init() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }

    updateBadges();
    document.addEventListener('cart:changed', updateBadges);
  }

  function updateBadges() {
    const count = Cart.getCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    Favorites.updateBadges();
  }

  return { init, updateBadges };
})();

// ─── REVEAL ON SCROLL ────────────────────────────────────────
const RevealObserver = (() => {
  function init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => observer.observe(el));
  }

  return { init };
})();

// ─── BACK TO TOP & NEWSLETTER ────────────────────────────────
function initUtils() {
  // Back to top
  const btn = document.getElementById('backToTop');
  if (btn) {
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 350);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Newsletter
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (!input) return;
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Toast.show('Por favor ingresá un correo electrónico válido', 'error');
        return;
      }
      Toast.show('¡Suscripción exitosa! Te enviamos tu cupón de bienvenida.', 'success');
      input.value = '';
    });
  });

  // Cart drawer triggers
  const closeBtn = document.getElementById('cartClose');
  const backdrop = document.getElementById('cartBackdrop');
  if (closeBtn) closeBtn.addEventListener('click', CartDrawer.close);
  if (backdrop) backdrop.addEventListener('click', CartDrawer.close);
  document.querySelectorAll('[data-cart-open]').forEach(el => {
    el.addEventListener('click', CartDrawer.open);
  });
}

// ─── INICIALIZACIÓN GLOBAL ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Navbar.init();
  Search.init();
  RevealObserver.init();
  initUtils();
  initFAQ();
  PerfumeFinder.init();
});

// Exponer globalmente
window.Cart = Cart;
window.Favorites = Favorites;
window.Toast = Toast;
window.CartDrawer = CartDrawer;
window.Search = Search;
window.PerfumeFinder = PerfumeFinder;
window.buildProductCard = buildProductCard;
window.resolvePageUrl = resolvePageUrl;
window.resolveAssetUrl = resolveAssetUrl;
window.Carousel = Carousel;
window.RevealObserver = RevealObserver;
