<script>
import { useRouter } from 'vue-router';
import { useAuthenticationStore } from '@/authentication/services/authentication.store.js';

/** Ancho fijo del sidebar (debe coincidir con `--sidenav-width` en estilos). */
export const SIDENAV_WIDTH_PX = 240;

export default {
  name: 'side-navbar',
  setup() {
    const router = useRouter();
    const authStore = useAuthenticationStore();

    const handleSignOut = async () => {
      await authStore.signOut(router);
    };

    return {
      handleSignOut,
      sidenavWidthPx: SIDENAV_WIDTH_PX,
    };
  },
};
</script>

<template>
  <div
    class="sidenav-container"
    :class="{ 'sidenav-container--with-slot': !!$slots.default }"
    :style="{ '--sidenav-width': `${sidenavWidthPx}px` }"
  >
    <aside class="sidenav" role="navigation" aria-label="Main">
      <div class="sidenav-inner">
        <div class="sidenav-logo-zone">
          <slot name="logo">
            <router-link
              to="/dashboard"
              class="sidenav-logo-link"
              :aria-label="$t('toolbar.dashboard')"
            >
              <!-- Sustituye por: <img class="sidenav-logo-img" src="@/assets/logo.svg" alt="Stocksip" /> -->
              <div class="sidenav-logo-frame" aria-hidden="true" />
            </router-link>
          </slot>
        </div>

        <nav class="sidenav-main" aria-label="App">
          <ul class="nav-list">
            <li>
              <router-link to="/dashboard" class="nav-item" v-tooltip="$t('toolbar.dashboard')">
                <i class="pi pi-chart-bar nav-item__icon" aria-hidden="true"></i>
                <span class="nav-item__label">{{ $t('toolbar.dashboard') }}</span>
              </router-link>
            </li>
            <li>
              <router-link to="/warehouses" class="nav-item" v-tooltip="$t('toolbar.inventory')">
                <i class="pi pi-warehouse nav-item__icon" aria-hidden="true"></i>
                <span class="nav-item__label">{{ $t('toolbar.inventory') }}</span>
              </router-link>
            </li>
            <li>
              <router-link to="/alerts" class="nav-item" v-tooltip="$t('toolbar.alerts')">
                <i class="pi pi-exclamation-triangle nav-item__icon" aria-hidden="true"></i>
                <span class="nav-item__label">{{ $t('toolbar.alerts') }}</span>
              </router-link>
            </li>
            <li>
              <router-link to="/care-guides" class="nav-item" v-tooltip="$t('toolbar.care')">
                <i class="pi pi-file nav-item__icon" aria-hidden="true"></i>
                <span class="nav-item__label">{{ $t('toolbar.care') }}</span>
              </router-link>
            </li>
            <li>
              <router-link to="/orders" class="nav-item" v-tooltip="$t('toolbar.order')">
                <i class="pi pi-shopping-cart nav-item__icon" aria-hidden="true"></i>
                <span class="nav-item__label">{{ $t('toolbar.order') }}</span>
              </router-link>
            </li>
            <li>
              <router-link to="/products" class="nav-item" v-tooltip="$t('toolbar.storage')">
                <i class="pi pi-building nav-item__icon" aria-hidden="true"></i>
                <span class="nav-item__label">{{ $t('toolbar.storage') }}</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <div class="sidenav-footer">
          <router-link
            :to="{ name: 'PlanChoose' }"
            class="nav-item"
            v-tooltip="$t('toolbar.plans')"
          >
            <i class="pi pi-credit-card nav-item__icon" aria-hidden="true"></i>
            <span class="nav-item__label">{{ $t('toolbar.plans') }}</span>
          </router-link>
          <router-link to="/profile" class="nav-item" v-tooltip="$t('toolbar.profile')">
            <i class="pi pi-user nav-item__icon" aria-hidden="true"></i>
            <span class="nav-item__label">{{ $t('toolbar.profile') }}</span>
          </router-link>
          <button
            type="button"
            class="nav-item nav-item--signout"
            @click="handleSignOut"
            v-tooltip="$t('toolbar.sign-out')"
          >
            <i class="pi pi-sign-out nav-item__icon" aria-hidden="true"></i>
            <span class="nav-item__label">{{ $t('toolbar.sign-out') }}</span>
          </button>
        </div>
      </div>
    </aside>
    <main v-if="$slots.default" class="content">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.sidenav-container {
  --sidenav-width: 240px;
  /* Separación solo arriba y abajo (lateral izquierdo pegado a la pantalla) */
  --sidenav-float: 14px;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  align-self: stretch;
  /* Mismo blanco que el panel: los márgenes arriba/abajo no muestran gris */
  background-color: #ffffff;
  box-sizing: border-box;
  flex: 0 0 var(--sidenav-width);
  width: var(--sidenav-width);
  min-width: var(--sidenav-width);
  max-width: var(--sidenav-width);
  padding: var(--sidenav-float) 0;
}

