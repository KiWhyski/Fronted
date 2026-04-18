<script>
import AlertItem from "@/alerts-and-notifications/components/alert-item.component.vue";
import StockSettingsModal from "@/alerts-and-notifications/components/stock-settings-modal.vue";
import ExpirationSettingsModal from "@/alerts-and-notifications/components/expiration-settings-modal.vue";
import { fetchAllStockAlerts, fetchAllExpirationAlerts } from "@/alerts-and-notifications/services/alert.service.js";

export default {
  name: "alert-list",
  components: {
    AlertItem,
    StockSettingsModal,
    ExpirationSettingsModal
  },
  props: {
    title: {
      type: String,
      required: true
    },
    alerts: {
      type: Array,
      required: true
    },
    linkText: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ["stock", "expiration"].includes(value)
    }
  },
  data() {
    return {
      showAll: false,
      allAlerts: [],
      showSettings: false
    };
  },
  methods: {
    async handleViewAll() {
      if (!this.showAll) {
        this.showAll = true;
        if (this.type === 'stock') {
          this.allAlerts = await fetchAllStockAlerts();
        } else {
          this.allAlerts = await fetchAllExpirationAlerts();
        }
      } else {
        this.showAll = false;
        this.allAlerts = [];
      }
    },
    openSettings() {
      this.showSettings = true;
    },
    closeSettings() {
      this.showSettings = false;
    },
    handleSettingsUpdated() {
      this.$emit("settings-updated");
    }
  }
};
</script>

<template>
  <div class="alert-card">
    <div class="card-header">
      <h2 class="card-title">{{ title }}</h2>
      <button 
        v-if="type === 'stock' || type === 'expiration'"
        class="settings-button"
        @click="openSettings"
        :title="type === 'stock' ? 'Configurar stock mínimo' : 'Configurar días de expiración'"
      >
        <i class="pi pi-cog"></i>
      </button>
    </div>
    
    <div v-if="showAll ? allAlerts.length === 0 : alerts.length === 0" class="no-alerts">
      <i :class="type === 'stock' ? 'pi pi-box' : 'pi pi-calendar'" class="no-alerts-icon"></i>
      <p class="no-alerts-message">
        {{ type === 'stock' 
          ? $t('alerts.no-content')
          : $t('alerts.no-expired')
        }}
      </p>
      <p class="no-alerts-submessage">
        {{ type === 'stock'
          ? $t('alerts.no-content-description')
          : $t('alerts.no-expired-description')
        }}
      </p>
    </div>
    
    <AlertItem 
      v-else
      v-for="alert in showAll ? allAlerts : alerts" 
      :key="alert.id" 
      :alert="alert" 
    />
    
    <a v-if="alerts.length > 0" href="#" class="card-link" @click.prevent="handleViewAll">
      {{ showAll ? 'Show less' : linkText }}
    </a>

    <StockSettingsModal
      v-if="type === 'stock'"
      :show="showSettings"
      @close="closeSettings"
      @stock-updated="handleSettingsUpdated"
    />
    <ExpirationSettingsModal
      v-if="type === 'expiration'"
      :show="showSettings"
      @close="closeSettings"
      @settings-updated="handleSettingsUpdated"
    />
  </div>
</template>

<style scoped>
.alert-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(38, 2, 29, 0.07);
  flex: 1 1 320px;
  min-width: 280px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #26021d;
  margin: 0;
}

.settings-button {
  background: none;
  border: none;
  color: #6e0081;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.settings-button:hover {
  background-color: rgba(110, 0, 129, 0.1);
}

.card-link {
  font-size: 0.95rem;
  color: #6e0081;
  text-decoration: underline;
  cursor: pointer;
}

.card-link:hover {
  color: #59033a;
}

.no-alerts {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

.no-alerts-icon {
  font-size: 2.5rem;
  color: #6e0081;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.no-alerts-message {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #26021d;
}

.no-alerts-submessage {
  font-size: 0.9rem;
  color: #666;
  max-width: 280px;
  margin: 0 auto;
  line-height: 1.4;
}
</style>