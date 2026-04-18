<script>
import { FilterMatchMode } from '@primevue/core/api';
import { useRoute } from 'vue-router';
import { InventoryService } from "@/inventory-management/services/inventory.service.js";
import {ProductService} from "@/inventory-management/services/product.service.js";
import {Select as PvSelect} from "primevue";

const inventoryService = new InventoryService();
const productService = new ProductService();

export default {
  name: 'inventory-products',
  components: {PvSelect},
  data() {
    return {
      availableProducts: [],
      addProductDialog: false,
      addProductData: {
        selectedProductId: null,
        quantity: 1,
        expirationDate: null
      },
      products: [],
      productDialog: false,
      stockDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      statuses: [
        { label: 'WithStock', value: 'WithStock' },
        { label: 'OutOfStock', value: 'OutOfStock' }
      ],
      warehouseId: null,
      stockOperation: 'add',
      stockData: {
        quantity: 1,
        expirationDate: null
      }
    };
  },
  created() {
    this.initFilters();
    const route = useRoute();
    this.warehouseId = route.params.warehouseId;
  },
  async mounted() {
    try {
      await this.refreshProducts();
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async fetchAvailableProducts() {
      const accountId = 'test-acc';
      const response = await productService.getAllByAccountId(accountId);
      this.availableProducts = response.data;
    },
    async openAddProductDialog() {
      await this.fetchAvailableProducts();
      this.addProductData = {
        selectedProductId: null,
        quantity: 1,
        expirationDate: new Date()
      };
      this.addProductDialog = true;
    },
    async handleAddProduct() {
      try {
        const formattedDate = this.toDateOnlyString(this.addProductData.expirationDate);

        await inventoryService.addProduct(
            this.addProductData.selectedProductId,
            this.warehouseId,
            this.addProductData.quantity,
            formattedDate
        );

        this.$toast.add({
          severity: 'success',
          summary: this.$t('toast.success'),
          detail: this.$t('inventory.stock-added'),
          life: 3000
        });

        this.addProductDialog = false;
        await this.refreshProducts();
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('toast.error'),
          detail: error.response?.data?.message || this.$t('inventory.error-past-date'),
          life: 5000
        });
      }
    },
    async moveProductToWare() {
      try {

      } catch(error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('toast.error'),
          detail: error.response?.data?.message || this.$t('inventory.error-move-product'),
          life: 5000
        });
      }
    },
    async refreshProducts() {
      this.products = await inventoryService.getAllProductsByWarehouseId(this.warehouseId);
    },
    formatCurrency(value) {
      return value ? value.toLocaleString('es-Pe', {style: 'currency', currency: 'PEN'}) : '';
    },
    toDateOnlyString(date) {
      return date.getFullYear() + '-' +
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0');
    },
    openStockDialog(product, operation = 'add') {
      this.product = {...product};
      this.stockOperation = operation;

      this.stockData = {
        quantity: 1,
        expirationDate: product.bestBeforeDate
            ? new Date(product.bestBeforeDate + 'T12:00:00')
            : new Date()
      };

      this.stockDialog = true;
    },
    async handleStockOperation() {
      try {
        if (!this.stockData.expirationDate) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('toast.error'),
            detail:  this.$t('inventory.valid-date'),
            life: 5000
          });
          return;
        }

        if (this.stockOperation === 'subtract' && this.stockData.quantity > this.product.currentStock) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('toast.error'),
            detail: this.$t('inventory.stock-reduced-error'),
            life: 5000
          });
          return;
        }

        const formattedDate = this.toDateOnlyString(this.stockData.expirationDate);

        if (this.stockOperation === 'add') {
          console.log(formattedDate);
          await inventoryService.addStock(
              this.product.productId,
              this.warehouseId,
              this.stockData.quantity,
              formattedDate
          );
        } else {
          await inventoryService.subtractStock(
              this.product.productId,
              this.warehouseId,
              this.stockData.quantity,
              formattedDate
          );
        }

        this.$toast.add({
          severity: 'success',
          summary: this.$t('toast.success'),
          detail: this.stockOperation === 'add'
              ? this.$t('inventory.stock-added')
              : this.$t('inventory.stock-reduced'),
          life: 3000
        });

        await this.refreshProducts();
        this.stockDialog = false;
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response?.data?.message || 'Error processing stock operation',
          life: 5000
        });
      }
    },
    async handleDeleteProduct() {
      try {
        const expirationDate = this.product.bestBeforeDate;

        await inventoryService.deleteProduct(
            this.product.productId,
            this.warehouseId,
            expirationDate
        );

        this.$toast.add({
          severity: 'success',
          summary: this.$t('toast.success'),
          detail: this.$t('inventory.product-deleted'),
          life: 3000
        });

        await this.refreshProducts();
        this.deleteProductDialog = false;

      } catch (error) {

        this.$toast.add({
          severity: 'error',
          summary: this.$t('toast.error'),
          detail: error.response?.data?.message || this.$t('inventory.delete-product-current-stock'),
          life: 5000
        });

        this.deleteProductDialog = false;
      }
    },
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductDialog = true;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      };
    },
    getStatusLabel(status) {
      switch (status) {
        case 'WithStock': return 'success';
        case 'OutOfStock': return 'danger';
        default: return null;
      }
    }
  },
  computed: {
    addProductMinDate() {
      return new Date(new Date().setDate(new Date().getDate() + 1));
    },
  }
};
</script>