.sidenav-container--with-slot {
  flex: 1 1 auto;
  width: 100%;
  max-width: none;
  min-width: 0;
  padding: var(--sidenav-float) 0;
  background-color: #ffffff;
}

.sidenav {
  flex: 0 0 var(--sidenav-width);
  width: var(--sidenav-width);
  background-color: #ffffff;
  box-sizing: border-box;
  /* Fijo al viewport: no baja al hacer scroll en la página */
  position: fixed;
  left: 0;
  top: var(--sidenav-float);
  height: calc(100vh - 2 * var(--sidenav-float));
  max-height: calc(100vh - 2 * var(--sidenav-float));
  min-height: 0;
  z-index: 1000;
  /* Esquinas solo a la derecha: el borde izquierdo va al ras de la pantalla */
  border-radius: 0 20px 20px 0;
  border: none;
  /* Sombra estilo Apple: suave, difusa, varias capas (separación del contenido) */
  box-shadow:
    1px 0 0 rgba(0, 0, 0, 0.045),
    4px 4px 16px rgba(0, 0, 0, 0.04),
    12px 12px 40px rgba(0, 0, 0, 0.06),
    24px 0 80px -24px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.sidenav-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

.sidenav-logo-zone {
  flex-shrink: 0;
  padding: 14px 12px 12px;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(60, 60, 67, 0.08);
}

.sidenav-logo-link {
  display: block;
  text-decoration: none;
  outline: none;
}

.sidenav-logo-link:focus-visible .sidenav-logo-frame {
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.35);
}

/* Área del logo: fondo blanco; placeholder solo con línea muy suave */
.sidenav-logo-frame {
  min-height: 48px;
  width: 100%;
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid rgba(60, 60, 67, 0.06);
  box-sizing: border-box;
}

.sidenav-logo-zone :deep(.sidenav-logo-img) {
  display: block;
  width: 100%;
  max-height: 56px;
  height: auto;
  object-fit: contain;
  object-position: left center;
  border-radius: 10px;
}

.sidenav-main {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 10px 8px;
  -webkit-overflow-scrolling: touch;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: rgba(60, 60, 67, 0.85);
  background: transparent;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.nav-item:hover {
  background-color: rgba(60, 60, 67, 0.06);
  color: #1d1d1f;
}

.nav-item.router-link-active {
  background-color: rgba(60, 60, 67, 0.1);
  color: #1d1d1f;
  font-weight: 600;
}

.nav-item__icon {
  font-size: 1.125rem;
  width: 1.5rem;
  margin-right: 10px;
  color: rgba(60, 60, 67, 0.55);
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.nav-item:hover .nav-item__icon,
.nav-item.router-link-active .nav-item__icon {
  color: #007aff;
}

.nav-item--signout:hover .nav-item__icon {
  color: rgba(255, 59, 48, 0.95);
}

.nav-item--signout:hover {
  color: #c41e1e;
  background-color: rgba(255, 59, 48, 0.08);
}

.nav-item__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidenav-footer {
  flex-shrink: 0;
  padding: 10px 10px 18px;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid rgba(60, 60, 67, 0.1);
  background-color: #ffffff;
}

.content {
  flex: 1;
  min-width: 0;
  /* El aside está `position: fixed`, no reserva espacio en el flujo: sin esto el
     toolbar y el scroll quedarían debajo del panel lateral. */
  margin-left: var(--sidenav-width);
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: #f5f5f7;
}
</style>
