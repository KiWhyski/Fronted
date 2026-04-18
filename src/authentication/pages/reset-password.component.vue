<script>
import { AuthenticationService } from "@/authentication/services/authentication.service.js";
import { useAuthenticationStore } from "@/authentication/services/authentication.store.js";
import { useToast } from "primevue/usetoast";

const authenticationService = new AuthenticationService();

export default {
  name: "reset-password",
  data() {
    return {
      form: {
        password: '',
        confirmPassword: ''
      },
      errors: {
        password: '',
        confirmPassword: '',
        general: ''
      },
      toast: useToast()
    };
  },
  methods: {
    async onSubmit() {
      this.errors = {
        password: '',
        confirmPassword: '',
        general: ''
      };

      const authStore = useAuthenticationStore();

      if (!this.form.password) {
        this.errors.password = this.$t('reset-password.error-password-required');
        return;
      }

      if (this.form.password.length < 6) {
        this.errors.password = this.$t('reset-password.error-password-length');
        return;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = this.$t('reset-password.error-mismatch');
        return;
      }

      try {
        const email = authStore.getRecoveryEmail();

        if (!email) {
          this.errors.general = this.$t('reset-password.error-session');
          return;
        }

        await authenticationService.resetPassword(email, this.form.password);

        this.toast.add({
          severity: 'success',
          summary: this.$t('reset-password.toast-success-title'),
          detail: this.$t('reset-password.toast-success-detail'),
          life: 3000
        });
        this.$router.push('/sign-in');
      } catch (err) {
        this.errors.general = this.$t('reset-password.error-failed');
      } finally {
      }
    }
  }
};
</script>

<template>
  <div class="recover-container">
    <div class="recover-header">
      <h2>{{ $t('reset-password.title') }}</h2>
    </div>
    <p class="recover-description">
      {{ $t('reset-password.description') }}
    </p>

    <form @submit.prevent="onSubmit" class="recover-form">
      <div class="form-group">
        <input
            v-model="form.password"
            type="password"
            :placeholder="$t('reset-password.placeholder-new')"
            class="form-input"
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <input
            v-model="form.confirmPassword"
            type="password"
            :placeholder="$t('reset-password.placeholder-confirm')"
            class="form-input"
        />
        <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
      </div>

      <div v-if="errors.general" class="form-group">
        <span class="error-message">{{ errors.general }}</span>
      </div>

      <button class="send-button-recover" type="submit">
        {{ $t('reset-password.submit') }}
      </button>
    </form>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&family=Roboto:wght@400;500;700&display=swap');

.recover-container {
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recover-header {
  background-color: #26021D;
  width: 100%;
  height: 210px;
  padding: 2rem;
  border-bottom-left-radius: 6rem;
  border-bottom-right-radius: 6rem;
  color: white;
  text-align: center;
}

.recover-header h2 {
  margin-top: 30px;
  font-weight: 600;
  justify-content: center;
  font-size: 3rem;
  font-family: 'Poppins', sans-serif;
  color: #F7EDDC;
}

.recover-description {
  margin-top: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.5rem;
  color: #4E4E4E;
  max-width: 600px;
  padding: 0 2rem;
}

.recover-form {
  width: 100%;
  max-width: 1000px;
  padding: 0 2rem;
}

.form-group {
  width: 100%;
  margin-bottom: 3rem;
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 1px solid #263238;
  border-radius: 45px;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #4E4E4E;
  background-color: white;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #6E0081;
}

.error-message {
  color: #dd0031;
  font-size: 0.9rem;
  position: absolute;
  bottom: -1.5rem;
  left: 1.5rem;
}

.send-button-recover {
  align-items: center;
  font-family: 'Roboto', sans-serif;
  background-color: #59033A;
  color: white;
  font-weight: bold;
  font-size: 1.3rem;
  width: 120px;
  height: 3rem;
  border-radius: 45px;
  border: none;
  margin: 1rem auto 0 auto;
  display: block;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button-recover:hover {
  background-color: #6d0b3f;
}

@media (max-width: 768px) {
  .recover-header h2 {
    font-size: 2.5rem;
  }

  .recover-description {
    font-size: 1.2rem;
  }

  .form-input {
    font-size: 1rem;
  }
}
</style>
