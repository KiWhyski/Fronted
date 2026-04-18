import axios from 'axios';
import http from '@/shared/services/http.instance.js';

const apiUrl = import.meta.env.VITE_API_URL + '/purchase-orders';

const StatusCode = {
    Received  : 0,
    InProcess : 1,
    Arrived   : 2,
    Canceled  : 3
};

export class PurchaseOrderService {
    constructor () {
        this.baseUrl  = import.meta.env.VITE_BASE_API_URL;
        this.endpoint = 'orders';
    }
    async createPurchaseOrder(order) {
        const { data } = await http.post('/orders', order);
        return data;
    }

    async getAll(filters = {}) {
        const { buyerAccountId, supplierAccountId, ...rest } = filters;

        // -------- endpoint según rol ----------
        let endpoint = '/orders';
        if (buyerAccountId) {
            endpoint = `/orders/buyer/${encodeURIComponent(buyerAccountId)}`;
        } else if (supplierAccountId) {
            endpoint = `/orders/supplier/${encodeURIComponent(supplierAccountId)}`;
        }

        // -------- query‑params opcionales -------
        const params = Object.fromEntries(
            Object.entries(rest).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );

        // -------- llamada http (con interceptor JWT) -------
        const { data } = await http.get(endpoint, { params });
        return data;
    }

    async updateStatus(orderId, statusInt) {
        try {
            const { data } = await http.patch(`/orders/${orderId}/status`, null, {
                params: { status: statusInt }
            });
            return data;          // ← devuelve la orden actualizada
        } catch (err) {
            // Propagamos el error para que la vista lo maneje
            throw err.response?.data ?? err;
        }
    }
}
