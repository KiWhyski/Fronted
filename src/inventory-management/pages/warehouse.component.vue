<script>
import WarehouseList from "@/inventory-management/components/warehouse-list.component.vue";
import {WarehouseService} from "@/inventory-management/services/warehouse.service.js";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import SideNavbar from "@/public/components/side-navbar.vue";
import {Button as PvButton} from "primevue";
import {AccountService} from "@/payment-and-subscriptions/services/account.service.js";

export default {
  name: "warehouses",
  components: {PvButton, SideNavbar, ToolbarContent, WarehouseList},
  data() {
    return {
      warehouses: [],
      warehousesCount: 0,
      maxWarehouses: 0
    };
  },
  methods: {
    async getWarehouses() {
      this.error = null;
      try {
        const warehouseService = new WarehouseService();
        this.warehouses = await warehouseService.getWarehousesByAccountId();
      } catch (error) {
        this.error = "Failed to load warehouses";
        console.error(error);
      }
    },
    async loadWarehouseLimits() {
      try {
        const warehouseService = new WarehouseService();
        const accountService = new AccountService();
        const current = await warehouseService.getWarehousesCount();
        const benefits = await accountService.getCurrentAccountBenefitsLimits();

        this.warehousesCount = current.count;
        this.maxWarehouses = benefits.maxWarehouses;
      } catch (error) {
        console.error("Error loading limits:", error);
      }
    },
    navigateToCreate() {
      this.$router.push('/warehouses/new');
    },
  },
  created() {
    this.getWarehouses();
    this.loadWarehouseLimits();
  }
}
</script>

<template>
  <div class="warehouse-bg">
    <side-navbar />
    <div class="warehouse-main">
      <toolbar-content :pageTitle="$t('warehouses.title')"/>

      <div class="warehouse-content">
        <div class="warehouse-management-content">
          <div v-if="warehouses && warehouses.length > 0" class="limits-info">
            <p>
              {{ $t('warehouses.limitMessage', { current: warehousesCount, max: maxWarehouses }) }}
            </p>
          </div>

          <warehouse-list v-if="warehouses && warehouses.length > 0" :warehouses="warehouses"></warehouse-list>

          <div v-else class="empty-warehouses">
            <h3 class="empty-title">{{ $t('warehouses.emptyTitle') }}</h3>
            <p>{{ $t('warehouses.emptyDescription') }}</p>
          </div>
        </div>

        <div class="floating-action-container">
          <pv-button
              icon="pi pi-plus"
              :label="($t('warehouses.create'))"
              class="create-button p-button-raised p-button-rounded"
              @click="navigateToCreate"
              aria-label="Create a new Warehouse"
              :disabled="warehousesCount >= maxWarehouses"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warehouse-bg {
  background: #F7EDDC;
  min-height: 100vh;
  display: flex;
}

.warehouse-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.warehouse-content {
  padding: 1rem 0;
}

.warehouse-management-content {
  padding: 1rem 2rem;
}

.floating-action-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.create-button {
  background-color: #790b38;
  color: white;
  border: none;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  width: 12rem;
}

.create-button:hover {
  background-color: #46062c !important;
  border-color: #46062c !important;
  transform: translateY(-1px);
  color: white !important;
  filter: brightness(1.1);
  box-shadow: 0 3px 5px rgba(89, 3, 58, 0.3);
}

.empty-warehouses {
  text-align: center;
  margin-top: 2rem;
}

.empty-title {
  font-size: 2.5rem;
  color: #790b38;
}

.limits-info {
  margin: 0 0 1.5rem auto;
  font-size: 1.1rem;
  color: #333;
  max-width: 1200px;
  padding: 0 1rem;
  text-align: right;
  width: fit-content;
}
</style>