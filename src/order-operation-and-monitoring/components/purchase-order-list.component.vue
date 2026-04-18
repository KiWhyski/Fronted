<template>
  <div class="purchase-list-card">
    <h2 class="recent-orders">{{ $t('orders.recent-orders') }}</h2>

    <DataTable
        v-if="orders.length > 0"
        :value="orders"
        class="p-datatable-striped"
        :paginator="true"
        :rows="5"
    >
      <Column field="id" :header="$t('common.col-id')">
        <template #body="{ data }">
          <span>{{ data.id }}</span>
        </template>
      </Column>

      <Column :header="$t('orders.col-date')">
        <template #body="{ data }">
          <span>{{ formatDate(data.orderDate ?? data.date ?? data._date) }}</span>
        </template>
      </Column>

      <Column field="status" :header="$t('orders.col-status')">
        <template #body="{ data }">
          <span>{{ data.status }}</span>
        </template>
      </Column>

      <Column :header="$t('orders.col-products')">
        <template #body="{ data }">
          <span>{{ data.totalItems !== undefined ? $t('orders.products-count', { n: data.totalItems }) : $t('orders.no-items') }}</span>
        </template>
      </Column>

      <Column :header="$t('orders.col-total')">
        <template #body="{ data }">
          <span>{{ formatPrice(data.totalAmount) }}</span>
        </template>
      </Column>
    </DataTable>

    <p v-else class="empty-text">{{ $t('orders.none') }}</p>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onMounted, ref } from 'vue';
import { PurchaseOrderService } from '@/order-operation-and-monitoring/services/purchase-order.service.js';
import { useAuthenticationStore } from '@/authentication/services/authentication.store.js';

export default {
  name: 'PurchaseOrderList',
  components: { DataTable, Column },
  props: {
    filterByBuyer: Boolean,
    filterBySupplier: Boolean,
    status: String
  },
  setup(props) {
    const orders = ref([]);
    const orderService = new PurchaseOrderService();
    const authStore = useAuthenticationStore();

    const formatPrice = (amount) => {
      if (typeof amount !== 'number' || !Number.isFinite(amount)) {
        return 'S/0.00';
      }
      return amount.toLocaleString('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
      });
    };

    const formatDate = (date) => {
      const d = typeof date === 'object' ? date._date ?? date : date;
      if (!d) return 'Invalid date';
      return new Date(d).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    onMounted(async () => {
      try {
        const filters = {};

        if (props.status) filters.status = props.status;

        if (props.filterByBuyer && authStore.account?.accountId) {
          filters.buyerAccountId = authStore.account.accountId;
        }

        if (props.filterBySupplier && authStore.account?.accountId) {
          filters.supplierAccountId = authStore.account.accountId;
        }

        orders.value = await orderService.getAll(filters);
      } catch (err) {
        console.error('❌ Error loading orders:', err.response?.data || err);
      }
    });

    return {
      orders,
      formatPrice,
      formatDate
    };
  }
};
</script>

<style scoped>
.purchase-list-card {
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.recent-orders {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #5A033A;
}
.p-datatable-striped {
  background-color: #ffffff;
}
.empty-text {
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;
}
</style>