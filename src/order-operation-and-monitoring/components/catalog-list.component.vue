<template>
  <div class="catalog-grid">
    <div
        v-for="catalog in catalogs"
        :key="catalog.id"
        class="catalog-grid-tile"
    >
      <CatalogItem :catalog="catalog" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import CatalogItem from "@/order-operation-and-monitoring/components/catalog-item.component.vue";
import { CatalogService } from '@/order-operation-and-monitoring/services/catalog.service.js';
import { useAuthenticationStore } from '@/authentication/services/authentication.store.js';

export default {
  name: 'CatalogListComponent',
  components: {
    CatalogItem
  },
  setup() {
    const catalogs = ref([]);
    const catalogService = new CatalogService();
    const authStore = useAuthenticationStore();

    const loadCatalogs = async () => {
      const accountId = authStore.currentAccountId;
      if (!accountId) return;

      try {
        catalogs.value = await catalogService.getCatalogsByAccount(accountId);
      } catch (err) {
        console.error('Error fetching catalogs:', err);
      }
    };

    onMounted(() => {
      loadCatalogs();
    });

    return {
      catalogs
    };
  }
};
</script>

<style scoped>
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.catalog-grid-tile {
  display: flex;
}
</style>
