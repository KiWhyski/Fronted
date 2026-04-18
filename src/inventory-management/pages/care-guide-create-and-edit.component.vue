<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import { CareGuideService } from "../services/care-guide.service.js";
import { ProductService } from "../services/product.service.js";
import PvSelect from 'primevue/select';

export default {
  name: "care-guide-create-and-edit",
  components: { SideNavbar, PvSelect },
  /**
   * Props definition
   * @property {String|Number} id - Care guide ID (for edit mode)
   * @property {Boolean} isEdit - Whether the form is in edit mode
   */
  props: {
    id: {
      type: [String, Number],
      required: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        title: '',
        summary: '',
        minTemp: '',
        maxTemp: '',
        placeStorage: '',
        recommendation: '',
        productId: null
      },
      products: [],
      allProducts: [],
      loading: false,
      successMessage: '',
      errorMessage: '',
      showUnassign: false
    };
  },
  computed: {
    /**
     * Returns the form title depending on the mode
     * @returns {string}
     */
    formTitle() {
      return this.isEdit ? 'Edit Care Guide' : 'New Care Guide';
    }
  },
  async mounted() {
    // Load products for the select field
    await this.loadProducts();
    // If editing, load the care guide data
    if (this.isEdit && this.id) {
      this.loading = true;
      try {
        const accountId = localStorage.getItem('accountId');
        const guide = await CareGuideService.getById(accountId, this.id);
        this.form.title = guide.title;
        this.form.summary = guide.summary;
        this.form.minTemp = guide.minTemp;
        this.form.maxTemp = guide.maxTemp;
        this.form.placeStorage = guide.placeStorage;
        this.form.recommendation = guide.recommendation;
        this.form.productId = guide.productId;
      } catch (error) {
        this.errorMessage = error.message || 'Failed to load care guide.';
      } finally {
        this.loading = false;
      }
    }
  },
  methods: {
    /**
     * Loads the list of products for the select field
     */
    async loadProducts() {
      try {
        const productService = new ProductService();
        const response = await productService.getAllByAccountId();
        this.allProducts = response.data || [];
        // Get all care guides to know which products are already assigned
        const accountId = localStorage.getItem('accountId');
        const guides = await CareGuideService.getAll(accountId);
        const assignedProductIds = guides
          .filter(g => g.productId && (!this.isEdit || g.id !== this.id))
          .map(g => g.productId);
        // Only show products not already assigned, or the currently assigned one if editing
        this.products = this.allProducts.filter(p =>
          !assignedProductIds.includes(p.productId) || (this.isEdit && this.form.productId === p.productId)
        );
      } catch (error) {
        this.products = [];
        console.error('Failed to load products:', error);
      }
    },
    /**
     * Handles form submission for creating or updating a care guide
     */
    async save() {
      this.successMessage = '';
      this.errorMessage = '';
      const min = parseFloat(this.form.minTemp);
      const max = parseFloat(this.form.maxTemp);
      // Basic validation
      if (
        !this.form.title ||
        !this.form.summary ||
        this.form.minTemp === '' ||
        this.form.maxTemp === '' ||
        isNaN(min) ||
        isNaN(max) ||
        min > max ||
        !this.form.placeStorage ||
        !this.form.recommendation
      ) {
        this.errorMessage = 'Please fill in all fields correctly. Minimum temperature must be less than or equal to maximum and both must be numbers.';
        return;
      }
      // Extra validation: prevent assigning a product that already has a care guide
      if (this.form.productId) {
        const alreadyAssigned = this.allProducts.find(p => p.productId === this.form.productId && !this.products.some(prod => prod.productId === p.productId));
        if (alreadyAssigned) {
          this.errorMessage = 'This product already has a care guide assigned.';
          return;
        }
      }
      this.loading = true;
      try {
        const accountId = localStorage.getItem('accountId');
        if (this.isEdit) {
          // Update care guide fields
          const updateData = {
            newTitle: this.form.title,
            newSummary: this.form.summary,
            newMinTemp: min,
            newMaxTemp: max,
            newPlaceStorage: this.form.placeStorage,
            newRecommendation: this.form.recommendation
          };
          await CareGuideService.update(this.id, updateData);

          // Handle product assignment changes
          const originalGuide = await CareGuideService.getById(accountId, this.id);
          let originalProductId = originalGuide.productId;
          let newProductId = this.form.productId;
          if (!newProductId) newProductId = null;
          if (originalProductId !== newProductId) {
            if (originalProductId && !newProductId) {
              await CareGuideService.unassignFromProduct(this.id);
              this.successMessage = 'Product unassigned successfully.';
            } else if (!originalProductId && newProductId) {
              await CareGuideService.assignToProduct(this.id, newProductId);
              this.successMessage = 'Product assigned successfully.';
            } else if (originalProductId && newProductId && originalProductId !== newProductId) {
              await CareGuideService.unassignFromProduct(this.id);
              await CareGuideService.assignToProduct(this.id, newProductId);
              this.successMessage = 'Product changed successfully.';
            }
          } else {
            this.successMessage = 'Care guide updated successfully.';
          }
        } else {
          // Create care guide
          const createData = {
            title: this.form.title,
            summary: this.form.summary,
            minTemp: min,
            maxTemp: max,
            placeStorage: this.form.placeStorage,
            recommendation: this.form.recommendation
          };
          let selectedProductId = this.form.productId;
          if (!selectedProductId) selectedProductId = null;
          if (selectedProductId) {
            await CareGuideService.createForProduct(accountId, selectedProductId, createData);
          } else {
            await CareGuideService.create(accountId, createData);
          }
          this.successMessage = 'Care guide created successfully.';
        }
        setTimeout(() => {
          this.successMessage = '';
          this.$router.push('/care-guides');
        }, 1200);
      } catch (error) {
        this.errorMessage = error.message || 'Error saving care guide.';
      } finally {
        this.loading = false;
      }
    },
    async unassignProduct() {
      try {
        await CareGuideService.unassignFromProduct(this.id);
        this.form.productId = null;
        this.successMessage = 'Product unassigned successfully.';
        await this.loadProducts();
      } catch (error) {
        this.errorMessage = error.message || 'Error unassigning product.';
      }
    },
    /**
     * Cancels and navigates back to the care guides list
     */
    cancel() {
      this.$router.push('/care-guides');
    }
  }
};
</script>

