<script>
import PlanItem from "@/payment-and-subscriptions/components/plan-item.components.vue";

export default {
  name: "PlanList",
  components: { PlanItem },
  props: {
    plans: { type: Array, required: true },
    currentPlanId: {
      type: String,
      required: false,
    },
    /** -1 = sin plan en catálogo; 0 = Esencial; 1 = Estándar */
    currentTier: {
      type: Number,
      default: -1,
    },
  },
};
</script>

<template>
  <div class="grid-container">
    <div class="grid">
      <div v-for="plan in plans" :key="plan.planId" class="grid-item">
        <plan-item
            :plan="plan"
            :current-plan-id="currentPlanId"
            :current-tier="currentTier"
            @choose="$emit('choose', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Dos planes siempre en fila horizontal cuando caben; si no, se apilan */
.grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 1.75rem;
  width: 100%;
  max-width: 960px;
  box-sizing: border-box;
}

.grid-item {
  flex: 1 1 320px;
  min-width: 0;
  max-width: 460px;
  display: flex;
  justify-content: center;
}

.grid-item :deep(.plan-card) {
  width: 100%;
  max-width: 440px;
}

@media (max-width: 639px) {
  .grid {
    flex-direction: column;
    align-items: center;
  }

  .grid-item {
    max-width: 100%;
    width: 100%;
  }
}

</style>