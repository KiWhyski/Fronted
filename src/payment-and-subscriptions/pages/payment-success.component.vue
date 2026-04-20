<script>
import { onMounted } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { SubscriptionService } from "@/payment-and-subscriptions/services/subscription.service.js"
import {useAuthenticationStore} from "@/authentication/services/authentication.store.js";

export default {
  name: "payment-success",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthenticationStore()
    const subscriptionService = new SubscriptionService()

    onMounted(async () => {
      const token = route.query.token
      const accountId = route.query.accountId
      const planId = route.query.planId

      if (!token || !accountId || !planId) {
        return router.push({ name: 'sign-in' })
      }

      try {
        const response = await subscriptionService.completeSubscription(token, accountId, planId)
        console.log('Complete subscription:', response)
      } catch (error) {
        console.error('Error completing subscription:', error)
      }
    })

    const goToDashboard = () => {
      router.push('/dashboard')
    }

    return {
      goToDashboard
    }
  }
}
</script>

<template>
  <div class="confirmation-container">
    <div class="card">
      <h2 class="title">¡Suscripción activada!</h2>
      <p class="message">Tu suscripción ha sido activada correctamente.</p>
      <p class="message">¡Gracias por tu compra!</p>
      <p class="message">Ahora puedes disfrutar de los beneficios de tu plan.</p>
      <button class="dashboard-button" @click="goToDashboard">
        Ir al Dashboard
      </button>
    </div>
  </div>
</template>

<style scoped>
.confirmation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #ffffff;
  padding: 2rem;
}

.card {
  background-color: #ffffff;
  padding: 2rem 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.message {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.8rem;
}

.dashboard-button {
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  background-color: var(--app-green-accent, #16a34a);
  color: white;
  border: none;
  border-radius: 45px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dashboard-button:hover {
  background-color: var(--app-green-accent-hover, #15803d);
}
</style>