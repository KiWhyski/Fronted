import httpInstance from "@/shared/services/http.instance.js";

const subscriptionNewEndpoint = import.meta.env.VITE_SUBSCRIPTION_NEW_ENDPOINT_PATH;
const subscriptionUpgradeEndpoint = import.meta.env.VITE_SUBSCRIPTION_UPDGRADE_PATH;
const subscriptionCompleteEndpoint = import.meta.env.VITE_SUBSCRIPTION_COMPLETE_PATH;
const subscriptionUpgradeCompleteEndpoint = import.meta.env.VITE_SUBSCRIPTION_UPGRADE_COMPLETE_PATH;

export class SubscriptionService {

    async subscribeToPlan(planId, accountId) {
        const response = await httpInstance.post(subscriptionNewEndpoint, {
            accountId,
            planId
        });
        console.log(response.data);
        return response.data;
    }

    async upgradeSubscription(planId, accountId) {
        return httpInstance.post(subscriptionUpgradeEndpoint, {
            planId,
            accountId
        }).then(res => res.data);
    }

    async completeSubscription(token, accountId, planId) {
        const response = await httpInstance.get(subscriptionCompleteEndpoint, {
            params: { token, accountId, planId }
        });
        return response.data;
    }

    async completeUpgrade(token, accountId, planId) {
        const response = await httpInstance.get(subscriptionUpgradeCompleteEndpoint, {
            params: { token, accountId, planId }
        });
        return response.data;
    }
}