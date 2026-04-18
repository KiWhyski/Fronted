<template>
  <pv-card class="product-card">
    <template #header>
      <img :src="product.imageUrl" alt="Product Image" class="product-img" />
    </template>
    <template #title>
      <div class="product-name">
        {{ displayName }}
      </div>
    </template>
    <template #subtitle>{{ displayBrand }} - {{ displayLiquorType }}</template>
    <template #content>
      <div class="product-content">
        <p><strong>{{ $t('products.card.price') }}</strong> {{ displayPrice }}</p>
        <p><strong>{{ $t('products.card.minimum-stock') }}</strong> {{ displayMinimumStock }}</p>
      </div>
    </template>
    <template #footer>
      <div class="footer-buttons">
        <pv-button
            icon="pi pi-pencil"
            class="p-button-sm p-button-secondary"
            @click="$emit('edit', product.productId)"
        />
        <pv-button
            icon="pi pi-trash"
            class="p-button-sm p-button-danger"
            @click="$emit('delete', product.productId)"
        />
      </div>
    </template>
  </pv-card>
</template>


<script>
import {Product} from "@/inventory-management/model/product.entity.js";

export default {
  name: 'ProductItem',
  props: {
    product: { type: Product, required: true }
  },
  computed: {
    displayName() {
      return this.product.name;
    },
    displayBrand() {
      return this.product.brandName;
    },
    displayLiquorType() {
      return this.product.liquorType;
    },
    displayPrice() {
      const amount = this.product.unitPriceAmount ?? 0;
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
      }).format(amount);
    },
    displayMinimumStock() {
      return this.product.updatedMinimumStock ?? this.product.minimumStock ?? 0;
    }
  }
};
</script>

<style scoped>
.product-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  width: 100%;
  background-color: #fff;
}

.product-card:hover {
  box-shadow: 0 5px 15px rgba(90, 3, 58, 0.2);
  border-color: #d8b4e2;
}

.product-img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f9f9f9;
  padding: 1rem;
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.product-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #5A033A;
  margin-bottom: 0.5rem;
}

.product-content {
  font-size: 1rem;
  color: #4E4E4E;
}
</style>
