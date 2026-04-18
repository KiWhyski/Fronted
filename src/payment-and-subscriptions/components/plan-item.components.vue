<script>
import {Plan} from "@/payment-and-subscriptions/model/plan.entity.js";

const PLAN_RANK = {
  plan_free: 1,
  plan_premium_monthly: 2,
  plan_premium_annual: 3
};

export default {
  name: 'PlanItem',
  props: {
    plan: { type: Plan, required: true },
    currentPlanId: { type: String, required: false }
  },
  computed: {
    isCurrentPlan() {
      console.log("Current Plan ID:", this.currentPlanId);
      return this.plan.planId === this.currentPlanId;
    },
    isDowngradeOrSame() {
      const currentRank = PLAN_RANK[this.currentPlanId] || 0;
      const thisRank = PLAN_RANK[this.plan.planId] || 0;
      return thisRank <= currentRank;

    }
  },
  methods: {
    choosePlan() {
      if (!this.isCurrentPlan && !this.isDowngradeOrSame) {
        this.$emit('choose', this.plan.planId);
      }
    }
  }
};
</script>

<template>
  <pv-card class="plan-card" :class="{ 'premium': isPremium, 'selected': isCurrentPlan }">
    <!-- Header -->
    <template #header>
      <div class="plan-header">
        <!-- Badge -->
        <div v-if="plan.planType === 'PremiumMonthly'" class="plan-badge yellow">Most Popular</div>
        <div v-else-if="plan.planType === 'PremiumAnnual'" class="plan-badge gold">Premium Plan</div>

        <h2 class="plan-title">{{ plan.description }}</h2>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <div class="price-section">
        <span class="price-amount">${{ plan.price }}</span>
        <span class="price-period">
          {{ plan.planType === 'PremiumAnnual' ? 'per year' : (plan.planType === 'PremiumMonthly' ? 'per month' : '') }}
        </span>
      </div>

      <ul class="features-list">
        <li><i class="pi pi-home icon"></i> Max Warehouses: {{ plan.maxWarehouses }}</li>
        <li><i class="pi pi-box icon"></i> Max Products: {{ plan.maxProducts }}</li>
        <li><i class="pi pi-shield icon"></i> Plan Type: {{ plan.planType }}</li>
      </ul>
    </template>

    <!-- Footer -->
    <template #footer>
      <div class="action-buttons">
        <pv-button
            :disabled="isCurrentPlan || isDowngradeOrSame"
            @click="choosePlan"
            class="p-button-rounded p-button-lg"
        >
          {{ isCurrentPlan ? 'Current Plan' : (isDowngradeOrSame ? 'Unavailable' : 'Choose') }}
        </pv-button>
      </div>
    </template>
  </pv-card>
</template>


<style scoped>
.plan-card {
  background-color: #ffffff;
  width: 100%;
  max-width: 360px;
  min-height: 540px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.plan-header {
  padding: 1rem;
  text-align: center;
  position: relative;
}

.plan-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3a3f;
  margin: 0.5rem 0 0;
}

.plan-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 12px;
  color: #000;
}

.plan-badge.yellow {
  background-color: #ffca28;
}

.plan-badge.gold {
  background-color: gold;
}

.price-section {
  text-align: center;
  margin: 1rem 0;
}

.price-amount {
  font-size: 2rem;
  font-weight: bold;
  color: #5A033A;
}

.price-period {
  font-size: 0.85rem;
  color: #666;
  display: block;
}

.features-list {
  list-style: none;
  padding: 0 1rem;
  margin: 1rem 0;
}

.features-list li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #444;
}

.features-list .icon {
  color: #5A033A;
  margin-right: 0.5rem;
}

.action-buttons {
  margin-top: auto;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid #eee;
  pv-button {
    width: 100%;
    max-width: 200px;
    background-color: #5A033A;
  }
}

.premium {
  border: 2px solid #3f51b5;
}

.selected {
  border: 2px solid #5A033A;
}
</style>

