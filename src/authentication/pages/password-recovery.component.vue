<script>
import {AuthenticationService} from "@/authentication/services/authentication.service.js";
import {useAuthenticationStore} from "@/authentication/services/authentication.store.js";
import { useToast } from "primevue/usetoast";

const authenticationService = new AuthenticationService();

export default {
  name: "password-recovery",
  data() {
    return {
      form: {
        email: ''
      },
      errors: {
        email: ''
      },
      toast: useToast(),
    }
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    async onSubmit() {
      // Reset errors
      this.errors.email = '';

      // Validate email
      if (!this.form.email) {
        this.errors.email = this.$t('password-recovery.email-required');
        return;
      }
      if (!this.validateEmail(this.form.email)) {
        this.errors.email = this.$t('password-recovery.email-invalid');
        return;
      }

      try {
        await authenticationService.sendRecoveryCode(this.form.email);
        const authStore = useAuthenticationStore();
        authStore.setRecoveryEmail(this.form.email);
        this.$router.push('/confirmation-code');
      } catch (err) {
        this.toast.add({
          severity: 'error',
          summary: this.$t('toast.error'),
          detail: this.$t('password-recovery.error-send'),
          life: 3000
        })
        console.error(err);
      }
    },
    beforeRouteLeave(to, from, next) {
      const authStore = useAuthenticationStore();
      authStore.clearRecoveryEmail();
      next();
    }
  }
}
</script>

<template>
  <div class="recover-container">
    <div class="recover-header">
      <h2>{{ $t('password-recovery.title') }}</h2>
    </div>
    <p class="recover-description">
      {{ $t('password-recovery.description') }}
    </p>

    <form @submit.prevent="onSubmit" class="recover-form">
      <div class="form-group">
        <input
            v-model="form.email"
            type="email"
            :placeholder="$t('password-recovery.placeholder-email')"
            class="form-input"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <button class="send-button-recover" type="submit">
        {{ $t('password-recovery.send') }}
      </button>
    </form>
  </div>
</template>

<style>
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