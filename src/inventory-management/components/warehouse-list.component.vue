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
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1rem;
}

</style>