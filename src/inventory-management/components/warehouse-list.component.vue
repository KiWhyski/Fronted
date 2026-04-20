<script>
import {Warehouse} from "@/inventory-management/model/warehouse.entity.js";
import WarehouseItem from "@/inventory-management/components/warehouse-item.component.vue";

export default {
  name: "warehouse-list",
  components: {WarehouseItem},
  props: {warehouses: {type: Array[Warehouse], required: true}}
}
</script>

<template>
  <div class="grid-container">
    <div v-for="warehouse in warehouses" :key="warehouse.warehouseId">
      <warehouse-item :warehouse="warehouse"/>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: clamp(1.25rem, 3vw, 1.75rem);
  padding: 0.25rem 0.5rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

@media (min-width: 1100px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

</style>