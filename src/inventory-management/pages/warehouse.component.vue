<script>
import WarehouseList from '@/inventory-management/components/warehouse-list.component.vue';
import WarehouseForm from '@/inventory-management/components/warehouse-form.component.vue';
import { WarehouseService } from '@/inventory-management/services/warehouse.service.js';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import SideNavbar from '@/public/components/side-navbar.vue';
import { Button as PvButton } from 'primevue';
import { AccountService } from '@/payment-and-subscriptions/services/account.service.js';

export default {
  name: 'warehouses',
  components: { PvButton, SideNavbar, ToolbarContent, WarehouseList, WarehouseForm },
  data() {
    return {
      warehouses: [],
      warehousesCount: 0,
      maxWarehouses: 0,
      showCreateModal: false,
      searchQuery: '',
    };
  },
  computed: {
    filteredWarehouses() {
      const q = (this.searchQuery || '').trim().toLowerCase();
      if (!q) {
        return this.warehouses;
      }
      return this.warehouses.filter((w) => {
        const hay = [w.name, w.city, w.district, w.street, w.fullAddress, w.warehouseId, String(w.capacity ?? '')]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    },
    hasNoWarehouseSearchMatches() {
      return (
        this.warehouses.length > 0 &&
        this.filteredWarehouses.length === 0 &&
        (this.searchQuery || '').trim() !== ''
      );
    },
  },
  methods: {
    async getWarehouses() {
      this.error = null;
      try {
        const warehouseService = new WarehouseService();
        this.warehouses = await warehouseService.getWarehousesByAccountId();
      } catch (error) {
        this.error = "Failed to load warehouses";
        console.error(error);
      }
    },
    async loadWarehouseLimits() {
      try {
        const warehouseService = new WarehouseService();
        const accountService = new AccountService();
        const current = await warehouseService.getWarehousesCount();
        const benefits = await accountService.getCurrentAccountBenefitsLimits();

        this.warehousesCount = current.count;
        this.maxWarehouses = benefits.maxWarehouses;
      } catch (error) {
        console.error("Error loading limits:", error);
      }
    },
    openCreateWarehouseModal() {
      this.showCreateModal = true;
    },
    onWarehouseFormSaved() {
      this.showCreateModal = false;
      this.getWarehouses();
      this.loadWarehouseLimits();
    },
  },
  created() {
    this.getWarehouses();
    this.loadWarehouseLimits();
  },
  activated() {
    this.getWarehouses();
    this.loadWarehouseLimits();
  },
}
</script>

<template>
  <div class="warehouse-bg">
    <side-navbar />
    <div class="warehouse-main">
      <toolbar-content :pageTitle="$t('warehouses.title')"/>

      <div class="warehouse-content">
        <div class="warehouse-management-content">
          <div class="products-toolbar">
            <div class="products-toolbar__inner">
              <div class="search-field">
                <i class="pi pi-search search-field__icon" aria-hidden="true" />
                <input
                  v-model="searchQuery"
                  type="search"
                  class="search-field__input"
                  :class="{ 'search-field__input--has-clear': searchQuery }"
                  :placeholder="$t('warehouses.search-placeholder')"
                  :aria-label="$t('warehouses.search-placeholder')"
                  autocomplete="off"
                  enterkeyhint="search"
                />
                <button
                  v-show="searchQuery"
                  type="button"
                  class="search-field__clear"
                  :aria-label="$t('products.search-clear')"
                  @click="searchQuery = ''"
                >
                  <i class="pi pi-times" aria-hidden="true" />
                </button>
              </div>
              <div class="limits-pill" role="status">
                <span class="limits-pill__icon-wrap" aria-hidden="true">
                  <i class="pi pi-warehouse limits-pill__icon" />
                </span>
                <p class="limits-pill__text">
                  {{ $t('warehouses.limitMessage', { current: warehousesCount, max: maxWarehouses }) }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="warehouses.length > 0 && hasNoWarehouseSearchMatches" class="search-empty">
            <p class="search-empty__text">{{ $t('warehouses.search-no-results') }}</p>
          </div>

          <warehouse-list
            v-else-if="warehouses.length > 0 && filteredWarehouses.length > 0"
            :warehouses="filteredWarehouses"
          />

          <div v-else class="empty-warehouses">
            <h3 class="empty-title">{{ $t('warehouses.emptyTitle') }}</h3>
            <p>{{ $t('warehouses.emptyDescription') }}</p>
          </div>
        </div>

        <div class="floating-action-container">
          <pv-button
              icon="pi pi-plus"
              :label="($t('warehouses.create'))"
              class="create-button p-button-raised p-button-rounded"
              @click="openCreateWarehouseModal"
              :aria-label="$t('warehouses.create')"
              :disabled="warehousesCount >= maxWarehouses"
          />
        </div>

        <pv-dialog
          v-model:visible="showCreateModal"
          :header="$t('warehouses.createWarehouseTitle')"
          :modal="true"
          :draggable="false"
          :closable="true"
          :dismissable-mask="true"
          class="warehouse-create-dialog"
          :style="{ width: 'min(720px, 96vw)' }"
          :breakpoints="{ '640px': '98vw' }"
        >
          <div class="warehouse-create-dialog__body">
            <warehouse-form
              v-if="showCreateModal"
              :embedded="true"
              @saved="onWarehouseFormSaved"
              @cancelled="showCreateModal = false"
            />
          </div>
        </pv-dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warehouse-bg {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
}

.warehouse-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.warehouse-content {
  padding: 2rem;
}

.warehouse-management-content {
  padding: 0 0 1rem;
}

.products-toolbar {
  max-width: 1280px;
  margin: 0 auto 1.5rem;
  padding: 0 0.5rem;
}

.products-toolbar__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.25rem;
  padding: 0.875rem 1rem 0.875rem 1.125rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 6px 20px rgba(0, 0, 0, 0.04);
}

.search-field {
  position: relative;
  flex: 1 1 min(100%, 240px);
  min-width: 0;
  max-width: 440px;
}

.search-field__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #aeaeb2;
  pointer-events: none;
}

.search-field__input {
  width: 100%;
  box-sizing: border-box;
  height: 44px;
  padding: 0 14px 0 2.55rem;
  font-size: 0.9375rem;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: #1d1d1f;
  background: #f5f5f7;
  border: 1px solid transparent;
  border-radius: 10px;
  outline: none;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-field__input--has-clear {
  padding-right: 2.65rem;
}

.search-field__input::placeholder {
  color: #86868b;
}

.search-field__input:hover {
  background: #ebebed;
}

.search-field__input:focus {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: none;
  outline: none;
}

.search-field__clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #86868b;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.search-field__clear:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #1d1d1f;
}

.search-field__clear .pi {
  font-size: 0.75rem;
}

.search-empty {
  max-width: 1280px;
  margin: 2rem auto 0;
  padding: 2rem 1rem;
  text-align: center;
}

.search-empty__text {
  margin: 0;
  font-size: 0.9375rem;
  color: #86868b;
  line-height: 1.5;
}

.floating-action-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.create-button,
.create-button.p-button {
  background-color: var(--app-green-accent, #16a34a);
  color: white;
  border: none;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  width: 12rem;
}

.create-button:hover {
  background-color: var(--app-green-accent-hover, #15803d) !important;
  border-color: var(--app-green-accent-hover, #15803d) !important;
  color: white !important;
  box-shadow: none;
}

.empty-warehouses {
  text-align: center;
  margin-top: 2rem;
}

.empty-title {
  font-size: 2.5rem;
  color: var(--app-green-accent, #16a34a);
}

.limits-pill {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  max-width: min(100%, 360px);
  padding: 0.5rem 0.9rem 0.5rem 0.65rem;
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f7 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}

.limits-pill__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.limits-pill__icon {
  font-size: 0.95rem;
  color: #6e6e73;
}

.limits-pill__text {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  letter-spacing: -0.015em;
  color: #424245;
  text-align: left;
  font-variant-numeric: tabular-nums;
}
</style>

<style>
.warehouse-create-dialog .warehouse-create-dialog__body {
  max-height: min(78vh, 640px);
  overflow-y: auto;
  padding-right: 0.25rem;
}
</style>