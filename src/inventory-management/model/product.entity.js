import {generateUuid} from "@/shared/model/uuid.js";

export class Product {
    constructor({productId,  name, brandName, liquorType, unitPriceAmount, minimumStock, imageUrl, providerId: accountId }) {
        this.productId = productId;
        this.name = name;
        this.brandName = brandName;
        this.liquorType = liquorType;
        this.unitPriceAmount = unitPriceAmount;
        this.minimumStock = minimumStock;
        this.imageUrl = imageUrl;
        this.providerId = accountId;
    }
}
