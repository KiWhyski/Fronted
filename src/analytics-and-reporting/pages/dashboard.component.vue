<script>
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import SideNavbar from '@/public/components/side-navbar.vue';
import Chart from 'primevue/chart';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

/** Días hasta la fecha de vencimiento (puede ser negativo si ya venció). */
function daysUntilExpiry(isoDateStr) {
  const end = new Date(isoDateStr);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - start) / 86400000);
}

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Niveles (de menor a mayor gravedad): bajo → moderado → medio → alto → crítico
 * Colores: verde, amarillo, ámbar, naranja, rojo
 */
function riskLevelFromDays(days) {
  if (days < 0) return 'critico';
  if (days <= 3) return 'critico';
  if (days <= 10) return 'alto';
  if (days <= 20) return 'medio';
  if (days <= 35) return 'moderado';
  return 'bajo';
}

const RISK_SEVERITY = {
  bajo: 0,
  moderado: 1,
  medio: 2,
  alto: 3,
  critico: 4,
};

function worstRiskLevel(levels) {
  let worst = 'bajo';
  let maxSev = -1;
  for (const lvl of levels) {
    const s = RISK_SEVERITY[lvl] ?? 0;
    if (s > maxSev) {
      maxSev = s;
      worst = lvl;
    }
  }
  return worst;
}

export default {
  name: 'dashboard',
  components: {
    ToolbarContent,
    SideNavbar,
    Chart
  },
  setup() {
    const router = useRouter();

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    const rotationData = {
      labels: ['Product A', 'Product B', 'Product C'],
      datasets: [
        {
          data: [70, 20, 10],
          backgroundColor: ['#B0F2B6', '#F7B2AD', '#E5D3F2']
        }
      ]
    };

    const rotationOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + '%';
            }
          }
        }
      }
    };

    const productsRaw = [
      {
        name: 'Malbec Red Wine',
        type: 'Spirit',
        expiration: addDays(new Date(), 50),
        currentStock: 20,
        minStock: 20,
        price: 20
      },
      {
        name: 'White Wine',
        type: 'Spirit',
        expiration: addDays(new Date(), 18),
        currentStock: 20,
        minStock: 15,
        price: 20
      },
      {
        name: 'Vodka Premium',
        type: 'Spirit',
        expiration: addDays(new Date(), 6),
        currentStock: 10,
        minStock: 5,
        price: 35
      }
    ];

    const products = computed(() =>
      productsRaw.map((p) => {
        const days = daysUntilExpiry(p.expiration);
        const riskLevel = riskLevelFromDays(days);
        return { ...p, daysUntilExpiry: days, riskLevel };
      })
    );

    const overallExpirationRisk = computed(() =>
      worstRiskLevel(products.value.map((p) => p.riskLevel))
    );

    const riskBadgeClass = (level) => `risk-badge risk-badge--${level}`;

    return {
      goToDashboard,
      rotationData,
      rotationOptions,
      products,
      overallExpirationRisk,
      riskBadgeClass
    };
  }
};
</script>

