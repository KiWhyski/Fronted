import httpInstance from '@/shared/services/http.instance.js';
import { CareGuide } from '../model/care-guide.entity.js';

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_BASE_API_URL;

export const CareGuideService = {
    /**
     * Get all care guides for a specific account
     * @param {string} accountId - Account ID
     * @returns {Promise<CareGuide[]>}
     */
    async getAll(accountId) {
        try {
            const response = await httpInstance.get(`${API_URL}accounts/${accountId}/care-guides`);
            const guides = Array.isArray(response.data) ? response.data : [response.data];
            return guides.map(guide => new CareGuide(guide));
        } catch (error) {
            console.error('Error fetching care guides:', error);
            throw new Error('Failed to fetch care guides');
        }
    },

    /**
     * Get a care guide by its ID (account scoped)
     * @param {string} accountId - Account ID
     * @param {string} careGuideId - Care guide ID
     * @returns {Promise<CareGuide>}
     */
    async getById(accountId, careGuideId) {
        try {
            const response = await httpInstance.get(`${API_URL}accounts/${accountId}/care-guides/${careGuideId}`);
            return new CareGuide(response.data);
        } catch (error) {
            console.error('Error fetching care guide by ID:', error);
            throw new Error('Failed to fetch care guide');
        }
    },

    /**
     * Get a care guide by its ID (general route)
     * @param {string} careGuideId - Care guide ID
     * @returns {Promise<CareGuide>}
     */
    async getByIdGeneral(careGuideId) {
        try {
            const response = await httpInstance.get(`${API_URL}care-guides/${careGuideId}`);
            return new CareGuide(response.data);
        } catch (error) {
            console.error('Error fetching care guide by ID (general):', error);
            throw new Error('Failed to fetch care guide');
        }
    },

    /**
     * Create a new care guide (without product)
     * @param {string} accountId - Account ID
     * @param {Object} guideData - Care guide data
     * @returns {Promise<CareGuide>}
     */
    async create(accountId, guideData) {
        try {
            const response = await httpInstance.post(`${API_URL}accounts/${accountId}/care-guides`, guideData);
            return new CareGuide(response.data);
        } catch (error) {
            console.error('Error creating care guide:', error);
            throw new Error('Failed to create care guide');
        }
    },

    /**
     * Create a new care guide and assign it to a product
     * @param {string} accountId - Account ID
     * @param {string} productId - Product ID
     * @param {Object} guideData - Care guide data
     * @returns {Promise<CareGuide>}
     */
    async createForProduct(accountId, productId, guideData) {
        try {
            const response = await httpInstance.post(`${API_URL}accounts/${accountId}/care-guides/product/${productId}`, guideData);
            return new CareGuide(response.data);
        } catch (error) {
            console.error('Error creating care guide for product:', error);
            throw new Error('Failed to create care guide for product');
        }
    },

    /**
     * Get the care guide of a product
     * @param {string} productId - Product ID
     * @returns {Promise<CareGuide>}
     */
    async getByProduct(productId) {
        try {
            const response = await httpInstance.get(`${API_URL}products/${productId}/care-guide`);
            return new CareGuide(response.data);
        } catch (error) {
            console.error('Error fetching care guide by product:', error);
            throw new Error('Failed to fetch care guide by product');
        }
    },

    /**
     * Update a care guide
     * @param {string} careGuideId - Care guide ID
     * @param {Object} updateData - Updated care guide data
     * @returns {Promise<CareGuide>}
     */
    async update(careGuideId, updateData) {
        try {
            const response = await httpInstance.put(`${API_URL}care-guides/${careGuideId}`, updateData);
            return new CareGuide(response.data);
        } catch (error) {
            console.error('Error updating care guide:', error);
            throw new Error('Failed to update care guide');
        }
    },

    /**
     * Delete a care guide
     * @param {string} careGuideId - Care guide ID
     * @returns {Promise<void>}
     */
    async delete(careGuideId) {
        try {
            await httpInstance.delete(`${API_URL}care-guides/${careGuideId}`);
        } catch (error) {
            console.error('Error deleting care guide:', error);
            throw new Error('Failed to delete care guide');
        }
    },

    /**
     * Unassign a care guide from its current product
     * @param {string} careGuideId - Care guide ID
     * @returns {Promise<void>}
     */
    async unassignFromProduct(careGuideId) {
        try {
            await httpInstance.put(`${API_URL}care-guides/${careGuideId}/deallocations`);
        } catch (error) {
            console.error('Error unassigning care guide from product:', error);
            throw new Error('Failed to unassign care guide from product');
        }
    },

    /**
     * Assign a care guide to a product
     * @param {string} careGuideId - Care guide ID
     * @param {string} productId - Product ID
     * @returns {Promise<void>}
     */
    async assignToProduct(careGuideId, productId) {
        try {
            await httpInstance.put(`${API_URL}care-guides/${careGuideId}/allocations/${productId}`);
        } catch (error) {
            console.error('Error assigning care guide to product:', error);
            throw new Error('Failed to assign care guide to product');
        }
    },

    /**
     * Filtra las guías por tipo
     * @param {string} type - Tipo de licor
     * @returns {Promise<CareGuide[]>}
     */
    async getByType(type) {
        try {
            const response = await httpInstance.get(`${API_URL}/conservation?type=${type}`);
            return response.data.map(guide => new CareGuide(guide));
        } catch (error) {
            console.error('Error al filtrar las guías:', error);
            throw new Error('No se pudieron filtrar las guías de cuidado');
        }
    },

    /**
     * Busca guías por nombre
     * @param {string} name - Nombre a buscar
     * @returns {Promise<CareGuide[]>}
     */
    async searchByName(name) {
        try {
            const response = await httpInstance.get(`${API_URL}/conservation?name_like=${name}`);
            return response.data.map(guide => new CareGuide(guide));
        } catch (error) {
            console.error('Error al buscar las guías:', error);
            throw new Error('No se pudieron buscar las guías de cuidado');
        }
    }
};