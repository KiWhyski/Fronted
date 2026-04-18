<script>

import {Plan} from "@/payment-and-subscriptions/model/plan.entity.js";
import WarehouseItem from "@/inventory-management/components/warehouse-item.component.vue";
import PlanItem from "@/payment-and-subscriptions/components/plan-item.components.vue";

export default {
  name: 'PlanList',
  components: {PlanItem, WarehouseItem},
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
}

.grid {
  display: grid;
  gap: 1.5rem;

  max-width: 1200px;
  width: fit-content;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.grid-item {
  aspect-ratio: 1 / 1;
}

</style>