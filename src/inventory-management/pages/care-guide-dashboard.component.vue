<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import CareGuideList from "@/inventory-management/components/care-guide-list.component.vue";
import CareGuideSummaryComponent from "@/inventory-management/components/care-guide-summary.component.vue";
import { CareGuideService } from '../services/care-guide.service.js';
import { ProductService } from "@/inventory-management/services/product.service.js";

export default {
  name: "care-guide-dashboard",
  components: {
    CareGuideDetail: CareGuideSummaryComponent,
    SideNavbar,
    CareGuideList
  },
  data() {
    return {
      guides: [],
      products: [],
      selectedGuide: null,
      searchQuery: '',
      loading: false,
      error: null
    }
  },
  computed: {
    /**
     * Returns the list of guides filtered by search query (by title)
     * @returns {Array}
     */
    filteredGuides() {
      if (!this.guides) return [];
      return this.guides.filter(guide => {
        if (!guide || !guide.title) return false;
        return guide.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    /**
     * Loads all care guides for the current account
     */
    async loadGuides() {
      this.loading = true;
      this.error = null;
      try {
        const accountId = localStorage.getItem('accountId');
        const response = await CareGuideService.getAll(accountId);
        this.guides = response || [];
      } catch (error) {
        this.error = error.message;
        console.error('Error loading care guides:', error);
        this.guides = [];
      } finally {
        this.loading = false;
      }
    },
    /**
     * Handles search input for filtering guides by title
     */
    async handleSearch() {
      // Filtering is done locally in computed property
    },
    /**
     * Handles edit action for a care guide
     * @param {Object} guide - The care guide to edit
     */
    handleEdit(guide) {
      this.$router.push(`/care-guides/${guide.id}/edit`);
    },
    /**
     * Handles delete action for a care guide
     * @param {string} guideId - The ID of the care guide to delete
     */
    async handleDelete(guideId) {
      if (!confirm('Are you sure you want to delete this care guide?')) {
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        await CareGuideService.delete(guideId);
        this.guides = this.guides.filter(g => g.id !== guideId);
        if (this.selectedGuide?.id === guideId) {
          this.selectedGuide = null;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error deleting care guide:', error);
      } finally {
        this.loading = false;
      }
    },
    /**
     * Navigates to the create care guide page
     */
    createGuide() {
      this.$router.push(`/care-guides/new`);
    },
    /**
     * Handles viewing the details of a care guide
     * @param {Object} guide - The care guide to view
     */
    handleViewDetail(guide) {
      this.selectedGuide = guide;
    }
  },
  async mounted() {
    this.guides = [];
    this.products = [];
    const accountId = localStorage.getItem('accountId');
    try {
      this.loading = true;
      const [guidesResponse, productsResponse] = await Promise.all([
        CareGuideService.getAll(accountId),
        new ProductService().getAllByAccountId()
      ]);
      this.products = productsResponse.data;
      // Assign productName to each care guide
      this.guides = guidesResponse.map(guide => {
        if (guide.productId) {
          const product = this.products.find(p => p.productId === guide.productId);
          guide.productName = product ? product.name : 'No Product Assigned';
        } else {
          guide.productName = 'No Product Assigned';
        }
        return guide;
      });
    } catch (error) {
      this.error = error.message;
      this.guides = [];
    } finally {
      this.loading = false;
    }
  }
}
</script>

<template>
  <!--
    Dashboard for listing, searching, creating, editing, and viewing care guides.
    Uses CareGuideList and CareGuideDetail components.
  -->
  <div class="dashboard-container">
    <SideNavbar />
    <div class="main-content">
      <div class="header">
        <h1>Care Guides</h1>
      </div>

      <div class="card-search">
        <div class="filter-row-with-btn">
          <div class="filter-row">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by title..."
                @input="handleSearch"
            />
          </div>
          <button class="btn main-action-btn" @click="createGuide">
            <i class="fas fa-plus"></i> New Care Guide
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading care guides...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button class="btn-secondary" @click="loadGuides">Retry</button>
      </div>

      <div v-else class="content-container">
        <div class="list-container">
          <CareGuideList
              :guides="filteredGuides"
              @view-detail="handleViewDetail"
              @edit="handleEdit"
              @delete="handleDelete"
          />
        </div>
        <div class="detail-container" v-if="selectedGuide">
          <CareGuideDetail :guide="selectedGuide" @close="selectedGuide = null" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f7eddc;
}
.main-content {
  flex: 1;
  padding: 2rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.title {
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.card-search {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  gap: 1rem;
}
.filter-row-with-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.create-btn {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 0 1.2rem;
}
h1{
  font-size: 3rem;
  font-weight: bold;
  color: #6F0082;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
}
h2{
  color: #26021C;
  font-family: 'Inter Semi Bold', sans-serif;
}
.filter-row input,
.filter-row select {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.btn.nuevo {
  background: #5A033A;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 26px;
  font-weight: bold;
}
.subtitle {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #e74c3c;
}

.error-container i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-container button {
  margin-top: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn.main-action-btn {
  background-color: #6E0081;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(110, 0, 129, 0.08);
}
.btn.main-action-btn:hover {
  background-color: #4b006e;
  box-shadow: 0 4px 16px rgba(110, 0, 129, 0.15);
}
</style>