<script>
import ProductManagement from "@/inventory-management/pages/product-management.component.vue";
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import InventoryProductsComponent from "@/inventory-management/components/inventory-products.component.vue";

export default {
  name: "Inventory",
  components: {InventoryProduct: InventoryProductsComponent, ToolbarContent, SideNavbar, ProductManagement}
}
</script>

<template>
  <div class="inventory-bg">
    <side-navbar />
    <div class="inventory-main">
      <div class="inventory-title">
        <toolbar-content :pageTitle="$t('inventory.title')" />
      </div>
      <inventory-product/>
    </div>
  </div>
</template>

<style scoped>
.inventory-bg {
  background: #ffffff;
  min-height: 100vh;
  width: 100vw;
  display: flex;
}


.inventory-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>