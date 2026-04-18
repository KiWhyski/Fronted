<template>
  <div>
    <div class="provider-input">
      <span class="p-float-label">
        <label for="providerEmail">{{ $t('catalog.supplier-email') }}</label>
        <InputText id="providerEmail" class="InputText" v-model="providerEmail" :placeholder="$t('catalog.supplier-placeholder')" />
      </span>
      <Button :label="$t('catalog.search')" icon="pi pi-search" class="search-btn" @click="loadProviderCatalogs" />
    </div>

    <div class="market-container">
      <Card
          v-for="catalog in catalogs"
          :key="catalog.catalogId"
          class="catalog-card"
      >
        <template #title>
          <div class="catalog-name">
            {{ catalog.name }}
          </div>
        </template>
        <template #subtitle>{{ $t('catalog.published-on', { date: formatDate(catalog.dateCreated) }) }}
          <div class="catalog-content">
            <Button :label="$t('catalog.see-all-products')" icon="pi pi-eye" text @click="loadItems(catalog.catalogId)" />
            <ul v-if="selectedItems[catalog.catalogId]">
              <li
                  v-for="item in selectedItems[catalog.catalogId]"
                  :key="item.id"
                  class="product-info"
              >
                {{ item.name }} - {{ formatPrice(item.unitPrice) }}
              </li>
            </ul>
          </div>
        </template>

        <template #footer>
          <Button
              :label="$t('orders.new-order')"
              icon="pi pi-shopping-cart"
              @click="goToOrderPage(catalog.catalogId)"
              class="new-order"
          />
        </template>
      </Card>
    </div>
  </div>

</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { CatalogService } from '@/order-operation-and-monitoring/services/catalog.service.js';
import { Money } from '@/shared/model/money.js';
import { Currency } from '@/shared/model/currency.js';
import userService from "@/authentication/services/user.service.js";

export default {
  name: 'CatalogForOrders',
  components: {
    Card,
    Button,
    InputText
  },
  setup() {
    const catalogs = ref([]);
    const selectedItems = ref({});
    const providerEmail = ref('');
    const isAllowed = ref(false);

    const catalogService = new CatalogService();
    const router = useRouter();
    const toast = useToast();

    async function loadItems (catalogId) {
      if (!catalogId) {
        console.warn('[CatalogForOrders] catalogId vacío →', catalogId)
        return
      }
      try {
        console.log('[CatalogForOrders] solicitando items de', catalogId)
        const items = await catalogService.getCatalogItems(catalogId)
        selectedItems.value = { ...selectedItems.value, [catalogId]: items }
        console.log('[CatalogForOrders] recibidos', items.length, 'items')
      } catch (err) {
        console.error('[CatalogForOrders] Error al cargar productos', err)
        toast.add({ severity:'error', summary:'Error al cargar productos', life:3000 })
      }
    }

    async function loadProviderCatalogs() {
      if (!providerEmail.value) return;

      try {
        catalogs.value = await catalogService.getPublishedCatalogsByEmail(
            providerEmail.value.trim().toLowerCase()
        );

        if (!catalogs.value.length) {
          toast.add({
            severity: 'info',
            summary: 'Sin catálogos',
            detail: 'El proveedor no tiene catálogos publicados',
            life: 4000
          });
        }
      } catch (err) {
        const status = err.response?.status;
        const detail = err.response?.data ?? err.message;

        if (status === 404) {
          toast.add({ severity: 'warn', summary: 'Proveedor no encontrado', life: 3000 });
        } else if (status === 403) {
          toast.add({ severity: 'warn', summary: 'La cuenta no es Supplier', life: 3000 });
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail, life: 5000 });
        }
        console.error('[CatalogForOrders] Error al cargar catálogos publicados:', err);
      }
    }

    const goToOrderPage = (catalogId) => {
      router.push(`/purchase-order/new/${catalogId}`);
    };

    const formatPrice = (value) => {
      const amount = Number(value ?? 0);
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',          // “S/”
        minimumFractionDigits: 2
      }).format(amount);
    };

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return {
      catalogs,
      selectedItems,
      providerEmail,
      isAllowed,
      loadItems,
      loadProviderCatalogs,
      goToOrderPage,
      formatPrice,
      formatDate
    };
  }
};
</script>

<style scoped>
.market-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.catalog-card {
  width: 100%;
  max-width: 500px;
}

.provider-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-direction: column;
  .InputText {
    background-color: white;
    color: gray;
    border: 3px solid #5A033A;
    border-radius: 45px;
  }
  label {
    color: #5A033A;
    font-weight: bold;
    font-size: 1.3rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
}

.p-float-label {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.product-info {
  margin: 0.5rem 0;
}

.search-btn {
  height: 42px;
  background-color: #5A033A;
  color: white;
  width: fit-content;
  font-size: 1.2rem;
  border-radius: 45px;
  border: none;
}
.search-btn:hover {
  background-color: #6E0081;
  color: white;
}
.search-btn:focus {
  border-color: #6E0081;
  color: white;
}

.market-container {
  .catalog-card {
    background-color: #fff;
    border: 3px solid #5A033A;
    border-radius: 35px;
  }
  .catalog-name {
    font-size: 1.5rem;
    color: #5A033A;
    font-weight: bold;
  }
  .catalog-content {
    align-items: center;
    margin-top: 1rem;
    color: gray;
    padding: 2rem;
    Button {
      color: #6E0081;
      border-radius: 45px;
      border: none;
      padding: 0.5rem 1.5rem;
      font-size: 1.2rem;
    }
  }
}

.new-order {
  background-color: #5A033A;
  color: white;
  border-radius: 45px;
  border: none;
  padding: 0.5rem 1.5rem;
  font-size: 1.2rem;
}
.new-order:hover {
  background-color: #6E0081;
  color: white;
}

</style>