<template>
  <div class="dashboard-bg dashboard-view--white">
    <side-navbar />
    <div class="dashboard-main">
      <toolbar-content :pageTitle="$t('dashboard.page-title')" />
      <div class="dashboard-content">
        <div class="dashboard-row">
          <div class="dashboard-card resumen resumen-flex">
            <div class="resumen-info">
              <h2 class="resumen-title">{{ $t('dashboard.general-summary') }}</h2>
              <ul class="resumen-kpi-list">
                <li>
                  <span class="resumen-kpi-left">
                    <span class="resumen-icon resumen-icon--pi" aria-hidden="true"><i class="pi pi-dollar"></i></span>
                    <span class="resumen-kpi-text">{{ $t('dashboard.sales-today') }}</span>
                  </span>
                  <span class="alerts-notify__line-value alerts-notify__line-value--ok">S/. 450.00</span>
                </li>
                <li>
                  <span class="resumen-kpi-left">
                    <span class="resumen-icon resumen-icon--pi" aria-hidden="true"><i class="pi pi-receipt"></i></span>
                    <span class="resumen-kpi-text">{{ $t('dashboard.last-invoice') }}</span>
                  </span>
                  <span class="alerts-notify__line-value alerts-notify__line-value--ok">24/04/2025</span>
                </li>
                <li>
                  <span class="resumen-kpi-left">
                    <span class="resumen-icon resumen-icon--pi" aria-hidden="true"><i class="pi pi-box"></i></span>
                    <span class="resumen-kpi-text">{{ $t('dashboard.products-in-stock') }}</span>
                  </span>
                  <span class="alerts-notify__line-value alerts-notify__line-value--ok">142</span>
                </li>
                <li>
                  <span class="resumen-kpi-left">
                    <span class="resumen-icon resumen-icon--pi resumen-icon--danger" aria-hidden="true"><i class="pi pi-exclamation-triangle"></i></span>
                    <span class="resumen-kpi-text">{{ $t('dashboard.low-stock') }}</span>
                  </span>
                  <span class="alerts-notify__line-value danger">7</span>
                </li>
                <li>
                  <span class="resumen-kpi-left">
                    <span class="resumen-icon resumen-icon--pi resumen-icon--warning" aria-hidden="true"><i class="pi pi-calendar-clock"></i></span>
                    <span class="resumen-kpi-text">{{ $t('dashboard.about-to-expire') }}</span>
                  </span>
                  <span class="alerts-notify__line-value warning">5</span>
                </li>
              </ul>
            </div>
            <div class="resumen-img">
            </div>
          </div>
          <div class="dashboard-card alerts alerts--with-icons">
            <h2 class="alerts-section-title">{{ $t('dashboard.important-notifications') }}</h2>

            <div class="alerts-notify alerts-notify--danger">
              <div class="alerts-notify__head">
                <span class="alerts-notify__badge" aria-hidden="true"><i class="pi pi-exclamation-triangle"></i></span>
                <span class="alerts-notify__product">Whisky Escocés Premium</span>
              </div>
              <ul class="alerts-notify__lines">
                <li>
                  <span class="alerts-notify__line-left">
                    <span class="alerts-notify__line-icon" aria-hidden="true"><i class="pi pi-box"></i></span>
                    <span class="alerts-notify__line-label">{{ $t('dashboard.current-stock') }}</span>
                  </span>
                  <span class="alerts-notify__line-value danger">5</span>
                </li>
                <li>
                  <span class="alerts-notify__line-left">
                    <span class="alerts-notify__line-icon" aria-hidden="true"><i class="pi pi-chart-line"></i></span>
                    <span class="alerts-notify__line-label">{{ $t('dashboard.minimum-stock') }}</span>
                  </span>
                  <span class="alerts-notify__line-value alerts-notify__line-value--ok">10</span>
                </li>
              </ul>
            </div>

            <hr class="alerts-sep" />

            <div class="alerts-notify alerts-notify--warning">
              <div class="alerts-notify__head">
                <span class="alerts-notify__badge alerts-notify__badge--warn" aria-hidden="true"><i class="pi pi-calendar-clock"></i></span>
                <span class="alerts-notify__product">Malbec White Wine</span>
              </div>
              <p class="alerts-notify__expire warning">{{ $t('dashboard.expires-in-days', { days: 8 }) }}</p>
            </div>
          </div>
        </div>
        <div class="dashboard-access-charts">
          <aside class="dashboard-access-col">
            <div class="dashboard-card access access--sidebar">
              <h2 class="access-title access-title--sidebar">{{ $t('dashboard.quick-access') }}</h2>
              <div class="access-row access-row--sidebar">
                <router-link to="/catalog" class="access-btn access-btn--sidebar">
                  <span class="access-icon"><i class="pi pi-book" aria-hidden="true"></i></span>
                  <span class="access-link">{{ $t('dashboard.access-catalogs') }}</span>
                </router-link>
                <router-link to="/orders" class="access-btn access-btn--sidebar">
                  <span class="access-icon"><i class="pi pi-shopping-cart" aria-hidden="true"></i></span>
                  <span class="access-link">{{ $t('dashboard.access-orders') }}</span>
                </router-link>
                <router-link to="/warehouses" class="access-btn access-btn--sidebar">
                  <span class="access-icon"><i class="pi pi-warehouse" aria-hidden="true"></i></span>
                  <span class="access-link">{{ $t('dashboard.access-inventory') }}</span>
                </router-link>
              </div>
            </div>
          </aside>
          <div class="dashboard-charts-col">
            <section class="rotation rotation--beside-access" :aria-label="$t('common.charts')">
              <div class="rotation-row rotation-row--fluid">
                <div class="rotation-card">
                  <h3>{{ $t('dashboard.chart-highest-turnover') }}</h3>
                  <div class="rotation-chart-wrap">
                    <Chart class="char" type="bar" :data="rotationData" :options="rotationOptions" />
                  </div>
                </div>
                <div class="rotation-card">
                  <h3>{{ $t('dashboard.chart-lowest-turnover') }}</h3>
                  <div class="rotation-chart-wrap">
                    <Chart class="char" type="bar" :data="rotationData" :options="rotationOptions" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Expiration risk table -->
      <section class="risk">
        <div class="risk-card">
          <h3 class="risk-section-title">
            {{ $t('dashboard.expiration-risk') }}
            <span :class="riskBadgeClass(overallExpirationRisk)">
              {{ $t('dashboard.risk-level-' + overallExpirationRisk) }}
            </span>
          </h3>
          <table class="risk-table">
            <thead>
            <tr>
              <th>{{ $t('dashboard.table-name') }}</th>
              <th>{{ $t('dashboard.table-type') }}</th>
              <th>{{ $t('dashboard.table-expiration') }}</th>
              <th>{{ $t('dashboard.table-risk') }}</th>
              <th>{{ $t('dashboard.table-current-stock') }}</th>
              <th>{{ $t('dashboard.table-min-stock') }}</th>
              <th>{{ $t('dashboard.table-price') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in products" :key="product.name">
              <td>{{ product.name }}</td>
              <td>{{ product.type }}</td>
              <td>{{ product.expiration }}</td>
              <td>
                <span class="risk-badge risk-badge--compact" :class="'risk-badge--' + product.riskLevel">
                  {{ $t('dashboard.risk-level-' + product.riskLevel) }}
                </span>
              </td>
              <td>{{ product.currentStock }}</td>
              <td>{{ product.minStock }}</td>
              <td>{{ product.price }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard-bg {
  background: #ffffff;
  min-height: 100vh;
  width: 100vw;
  display: flex;
}

/* Toolbar del dashboard: mismo fondo blanco (el componente sigue crema en otras vistas) */
.dashboard-view--white :deep(.custom-toolbar) {
  background-color: #ffffff !important;
}

.dashboard-view--white :deep(.toolbar-title) {
  background-color: #ffffff;
}
.dashboard-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.dashboard-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.dashboard-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}
.dashboard-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(38,2,29,0.07);
  padding: 2rem;
  min-width: 280px;
  flex: 1 1 320px;
  color: #323130;
  font-size: 1.5rem;
}

/* KPIs superiores (resumen + alertas): más compactos */
.dashboard-row .dashboard-card {
  padding: 1rem 1.15rem;
  font-size: 0.8125rem;
  border-radius: 12px;
  flex: 1 1 260px;
  min-width: 220px;
}
.dashboard-row .resumen-title,
.dashboard-row .alerts-section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  color: #111111;
}
.dashboard-row .resumen ul,
.dashboard-row .resumen li {
  font-size: 0.8125rem;
}
.dashboard-row .resumen-info li {
  margin-bottom: 0.4rem;
  font-size: 0.8125rem;
  gap: 0.35rem;
}

