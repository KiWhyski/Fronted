<script>
import {PlanService} from "@/payment-and-subscriptions/services/plan.service.js";
import PlanList from "@/payment-and-subscriptions/components/plan-list.component.vue";
import {SubscriptionService} from "@/payment-and-subscriptions/services/subscription.service.js";
import httpInstance from "@/shared/services/http.instance.js";

export default {
  name: "payment-choose",
  components: { PlanList },
  data() {
    return {
      plans: [],
      currentPlanId: null,
      error: null
    };
  },
  methods: {
    async getAllPlans() {
      this.error = null;
      try {
        const planService = new PlanService();
        this.plans = await planService.getAllPlans();
      } catch (error) {
        this.error = "Failed to load plans";
        console.error(error);
      }
    },

    async checkCurrentPlanAndLoad() {
      try {
        const accountId = localStorage.getItem("accountId");
        const response = await httpInstance.get(`/accounts/${accountId}/subscriptions/current-plan`);

        this.currentPlanId = response.data;
        console.log("Current Plan ID:", this.currentPlanId);

        await this.getAllPlans();
      } catch (error) {
        console.error(" Error checking current plan:", error);
      }
    },

    async subscribeToPlan(planId) {
      try {
        const accountId = localStorage.getItem("accountId");
        const subscriptionService = new SubscriptionService();

        let data;

        if (this.currentPlanId && this.currentPlanId !== "free") {

          data = await subscriptionService.upgradeSubscription(planId, accountId);
        } else {
          data = await subscriptionService.subscribeToPlan(planId, accountId);
        }

        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          throw new Error(data.message || "Error in subscription.");
        }
      } catch (err) {
        console.error("Error subscribing/upgrading to plan:", err);
      }
    }
  },
  created() {
    this.checkCurrentPlanAndLoad();
  }
};
</script>

<template>
  <div class="plan-list-wrapper">
    <plan-list
        :plans="plans"
        :current-plan-id="currentPlanId"
        @choose="subscribeToPlan"
    />
  </div>
</template>


<style scoped>


.plan-list-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
  max-width: 100vw;
  background-color: #F4EDE3;
}

</style>