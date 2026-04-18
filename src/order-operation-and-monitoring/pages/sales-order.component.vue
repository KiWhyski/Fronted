<template>
  <SideNavbar>
    <div class="order-container">
      <Card v-for="order in orders" :key="order.id" class="order-card">
        <template #title>
          <div class="order-title">
            Order #{{ order.id }}
          </div>
        </template>

        <template #content>
          <div class="order-content">
            <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
            <p><strong>Buyer:</strong> {{ order.buyer.email }}</p>
            <p>
              <strong>Status:</strong>
              <span :class="'st-' + order.status">{{ order.status }}</span>
              <Button
                  size="small"
                  icon="pi pi-pencil"
                  text
                  @click="openStatusDialog(order)"
              />
            </p>
            <p><strong>Total:</strong> {{ formatPrice(order.totalAmount) }}</p>

            <h4>Items:</h4>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} - {{ formatPrice(item.unitPrice) }}
              </li>
            </ul>
          </div>
        </template>
      </Card>
    </div>

    <Dialog
        v-model:visible="showDialog"
        modal
        header="Change order status"
        :style="{ width: '25rem' }"
    >
      <div class="p-fluid">
        <Dropdown
            v-model="selectedStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a status"
        />

        <div class="dlg-actions">
          <Button label="Cancel" severity="secondary" @click="showDialog=false" />
          <Button label="Save" icon="pi pi-check" @click="applyStatusChange" />
        </div>
      </div>
    </Dialog>
  </SideNavbar>
</template>

<script>
import { useAuthenticationStore } from '@/authentication/services/authentication.store.js';
import { PurchaseOrderService }   from '@/order-operation-and-monitoring/services/purchase-order.service.js';

import SideNavbar     from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import Card           from 'primevue/card';
import Button         from 'primevue/button';
import Dialog         from 'primevue/dialog';
import Dropdown       from 'primevue/dropdown';

export default {
  name: 'SalesOrderComponent',
  components: {
    SideNavbar,
    ToolbarContent,
    Card,
    Button,
    Dialog,
    Dropdown
  },

  data() {
    return {
      orders: [],
      showDialog: false,
      currentOrder: null,
      selectedStatus: null,
      statusOptions: [
        { label: 'Received',  value: 0 },
        { label: 'InProcess', value: 1 },
        { label: 'Arrived',   value: 2 },
        { label: 'Canceled',  value: 3 }
      ]
    };
  },

  methods: {
    formatDate(date) {
      const raw = typeof date === 'object' && date?._date ? date._date : date;
      return raw
          ? new Date(raw).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })
          : 'Fecha inválida';
    },

    formatPrice(amount = 0) {
      return Number.isFinite(amount)
          ? amount.toLocaleString('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 })
          : 'S/0.00';
    },

    async loadOrders() {
      try {
        const supplierAccountId = useAuthenticationStore().account?.accountId;
        if (!supplierAccountId) return;

        const resp = await new PurchaseOrderService().getAll({ supplierAccountId });
        this.orders = resp.map(o => ({
          ...o,
          totalAmount: Number(o.totalAmount) || 0,
          date: o.date?._date ?? o.date
        }));

        console.log('Orders received by the supplier:', this.orders);
      } catch (e) {
        console.error('Error loading supplier orders:', e);
      }
    },

    openStatusDialog(order) {
      if (order.status === 'Canceled') {
        alert('No puedes cambiar el estado de una orden cancelada.');
        return;
      }
      this.currentOrder   = order;
      this.selectedStatus = this.statusOptions.find(o => o.label === order.status)?.value ?? null;
      this.showDialog     = true;
    },

    async applyStatusChange() {
      if (!this.currentOrder || this.selectedStatus == null) return;

      try {
        const svc = new PurchaseOrderService();
        await svc.updateStatus(this.currentOrder.id, this.selectedStatus);
        this.currentOrder.status = this.statusOptions.find(opt => opt.value === this.selectedStatus).label;
        this.showDialog = false;
      } catch (e) {
        console.error('Error updating status', e);
        alert('No se pudo cambiar el estado.');
      }
    }
  },

  mounted() {
    this.loadOrders();
  }
};
</script>

<style scoped>
:root {
  --primary-900: #5A033A;   /* vino            */
  --primary-700: #6E0081;   /* púrpura oscuro  */
  --accent-100 : #f7eddc;   /* crema / fondo   */
  --text-900   : #242424;
  --text-600   : #555;
}

/* =============  LAYOUT ============= */
.order-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: var(--accent-100);
  min-height: 100vh;
}

/* ======  ORDER CARD  ====== */
.order-card {
  border-radius: 1.25rem;
  border: 3px solid var(--primary-900);
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, .08);
  background-color: #fff;
  transition: transform .2s ease, box-shadow .2s ease;
}
.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, .12);
}

/* ----- header / título ----- */
.order-title {
  font-weight: 700;
  font-size: 1.5rem;
  padding: .75rem 1.25rem;
  background: linear-gradient(135deg, var(--primary-900), var(--primary-700));
  color: #5A033A;
}

/* ----- contenido ----- */
.order-content {
  padding: 1.5rem;
  color: var(--text-600);
  line-height: 1.4;
}
.order-content p {
  color: #4E4E4E;
}
.order-content h4 {
  margin: 1rem 0 .5rem;
  color: #4E4E4E;
  font-weight: 600;
}
.order-content ul {
  list-style: disc;
  padding-left: 1.25rem;
  margin: .25rem 0 0;
  color: #4E4E4E;
}
.order-content li {
  margin-bottom: .25rem;
  color: #4E4E4E;
}

/* ======  STATUS CHIP  ====== */
.st-Received,
.st-InProcess,
.st-Arrived,
.st-Canceled {
  padding: .25rem .75rem;
  border-radius: 9999px;
  font-size: .75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .035em;
  color: #fff;
}
.st-Received   { background: #2e8b57; }
.st-InProcess  { background: #ff9800; }
.st-Arrived    { background: #2196f3; }
.st-Canceled   { background: #e53935; }

/* ======  BUTTONS  ====== */
.p-button {
  border-radius: 9999px !important;
}
.p-button.p-button-text {
  color: var(--primary-700);
}
.p-button.p-button-text:hover {
  background: var(--primary-700);
  color: #fff;
}

/* ======  DIALOG ====== */
.p-dialog {
  border-radius: 1rem;
}
.p-dialog-header {
  background: var(--primary-900);
  color: #fff;
}
.p-dialog .p-button {
  min-width: 110px;
}
.dlg-actions {
  display: flex;
  justify-content: flex-end;
  gap: .75rem;
  margin-top: 2rem;
}
</style>
