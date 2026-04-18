import httpInstance from "../../shared/services/http.instance.js";

/**
 * @class BaseService
 * @description Base service class for handling CRUD operations on categories using HTTP requests
 */
export class BaseService {
    /** @type {string} The API endpoint for the resource */
    resourceEndpoint = '';

    /**
     * Retrieves all the resources
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of resources
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    /**
     * Retrieves a resource by its ID
     * @param {string | number } id - The ID of the resource to retrieve
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the resource object
     */
    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Creates a new product
     * @param {Object} resource - The resource object to create
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created resource
     */
    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    /**
     * Updates an existing product
     * @param {string | number } id - The ID of the resource to update
     * @param {Object} resource - The updated resource data
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated resource
     */
    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    /**
     * Deletes a resource by its ID
     * @param {string | number } id - The ID of the resource to delete
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the resource is deleted
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
}