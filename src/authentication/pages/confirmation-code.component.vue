<script>
import { useAuthenticationStore} from "@/authentication/services/authentication.store.js";
import { AuthenticationService } from "@/authentication/services/authentication.service.js";
import { useToast } from "primevue/usetoast";

const authenticationService = new AuthenticationService();

export default {
  name: "confirmation-code",
  data() {
    return {
      code: ['', '', '', '', '', ''],
      error: '',
      isVerifying: false,
      toast: useToast()
    }
  },
  methods: {
    handleInput(index, event) {
      const value = event.target.value;

      // Only allow numbers
      if (!/^\d*$/.test(value)) {
        event.target.value = this.code[index];
        return;
      }

      // Update the code array
      this.code[index] = value;

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = event.target.parentElement.nextElementSibling?.querySelector('input');
        if (nextInput) nextInput.focus();
      }
    },
    handleKeydown(index, event) {
      // Handle backspace
      if (event.key === 'Backspace' && !this.code[index] && index > 0) {
        const prevInput = event.target.parentElement.previousElementSibling?.querySelector('input');
        if (prevInput) {
          prevInput.focus();
          prevInput.value = '';
          this.code[index - 1] = '';
        }
      }
    },
    handlePaste(event) {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text');
      const numbers = pastedData.match(/\d/g);

      if (numbers) {
        numbers.slice(0, 6).forEach((num, index) => {
          this.code[index] = num;
          const input = this.$refs.codeInputs[index];
          if (input) input.value = num;
        });
      }
    },
    async verifyCode() {
      this.error = '';
      const fullCode = this.code.join('');

      if (fullCode.length !== 6) {
        this.error = 'Please enter all 6 digits';
        return;
      }

      const authStore = useAuthenticationStore();
      const email = authStore.getRecoveryEmail();

      if (!email) {
        this.error = 'Email not found. Please restart the recovery process.';
        return;
      }

      this.isVerifying = true;
      try {
        await authenticationService.verifyRecoveryCode(email, fullCode);
        this.toast.add({
          severity: 'success',
          summary: 'Verification Successful',
          detail: 'Your account has been verified successfully.',
          life: 3000
        });
        this.$router.push('/reset-password');
      } catch (err) {
        console.error(err);
        this.toast.add({
          severity: 'error',
          summary: 'Verification Failed',
          detail: 'Invalid verification code. Please try again.',
          life: 3000
        });
      } finally {
        this.isVerifying = false;
      }
    }
  }
}
</script>

<template>
  <div class="confirmation-container">
    <div class="confirmation-header">
      <h2>Enter Verification Code</h2>
    </div>

    <div class="confirmation-content">
      <p class="confirmation-description">
        We've sent a verification code to your email.
        Please enter the code below to verify your account.
      </p>

      <form @submit.prevent="verifyCode" class="code-form">
        <div class="code-inputs">
          <div v-for="(digit, index) in code" :key="index" class="code-input-wrapper">
            <input
                ref="codeInputs"
                type="text"
                maxlength="1"
                :value="digit"
                @input="handleInput(index, $event)"
                @keydown="handleKeydown(index, $event)"
                @paste="handlePaste"
                class="code-input"
            />
          </div>
        </div>

        <div class="error">
          <span v-if="error" class="error-message">{{ error }}</span>
        </div>

        <button
            type="submit"
            class="verify-button"
            :disabled="isVerifying"
        >
          {{ isVerifying ? 'Verifying...' : 'Verify' }}
        </button>
      </form>

      <div class="resend-section">
        <p>Didn't receive the code?</p>
        <button class="resend-button" @click="$router.push('/password-recovery')">
          Send again
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&family=Roboto:wght@400;500;700&display=swap');

.confirmation-container {
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.confirmation-header {
  background-color: #26021D;
  width: 100%;
  height: 210px;
  padding: 2rem;
  border-bottom-left-radius: 6rem;
  border-bottom-right-radius: 6rem;
  color: white;
  text-align: center;
}

.confirmation-header h2 {
  margin-top: 30px;
  font-weight: 600;
  font-size: 3rem;
  color: #F7EDDC;
  font-family: 'Poppins', sans-serif;
}

.confirmation-content {
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.confirmation-description {
  margin-top: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  font-size: 1.2rem;
  color: #4E4E4E;
  font-family: 'Inter', sans-serif;
}

.code-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.code-inputs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.code-input-wrapper {
  width: 60px;
  height: 70px;
}

.code-input {
  width: 100%;
  height: 100%;
  border: 2px solid #26021D;
  border-radius: 12px;
  font-size: 2rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
  color: #26021D;
  background-color: white;
  transition: all 0.3s ease;
}

.code-input:focus {
  border-color: #8E24AA;
  outline: none;
  box-shadow: 0 0 0 2px rgba(142, 36, 170, 0.2);
}


.error-message {
  color: #dd0031;
  font-size: 1rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
  width: 100%;
  height: 1.5rem;
  margin-left: 0;
}

.verify-button {
  font-family: 'Roboto', sans-serif;
  background-color: #59033A;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 1rem 3rem;
  border-radius: 45px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.verify-button:hover:not(:disabled) {
  background-color: #6d0b3f;
}

.verify-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.resend-section {
  margin-top: 3rem;
  text-align: center;
}

.resend-section p {
  color: #4E4E4E;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
}

.resend-button {
  background: none;
  border: none;
  color: #6E0081;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: color 0.3s;
}

.resend-button:hover {
  color: #6a1b7e;
}

@media (max-width: 768px) {
  .confirmation-header h2 {
    font-size: 2rem;
  }

  .confirmation-description {
    font-size: 1rem;
  }

  .code-input-wrapper {
    width: 45px;
    height: 55px;
  }

  .code-input {
    font-size: 1.5rem;
  }

  .verify-button {
    width: 100%;
  }
}
</style>