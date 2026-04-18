<script>
import axios from "axios";
import { isFrontendOnly } from "@/shared/config/frontend-only.js";

const API_BASE = "http://localhost:3000";

export default {
  name: "stock-settings-modal",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      saving: false
    };
  },
  async mounted() {
    await this.loadProducts();
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true;
        if (isFrontendOnly()) {
          this.products = [
            { id: '1', name: 'Producto demo', current: 10, min: 5 },
          ];
          return;
        }
        const res = await axios.get(`${API_BASE}/products`);
        this.products = res.data;
      } catch (err) {
        this.error = "Error loading products";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async updateMinStock(product) {
      try {
        this.saving = true;
        if (isFrontendOnly()) {
          this.$emit('stock-updated');
          return;
        }
        await axios.put(`${API_BASE}/products/${product.id}`, {
          ...product,
          min: product.min
        });
        this.$emit('stock-updated');
      } catch (err) {
        this.error = "Error updating stock minimum";
        console.error(err);
      } finally {
        this.saving = false;
      }
    },
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ $t('alerts.minimum-stock.title') }}</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div v-if="loading" class="loading">{{ $t('alerts.minimum-stock.loading') }}</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <table v-else class="products-table">
          <thead>
            <tr>
              <th>{{ $t('alerts.minimum-stock.form.product') }}</th>
              <th>{{ $t('alerts.minimum-stock.form.actual-stock') }}</th>
              <th>{{ $t('alerts.minimum-stock.form.minimum-stock') }}</th>
              <th>{{ $t('alerts.minimum-stock.form.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.current }}</td>
              <td>
                <input 
                  type="number" 
                  v-model.number="product.min" 
                  min="0"
                  :max="product.current"
                  class="stock-input"
                >
              </td>
              <td>
                <button 
                  class="save-button"
                  @click="updateMinStock(product)"
                  :disabled="saving"
                >
                  {{ saving ? 'Guardando...' : 'Guardar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #26021d;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
}

.close-button:hover {
  color: #26021d;
}

.modal-body {
  padding: 1.5rem;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.products-table th {
  background: #f8f8f8;
  font-weight: 600;
  color: #26021d;
}

.stock-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stock-input:focus {
  border-color: #6e0081;
  outline: none;
}

.save-button {
  background: #6e0081;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.save-button:hover {
  background: #59033a;
}

.save-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #d90429;
  text-align: center;
  padding: 1rem;
  background: #fff5f5;
  border-radius: 4px;
  margin: 1rem 0;
}
</style> 