.dashboard-row .resumen-info {
  min-width: 0;
  width: 100%;
}

.dashboard-row .alerts.alerts--with-icons {
  width: 100%;
  box-sizing: border-box;
}

.dashboard-row .resumen-kpi-list {
  width: 100%;
}

/* Misma fila que .alerts-notify__lines (flex + valor a la derecha) */
.dashboard-row .resumen .resumen-info .resumen-kpi-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
  font-size: 0.8125rem;
  box-sizing: border-box;
}

.dashboard-row .resumen-kpi-left {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  flex: 1;
}
.dashboard-row .resumen-icon.resumen-icon--pi {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  flex-shrink: 0;
}
.dashboard-row .resumen-icon.resumen-icon--pi i {
  font-size: 0.95rem;
  line-height: 1;
  color: #2e7d32;
}
.dashboard-row .resumen-icon.resumen-icon--pi.resumen-icon--danger i {
  color: #dc2626;
}
.dashboard-row .resumen-icon.resumen-icon--pi.resumen-icon--warning i {
  color: #d97706;
}
.dashboard-row .resumen-kpi-text {
  min-width: 0;
  color: #323130;
}

.dashboard-row .alerts {
  font-size: 0.8125rem;
}
.dashboard-row .alert-item {
  margin-bottom: 0.5rem;
}

.dashboard-row .alerts-notify__head {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
}

.dashboard-row .alerts-notify__badge {
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 0.05rem;
}

.dashboard-row .alerts-notify__badge i {
  font-size: 1rem;
  color: #dc2626;
}

.dashboard-row .alerts-notify__badge--warn i {
  color: #d97706;
}

