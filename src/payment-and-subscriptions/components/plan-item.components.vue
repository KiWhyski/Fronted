<script>
import { Plan } from "@/payment-and-subscriptions/model/plan.entity.js";

const PLAN_RANK = {
  plan_free: 1,
  plan_premium_monthly: 2,
};

export default {
  name: "PlanItem",
  props: {
    plan: { type: Plan, required: true },
    currentPlanId: { type: String, required: false },
  },
  computed: {
    isPremium() {
      return this.plan.planType === "PremiumMonthly";
    },
    isCurrentPlan() {
      return this.plan.planId === this.currentPlanId;
    },
    isDowngradeOrSame() {
      const currentRank = PLAN_RANK[this.currentPlanId] || 0;
      const thisRank = PLAN_RANK[this.plan.planId] || 0;
      return thisRank <= currentRank;
    },
    formattedPrice() {
      if (!Number.isFinite(Number(this.plan.price)) || Number(this.plan.price) === 0) {
        return this.$t("plans-page.price-free");
      }
      return Number(this.plan.price).toLocaleString("es-PE", {
        style: "currency",
        currency: "PEN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    planTypeKey() {
      if (this.plan.planType === "Free") return "plans-page.type-free";
      return "plans-page.type-premium";
    },
  },
  methods: {
    choosePlan() {
      if (!this.isCurrentPlan && !this.isDowngradeOrSame) {
        this.$emit("choose", this.plan.planId);
      }
    },
  },
};
</script>

<template>
  <pv-card
    class="plan-card"
    :class="{ premium: isPremium, selected: isCurrentPlan }"
  >
    <template #header>
      <div class="plan-header">
        <div v-if="isPremium" class="plan-badge plan-badge--accent">
          {{ $t("plans-page.badge-recommended") }}
        </div>
        <h2 class="plan-title">{{ plan.description }}</h2>
      </div>
    </template>

    <template #content>
      <div class="price-section">
        <span class="price-amount">{{ formattedPrice }}</span>
        <span v-if="isPremium" class="price-period">
          {{ $t("plans-page.per-month") }}
        </span>
      </div>

      <ul class="features-list">
        <li>
          <i class="pi pi-home icon" aria-hidden="true"></i>
          {{ $t("plans-page.feature-warehouses", { n: plan.maxWarehouses }) }}
        </li>
        <li>
          <i class="pi pi-box icon" aria-hidden="true"></i>
          {{ $t("plans-page.feature-products", { n: plan.maxProducts }) }}
        </li>
        <li>
          <i class="pi pi-shield icon" aria-hidden="true"></i>
          {{ $t("plans-page.feature-type", { type: $t(planTypeKey) }) }}
        </li>
      </ul>
    </template>

    <template #footer>
      <div class="action-buttons">
        <pv-button
          :disabled="isCurrentPlan || isDowngradeOrSame"
          class="plan-choose-btn p-button-rounded p-button-lg"
          @click="choosePlan"
        >
          {{
            isCurrentPlan
              ? $t("plans-page.btn-current")
              : isDowngradeOrSame
                ? $t("plans-page.btn-unavailable")
                : $t("plans-page.btn-choose")
          }}
        </pv-button>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
/* Misma familia de verdes que login (login.component.vue) */
.plan-card {
  --plan-green-deep: #0d3b26;
  --plan-green-accent: #2e7d32;
  --plan-green-accent-hover: #1b5e20;
  --plan-green-border: #a5d6a7;
  --plan-green-soft: #e8f5e9;
  --plan-text: #1b3326;
  --plan-muted: #3d5c48;

  background-color: #ffffff;
  width: 100%;
  max-width: 360px;
  min-height: 480px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(13, 59, 38, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(13, 59, 38, 0.12);
}

.plan-header {
  padding: 1rem;
  text-align: center;
  position: relative;
}

.plan-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--plan-text);
  margin: 0.5rem 0 0;
}

.plan-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
}

.plan-badge--accent {
  background-color: var(--plan-green-soft);
  color: var(--plan-green-deep);
  border: 1px solid var(--plan-green-border);
}

.price-section {
  text-align: center;
  margin: 1rem 0;
}

.price-amount {
  font-size: 2rem;
  font-weight: bold;
  color: var(--plan-green-accent);
}

.price-period {
  font-size: 0.85rem;
  color: var(--plan-muted);
  display: block;
  margin-top: 0.25rem;
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
  color: var(--plan-green-accent);
  margin-right: 0.5rem;
}

.action-buttons {
  margin-top: auto;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid #eee;
}

.action-buttons :deep(.p-button) {
  width: 100%;
  max-width: 220px;
  background: var(--plan-green-accent) !important;
  border-color: var(--plan-green-accent) !important;
  color: #fff !important;
}

.action-buttons :deep(.p-button:not(:disabled):hover) {
  background: var(--plan-green-accent-hover) !important;
  border-color: var(--plan-green-accent-hover) !important;
}

.action-buttons :deep(.p-button:disabled) {
  opacity: 0.55;
  filter: grayscale(0.15);
}

.premium {
  border: 2px solid var(--plan-green-border);
}

.selected {
  border: 2px solid var(--plan-green-accent);
  box-shadow: 0 0 0 1px rgba(46, 125, 50, 0.2);
}
</style>
