<script>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import profileService from "@/profile-management/services/profile.service.js";
import userService from "@/authentication/services/user.service.js";

export default {
  name: 'profile-edit',
  setup() {
    const toast = useToast();
    const { t } = useI18n();

    const hideActual = ref(true);
    const hideNew = ref(true);
    const hideConfirm = ref(true);

    const form = reactive({
      profileId: null,
      name: '',
      email: '',
      businessName: '',
      businessAddress: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const errors = reactive({
      name: '',
      email: '',
      businessName: '',
      businessAddress: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordMismatch: ''
    });

    const validateForm = () => {
      let isValid = true;
      errors.name = !form.name ? t('profile.errors.name-required') : '';
      errors.email = !form.email ? t('profile.errors.email-required') :
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? t('profile.errors.email-invalid') : '';
      errors.businessName = !form.businessName ? t('profile.errors.business-name-required') : '';
      errors.businessAddress = !form.businessAddress ? t('profile.address-required') : '';
      errors.phone = !form.phone ? t('profile.errors.phone-required') : '';

      if (form.newPassword || form.confirmPassword) {
        if (form.newPassword !== form.confirmPassword) {
          errors.passwordMismatch = t('profile.password-mismatch');
          isValid = false;
        } else {
          errors.passwordMismatch = '';
        }
      }

      return isValid && !Object.values(errors).some(error => error);
    };

    const save = async () => {
      if (!validateForm()) {
        toast.add({
          severity: 'error',
          summary: t('profile.errors.validation-summary'),
          detail: t('profile.errors.validation-detail'),
          life: 3000
        });
        return;
      }

      try {
        await profileService.editProfile(form);
        toast.add({
          severity: 'success',
          summary: t('toast.success'),
          detail: t('profile.errors.save-success'),
          life: 3000
        });
        resetForm();
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: t('toast.error'),
          detail: t('profile.errors.save-error'),
          life: 3000
        });
      }
    };

    const cancel = () => {
      resetForm();
    };

    const resetForm = () => {
      Object.keys(form).forEach(key => form[key] = '');
      Object.keys(errors).forEach(key => errors[key] = '');
    };


    onMounted(async () => {
      /*
      if (!currentUser || !currentUser.profileId) {
        console.error('No profileId found in currentUser');
        return;
      }


      try {
        const profile = await profileService.getProfileById(currentUser.profileId);
        Object.assign(form, profile);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      }
      */
    });

    return {
      form,
      errors,
      hideActual,
      hideNew,
      hideConfirm,
      save,
      cancel
    };
  }
};
</script>


