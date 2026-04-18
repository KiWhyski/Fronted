<script>

import {Plan} from "@/payment-and-subscriptions/model/plan.entity.js";
import PlanItem from "@/payment-and-subscriptions/components/plan-item.components.vue";

export default {
  name: 'PlanList',
  components: { PlanItem },
  props: {
    plans: {Type: Array[Plan], required: true},
    currentPlanId: {
      type: String,
      required: false
    },
  }
}
</script>

<template>
  <div class="grid-container">
    <div class="grid">
      <div v-for="plan in plans" :key="plan.planId" class="grid-item">
        <plan-item
            :plan="plan"
            :current-plan-id="currentPlanId"
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
  gap: 1.5rem;
  width: 100%;
  max-width: 880px;
  box-sizing: border-box;
}

.grid-item {
  flex: 1 1 300px;
  min-width: 0;
  max-width: 420px;
  display: flex;
  justify-content: center;
}

.grid-item :deep(.plan-card) {
  width: 100%;
  max-width: 360px;
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