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
      <footer class="warehouse-card__footer">
        <button
          type="button"
          class="warehouse-card__action"
          :aria-label="$t('components.edit')"
          @click="navigateToEdit"
        >
          <i class="pi pi-pencil" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="warehouse-card__action"
          :aria-label="$t('components.show')"
          @click="navigateToZones"
        >
          <i class="pi pi-eye" aria-hidden="true" />
        </button>
      </footer>
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

.warehouse-card :deep(.p-card) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.warehouse-card :deep(.p-card-body) {
  flex: 1;
}

.warehouse-card :deep(.p-card-footer) {
  padding: 0;
  border-top: none;
  background: transparent;
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

/* Mismo pie y botones circulares que `product-item` (vista Almacenamiento) */
.warehouse-card__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem 1rem;
  margin-top: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.6);
}

.warehouse-card__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #424245;
  cursor: pointer;
  font-size: 1rem;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.warehouse-card__action:hover {
  background: #f5f5f7;
  border-color: rgba(0, 0, 0, 0.14);
  color: #1d1d1f;
}

.warehouse-card__action:not(.warehouse-card__action--danger):hover {
  color: var(--app-green-accent, #16a34a);
  border-color: rgba(0, 0, 0, 0.12);
  background: #f5f5f7;
}

.warehouse-card__action:active {
  transform: scale(0.96);
}

</style>