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
  background-color: white;
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
  font-size: 1.5rem;
  font-weight: bold;
  color: #6E0081;
  margin: 0.5rem 0;
}

.warehouse-text {
  font-size: 1rem;
  color: #333;
  margin: 0.5rem 0;
  font-weight: bold;
}

.edit-button {
  background-color: #790b38;
  color: white;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #7a044d !important;
  border-color: #46062c !important;
  transform: translateY(-1px);
  box-shadow: 0 3px 5px rgba(121, 11, 56, 0.3);
  color: white !important;
  filter: brightness(1.1);
}

.show-button {
  background-color: #59033A;
  color: white;
  border: none;
}

.show-button:hover {
  background-color: #7a044d !important;
  border-color: #46062c !important;
  transform: translateY(-1px);
  color: white !important;
  filter: brightness(1.1);
  box-shadow: 0 3px 5px rgba(89, 3, 58, 0.3);
}

</style>