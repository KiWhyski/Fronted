<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import AlertList from "@/alerts-and-notifications/components/alert-list.component.vue";
import { fetchStockAlerts, fetchExpirationAlerts } from "@/alerts-and-notifications/services/alert.service.js";

export default {
  name: "alert-dashboard",
  components: { SideNavbar, ToolbarContent, AlertList },
  data() {
    return {
      stockAlerts: [],
      expirationAlerts: [],
      loading: true,
      error: null
    };
  },
  methods: {
    async loadAlerts() {
      this.loading = true;
      try {
        const [stock, expiration] = await Promise.all([
          fetchStockAlerts(),
          fetchExpirationAlerts()
        ]);
        this.stockAlerts = stock;
        this.expirationAlerts = expiration;
      } catch (err) {
        this.error = "Error loading alerts.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async handleStockUpdated() {
      await this.loadAlerts();
    }
  },
  async mounted() {
    await this.loadAlerts();
  }
}
</script>

<template>
  <div class="alerts-bg">
    <side-navbar />
    <div class="alerts-main">
      <toolbar-content :pageTitle=" $t('alerts.title') " />
      <div class="alerts-content">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error" class="error-msg">{{ error }}</div>
        <template v-else>
          <AlertList 
            :title="$t('alerts.urgent-restocking')"
            :alerts="stockAlerts" 
            linkText="View all alerts"
            type="stock"
            @stock-updated="handleStockUpdated"
          />
          <AlertList 
            :title="$t('alerts.next-to-expire')"
            :alerts="expirationAlerts" 
            linkText="See all products"
            type="expiration"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alerts-bg {
  background: #f7eddc;
  min-height: 100vh;
  width: 100vw;
  display: flex;
}
.alerts-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.alerts-content {
  padding: 2rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
.error-msg {
  color: red;
  font-weight: bold;
  margin-top: 2rem;
}
</style>