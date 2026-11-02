// ============================================================
// BUNKER IMPORTS — ADMIN CORE CONTROLLER
// Sidebar, Topbar, Modales, Alertas y Protección de Rutas
// ============================================================

'use strict';

const AdminCore = (() => {

  // ─── TOAST NOTIFICATION ─────────────────────────────────
  const Toast = {
    show(message, type = 'success', duration = 3000) {
      let container = document.querySelector('.admin-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'admin-toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
      };
      toast.className = `admin-toast`;
      if (type === 'error') toast.style.borderColor = 'var(--status-red)';
      if (type === 'warning') toast.style.borderColor = 'var(--status-yellow)';

      toast.innerHTML = `
        <span style="font-weight:700;color:${type === 'error' ? 'var(--status-red)' : (type === 'warning' ? 'var(--status-yellow)' : 'var(--gold-primary)')};">${icons[type] || '•'}</span>
        <span>${message}</span>
      `;

      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
      }, duration);
    }
  };

  // ─── MODAL CONTROLLERS ──────────────────────────────────
  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ─── RENDERIZADO DE SIDEBAR DINÁMICO ────────────────────
  function renderSidebar(activeKey = 'dashboard') {
    const sidebarEl = document.getElementById('adminSidebar');
    if (!sidebarEl) return;

    const { DataStore, AuthService } = window.BunkerData;
    const user = AuthService.getCurrentUser() || { name: 'Admin', role: 'SUPER_ADMIN' };

    const lowStockCount = DataStore.getLowStockProducts().length;
    const pendingOrdersCount = DataStore.getAllOrders().filter(o => o.status === 'pending' || o.status === 'paid').length;

    const navItems = [
      { key: 'dashboard', label: 'Dashboard', icon: '📊', url: 'index.html' },
      { key: 'productos', label: 'Productos', icon: '📦', url: 'productos.html' },
      { key: 'inventario', label: 'Inventario & Stock', icon: '📦', url: 'inventario.html', badge: lowStockCount > 0 ? lowStockCount : null },
      { key: 'precios', label: 'Gestión de Precios', icon: '🏷️', url: 'precios.html' },
      { key: 'marcas', label: 'Marcas', icon: '🏷️', url: 'marcas.html' },
      { key: 'categorias', label: 'Categorías', icon: '🗂️', url: 'categorias.html' },
      { key: 'pedidos', label: 'Pedidos', icon: '📋', url: 'pedidos.html', badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
      { key: 'clientes', label: 'Clientes', icon: '👥', url: 'clientes.html' },
      { key: 'promociones', label: 'Promociones', icon: '🎟️', url: 'promociones.html' },
      { key: 'banners', label: 'Banners Home', icon: '🖼️', url: 'banners.html' },
      { key: 'resenas', label: 'Reseñas', icon: '⭐', url: 'resenas.html' },
      { key: 'contenido', label: 'Contenido Tienda', icon: '✍️', url: 'contenido.html' },
      { key: 'envios', label: 'Métodos de Envío', icon: '🚚', url: 'envios.html' },
      { key: 'estadisticas', label: 'Estadísticas', icon: '📈', url: 'estadisticas.html' },
      { key: 'importar', label: 'Importar / Exportar', icon: '📥', url: 'importar.html' },
      { key: 'auditoria', label: 'Auditoría', icon: '📜', url: 'auditoria.html' },
      { key: 'configuracion', label: 'Configuración', icon: '⚙️', url: 'configuracion.html' }
    ];

    sidebarEl.innerHTML = `
      <div class="admin-sidebar-header">
        <a href="index.html" class="admin-logo-link">
          <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" fill="none" stroke="#C9A45C" stroke-width="2"/>
            <path d="M24 10 L34 15 L34 26 C34 32 29 38 24 40 C19 38 14 32 14 26 L14 15 Z" fill="none" stroke="#C9A45C" stroke-width="1.8"/>
            <text x="19" y="29" font-family="Montserrat, sans-serif" font-weight="700" font-size="14" fill="#C9A45C">B</text>
          </svg>
          <div>
            <div style="font-family:var(--font-heading);font-size:12px;font-weight:800;letter-spacing:0.18em;color:var(--gold-primary);">BUNKER</div>
            <div style="font-size:8px;font-weight:600;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Admin Panel</div>
          </div>
        </a>
        <button id="adminCloseSidebarBtn" style="color:var(--text-muted);font-size:18px;display:none;">✕</button>
      </div>

      <div style="flex:1;overflow-y:auto;padding-bottom:16px;">
        <div class="admin-nav-group">
          <div class="admin-nav-label">Operaciones E-Commerce</div>
          <ul class="admin-nav-list">
            ${navItems.map(item => `
              <li>
                <a href="${item.url}" class="admin-nav-item ${item.key === activeKey ? 'active' : ''}">
                  <span class="admin-nav-icon">${item.icon}</span>
                  <span>${item.label}</span>
                  ${item.badge ? `<span class="admin-nav-badge">${item.badge}</span>` : ''}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="admin-sidebar-footer">
        <div class="admin-user-info">
          <div class="admin-avatar">${user.name.charAt(0).toUpperCase()}</div>
          <div class="admin-user-details">
            <div class="admin-user-name">${user.name}</div>
            <div class="admin-user-role">${user.role.replace('_', ' ')}</div>
          </div>
        </div>
        <button id="adminLogoutBtn" title="Cerrar sesión" style="color:var(--status-red);font-size:16px;padding:6px;">🚪</button>
      </div>
    `;

    // Logout listener
    document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
      if (confirm('¿Cerrar sesión del panel administrativo?')) {
        AuthService.logout();
      }
    });

    // Close on mobile
    document.getElementById('adminCloseSidebarBtn')?.addEventListener('click', () => {
      sidebarEl.classList.remove('open');
    });
  }

  // ─── RENDERIZADO DE TOPBAR ──────────────────────────────
  function renderTopbar(pageTitle = 'Dashboard') {
    const topbarEl = document.getElementById('adminTopbar');
    if (!topbarEl) return;

    topbarEl.innerHTML = `
      <div class="admin-topbar-left">
        <button id="adminMobileToggle" class="admin-toggle-btn" aria-label="Menú">☰</button>
        <h1 class="admin-page-title">${pageTitle}</h1>
      </div>
      <div class="admin-topbar-right">
        <a href="../index.html" target="_blank" class="admin-btn-store" title="Ver Tienda Pública">
          <span>🌐</span> Ver Tienda
        </a>
        <div style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--status-green);"></span>
          <span>Online</span>
        </div>
      </div>
    `;

    document.getElementById('adminMobileToggle')?.addEventListener('click', () => {
      document.getElementById('adminSidebar')?.classList.toggle('open');
    });
  }

  // ─── INICIALIZACIÓN Y GUARD DE SEGURIDAD ────────────────
  function init(activeKey, pageTitle) {
    if (!window.BunkerData || !window.BunkerData.AuthService) {
      console.error('Data layer not loaded');
      return;
    }

    // Ruta protegida: verificar autenticación
    if (!window.BunkerData.AuthService.requireAuth()) {
      return;
    }

    renderSidebar(activeKey);
    renderTopbar(pageTitle);

    // Eventos globales para modales con data-modal-close
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.admin-modal-backdrop');
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Cerrar al clickear backdrop
    document.querySelectorAll('.admin-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  return { init, Toast, openModal, closeModal };
})();

window.AdminCore = AdminCore;
window.AdminToast = AdminCore.Toast;
