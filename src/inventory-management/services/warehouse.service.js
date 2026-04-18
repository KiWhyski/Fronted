import {WarehouseAssembler} from "@/inventory-management/services/warehouse.assembler.js";
import {BaseService} from "@/shared/services/base.service.js";
import {useAuthenticationStore} from "@/authentication/services/authentication.store.js";
import httpInstance from "@/shared/services/http.instance.js";

/**
 * @class WarehouseService
 * @description Service class for handling CRUD operations on categories using HTTP requests
 */
export class WarehouseService extends BaseService {

    accountEndpoint = '';
    accountWarehouseEndpoint = '';
    accountWarehousesCountEndpoint = '';

    constructor() {
        super();
        /** @type {string} The API endpoint for user's warehouses */
        this.resourceEndpoint = import.meta.env.VITE_WAREHOUSE_ENDPOINT_PATH;
        this.accountEndpoint = import.meta.env.VITE_ACCOUNT_ENDPOINT_PATH;
        this.accountWarehouseEndpoint = import.meta.env.VITE_ACCOUNT_WAREHOUSES_ENDPOINT_PATH;
        this.accountWarehousesCountEndpoint = import.meta.env.VITE_WAREHOUSES_COUNT_ENDPOINT_PATH;
    }

    /**
     * Get a warehouse by ID
     * @param id
     * @returns {Promise<Object>} The warehouse data
     */
    async getWarehouseById(id) {
        const response = await this.getById(id);
        return WarehouseAssembler.toEntityFromResource(response.data);
    }

    /**
     * Get all warehouses for the current account
     * @returns {Promise<*>} - A promise that resolves to an array of Warehouse entities
     */
    async getWarehousesByAccountId() {
        const accountId =  this.getAccountId();
        const endpoint = `${import.meta.env.VITE_BASE_API_URL}${this.accountWarehouseEndpoint.replace('{accountId}', accountId)}`;

        const response = await httpInstance.get(endpoint);
        return response.data.map(resource => WarehouseAssembler.toEntityFromResource(resource));
    }

    /**
     * Update a warehouse
     * @returns {Promise<Object>} Created warehouse data
     * @param warehouseData
     * @param imageFile
     */
    async createWarehouse(warehouseData, imageFile) {
        let accountId = this.getAccountId();
        const endpoint = `${import.meta.env.VITE_BASE_API_URL}${this.accountWarehouseEndpoint.replace('{accountId}', accountId)}`;

        const formData = this.#createWarehouseFormData(warehouseData, imageFile);

        if (imageFile) {
            formData.append('Image', imageFile);
        }

        const response = await httpInstance.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    /**
     * Delete a warehouse
     * @param {string} id - The ID of the warehouse to delete
     * @returns {Promise<Object>} The deleted warehouse data
     */
    async deleteWarehouse(id) {
        const response = await this.delete(id);
        return response.data;
    }

    /**
     * Update a warehouse
     * @param {string} warehouseId - The ID of the warehouse to update
     * @param {Object} warehouseData - The updated warehouse data
     * @param imageFile - The image file to upload
     * @returns {Promise<Object>} The updated warehouse data
     */
    async updateWarehouse(warehouseId, warehouseData, imageFile) {
        const endpoint = `${import.meta.env.VITE_BASE_API_URL}${this.resourceEndpoint}/${warehouseId}`;
        const formData = this.#createWarehouseFormData(warehouseData, imageFile);

        const response = await httpInstance.put(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return response.data;
    }

    async getWarehousesCount() {
        const accountId = this.getAccountId();
        const endpoint = `${import.meta.env.VITE_BASE_API_URL}${this.accountWarehousesCountEndpoint.replace('{accountId}', accountId)}`;
        const response = await httpInstance.get(endpoint);
        return response.data;
    }


    #createWarehouseFormData(warehouseData, imageFile) {
        const formData = new FormData();
        formData.append('Name', warehouseData.name);
        formData.append('Street', warehouseData.street);
        formData.append('City', warehouseData.city);
        formData.append('District', warehouseData.district);
        formData.append('PostalCode', warehouseData.postalCode);
        formData.append('Country', warehouseData.country);
        formData.append('MaxTemperature', warehouseData.maxTemperature);
        formData.append('MinTemperature', warehouseData.minTemperature);
        formData.append('Capacity', warehouseData.capacity);

        if (imageFile) {
            formData.append('Image', imageFile);
        }

        return formData;
    }

    getAccountId() {
        const authenticationStore = useAuthenticationStore();
        return authenticationStore.currentAccountId;
    }
}