import http from '@/shared/services/http.instance.js';

const apiUrl = import.meta.env.VITE_BASE_API_URL;

export class CatalogService {

    async getCatalogsByAccount(accountId, onlyPublished = false) {
        const params = { accountId };
        if (onlyPublished) params.published = true;

        const { data } = await http.get('/catalogs', { params });
        return data;
    }
    async getPublishedCatalogs() {
        const { data } = await http.get('/catalogs?published=true');
        return data;
    }

    async publishCatalog(catalogId) {
        const { data } = await http.post(`/catalogs/${catalogId}/publish`);
        return data;
    }

    async getPublishedCatalogsByAccount(accountId) {
        const { data } = await http.get(
            `/api/v1/accounts/${accountId}/catalogs`,
            { params: { published: true } }
        );
        return data;
    }

    async getPublishedCatalogsByEmail(email) {
        const response = await http.get('/catalogs/published', {
            params: { providerEmail: email }
        });
        return response.data;
    }

    async getCatalogById(catalogId) {
        const { data } = await http.get(`/catalogs/${catalogId}`);
        return data;
    }

    async createCatalog(catalog) {
        const { data } = await http.post('/catalogs', catalog); // baseURL ya es /api/v1
        return data;
    }

    async updateCatalog(catalogId, catalog) {
        const { data } = await http.put(`/catalogs/${catalogId}`, catalog);
        return data;
    }

    async getCatalogItems(catalogId) {
        const { data } = await http.get('catalogs/catalogitems', {
            params: { catalogId }
        });
        return data;
    }

    async addCatalogItem(item) {
        const { data } = await http.post('/catalogs/catalogitems', item);
        return data;
    }
    async deleteCatalogItem(itemId) {
        console.log('[DELETE] Enviando ID:', itemId);

        if (!itemId || typeof itemId !== 'string' || itemId.length < 36) {
            console.warn('[DELETE] ID no válido:', itemId);
            return;
        }
        // aquí **NO** concatenamos /catalogId
        //   y nos aseguramos de usar exactamente la ruta del backend
        await http.delete(`/catalogs/catalogitems/${itemId}`);
    }
}