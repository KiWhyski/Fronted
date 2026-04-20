<script>
import SideNavbar from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import WarehouseForm from '@/inventory-management/components/warehouse-form.component.vue';

export default {
  name: 'warehouse-create-and-edit',
  components: {
    SideNavbar,
    ToolbarContent,
    WarehouseForm,
  },
  computed: {
    routeWarehouseId() {
      return this.$route.params.warehouseId ?? null;
    },
    pageTitle() {
      return this.routeWarehouseId
        ? this.$t('warehouses.editWarehouseTitle')
        : this.$t('warehouses.createWarehouseTitle');
    },
  },
};
</script>

<template>
  <div class="warehouse-bg">
    <side-navbar />
    <div class="warehouse-main">
      <toolbar-content :pageTitle="pageTitle" />
      <div class="warehouse-content">
        <warehouse-form :key="$route.fullPath" :warehouse-id="routeWarehouseId" :embedded="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.warehouse-bg {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
}

.warehouse-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.warehouse-content {
  padding: 2rem;
}
</style>
