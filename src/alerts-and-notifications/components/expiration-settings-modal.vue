<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Configurar Alertas de Vencimiento</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div v-if="loading" class="loading">Cargando configuración...</div>
        <div v-else>
          <div class="form-group">
            <label for="days">Días de anticipación para alertas:</label>
            <input 
              type="number" 
              id="days"
              v-model.number="days" 
              min="1"
              max="30"
              class="days-input"
            >
            <span class="input-hint">(1-30 días)</span>
          </div>

          <div v-if="error" class="error">{{ error }}</div>

          <div class="actions">
            <button 
              class="save-button"
              @click="saveSettings"
              :disabled="saving"
            >
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getExpirationSettings, updateExpirationSettings } from '../services/settings.service.js';

export default {
  name: "expiration-settings-modal",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      days: 7,
      loading: true,
      saving: false,
      error: null
    };
  },
  async mounted() {
    await this.loadSettings();
  },
  methods: {
    async loadSettings() {
      try {
        this.loading = true;
        const settings = await getExpirationSettings();
        this.days = settings.expirationAlertMargin || 7;
      } catch (err) {
        this.error = "Error al cargar la configuración";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    validateInput() {
      if (this.days < 1) {
        this.error = "El número de días debe ser mayor a 0";
        return false;
      }
      if (this.days > 30) {
        this.error = "El número de días no puede ser mayor a 30";
        return false;
      }
      return true;
    },
    async saveSettings() {
      if (!this.validateInput()) return;

      try {
        this.saving = true;
        await updateExpirationSettings(this.days);
        this.$emit('settings-updated');
        this.closeModal();
      } catch (err) {
        this.error = "Error al guardar la configuración";
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
  max-width: 500px;
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #26021d;
  font-weight: 500;
}

.days-input {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.days-input:focus {
  border-color: #6e0081;
  outline: none;
}

.input-hint {
  margin-left: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.save-button {
  background: #6e0081;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
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