<template>
  <div class="inventory-container">
    <div>
      <div class="card">
        <pv-toolbar class="mb-6">
          <template #start>
            <pv-button :label="$t('components.add')" icon="pi pi-plus-circle" class="mr-2" @click="openAddProductDialog" />
            <pv-button :label="$t('inventory.transfer-product')" icon="pi pi-arrow-right" class="mr-2"/>
          </template>
          <template #end>
            <pv-button :label="$t('components.export')" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)"/>
          </template>
        </pv-toolbar>

        <pv-data-table
            ref="dt"
            v-model:selection="selectedProducts"
            :value="products"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
          <template #header>
            <div class="flex items-center w-full">
              <h4 class="m-4 inventory-title">{{ $t('inventory.manage-products') }}</h4>
              <div class="ml-auto">
                <pv-icon-field>
                  <pv-input-icon>
                    <i class="pi pi-search" />
                  </pv-input-icon>
                  <pv-input-text v-model="filters['global'].value" :placeholder="$t('components.search')" />
                </pv-icon-field>
              </div>
            </div>
          </template>

          <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false" />
          <pv-column field="name" :header="$t('inventory.name')" sortable style="min-width: 8rem" />
          <pv-column field="type" :header="$t('inventory.liquor-type')" sortable style="min-width: 8rem" />
          <pv-column field="imageUrl" :header="$t('inventory.image')" sortable style="min-width: 8rem">
            <template #body="slotProps">
              <img v-if="slotProps.data.imageUrl" :src="slotProps.data.imageUrl" alt="Product" class="rounded" style="width: 64px" />
            </template>
          </pv-column>
          <pv-column field="unitPriceAmount" :header="$t('inventory.unit-price')" sortable style="min-width: 8rem">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.unitPriceAmount) }}
            </template>
          </pv-column>
          <pv-column field="minimumStock" :header="$t('inventory.minimum-stock')" sortable style="min-width: 10rem" />
          <pv-column field="currentStock" :header="$t('inventory.current-stock')" sortable style="min-width: 8rem" />
          <pv-column field="status" :header="$t('inventory.state')" sortable style="min-width: 8rem">
            <template #body="slotProps">
              <pv-tag :value="$t(`inventory.status.${slotProps.data.status}`)" :severity="getStatusLabel(slotProps.data.status)"/>
            </template>
          </pv-column>
          <pv-column field="bestBeforeDate" :header="$t('inventory.best-date-before')" sortable style="min-width: 8rem"/>
          <pv-column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <pv-button icon="pi pi-plus" outlined rounded class="mr-2"
                         @click="openStockDialog(slotProps.data, 'add')" />
              <pv-button icon="pi pi-minus" outlined rounded severity="warning" class="mr-2"
                         @click="openStockDialog(slotProps.data, 'subtract')" />
              <pv-button icon="pi pi-trash" outlined rounded severity="danger"
                         @click="confirmDeleteProduct(slotProps.data)"/>
            </template>
          </pv-column>
        </pv-data-table>
      </div>

      <pv-dialog v-model:visible="stockDialog" :style="{ width: '500px' }"
                 :header="stockOperation === 'add' ? $t('inventory.stock-added-title') : $t('inventory.stock-reduced-title')"
                 :modal="true">
        <div class="edit-dialog">
          <div class="image-container">
            <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="product-image"/>
          </div>

          <div class="form-grid">
            <div class="col-span-2">
              <label class="block font-bold mb-2">{{ $t('inventory.product-id') }}</label>
              <pv-tag :value="product.productId" class="w-full" />
            </div>

            <div>
              <label class="block font-bold mb-2">{{ $t('inventory.name') }}</label>
              <pv-input-text :modelValue="product.name" disabled />
            </div>

            <div>
              <label class="block font-bold mb-2">{{ $t('inventory.liquor-type') }}</label>
              <pv-input-text :modelValue="product.type" disabled />
            </div>

            <div>
              <label class="block font-bold mb-2">{{ $t('inventory.unit-price') }}</label>
              <pv-input-number
                  :modelValue="product.unitPriceAmount"
                  disabled
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
              />
            </div>

            <div>
              <label class="block font-bold mb-2">{{ $t('inventory.current-stock') }}</label>
              <pv-input-number :modelValue="product.currentStock" disabled />
            </div>
            <div class="combined-row">
              <div class="quantity-field">
                <label class="block font-bold mb-2">
                  {{ stockOperation === 'add' ? $t('inventory.quantity-add') : $t('inventory.quantity-reduce') }}
                </label>
                <pv-input-number
                    v-model="stockData.quantity"
                    :min="1"
                    :max="stockOperation === 'subtract' ? product.currentStock : null"
                    showButtons
                    :step="1"
                    mode="decimal"
                    :disabled="stockOperation === 'subtract' && product.currentStock <= 0"
                />
              </div>

              <div class="date-field">
                <label class="block font-bold mb-2">
                  {{ stockOperation === 'add' ? $t('inventory.best-date-before') : $t('inventory.best-date-before') }}
                </label>
                <pv-date-picker
                    v-model="stockData.expirationDate"
                    dateFormat="yy-mm-dd"
                    showIcon
                    :minDate="stockOperation === 'add' ? new Date() : null"
                    :showButtonBar="true"
                    inputId="expiration-date"
                />
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <pv-button :label="$t('components.cancel')" icon="pi pi-times" @click="stockDialog = false" class="p-button-text cancel-btn" />
            <pv-button
                :label="stockOperation === 'add' ? $t('components.save') : $t('components.save')"
                icon="pi pi-check"
                @click="handleStockOperation"
                :class="{
            'p-button-success': stockOperation === 'add',
            'p-button-warning': stockOperation === 'subtract'
          }"
                class="action-btn"
            />
          </div>
        </template>
      </pv-dialog>

      <pv-dialog v-model:visible="addProductDialog" :style="{ width: '450px' }" :modal="true" :header="$t('inventory.add-product')">
        <div class="formgrid grid">
          <div class="field col-12">
            <label class="block mb-2">{{ $t('inventory.select-product') }}</label>
            <pv-select
                v-model="addProductData.selectedProductId"
                :options="availableProducts"
                optionLabel="name"
                optionValue="productId"
                :placeholder="$t('inventory.select-product')"
                filter
            />
          </div>
          <div class="field col-6">
            <label class="block mb-2">{{ $t('inventory.quantity-add') }}</label>
            <pv-input-number v-model="addProductData.quantity" :min="1" showButtons />
          </div>
          <div class="field col-6">
            <label class="block mb-2">{{ $t('inventory.best-date-before') }}</label>
            <pv-date-picker
                v-model="addProductData.expirationDate"
                dateFormat="yy-mm-dd"
                showIcon
                :minDate="addProductMinDate"
                :showButtonBar="true"
            />
          </div>
        </div>
        <template #footer>
          <pv-button :label="$t('components.cancel')" icon="pi pi-times" @click="addProductDialog = false" class="p-button-text" />
          <pv-button :label="$t('components.save')" icon="pi pi-check" @click="handleAddProduct" class="p-button-success" :disabled="!addProductData.selectedProductId"/>
        </template>
      </pv-dialog>

      <pv-dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" :header="$t('common.confirmation')" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span>{{ $t('inventory.confirm-delete-product') }}</span>
        </div>
        <template #footer>
          <pv-button :label="$t('components.cancel')" icon="pi pi-times" text @click="deleteProductDialog = false" />
          <pv-button :label="$t('components.confirm')" icon="pi pi-check" severity="danger" @click="handleDeleteProduct" />
        </template>
      </pv-dialog>


    </div>
  </div>
</template>

<style scoped>
.inventory-container {
  max-width: 2200px;
  margin: 2rem 1rem;
  padding: 1rem 2rem;
}

.inventory-title {
  font-size: 1.5rem;
}

.edit-dialog {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.product-image {
  max-width: 220px;
  max-height: 220px;
  object-fit: contain;
  border-radius: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.form-grid .col-span-2 {
  grid-column: span 2;
}

.combined-row {
  grid-column: span 2;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.quantity-field {
  flex: 1;
}

.date-field {
  flex: 1;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
}

</style>