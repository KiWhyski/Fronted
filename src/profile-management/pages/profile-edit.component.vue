<script>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import profileService from "@/profile-management/services/profile.service.js";
import userService from "@/authentication/services/user.service.js";

export default {
  name: 'profile-edit',
  setup() {
    const toast = useToast();

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
      errors.name = !form.name ? 'Name is required' : '';
      errors.email = !form.email ? 'Email is required' :
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Invalid email format' : '';
      errors.businessName = !form.businessName ? 'Business name is required' : '';
      errors.businessAddress = !form.businessAddress ? 'Business address is required' : '';
      errors.phone = !form.phone ? 'Phone is required' : '';

      if (form.newPassword || form.confirmPassword) {
        if (form.newPassword !== form.confirmPassword) {
          errors.passwordMismatch = 'Passwords do not match';
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
          summary: 'Validation Error',
          detail: 'Please check the form for errors',
          life: 3000
        });
        return;
      }

      try {
        await profileService.editProfile(form);
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile saved successfully',
          life: 3000
        });
        resetForm();
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save profile',
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
        <h2>Change Password</h2>

        <div class="form-group">
          <label>Current password</label>
          <div class="password-input">
            <input
                :type="hideActual ? 'password' : 'text'"
                v-model="form.currentPassword"
                class="form-input"
                placeholder="Enter current password"
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
          <label>New password</label>
          <div class="password-input">
            <input
                :type="hideNew ? 'password' : 'text'"
                v-model="form.newPassword"
                class="form-input"
                placeholder="Enter new password"
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
          <label>Confirm password</label>
          <div class="password-input">
            <input
                :type="hideConfirm ? 'password' : 'text'"
                v-model="form.confirmPassword"
                class="form-input"
                placeholder="Confirm new password"
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
          <button class="save-button" @click="save">Save</button>
          <button class="cancel-button" @click="cancel">Cancel</button>
        </div>
      </div>
    </div>

    <div class="profile-right">
      <div class="profile-section">
        <h2>Profile Information</h2>

        <div class="form-group">
          <label>Name</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.name"
                class="form-input"
                placeholder="Enter your name"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label>Email</label>
          <div class="input-with-icon">
            <input
                type="email"
                v-model="form.email"
                class="form-input"
                placeholder="Enter your email"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>Business</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.businessName"
                class="form-input"
                placeholder="Enter business name"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.businessName" class="error-message">{{ errors.businessName }}</span>
        </div>

        <div class="form-group">
          <label>Phone</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.phone"
                class="form-input"
                placeholder="Enter phone number"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label>Business address</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.businessAddress"
                class="form-input"
                placeholder="Enter business address"
            />
            <button class="map-button">
              <i class="pi pi-map-marker"></i>
            </button>
          </div>
          <span v-if="errors.businessAddress" class="error-message">{{ errors.businessAddress }}</span>
        </div>

        <div class="actions">
          <button class="save-button" @click="save">Save</button>
          <button class="cancel-button" @click="cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.profile-edit--apple.profile-edit-container {
  --apple-blue: #007aff;
  --apple-text: #1d1d1f;
  --apple-secondary: rgba(60, 60, 67, 0.6);
  --apple-border: rgba(60, 60, 67, 0.18);
  --apple-bg: #ffffff;
  --apple-card: #ffffff;
  --apple-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  max-width: none;
  width: 100%;
  box-sizing: border-box;
}

.profile-edit--apple h2 {
  color: var(--apple-text);
  font-family: var(--apple-font);
  font-size: 1.0625rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  letter-spacing: -0.01em;
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
}

.profile-edit--apple .form-input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--apple-border);
  border-radius: 10px;
  font-family: var(--apple-font);
  font-size: 1.0625rem;
  color: var(--apple-text);
  background-color: #fafafa;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.profile-edit--apple .form-input:focus {
  border-color: var(--apple-blue);
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
}

.profile-edit--apple .password-input,
.profile-edit--apple .input-with-icon {
  position: relative;
}

.profile-edit--apple .toggle-password,
.profile-edit--apple .map-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--apple-secondary);
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 6px;
}

.profile-edit--apple .toggle-password:hover,
.profile-edit--apple .map-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.profile-edit--apple .input-with-icon i {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(60, 60, 67, 0.45);
  font-size: 0.9rem;
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
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-family: var(--apple-font);
  font-size: 1.0625rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
}

.profile-edit--apple .save-button {
  background-color: var(--apple-blue);
  color: #fff;
  border: none;
}

.profile-edit--apple .save-button:hover {
  filter: brightness(1.06);
}

.profile-edit--apple .cancel-button {
  background-color: rgba(60, 60, 67, 0.08);
  border: none;
  color: var(--apple-text);
}

.profile-edit--apple .cancel-button:hover {
  background-color: rgba(60, 60, 67, 0.12);
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