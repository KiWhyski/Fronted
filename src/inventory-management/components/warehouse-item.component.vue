<script>
import { Warehouse } from "@/inventory-management/model/warehouse.entity.js";

export default {
  name: "warehouse-item",
  props: {
    warehouse: { type: Object, required: true }
  },
  methods: {
    navigateToEdit() {
        this.$router.push({ name: 'EditWarehouse', params: { warehouseId: this.warehouse.warehouseId } });
    },

    navigateToZones() {
      this.$router.push({name: 'Inventory', params: { warehouseId: this.warehouse.warehouseId } });
    }
  }
}
</script>

<template>
  <pv-card class="warehouse-card">
    <template #header>
      <div class="center-text">
        <h2 class="warehouse-title">{{ warehouse.name }}</h2>
      </div>
      <img :src="warehouse.imageUrl" :alt="warehouse.name" class="warehouse-image" />
    </template>

    <template #content>
      <p class="warehouse-text">{{ $t('warehouses.address') }}: {{ warehouse.fullAddress }}</p>
      <p class="warehouse-text">{{ $t('warehouses.capacity') }}: {{ warehouse.capacity }} m³</p>
    </template>

    <template #footer>
      <div class="action-buttons">
        <pv-button
            icon="pi pi-pencil"
            class="edit-button action-button"
            :label="$t('components.edit')"
            @click="navigateToEdit">
        </pv-button>
        <pv-button
            class="show-button action-button"
            :label="$t('components.show')"
            @click="navigateToZones">
        </pv-button>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.warehouse-card {
  width: 100%;
  max-width: 400px;
  margin: 16px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.center-text {
  display: flex;
  justify-content: center;
  text-align: center;
}

.warehouse-image {
  width: 100%;
  height: 100%;
  max-height: 200px;
  object-fit: cover;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.action-button {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  flex: 1;
  min-width: 120px;
  max-width: 200px;
}

.warehouse-title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #1d1d1f;
  margin: 0.5rem 0;
}

.warehouse-text {
  font-size: 0.9375rem;
  color: #6e6e73;
  margin: 0.5rem 0;
  font-weight: 500;
  line-height: 1.45;
}

.edit-button,
.edit-button.p-button {
  background-color: var(--app-green-accent, #16a34a) !important;
  border-color: var(--app-green-accent, #16a34a) !important;
  color: #ffffff !important;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.edit-button:hover {
  background-color: var(--app-green-accent-hover, #15803d) !important;
  border-color: var(--app-green-accent-hover, #15803d) !important;
  color: #ffffff !important;
}

.show-button,
.show-button.p-button {
  background-color: #f5f5f7 !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  color: #1d1d1f !important;
}

.show-button:hover {
  background-color: #ebebed !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
  color: #1d1d1f !important;
}

</style>