<template>
  <div class="profile-edit-container profile-edit--apple">
    <div class="profile-left">
      <div class="password-section">
        <h2>{{ $t('profile.change-password-title') }}</h2>

        <div class="form-group">
          <label>{{ $t('profile.current-password') }}</label>
          <div class="password-input">
            <input
                :type="hideActual ? 'password' : 'text'"
                v-model="form.currentPassword"
                class="form-input"
                :placeholder="$t('profile.placeholder-current-password')"
            />
            <button
                type="button"
                class="toggle-password"
                @click="hideActual = !hideActual"
            >
              <i :class="hideActual ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>{{ $t('profile.new-password') }}</label>
          <div class="password-input">
            <input
                :type="hideNew ? 'password' : 'text'"
                v-model="form.newPassword"
                class="form-input"
                :placeholder="$t('profile.placeholder-new-password')"
            />
            <button
                type="button"
                class="toggle-password"
                @click="hideNew = !hideNew"
            >
              <i :class="hideNew ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>{{ $t('profile.confirm-password') }}</label>
          <div class="password-input">
            <input
                :type="hideConfirm ? 'password' : 'text'"
                v-model="form.confirmPassword"
                class="form-input"
                :placeholder="$t('profile.placeholder-confirm-new-password')"
            />
            <button
                type="button"
                class="toggle-password"
                @click="hideConfirm = !hideConfirm"
            >
              <i :class="hideConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <span v-if="errors.passwordMismatch" class="error-message">
            {{ errors.passwordMismatch }}
          </span>
        </div>

        <div class="actions">
          <button class="save-button" @click="save">{{ $t('components.save') }}</button>
          <button class="cancel-button" @click="cancel">{{ $t('components.cancel') }}</button>
        </div>
      </div>
    </div>

    <div class="profile-right">
      <div class="profile-section">
        <h2>{{ $t('profile.profile-info-title') }}</h2>

        <div class="form-group">
          <label>{{ $t('profile.name-label') }}</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.name"
                class="form-input"
                :placeholder="$t('profile.placeholder-name')"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label>{{ $t('profile.email-label') }}</label>
          <div class="input-with-icon">
            <input
                type="email"
                v-model="form.email"
                class="form-input"
                :placeholder="$t('profile.placeholder-email')"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>{{ $t('profile.business-label') }}</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.businessName"
                class="form-input"
                :placeholder="$t('profile.placeholder-business')"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.businessName" class="error-message">{{ errors.businessName }}</span>
        </div>

        <div class="form-group">
          <label>{{ $t('profile.phone-label') }}</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.phone"
                class="form-input"
                :placeholder="$t('profile.placeholder-phone')"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label>{{ $t('profile.business-address') }}</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.businessAddress"
                class="form-input"
                :placeholder="$t('profile.placeholder-business-address')"
            />
            <button class="map-button">
              <i class="pi pi-map-marker"></i>
            </button>
          </div>
          <span v-if="errors.businessAddress" class="error-message">{{ errors.businessAddress }}</span>
        </div>

        <div class="actions">
          <button class="save-button" @click="save">{{ $t('components.save') }}</button>
          <button class="cancel-button" @click="cancel">{{ $t('components.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.profile-edit--apple.profile-edit-container {
  /* Mismo verde global que alertas / inventario / sidebar */
  --stocksip-green: var(--app-green-accent, #16a34a);
  --stocksip-green-hover: var(--app-green-accent-hover, #15803d);
  --stocksip-green-soft: rgba(22, 163, 74, 0.09);
  --stocksip-green-border: rgba(22, 163, 74, 0.28);
  --apple-focus-ring: rgba(22, 163, 74, 0.12);
  --apple-focus-border: rgba(22, 163, 74, 0.22);
  --apple-text: #1d1d1f;
  --apple-secondary: rgba(60, 60, 67, 0.6);
  --apple-border: rgba(60, 60, 67, 0.12);
  --apple-field-bg: #f2f2f7;
  --apple-field-bg-focus: #ffffff;
  --apple-placeholder: rgba(60, 60, 67, 0.35);
  --apple-bg: #ffffff;
  --apple-card: #ffffff;
  --apple-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --profile-title-color: #111111;
  /* Cápsula: inputs y botones. Las tarjetas usan menos radio para no verse “pastilla” */
  --apple-input-radius: 999px;
  --apple-button-radius: var(--apple-input-radius);
  --apple-container-radius: 12px;
  gap: 0.75rem;
  padding: 0;
  font-family: var(--apple-font);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 692px;
}

.profile-edit--apple .profile-left,
.profile-edit--apple .profile-right {
  width: 100%;
  flex: none;
}

.profile-edit--apple .password-section,
.profile-edit--apple .profile-section {
  background-color: var(--apple-card);
  padding: 1rem 1rem 1.125rem;
  border-radius: var(--apple-container-radius);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  max-width: none;
  width: 100%;
  box-sizing: border-box;
}

.profile-edit--apple h2 {
  color: var(--profile-title-color);
  font-family: var(--apple-font);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.profile-edit--apple .form-group {
  margin-bottom: 0.875rem;
  width: 100%;
}

.profile-edit--apple .form-group label {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--apple-secondary);
  font-weight: 400;
  font-size: 0.8125rem;
  letter-spacing: -0.01em;
}

/* Campos: fondo gris sistema, foco blanco + anillo verde suave (marca global) */
.profile-edit--apple .form-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  min-height: 44px;
  padding-left: 16px;
  padding-right: 16px;
  border: 1px solid transparent;
  border-radius: var(--apple-input-radius);
  font-family: var(--apple-font);
  font-size: 17px;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--apple-text);
  background-color: var(--apple-field-bg);
  background-clip: padding-box;
  outline: none;
  box-shadow: inset 0 0 0 0.5px rgba(60, 60, 67, 0.14);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

.profile-edit--apple .form-input::placeholder {
  color: var(--apple-placeholder);
  opacity: 1;
}

.profile-edit--apple .form-input:hover:not(:focus) {
  background-color: #ebebf0;
}

.profile-edit--apple .form-input:focus {
  border-color: var(--stocksip-green);
  background-color: var(--apple-field-bg-focus);
  box-shadow:
    0 0 0 3px var(--apple-focus-ring),
    inset 0 0 0 0.5px var(--apple-focus-border);
}

.profile-edit--apple .form-input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.profile-edit--apple .password-input,
.profile-edit--apple .input-with-icon {
  position: relative;
}

.profile-edit--apple .input-with-icon .form-input {
  padding-right: 2.5rem;
}

.profile-edit--apple .password-input .form-input {
  padding-right: 2.75rem;
}

.profile-edit--apple .toggle-password,
.profile-edit--apple .map-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  color: var(--apple-secondary);
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.profile-edit--apple .toggle-password:hover,
.profile-edit--apple .map-button:hover {
  background: rgba(60, 60, 67, 0.08);
  color: var(--apple-text);
}

.profile-edit--apple .toggle-password:active,
.profile-edit--apple .map-button:active {
  background: rgba(60, 60, 67, 0.12);
}

.profile-edit--apple .input-with-icon i {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(60, 60, 67, 0.45);
  font-size: 0.95rem;
}

.profile-edit--apple .error-message {
  color: #ff3b30;
  font-size: 0.8125rem;
  margin-top: 0.35rem;
  display: block;
}

.profile-edit--apple .actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.profile-edit--apple .save-button,
.profile-edit--apple .cancel-button {
  min-width: 5.5rem;
  padding: 0.55rem 1.25rem;
  border-radius: var(--apple-button-radius);
  font-family: var(--apple-font);
  font-size: 1.0625rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
}

.profile-edit--apple .save-button {
  background-color: var(--stocksip-green);
  color: #fff;
  border: none;
}

.profile-edit--apple .save-button:hover {
  background-color: var(--stocksip-green-hover);
}

.profile-edit--apple .cancel-button {
  background-color: var(--stocksip-green-soft);
  border: 1px solid var(--stocksip-green-border);
  color: var(--stocksip-green-hover);
}

.profile-edit--apple .cancel-button:hover {
  background-color: rgba(22, 163, 74, 0.12);
  border-color: var(--stocksip-green);
}

@media (min-width: 900px) {
  .profile-edit--apple.profile-edit-container {
    flex-direction: row;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .profile-edit--apple .profile-left,
  .profile-edit--apple .profile-right {
    flex: 1;
    min-width: 0;
  }
}

@media (max-width: 768px) {
  .profile-edit--apple .actions {
    flex-direction: column-reverse;
  }

  .profile-edit--apple .save-button,
  .profile-edit--apple .cancel-button {
    width: 100%;
  }
}
</style>