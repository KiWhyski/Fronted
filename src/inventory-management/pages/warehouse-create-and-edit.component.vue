<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import { WarehouseService } from "@/inventory-management/services/warehouse.service.js";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const warehouseService = new WarehouseService();

export default {
  name: "warehouse-create-and-edit",
  components: {
    SideNavbar,
    ToolbarContent,
  },
  data() {
    return {
      toast: useToast(),
      router: useRouter(),
      route: useRoute(),
      isEditMode: false,
      warehouseId: null,
      submitted: false,
      selectedFile: null,
      existingImageUrl: null,
      newImagePreview: null,
      showDeleteDialog: false,
      errors: {},
      initialValues: {
        name: '',
        street: '',
        city: '',
        district: '',
        postalCode: '',
        country: '',
        maxTemperature: 0,
        minTemperature: 0,
        capacity: 0
      },
      form: {
        name: '',
        street: '',
        city: '',
        district: '',
        postalCode: '',
        country: '',
        maxTemperature: 0,
        minTemperature: 0,
        capacity: 0
      }
    };
  },
  created() {
    this.warehouseId = this.route.params.warehouseId;
    this.isEditMode = Boolean(this.warehouseId);
    if (this.isEditMode) {
      this.loadWarehouseData();
    }
  },
  methods: {
    async loadWarehouseData() {
      try {
        const warehouse = await warehouseService.getWarehouseById(this.warehouseId);
        this.form = { ...warehouse };
        this.existingImageUrl = warehouse.imageUrl || null;
      } catch (error) {
        setTimeout(() => this.router.push('/warehouses'), 2000);
      }
    },
    validateForm() {
      const errors = {};
      const t = this.$t;
      const v = this.form;

      if (!v.name?.trim()) errors.name = [{ message: t('errors.name-required') }];
      if (!v.street?.trim()) errors.street = [{ message: t('errors.street-required') }];
      if (!v.city?.trim()) errors.city = [{ message: t('errors.city-required') }];
      if (!v.district?.trim()) errors.district = [{ message: t('errors.district-required') }];
      if (!v.postalCode?.trim()) errors.postalCode = [{ message: t('errors.postal-code-required') }];
      if (!v.country?.trim()) errors.country = [{ message: t('errors.country-required') }];
      if (v.maxTemperature === null || isNaN(v.maxTemperature) || v.maxTemperature > 50 || v.maxTemperature < -50)
        errors.maxTemperature = [{ message: t('errors.max-temperature-required') }];
      if (v.minTemperature === null || isNaN(v.minTemperature) || v.minTemperature > 50 || v.minTemperature < -50)
        errors.minTemperature = [{ message: t('errors.min-temperature-required') }];
      if (v.capacity === null || isNaN(v.capacity) || v.capacity < 0)
        errors.capacity = [{ message: t('errors.capacity-required') }];

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async onSubmit() {
      if (this.submitted) return;
      this.submitted = true;

      if (!this.validateForm()) {
        this.submitted = false;
        return;
      }

      try {
        const warehouseData = { ...this.form };
        if (this.isEditMode) {
          await warehouseService.updateWarehouse(this.warehouseId, warehouseData, this.selectedFile);
          this.toast.add({
            severity: 'success',
            summary: this.$t('toast.success'),
            detail: this.$t('warehouses.update_success'),
            life: 3000
          });
        } else {
          await warehouseService.createWarehouse(warehouseData, this.selectedFile);
          this.toast.add({
            severity: 'success',
            summary: this.$t('toast.success'),
            detail: this.$t('warehouses.create_success'),
            life: 3000
          });
        }
        await this.router.push('/warehouses');
      } catch (error) {
        console.error('Error:', error);
        this.toast.add({
          severity: 'error',
          summary: this.$t('toast.error'),
          detail: this.$t('warehouses.error-message'),
          life: 5000
        });
      } finally {
        this.submitted = false;
      }
    },
    onFileSelect(event) {
      const file = event.target?.files?.[0];
      if (!file) return;
      this.selectedFile = file;
      this.newImagePreview = URL.createObjectURL(file);
    },
    onCancel() {
      this.router.push('/warehouses');
    },
    confirmDelete() {
      this.showDeleteDialog = true;
    },
    async onDelete() {
      this.showDeleteDialog = false;
      try {
        await warehouseService.deleteWarehouse(this.warehouseId);
        this.toast.add({
          severity: 'success',
          summary: this.$t('toast.success'),
          detail: this.$t('warehouses.delete_success'),
          life: 3000
        });
        await this.router.push('/warehouses');
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      }
    }
  }
};
</script>

<template>
  <div class="warehouse-bg">
    <side-navbar />
    <div class="warehouse-main">
      <toolbar-content :pageTitle="isEditMode ? $t('warehouses.editWarehouseTitle') : $t('warehouses.createWarehouseTitle')" />
      <div class="warehouse-content">
        <pv-form :initialValues="initialValues" @submit="onSubmit" v-slot="$form" class="form-card">
          <h2 class="form-title">{{ isEditMode ? $t('components.edit-data') : $t('components.complete-data') }}</h2>
          <div class="form-grid">

            <div class="form-group">
              <label>{{$t('warehouses.form.name')}} <span class="important">*</span></label>
              <pv-input-text
                  name="name"
                  v-model="form.name"
                  :placeholder="$t('warehouses.form.placeholder-name-example')"
                  class="form-input"
                  :class="{ 'input-error': errors.name }"
              />
              <pv-message v-if="$form.name?.invalid" class="form-error">{{ $form.name.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="street">{{$t('warehouses.form.street')}} <span class="important">*</span></label>
              <pv-input-text
                  name="street"
                  v-model="form.street"
                  type="text"
                  placeholder="Av. Sol"
                  class="form-input"
              />
              <pv-message v-if="$form.street?.invalid" class="form-error">{{ $form.street.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="city">{{$t('warehouses.form.city')}} <span class="important">*</span></label>
              <pv-input-text
                  name="city"
                  v-model="form.city"
                  type="text"
                  placeholder="Lima"
                  class="form-input"
              />
              <pv-message v-if="$form.city?.invalid" class="form-error">{{ $form.city.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="district">{{$t('warehouses.form.district')}} <span class="important">*</span></label>
              <pv-input-text
                  name="district"
                  v-model="form.district"
                  type="text"
                  placeholder="Villa El Salvador"
                  class="form-input"
              />
              <pv-message v-if="$form.district?.invalid" class="form-error">{{ $form.district.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="postalCode">{{$t('warehouses.form.postal-code')}} <span class="important">*</span></label>
              <pv-input-text
                  name="postalCode"
                  v-model="form.postalCode"
                  type="text"
                  placeholder="12345"
                  class="form-input"
              />
              <pv-message v-if="$form.postalCode?.invalid" class="form-error">{{ $form.postalCode.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="country">{{$t('warehouses.form.country')}} <span class="important">*</span></label>
              <pv-input-text
                  name="country"
                  v-model="form.country"
                  type="text"
                  placeholder="Perú"
                  class="form-input"
              />
              <pv-message v-if="$form.country?.invalid" class="form-error">{{ $form.country.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="max-temperature">{{$t('warehouses.form.max-temperature')}} <span class="important">*</span></label>
              <pv-input-text
                  name="maxTemperature"
                  v-model="form.maxTemperature"
                  type="number"
                  placeholder="10"
                  class="form-input"
                  min="0"
                  max="50"
              />
              <pv-message v-if="$form.maxTemperature?.invalid" class="form-error">{{ $form.maxTemperature.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="min-temperature">{{$t('warehouses.form.min-temperature')}} <span class="important">*</span></label>
              <pv-input-text
                  name="minTemperature"
                  v-model="form.minTemperature"
                  type="number"
                  placeholder="-10"
                  class="form-input"
                  min="-50"
                  max="50"
              />
              <pv-message v-if="$form.minTemperature?.invalid" class="form-error">{{ $form.minTemperature.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group full-width">
              <label for="capacity">{{$t('warehouses.form.capacity')}} (m²) <span class="important">*</span></label>
              <pv-input-text
                  name="capacity"
                  v-model="form.capacity"
                  type="number"
                  placeholder="1000"
                  class="form-input"
                  min="1"
              />
              <pv-message v-if="$form.capacity?.invalid" class="form-error">{{ $form.capacity.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group full-width image-section">
              <label>{{ $t('warehouses.form.warehouse-image') }}</label>
              <div class="image-upload-container">
                <label for="file-upload" class="upload-button">
                  <span>+ {{ $t('components.upload-file') }}</span>
                  <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      @change="onFileSelect"
                      style="display: none;"
                  >
                </label>
                <span class="file-name">{{ selectedFile ? selectedFile.name : $t('components.no-chosen-file') }}</span>
              </div>

              <div v-if="existingImageUrl && !newImagePreview" class="image-preview">
                <p>{{ $t('components.actual-image') }}:</p>
                <img :src="existingImageUrl" alt="image">
              </div>

              <div v-if="newImagePreview" class="image-preview">
                <p>{{ $t('components.preview') }}:</p>
                <img :src="newImagePreview" alt="image">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <pv-button v-if="isEditMode" type="button" class="delete-button" @click="confirmDelete">
              {{ $t('components.delete') }}
            </pv-button>

            <div class="right-actions">
              <pv-button type="button" class="cancel-button" @click="onCancel">
                {{ $t('components.cancel') }}
              </pv-button>
              <pv-button type="submit" class="submit-button">
                {{ isEditMode ? $t('components.update') : $t('components.save') }}
              </pv-button>
            </div>
          </div>

          <pv-dialog
              v-model:visible="showDeleteDialog"
              :style="{ width: '450px' }"
              header=" "
              :modal="true"
              :closable="true"
          >
            <div class="confirmation-content">
              <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
              <span>{{ $t('warehouses.delete_confirm') }}</span>
            </div>

            <template #footer>
              <pv-button
                  :label="$t('components.cancel')"
                  icon="pi pi-times"
                  @click="showDeleteDialog = false"
                  class="p-button-danger"
              />
              <pv-button
                  :label="$t('components.confirm')"
                  icon="pi pi-check"
                  @click="onDelete"
                  class="confirm-button"
                  autofocus
              />
            </template>
          </pv-dialog>

        </pv-form>
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
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #59033A;
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

.confirm-button {
  background-color: #f0f0f0;
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

.input-error {
  border-color: #e53935 !important;
}

.form-error {
  color: #e53935;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.important {
  color: #ea1c18;
}

.delete-button {
  background-color: #f44336;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: auto;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}

.p-dialog .p-dialog-footer button {
  margin: 0 0.5rem 0 0;
  min-width: 6rem;
}

/* Estilo para el botón de eliminar */
.p-button-danger {
  background-color: #f44336;
  border-color: #f44336;
  margin-right: auto;
}

.p-button-danger:hover {
  background-color: #d32f2f !important;
  border-color: #d32f2f !important;
}

/* Ajustes para los botones existentes */
.right-actions {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

</style>