export class Plan {

    constructor({
        planId = '',
        planType = '',
        description = '',
        price = 0,
        maxWarehouses = 0,
        minWarehouses = 0,
                }) {
        this.planId = planId;
        this.planType = planType;
        this.description = description;
        this.price = price;
        this.maxWarehouses = maxWarehouses;
        this.minWarehouses = minWarehouses;
    }
}