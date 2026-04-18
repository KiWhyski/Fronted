<script>
import {PlanService} from "@/payment-and-subscriptions/services/plan.service.js";
import PlanList from "@/payment-and-subscriptions/components/plan-list.component.vue";
import {SubscriptionService} from "@/payment-and-subscriptions/services/subscription.service.js";
import httpInstance from "@/shared/services/http.instance.js";
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";

export default {
  name: "payment-choose",
  components: { PlanList, SideNavbar, ToolbarContent },
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
        this.error = this.$t("plans-page.load-error");
        console.error(error);
      }
    },

    async checkCurrentPlanAndLoad() {
      try {
        const accountId = localStorage.getItem("accountId");
        if (accountId) {
          const response = await httpInstance.get(`/accounts/${accountId}/subscriptions/current-plan`);
          const d = response.data;
          this.currentPlanId =
            typeof d === "string" || typeof d === "number"
              ? String(d)
              : (d?.planId ?? d?.planCode ?? null);
          if (this.currentPlanId && /^free$/i.test(String(this.currentPlanId))) {
            this.currentPlanId = "plan_free";
          }
        }
      } catch (error) {
        console.error(" Error checking current plan:", error);
      } finally {
        await this.getAllPlans();
      }
    },

    async subscribeToPlan(planId) {
      try {
        const accountId = localStorage.getItem("accountId");
        const subscriptionService = new SubscriptionService();

        let data;

        if (this.currentPlanId && this.currentPlanId !== "plan_free") {
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
  <div class="plan-page-bg">
    <side-navbar />
    <div class="plan-page-main">
      <toolbar-content :page-title="$t('toolbar.plans')" />
      <div class="plan-list-wrapper">
        <plan-list
            :plans="plans"
            :current-plan-id="currentPlanId"
            @choose="subscribeToPlan"
        />
      </div>
    </div>
  </div>
</template>


<style scoped>
.plan-page-bg {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #ffffff;
}

.plan-page-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.plan-list-wrapper {
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 2rem;
  box-sizing: border-box;
  background-color: #ffffff;
}

</style>