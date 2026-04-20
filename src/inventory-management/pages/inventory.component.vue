<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import InventoryProductsComponent from "@/inventory-management/components/inventory-products.component.vue";

export default {
  name: "Inventory",
  components: { InventoryProduct: InventoryProductsComponent, ToolbarContent, SideNavbar },
};
</script>

<template>
  <div class="inventory-bg">
    <side-navbar />
    <div class="inventory-main">
      <toolbar-content :pageTitle="$t('inventory.title')" />
      <div class="inventory-content">
        <inventory-product />
      </div>
    </div>
  </div>
</template>

<style scoped>
.inventory-bg {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
}

.inventory-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.inventory-content {
  flex: 1;
  min-width: 0;
  padding: 2rem;
  /* Mismo fondo de lienzo que otras vistas con tarjetas (p. ej. planes) */
  background: #f5f5f7;
}
</style>