<template>
  <div class="create-guide-page">
    <side-navbar />
    <div class="main">
      <div class="header">
        <button class="back-btn" @click="cancel">
          <i class="pi pi-arrow-left"></i>
        </button>
        <h1>{{ formTitle }}</h1>
      </div>

      <!--
        Form for creating or editing a care guide.
        Fields: title, summary, minTemp, maxTemp, placeStorage, recommendation, productId.
      -->
      <form @submit.prevent="save" class="form">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
        <template v-else>
          <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" type="text" required />
          </div>
          <div class="form-group">
            <label>Summary</label>
            <input v-model="form.summary" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Minimum temperature (°C)</label>
              <input v-model="form.minTemp" type="number" step="0.1" min="-100" max="100" required />
            </div>
            <div class="form-group">
              <label>Maximum temperature (°C)</label>
              <input v-model="form.maxTemp" type="number" step="0.1" min="-100" max="100" required />
            </div>
          </div>
          <div class="form-group">
            <label>Storage Place</label>
            <input v-model="form.placeStorage" type="text" required placeholder="e.g. cool and dry place" />
          </div>
          <div class="form-group">
            <label>Recommendation</label>
            <input v-model="form.recommendation" type="text" required placeholder="e.g. Keep the bottle upright" />
          </div>
          <div class="form-group">
            <label>Product</label>
            <PvSelect
              v-model="form.productId"
              :options="products"
              optionLabel="name"
              optionValue="productId"
              placeholder="No Product Assigned"
              :showClear="true"
              :filter="true"
              style="width: 100%"
            />
            <button v-if="isEdit && form.productId" type="button" class="btn cancel" @click="unassignProduct" style="margin-top: 0.5rem;">Unassign Product</button>
          </div>
          <div class="form-group">
            <button type="submit" class="btn save" :disabled="loading">Save</button>
            <button type="button" class="btn cancel" @click="cancel">Cancel</button>
          </div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </template>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-guide-page {
  display: flex;
}
.main {
  flex: 1;
  padding: 2rem;
}
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6E0081;
}
.form {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-row {
  display: flex;
  gap: 1.5rem;
}
.form-row .form-group {
  flex: 1;
}
.btn.save {
  background-color: #6E0081;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 1rem;
}
.btn.cancel {
  background-color: #ccc;
  color: #333;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.success-message {
  color: #2e7d32;
  margin-top: 1rem;
}
.error-message {
  color: #c62828;
  margin-top: 1rem;
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6E0081;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>