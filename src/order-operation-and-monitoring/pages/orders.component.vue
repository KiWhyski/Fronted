<template>
  <SideNavbar>
    <ToolbarContent pageTitle="Orders" />

    <div class="orders-wrapper">


      <SalesOrderComponent
          v-if="isSupplier"
          :orders="orders"
      />

      <PurchaseOrder
          v-if="isLiquorStoreOwner"
          :orders="orders"
      />


      <p v-if="!isSupplier && !isLiquorStoreOwner" class="unauthorized">
        Tu cuenta no tiene acceso a órdenes.
      </p>
    </div>
  </SideNavbar>
</template>


<script>
import { ref, onMounted } from 'vue';
import { useAuthenticationStore } from '@/authentication/services/authentication.store.js';
import { PurchaseOrderService } from '@/order-operation-and-monitoring/services/purchase-order.service.js';

import SideNavbar        from '@/public/components/side-navbar.vue';
import ToolbarContent    from '@/public/components/toolbar-content.component.vue';
import Button            from 'primevue/button';

import SalesOrderComponent from "@/order-operation-and-monitoring/pages/sales-order.component.vue";
import PurchaseOrder  from '@/order-operation-and-monitoring/pages/purchase-order.component.vue';

export default {
  name: 'OrdersComponent',
  components: {
    SideNavbar,
    ToolbarContent,
    Button,
    SalesOrderComponent,
    PurchaseOrder
  },
  setup() {
    const authStore  = useAuthenticationStore();
    const orderSrv   = new PurchaseOrderService();

    const orders               = ref([]);
    const isSupplier           = ref(false);
    const isLiquorStoreOwner   = ref(false);

    const loadOrders = async () => {
      const account = authStore.account;

      if (!account?.accountRole) {
        console.error('Cuenta sin rol, imposible cargar órdenes');
        return;
      }

      try {
        if (account.accountRole === 'Supplier') {
          isSupplier.value = true;
          orders.value = await orderSrv.getAll({ supplierAccountId: account.accountId });
        } else if (account.accountRole === 'Liquor Store Owner') {
          isLiquorStoreOwner.value = true;
          orders.value = await orderSrv.getAll({ buyerAccountId: account.accountId });
        } else {
          console.warn('Rol no reconocido:', account.accountRole);
        }
      } catch (err) {
        console.error('❌ Error al obtener órdenes:', err.response?.data || err);
      }
    };

    onMounted(loadOrders);

    return {
      orders,
      isSupplier,
      isLiquorStoreOwner,
      loadOrders
    };
  }
};
</script>

<style scoped>
.orders-wrapper {
  padding: 1rem;
  background-color: #f7eddc;
  min-height: calc(100vh - 80px);
}

.refresh-btn {
  margin-bottom: 1rem;
  background-color: #5A033A;
  color: #fff;
  border: none;
  border-radius: 45px;
}
.refresh-btn:hover {
  background-color: #6E0081;
}

.unauthorized {
  color: #a00;
  font-weight: bold;
  margin-top: 2rem;
}
</style>