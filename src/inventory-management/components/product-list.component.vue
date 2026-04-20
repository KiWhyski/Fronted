<template>
  <div class="product-grid">
    <div
        v-for="product in products"
        :key="product.productId"
        class="product-grid-tile"
    >
      <product-item
          :product="product"
          @edit="goToEditProduct"
          @delete="() => confirmDelete(product.productId)"
      />
    </div>

    <pv-confirm-dialog/>
  </div>
</template>

<script>
import { ProductService } from "@/inventory-management/services/product.service.js";

import ProductItem from "@/inventory-management/components/product-item.component.vue";
import {Product} from "@/inventory-management/model/product.entity.js";

export default {
  name: 'ProductListComponent',
  components: {ProductItem},
  props: {
    products: {
      type: Array[Product],
      required: true
    }
  },
  methods: {
    goToEditProduct(productId) {
      this.$router.push({ name: 'ProductEdit', params: { productId } });
    },
    confirmDelete(productId) {
      const confirm = this.$confirm;
      const toast = this.$toast;

      confirm.require({
        message: this.$t('products.confirm-delete'),
        header: this.$t('components.confirm-delete'),
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: this.$t('components.accept'),
        rejectLabel: this.$t('components.cancel'),
        acceptClass: 'p-button-danger',
        accept: async () => {
          try {
            const productService = new ProductService();
            await productService.delete(productId);
            toast.add({ severity: 'success', summary: this.$t('toast.deleted-success'), detail: this.$t('products.success-deleted'), life: 3000 });
            this.$emit('deleted');
          } catch (err) {
            console.error('Error deleting product:', err);
            toast.add({ severity: 'error', summary: this.$t('toast.error'), detail: 'Failed to delete product', life: 3000 });
          }
        },
      });
    }
  }
};
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  gap: clamp(1.25rem, 3vw, 1.75rem);
  padding: 0.25rem 0.5rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.product-grid-tile {
  display: flex;
  min-width: 0;
}
</style>