.dashboard-row .alerts-notify__product {
  font-weight: 600;
  color: #323130;
  font-size: 0.8125rem;
  line-height: 1.35;
}

.dashboard-row .alerts-notify__lines {
  list-style: none;
  padding: 0;
  margin: 0.45rem 0 0 0;
  width: 100%;
}

.dashboard-row .alerts-notify__lines li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
  font-size: 0.8125rem;
  box-sizing: border-box;
}

.dashboard-row .alerts-notify__line-left {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  flex: 1;
}

.dashboard-row .alerts-notify__line-label {
  color: #323130;
}

.dashboard-row .alerts-notify__line-icon i {
  font-size: 0.85rem;
  color: #2e7d32;
}

.dashboard-row .alerts-notify__line-value {
  flex-shrink: 0;
  text-align: right;
  font-weight: 700;
}

.dashboard-row .alerts-notify__line-value--ok {
  color: #174d32;
}

.dashboard-row .alerts-notify__expire {
  margin: 0.4rem 0 0 0;
  padding-left: 1.75rem;
  font-size: 0.8125rem;
  line-height: 1.35;
}

.dashboard-row .alerts-sep {
  margin: 0.55rem 0;
}
.dashboard-row .resumen-flex {
  gap: 1rem;
}

/* Columna estrecha (accesos) + columna ancha (gráficos) */
.dashboard-access-charts {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 1.25rem;
  width: 100%;
  min-width: 0;
}
.dashboard-access-col {
  flex: 0 0 clamp(150px, 18vw, 210px);
  min-width: 0;
}
.dashboard-charts-col {
  flex: 1 1 auto;
  min-width: 0;
}
.dashboard-card.access--sidebar {
  padding: 1rem 0.75rem;
  margin: 0;
  min-width: 0;
  font-size: 0.875rem;
  height: 100%;
  box-sizing: border-box;
}
.access-row--sidebar {
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 0.45rem;
  margin-top: 0;
}
.access-btn--sidebar {
  min-width: 0;
  width: 100%;
  padding: 0.5rem 0.6rem;
  font-size: 0.8125rem;
  gap: 0.45rem;
  justify-content: flex-start;
  border-radius: 10px;
}
.access-btn--sidebar .access-icon {
  font-size: 1.15rem;
  flex-shrink: 0;
  color: #2e7d32;
}
.access-btn--sidebar .access-link {
  font-size: 0.8125rem;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #174d32;
  font-weight: 600;
}

.dashboard-card.access--sidebar .access-btn--sidebar {
  color: #174d32;
  border-color: rgba(46, 125, 50, 0.25);
  background: #ffffff;
}
.dashboard-card.access--sidebar .access-btn--sidebar:hover {
  background: #e8f5e9;
  border-color: rgba(27, 94, 32, 0.35);
  color: #1b5e20;
  box-shadow: 0 2px 8px rgba(20, 83, 45, 0.12);
}
.dashboard-card.access--sidebar .access-btn--sidebar:hover .access-icon {
  color: #1b5e20;
}
.dashboard-card.access--sidebar .access-btn--sidebar:hover .access-link {
  color: #1b5e20;
}

.resumen h2, .alertas h2, .accesos h2 {
  color: #111111;
  font-size: 2rem;
  margin-bottom: 1rem;
}
.resumen ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.5rem;
}
.resumen li {
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
}

.bold {
  font-weight: bold;
  color: #26021D;
}
.danger {
  color: #D90429;
}
.warning {
  color: #D98C4A;
}
.alerts .danger {
  color: #D90429;
  font-weight: bold;
}
.alerts .warning {
  color: #D98C4A;
  font-weight: bold;
}
.alert-item {
  margin-bottom: 1rem;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 0.5rem 0;
}
.access-title {
  color: #111111;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.access-title.access-title--sidebar {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.65rem;
  line-height: 1.25;
  color: #111111;
  letter-spacing: -0.02em;
}
.access-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}
.access-btn {
  background: #ffffff;
  border: 1px solid rgba(60, 60, 67, 0.1);
  color: #6E0081;
  border-radius: 14px;
  padding: 0.8rem 1.6rem;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  min-width: 160px;
}
.access-btn:hover {
  background: #f5f5f5;
  color: #59033A;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.access-icon {
  font-size: 4rem;

  display: flex;
  align-items: center;
}
.access-link {
  color: #6E0081;
  text-decoration: underline;
  font-weight: 600;
  font-size: 1.5rem;
}
.acceso-btn:hover .access-link {
  color: #59033A;
}

