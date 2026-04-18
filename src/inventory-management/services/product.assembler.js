import {Product} from "@/inventory-management/model/product.entity.js";

export class ProductAssembler {

    static toEntityFromResource(resource) {
        let product = new Product({...resource});
        return product;
    }

    static toEntitiesFromResources(response) {
        if (!response.data || response.data.error) {
            console.error(response.data.error);
            return [];
        }
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}