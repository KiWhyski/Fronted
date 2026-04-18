import {Warehouse} from "@/inventory-management/model/warehouse.entity.js";

export class WarehouseAssembler {

    static toEntityFromResource(resource) {

        let warehouse = new Warehouse({...resource});
        return warehouse;
    }

    static toEntitiesFromResources(response) {
        if (!response.data || response.data.error) {
            console.error(response.data.error);
            return [];
        }
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}