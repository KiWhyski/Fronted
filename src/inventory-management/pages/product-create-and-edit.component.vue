<script>
import SideNavbar from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import ProductForm from '@/inventory-management/components/product-form.component.vue';

export default {
  name: 'ProductCreateAndEdit',
  components: {
    SideNavbar,
    ToolbarContent,
    ProductForm,
  },
  computed: {
    routeProductId() {
      return this.$route.params.productId ?? null;
    },
    pageTitle() {
      return this.routeProductId ? this.$t('products.edit-title') : this.$t('products.new-title');
    },
  },
};
</script>

<template>
  <div class="product-bg">
    <side-navbar />
    <div class="product-main">
      <toolbar-content :pageTitle="pageTitle" />
      <div class="product-content">
        <product-form :key="$route.fullPath" :product-id="routeProductId" :embedded="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-bg {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
}

.product-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-content {
  padding: 2rem;
}
</style>
