<template>

  <div class="products-bg">
    <side-navbar />
    <div class="products-main">
      <toolbar-content :pageTitle="$t('products.title')"/>
      <div class="products-content">
        <div class="product-management-content">

          <div v-if="products && products.length > 0" class="limits-info">
            <p>
              {{ $t('products.limitMessage', { current: productsCount, max: maxProducts }) }}
            </p>
          </div>

          <product-list-component v-if="products && products.length > 0" :products="products" @deleted="getProducts"/>

          <div v-else class="empty-products">
            <h3 class="empty-title">{{ $t('products.empty-title') }}</h3>
            <p>{{ $t('products.empty-description') }}</p>
          </div>
        </div>

        <div class="floating-action-container">
          <pv-button
              :label="$t('products.new-product')"
              icon="pi pi-plus"
              class="create-button p-button-raised p-button-rounded"
              @click="goToCreate"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import SideNavbar from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import Button from 'primevue/button';
import ProductListComponent from "@/inventory-management/components/product-list.component.vue";
import { useRouter } from 'vue-router';
import WarehouseList from "@/inventory-management/components/warehouse-list.component.vue";
import {ProductService} from "@/inventory-management/services/product.service.js";
import {Product} from "@/inventory-management/model/product.entity.js";
import {Button as PvButton} from "primevue";
import {AccountService} from "@/payment-and-subscriptions/services/account.service.js";

export default {
  name: 'ProductManagementComponent',
  components: {
    PvButton,
    WarehouseList,
    ProductListComponent,
    SideNavbar,
    ToolbarContent,
    Button,
  },
  data() {
    return {
      products: [],
      productsApi: new ProductService(),
      productsCount: 0,
      maxProducts: 0,
    }
  },
  setup() {
    const router = useRouter();

    const goToCreate = () => {
      router.push({ name: 'ProductCreate' });
    };

    return {
      goToCreate
    };
  },
  methods: {
    async getProducts() {
      this.error = null;
      try {
        const response = await this.productsApi.getAllByAccountId();
        this.products = response.data.map(item => new Product(
          {
            productId: item.productId,
            name: item.name,
            brandName: item.brandName,
            liquorType: item.liquorType,
            unitPriceAmount: item.unitPriceAmount,
            minimumStock: item.minimumStock,
            imageUrl: item.imageUrl,
            accountId: item.accountId
          }
        ));
      } catch (error) {
        this.error = "Failed to load products";
        console.error(error);
      }
    },
    async loadProductLimits() {
      try {
        const productService = new ProductService();
        const accountService = new AccountService();
        const current = await productService.getProductsCount();
        const benefits = await accountService.getCurrentAccountBenefitsLimits();

        this.productsCount = current.count;
        this.maxProducts = benefits.maxProducts;
      } catch (error) {
        console.error("Error loading limits:", error);
      }
    }
  },
  created() {
    this.getProducts();
    this.loadProductLimits();
  }
};
</script>

<style scoped>

.products-bg {
  background: #F7EDDC;
  min-height: 100vh;
  display: flex;
}

.products-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.products-content {
  padding: 2rem;
}

.product-management-content {
  padding: 1rem 2rem;
}

.p-button-success:hover {
  background-color: #6E0081;
}

.floating-action-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.create-button {
  background-color: #790b38;
  color: white;
  border: none;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  width: 12rem;
}

.create-button:hover {
  background-color: #46062c !important;
  border-color: #46062c !important;
  transform: translateY(-1px);
  color: white !important;
  filter: brightness(1.1);
  box-shadow: 0 3px 5px rgba(89, 3, 58, 0.3);
}

.empty-products {
  text-align: center;
  margin-top: 2rem;
}

.empty-title {
  font-size: 2.5rem;
  color: #790b38;
}

.limits-info {
  margin: 0 0 1.5rem auto;
  font-size: 1.1rem;
  color: #333;
  max-width: 1200px;
  padding: 0 1rem;
  text-align: right;
  width: fit-content;
}
</style>