.rotation {
  background: #ffffff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.rotation--beside-access {
  padding: 0;
  align-items: stretch;
  width: 100%;
}
.rotation-row {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  width: 1200px;
  height: 400px;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
}
.rotation-row--fluid {
  width: 100%;
  max-width: none;
  margin-top: 0;
  height: auto;
  min-height: 300px;
  align-items: stretch;
  gap: 1rem;
}

.rotation-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(38,2,29,0.07);
  padding: 2rem;
  flex: 1;
  font-size: 1.5rem;
}
.rotation--beside-access .rotation-card {
  padding: 1rem 1.15rem;
  font-size: 1rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 280px;
}
.rotation--beside-access .rotation-card h3 {
  font-size: 1.05rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: #111111;
}

.rotation-card .char {
  width: 100%;
  height: 100%;
  font-size: 2rem;
}
.rotation-chart-wrap {
  flex: 1 1 auto;
  min-height: 200px;
  width: 100%;
  position: relative;
}
.rotation--beside-access .rotation-card .char {
  display: block;
  width: 100% !important;
  height: 100% !important;
  min-height: 200px;
  max-height: 320px;
}

.risk-card {
  background: #ffffff;
  padding: 1rem 1.25rem 1.15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.risk-section-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: #111111;
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
}

.risk-table {
  width: 100%;
  max-width: 1400px;
  background: #fff;
  border-collapse: collapse;
  font-size: 0.875rem;
  margin-top: 0.35rem;
}
.risk-table th,
.risk-table td {
  padding: 0.45rem 0.5rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 0.9rem;
  line-height: 1.35;
}
.risk-table th {
  background-color: #ffffff;
  font-weight: bold;
}
.risk-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  margin-left: 0.35rem;
  vertical-align: middle;
  letter-spacing: 0.02em;
}

.risk-badge--bajo {
  background: var(--app-green-accent, #16a34a);
  color: #ffffff;
}

.risk-badge--moderado {
  background: #eab308;
  color: #1a1a1a;
}

.risk-badge--medio {
  background: #f59e0b;
  color: #1a1a1a;
}

.risk-badge--alto {
  background: #ea580c;
  color: #ffffff;
}

.risk-badge--critico {
  background: #dc2626;
  color: #ffffff;
}

.risk-badge--compact {
  margin-left: 0;
  font-size: 0.68rem;
  padding: 0.15rem 0.45rem;
}

.risk {
  background: #ffffff;
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .dashboard-row {
    flex-direction: column;
  }
  .dashboard-main {
    margin-left: 0;
  }
  .dashboard-access-charts {
    flex-direction: column;
  }
  .dashboard-access-col {
    flex: 1 1 auto;
    max-width: none;
    width: 100%;
  }
  .access-row--sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .access-btn--sidebar {
    flex: 1 1 140px;
    width: auto;
  }
  .access-row {
    flex-direction: column;
    gap: 0.7rem;
  }
  .access-btn {
    min-width: unset;
    width: 100%;
    justify-content: flex-start;
  }
}
@media (max-width: 600px) {
  .dashboard-content {
    padding: 0.5rem;
    gap: 1rem;
  }
  .dashboard-card {
    padding: 1rem;
    min-width: unset;
  }
  .access-row {
    gap: 0.5rem;
  }
}
.resumen-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}
.resumen-info {
  flex: 2;
}
.resumen-img {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.resumen-img img {
  max-width: 140px;
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(38,2,29,0.07);
  background: #ffffff;
}
.resumen-title {
  color: #111111;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
}
.resumen-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.resumen-info li {
  margin-bottom: 0.7rem;
  font-size: 1.13rem;
}
/* Flex solo para listas genéricas; .resumen-kpi-list usa grid más arriba */
.resumen-info ul:not(.resumen-kpi-list) li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.resumen-icon {
  display: flex;
  align-items: center;
  margin-right: 0.3rem;
}
.resumen-label {
  font-weight: bold;
  color: #26021D;
  margin-left: 0.2rem;
}
.resumen-label.danger {
  color: #D90429;
}
.resumen-label.warning {
  color: #D98C4A;
}
.access-btn-lg {
  min-width: 370px;
  min-height: 100px;
  font-size: 4rem;
  padding: 2.7rem 3.5rem;
}
.acceso-btn-lg .access-icon {
  font-size: 3.5rem;
}
@media (max-width: 1100px) {
  .resumen-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }
  .resumen-img {
    width: 100%;
    justify-content: flex-start;
  }
  .resumen-img img {
    max-width: 100px;
  }
}
</style>