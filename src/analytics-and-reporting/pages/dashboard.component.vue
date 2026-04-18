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
              <ul>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#6E0081"><path d="M7 18c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H7zm0-2h10V8H7v8z"/></svg></span> Ventas hoy:<span class="resumen-label">S/. <b>450.00</b></span></li>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#D98C4A"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg></span> Última factura:<span class="resumen-label">24/04/2025</span></li>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#D98C4A"><path d="M20.54 5.23l-1.39-1.39c-.36-.36-.86-.59-1.41-.59H6.26c-.55 0-1.05.23-1.41.59L3.46 5.23C3.17 5.52 3 5.91 3 6.32V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.32c0-.41-.17-.8-.46-1.09zM12 17c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg></span> Productos en stock:<span class="resumen-label">142</span></li>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#D90429"><circle cx="12" cy="12" r="10"/></svg></span> {{ $t('dashboard.low-stock') }}<span class="resumen-label danger">7</span></li>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#D98C4A"><circle cx="12" cy="12" r="10"/></svg></span> {{ $t('dashboard.about-to-expire') }}<span class="resumen-label warning">5</span></li>
              </ul>
            </div>
            <div class="resumen-img">
            </div>
          </div>
          <div class="dashboard-card alerts">
            <h2>{{ $t('dashboard.important-notifications') }}</h2>
            <div class="alert-item">
              <div>Whisky Escocés Premium</div>
              <div>{{ $t('dashboard.current-stock') }} <span class="danger">5</span></div>
              <div>{{ $t('dashboard.minimum-stock') }} <span>10</span></div>
            </div>
            <hr />
            <div class="alerta-item">
              <div>Malbec White Wine</div>
              <div class="warning">{{ $t('dashboard.expires-in-days', { days: 8 }) }}</div>
            </div>
          </div>
        </div>
        <div class="dashboard-access-charts">
          <aside class="dashboard-access-col">
            <div class="dashboard-card access access--sidebar">
              <h2 class="access-title access-title--sidebar">{{ $t('dashboard.quick-access') }}</h2>
              <div class="access-row access-row--sidebar">
                <router-link to="/catalog" class="access-btn access-btn--sidebar">
                  <span class="access-icon"><i class="pi pi-box"></i></span>
                  <span class="access-link">{{ $t('dashboard.access-catalogs') }}</span>
                </router-link>
                <router-link to="/orders" class="access-btn access-btn--sidebar">
                  <span class="access-icon"><i class="pi pi-shopping-cart"></i></span>
                  <span class="access-link">{{ $t('dashboard.access-orders') }}</span>
                </router-link>
                <router-link to="/warehouses" class="access-btn access-btn--sidebar">
                  <span class="access-icon"><i class="pi pi-building"></i></span>
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
.dashboard-row .alerts h2 {
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
.dashboard-row .resumen-icon svg {
  width: 16px;
  height: 16px;
}
.dashboard-row .alerts {
  font-size: 0.8125rem;
}
.dashboard-row .alert-item {
  margin-bottom: 0.5rem;
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
}
.access-btn--sidebar .access-link {
  font-size: 0.8125rem;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  background: #16a34a;
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