<script>
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import SideNavbar from '@/public/components/side-navbar.vue';
import Chart from 'primevue/chart';
import { useRouter } from 'vue-router';

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

    const products = [
      {
        name: 'Malbec Red Wine',
        type: 'Spirit',
        expiration: '2024-04-24',
        currentStock: 20,
        minStock: 20,
        price: 20
      },
      {
        name: 'White Wine',
        type: 'Spirit',
        expiration: '2024-04-23',
        currentStock: 20,
        minStock: 15,
        price: 20
      }
    ];

    return {
      goToDashboard,
      rotationData,
      rotationOptions,
      products
    };
  }
};
</script>

<template>
  <div class="dashboard-bg dashboard-view--white">
    <side-navbar />
    <div class="dashboard-main">
      <toolbar-content :pageTitle="'Dashboard'" />
      <div class="dashboard-content">
        <div class="dashboard-row">
          <div class="dashboard-card resumen resumen-flex">
            <div class="resumen-info">
              <h2 class="resumen-title">{{ $t('dashboard.general-summary') }}</h2>
              <ul>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#6E0081"><path d="M7 18c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H7zm0-2h10V8H7v8z"/></svg></span> Ventas hoy:<span class="resumen-label">S/. <b>450.00</b></span></li>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#D98C4A"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg></span> Última factura:<span class="resumen-label">24/04/2025</span></li>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#D98C4A"><path d="M20.54 5.23l-1.39-1.39c-.36-.36-.86-.59-1.41-.59H6.26c-.55 0-1.05.23-1.41.59L3.46 5.23C3.17 5.52 3 5.91 3 6.32V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.32c0-.41-.17-.8-.46-1.09zM12 17c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg></span> Productos en stock:<span class="resumen-label">142</span></li>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#D90429"><circle cx="12" cy="12" r="10"/></svg></span> Products low in stock:<span class="resumen-label danger">7</span></li>
                <li><span class="resumen-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#D98C4A"><circle cx="12" cy="12" r="10"/></svg></span> Products about to expire:<span class="resumen-label warning">5</span></li>
              </ul>
            </div>
            <div class="resumen-img">
            </div>
          </div>
          <div class="dashboard-card alerts">
            <h2>{{ $t('dashboard.important-notifications') }}</h2>
            <div class="alert-item">
              <div>Whisky Escocés Premium</div>
              <div>Current stock: <span class="danger">5</span></div>
              <div>Minimum stock: <span>10</span></div>
            </div>
            <hr />
            <div class="alerta-item">
              <div>Malbec White Wine</div>
              <div class="warning">Expires in 8 days!</div>
            </div>
          </div>
        </div>
        <div class="dashboard-card access">
          <h2 class="access-title">{{ $t('dashboard.quick-access') }}</h2>
          <div class="access-row">
            <router-link to="/catalog" class="access-btn acceso-inventario access-btn-lg">
              <span class="access-icon"><i class="pi pi-box"></i></span>
              <span class="access-link">Catalogs</span>
            </router-link>
            <router-link to="/orders" class="access-btn acceso-compras access-btn-lg">
              <span class="access-icon"><i class="pi pi-shopping-cart"></i></span>
              <span class="access-link">Orders</span>
            </router-link>
            <router-link to="/warehouses" class="access-btn acceso-zonas access-btn-lg">
              <span class="access-icon"><i class="pi pi-building"></i></span>
              <span class="access-link">Inventory</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Rotation charts -->
      <section class="rotation">
        <div class="rotation-row">
          <div class="rotation-card">
            <h3>Highest Turnover</h3>
            <Chart class="char" type="bar" :data="rotationData" :options="rotationOptions" />
          </div>
          <div class="rotation-card">
            <h3>Lowest Turnover</h3>
            <Chart class="char" type="bar" :data="rotationData" :options="rotationOptions" />
          </div>
        </div>
      </section>

      <!-- Expiration risk table -->
      <section class="risk">
        <div class="risk-card">
          <h3>Expiration Risk <span class="badge">Highest</span></h3>
          <table class="risk-table">
            <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Expiration Date</th>
              <th>Current Stock</th>
              <th>Minimum Stock</th>
              <th>Price</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in products" :key="product.name">
              <td>{{ product.name }}</td>
              <td>{{ product.type }}</td>
              <td>{{ product.expiration }}</td>
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
  gap: 2rem;
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
.resumen h2, .alertas h2, .accesos h2 {
  color: #6E0081;
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
  color: #26021D;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.access-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}
.access-btn {
  background: #f5f5f7;
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
  background: #ebebed;
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

.rotation-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(38,2,29,0.07);
  padding: 2rem;
  flex: 1;
  font-size: 1.5rem;
}

.rotation-card .char {
  width: 100%;
  height: 100%;
  font-size: 2rem;
}

.risk-card {
  background: #ffffff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.risk-card h3 {
  color: #6E0081;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
}

.risk-table {
  width: 1400px;
  background: #fff;
  border-collapse: collapse;
  font-size: 1rem;
  margin-top: 1rem;
}
.risk-table th,
.risk-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 1.2rem;
}
.risk-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}
.badge {
  background: #6E0081;
  color: white;
  padding: 0.2rem 0.6rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  margin-left: 0.5rem;
}

.risk {
  background: #ffffff;
  padding: 2rem;
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
  background: #f5f5f7;
}
.resumen-title {
  color: #6E0081;
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