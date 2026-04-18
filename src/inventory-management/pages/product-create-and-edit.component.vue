<script>
import { ProductService } from '@/inventory-management/services/product.service.js';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import SideNavbar from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import { InputNumber as PvInputNumber, InputText as PvInputText, Select as PvSelect } from 'primevue';

const productService = new ProductService();
export default {
  name: 'ProductCreateAndEdit',
  components: {
    PvSelect,
    PvInputNumber,
    PvInputText,
    Button,
    InputText,
    InputNumber,
    SideNavbar,
    ToolbarContent
  },
  data() {
    return {
      product: {
        name: '',
        brandName: '',
        liquorType: '',
        unitPriceAmount: 0,
        minimumStock: 1,
        imageUrl: ''
      },
      liquorTypes: [
        { label: 'Rum', value: 'Rum' },
        { label: 'Whisky', value: 'Whisky' },
        { label: 'Gin', value: 'Gin' },
        { label: 'Vodka', value: 'Vodka' },
        { label: 'Tequila', value: 'Tequila' },
        { label: 'Brandy', value: 'Brandy' },
        { label: 'Wine', value: 'Wine' },
        { label: 'Beer', value: 'Beer' },
        { label: 'Creamy', value: 'Creamy' },
        { label: 'Herbal', value: 'Herbal' },
        { label: 'Fruity', value: 'Fruity' },
        { label: 'Special', value: 'Special' },
        { label: 'No Liquor Type', value: 'NoLiquorType' }
      ],
      brandNames: [
        { label: 'Tabernero', value: 'Tabernero' },
        { label: 'Santiago Queirolo', value: 'SantiagoQueirolo' },
        { label: 'Porton', value: 'Porton' },
        { label: 'Cristal', value: 'Cristal' },
        { label: 'Johnnie Walker', value: 'JohnnieWalker' },
        { label: 'Jack Daniels', value: 'JackDaniels' },
        { label: 'Budweiser', value: 'Budweiser' },
        { label: 'Heineken', value: 'Heineken' },
        { label: 'Corona', value: 'Corona' },
        { label: 'Pilsen Callao', value: 'PilsenCallao' },
        { label: 'Cusqueña', value: 'Cusqueña' },
        { label: 'Cartavio', value: 'Cartavio' },
        { label: 'No Brand', value: 'NoBrand' }
      ],
      isEditMode: false,
      selectedFile: null,
      submitting: false,
      existingImageUrl: null,
      newImagePreview: null
    };
  },
  created() {
    this.loadProduct();
  },
  methods: {
    async loadProduct() {
      const { productId } = this.$route.params;
      if (productId) {
        this.isEditMode = true;
        try {
          const data = await productService.getById(productId);
          this.product = {
            name: data.name,
            brandName: data.brandName,
            liquorType: data.liquorType,
            unitPriceAmount: data.unitPriceAmount,
            minimumStock: data.minimumStock,
            imageUrl: data.imageUrl
          };
          this.existingImageUrl = data.imageUrl || null;
        } catch (err) {
          console.error('Error loading product:', err);
        }
      }
    },
    uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.newImagePreview = e.target.result;
        this.product.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async onSave() {
      this.submitting = true;
      const toast = this.$toast;
      try {
        if (this.isEditMode) {
          await productService.updateProduct(
              this.$route.params.productId,
              this.product,
              this.selectedFile
          );
          toast.add({
            severity: 'success',
            summary: this.$t('toast.success'),
            detail: this.$t('products.success-updated'),
            life: 3000
          });
        } else {
          await productService.createProduct(this.product, this.selectedFile);
          toast.add({
            severity: 'success',
            summary: this.$t('toast.success'),
            detail: this.$t('products.success-created'),
            life: 3000
          });
        }
        this.$router.push({ name: 'ProductList' });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: this.$t('toast.error'),
          detail: this.$t('products.duplicate-product'),
          life: 3000
        });
        console.error('Error saving product:', error);
      } finally {
        this.submitting = false;
      }
    },
    async onDelete() {
      const toast = this.$toast;
      try {
        await productService.delete(this.$route.params.productId);
        toast.add({
          severity: 'success',
          summary: this.$t('toast.success'),
          detail: this.$t('products.success-deleted'),
          life: 3000
        });
        this.$router.push({ name: 'ProductList' });
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  }
};
</script>


<template>
  <div class="product-bg">
    <side-navbar />
    <div class="product-main">
      <toolbar-content :pageTitle="isEditMode ? $t('products.edit-title') : $t('products.new-title')" />
      <div class="product-content">
        <div class="form-card">
          <h2 class="form-title">{{ isEditMode ? $t('products.form-heading-edit') : $t('products.form-heading-new') }}</h2>
          <div class="form-grid">

            <div class="form-group">
              <label>{{ $t('products.name') }} <span class="important">*</span></label>
              <pv-input-text v-model="product.name" class="form-input" placeholder="Ron Cartavio" />
            </div>

            <div class="form-group">
              <label>{{ $t('products.brand') }} <span class="important">*</span></label>
              <pv-select
                  v-model="product.brandName"
                  :options="brandNames"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="$t('products.placeholder-brand')"
                  class="p-select"
              />
            </div>

            <div class="form-group">
              <label>{{ $t('products.liquor-type') }}<span class="important">*</span></label>
              <pv-select
                  v-model="product.liquorType"
                  :options="liquorTypes"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="$t('products.placeholder-liquor-type')"
                  class="p-select"
              />
            </div>

            <div class="form-group">
              <label>{{ $t('products.price') }} (S/)<span class="important">*</span></label>
              <pv-input-number v-model="product.unitPriceAmount" mode="currency" currency="PEN" locale="es-PE"/>
            </div>

            <div class="form-group">
              <label>{{ $t('products.minimum-stock') }}<span class="important">*</span></label>
              <pv-input-number v-model="product.minimumStock" :min="0"/>
            </div>

            <div class="form-group full-width image-section">
              <label>{{ $t('products.products-image') }}</label>
              <div class="image-upload-container">
                <label for="file-upload" class="upload-button">
                  <span>+ {{ $t('components.upload-file') }}</span>
                  <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      @change="uploadImage"
                      style="display: none;"
                  >
                </label>
                <span class="file-name">{{ selectedFile ? selectedFile.name : $t('components.no-chosen-file') }}</span>
              </div>

              <div v-if="product.imageUrl && !newImagePreview" class="image-preview">
                <p>{{ $t('components.actual-image') }}:</p>
                <img :src="product.imageUrl" :alt="product.name" />
              </div>

              <div v-if="newImagePreview" class="image-preview">
                <p>{{ $t('components.preview') }}:</p>
                <img :src="newImagePreview" :alt="product.name" />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <div class="right-actions">
              <Button :label="$t('products.back')" class="cancel-button" @click="$router.push({ name: 'ProductList' })" />
              <Button :label="$t('components.save')" class="submit-button" @click="onSave" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-bg {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
}

.product-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-content {
  padding: 2rem;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.form-title {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.full-width {
  grid-column: span 2;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #444;
}

.form-input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.p-select {
  width: 100%;
}

.p-inputnumber {
  width: 100%;
}

.p-inputnumber input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.image-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.image-upload-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.upload-button {
  background-color: #59033A;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #7a044d;
}

.file-name {
  color: #666;
  font-size: 0.9rem;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 6px;
  border: 1px solid #eee;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.right-actions {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #59033A;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #7a044d;
}

.important {
  color: #ea1c18;
}
</style>