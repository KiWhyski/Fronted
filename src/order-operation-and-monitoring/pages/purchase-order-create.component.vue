<template>
  <SideNavbar>
    <ToolbarContent :pageTitle="$t('purchase.new-order')" />
    <div class="purchase-order-container">
      <p>{{ $t('purchase.total-items', { n: catalogItems.length }) }}</p>

      <table>
        <thead>
        <tr>
          <th>{{ $t('purchase.select') }}</th>
          <th>{{ $t('purchase.th-name') }}</th>
          <th>{{ $t('purchase.th-brand') }}</th>
          <th>{{ $t('purchase.th-price') }}</th>
          <th>{{ $t('purchase.th-quantity') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in catalogItems" :key="item.id">
          <td>
            <input class="check" type="checkbox" v-model="selectedItems[item.id]" />
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.brand }}</td>
          <td>{{ formatPrice(item.unitPrice) }}</td>
          <td>
            <input type="number"
                   min="1"
                   :placeholder="$t('purchase.qty-placeholder')"
                   v-model.number="quantities[item.id]"
                   :disabled="!selectedItems[item.id]"
                   class="qty-input" />
          </td>
        </tr>
        </tbody>
      </table>

      <p class="total-amount">{{ $t('purchase.total-amount-label') }} {{ formatPrice(totalAmount) }}</p>

      <button class="create-btn" @click="createOrder">🛒 {{ $t('purchase.save-order') }}</button>
    </div>
  </SideNavbar>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { CatalogService }        from '@/order-operation-and-monitoring/services/catalog.service';
import { PurchaseOrderService }  from '@/order-operation-and-monitoring/services/purchase-order.service';
import { AccountService }        from '@/payment-and-subscriptions/services/account.service';
import { useAuthenticationStore } from '@/authentication/services/authentication.store';

import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import SideNavbar     from '@/public/components/side-navbar.vue';

export default {
  name: 'PurchaseOrderCreateComponent',
  components: { SideNavbar, ToolbarContent },

  setup () {
    /* ---------- services & stores ---------- */
    const route           = useRoute();
    const router          = useRouter();
    const catalogService  = new CatalogService();
    const orderService    = new PurchaseOrderService();
    const accountService  = new AccountService();
    const authStore       = useAuthenticationStore();

    /* ---------- refs ---------- */
    const catalogId     = +route.params.catalogId;
    const catalog       = ref(null);
    const catalogItems  = ref([]);
    const selectedItems = ref({});
    const quantities    = ref({});

    const buyerAcc     = ref(null);
    const supplierAcc  = ref(null);

    /* ---------- computed ---------- */
    const totalAmount  = computed(() =>
        catalogItems.value.reduce((sum, item) => {
          if (selectedItems.value[item.id]) {
            const qty = quantities.value[item.id] || 1;
            return sum + (item.unitPrice * qty);
          }
          return sum;
        }, 0)
    );

    /* ---------- helpers ---------- */
    const formatPrice = (price) =>
        Number.isFinite(price)
            ? price.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })
            : 'S/ 0.00';

    /* ---------- data loading ---------- */
    const loadCatalogItems = async () => {
      const items = await catalogService.getCatalogItems(catalogId);

      catalogItems.value = items.map(i => ({
        ...i,
        unitPrice: Math.max(0, Number(i.unitPrice) || 0)
      }));

      // inicializar cantidades en 1
      catalogItems.value.forEach(i => { quantities.value[i.id] = 1; });
    };

    onMounted(async () => {
      /* comprador (buyer) */
      const myAccountId = authStore.account?.accountId;
      if (myAccountId) buyerAcc.value = accountService.getCurrentAccountId(myAccountId);

      /* catálogo y proveedor */
      catalog.value = await catalogService.getCatalogById(catalogId);
      if (catalog.value?.accountId)
        supplierAcc.value = accountService.getCurrentAccountId(catalog.value.accountId);

      /* productos */
      await loadCatalogItems();
    });

    /* ---------- order creation ---------- */
    const createOrder = async () => {
      const chosenIds = Object.keys(selectedItems.value).filter(id => selectedItems.value[id]);
      if (!chosenIds.length) { alert('Selecciona al menos un producto'); return; }

      if (!buyerAcc.value?.accountId || !supplierAcc.value?.accountId) {
        alert('Faltan datos del comprador o proveedor');
        return;
      }

      const buyer = {
        accountId    : buyerAcc.value.accountId,
        userOwnerId  : buyerAcc.value.userOwnerId ?? '',
        role         : buyerAcc.value.accountRole,
        businessName : buyerAcc.value.businessName,
        email        : buyerAcc.value.email
      };

      const supplier = {
        accountId    : supplierAcc.value.accountId,
        userOwnerId  : supplierAcc.value.userOwnerId ?? '',
        role         : supplierAcc.value.accountRole,
        businessName : supplierAcc.value.businessName,
        email        : supplierAcc.value.email
      };

      const items = catalogItems.value
          .filter(i => chosenIds.includes(i.id))
          .map(i => ({
            ...i,
            customQuantity: Number(quantities.value[i.id]) || 1
          }));

      const payload = {
        orderDate   : new Date().toISOString(),
        buyer,
        supplier,
        items,
        totalAmount : totalAmount.value,
        totalItems  : items.length
      };

      try {
        await orderService.createPurchaseOrder(payload);
        alert('Orden creada con éxito');
        router.push('/orders');
      } catch (err) {
        console.error('Error al crear orden:', err.response?.data || err);
        alert('Ocurrió un error al crear la orden');
      }
    };

    /* ---------- expose to template ---------- */
    return {
      catalogItems,
      selectedItems,
      quantities,
      totalAmount,
      formatPrice,
      createOrder
    };
  }
};
</script>

<style scoped>
.purchase-order-container {
  padding: 2rem;
  max-width: 1000px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 4rem auto 0;
  font-size: 1.3rem;
}
.purchase-order-container p {
  margin-bottom: 1rem;
  font-size: 2rem;
  color: #5A033A;
  font-weight: bold;
}
table {
  width: 100%;
  border: 2px solid #4E4E4E;
  margin-top: 2rem;
  text-align: center;
}
thead {
  background-color: #6E0081;
  color: white;
}
th, td {
  padding: 1rem;
  border: 1px solid #4E4E4E;
}
th {
  font-weight: bold;
  font-size: 1.2rem;
}
.check {
  width: 1.2rem;
  height: 1.2rem;
}
.qty-input {
  width: 4rem;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 4px;
}
.create-btn {
  background-color: #5A033A;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 45px;
  font-size: 1.3rem;
  cursor: pointer;
  margin-top: 2rem;
  transition: background-color 0.3s ease;
}
.create-btn:hover {
  background-color: #6E0081;
}

.total-amount {
  margin-top: 1rem;
  font-size: 1.5rem;
  color: #5A033A;
  font-weight: bold;
}
</style>