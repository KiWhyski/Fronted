import httpInstance from "../../shared/services/http.instance.js";
import {BaseService} from "@/shared/services/base.service.js";

/**
 * @class InventoryService
 * @description Service class for handling CRUD operations on categories using HTTP requests
 */
export class InventoryService extends BaseService {

    warehouseProductsEndpoint = '';
    stockAdditionEndpoint = '';
    stockSubtractionEndpoint = '';
    productAdditionEndpoint = '';

    constructor() {
        super();
        /** @type {string} The API endpoint to manage inventories */
        this.resourceEndpoint = import.meta.env.VITE_BASE_API_URL;
        this.warehouseProductsEndpoint = import.meta.env.VITE_WAREHOUSE_PRODUCTS_ENDPOINT_PATH;
        this.stockAdditionEndpoint = import.meta.env.VITE_INVENTORY_PRODUCTS_ADDITION_ENDPOINT;
        this.stockSubtractionEndpoint = import.meta.env.VITE_INVENTORY_PRODUCTS_SUBSTRACTION_ENDPOINT;
        this.productAdditionEndpoint = import.meta.env.VITE_WAREHOUSE_PRODUCT_ADDITION_ENDPOINT_PATH;
    }

    async getAllProductsByWarehouseId(warehouseId) {
        const endpoint = this.warehouseProductsEndpoint.replace('{warehouseId}', warehouseId);
        const url = `${import.meta.env.VITE_BASE_API_URL}${endpoint}`;
        const response = await httpInstance.get(url);
        return response.data;
    }

        async addStock(productId, warehouseId, addedQuantity, stockExpirationDate) {
            try {
                const endpoint = `warehouses/${warehouseId}/inventories${this.stockAdditionEndpoint.replace('{productId}', productId)}`;

                const url = `${this.resourceEndpoint}${endpoint}`;

                console.log(stockExpirationDate);
                const response = await httpInstance.put(url, {
                    stockExpirationDate,
                    addedQuantity
                });
                return response.data;
            } catch (error) {
                console.error('Error adding stock:', error);
                throw error;
            }
        }

        async subtractStock(productId, warehouseId, removedQuantity, expirationDate) {
            try {
                const endpoint = `warehouses/${warehouseId}/inventories${this.stockSubtractionEndpoint.replace('{productId}', productId)}`;

                const url = `${this.resourceEndpoint}${endpoint}`;

                const response = await httpInstance.put(url, {
                    expirationDate,
                    removedQuantity
                });

                return response.data;
            } catch (error) {
                console.error('Error subtracting stock:', error);
                throw error;
            }
        }

    async addProduct(productId, warehouseId, quantity, expirationDate) {
        const inventoriesPath = this.warehouseProductsEndpoint.replace('{warehouseId}', warehouseId);
        const productPath = this.productAdditionEndpoint.replace('{productId}', productId);
        const url = `${this.resourceEndpoint}${inventoriesPath}${productPath}`;

        const payload = {
            expirationDate,
            quantity
        };

        const response = await httpInstance.post(url, payload);
        return response.data;
    }

    async deleteProduct(productId, warehouseId, expirationDate) {
        try {
            const inventoriesPath = this.warehouseProductsEndpoint.replace('{warehouseId}', warehouseId);
            const productPath = this.productAdditionEndpoint.replace('{productId}', productId);
            const url = `${this.resourceEndpoint}${inventoriesPath}${productPath}`;

            const response = await httpInstance.delete(url, {
                data: { expirationDate }
            });

            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}