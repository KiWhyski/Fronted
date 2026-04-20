import axios from "axios";
import { StockAlert, ExpirationAlert } from "@/alerts-and-notifications/model/alert.entity.js";
import { getExpirationSettings } from './settings.service.js';
import { isFrontendOnly } from '@/shared/config/frontend-only.js';
import { getBackendBaseUrl } from '@/shared/config/backend-url.js';

const apiBase = () => getBackendBaseUrl();

const MOCK_STOCK_ALERTS = [
    new StockAlert({ id: 'demo-p-1', name: 'Vino tinto reserva', stock: 4, minStock: 10 }),
    new StockAlert({ id: 'demo-p-2', name: 'Whisky 12 años', stock: 2, minStock: 5 }),
];

const MOCK_EXPIRATION_ALERTS = [
    new ExpirationAlert({ id: 'demo-p-1', name: 'Vino tinto reserva', expiresIn: 5 }),
    new ExpirationAlert({ id: 'demo-p-3', name: 'Cerveza artesanal', expiresIn: 12 }),
];

/**
 * Fetches stock alerts with a limit of 3 items
 * @returns {Promise<Array>} Array of stock alerts
 * @throws {Error} If API request fails
 */
export async function fetchStockAlerts() {
    if (isFrontendOnly()) return MOCK_STOCK_ALERTS.slice(0, 3);
    const base = apiBase();
    if (!base) return [];
    const res = await axios.get(`${base}/products`);
    // Filtrar productos con stock bajo (current < min)
    const lowStockProducts = res.data.filter(product => product.current < product.min);
    return lowStockProducts
        .slice(0, 3)
        .map(item => new StockAlert({
            id: item.id,
            name: item.name,
            stock: item.current,
            minStock: item.min
        }));
}

/**
 * Fetches all stock alerts without limit
 * @returns {Promise<Array>} Array of all stock alerts
 * @throws {Error} If API request fails
 */
export async function fetchAllStockAlerts() {
    if (isFrontendOnly()) return [...MOCK_STOCK_ALERTS];
    const base = apiBase();
    if (!base) return [];
    const res = await axios.get(`${base}/products`);
    // Filtrar productos con stock bajo (current < min)
    const lowStockProducts = res.data.filter(product => product.current < product.min);
    return lowStockProducts.map(item => new StockAlert({
        id: item.id,
        name: item.name,
        stock: item.current,
        minStock: item.min
    }));
}

/**
 * Fetches expiration alerts with a limit of 3 items
 * @returns {Promise<Array>} Array of expiration alerts
 * @throws {Error} If API request fails
 */
export async function fetchExpirationAlerts() {
    try {
        if (isFrontendOnly()) return MOCK_EXPIRATION_ALERTS.slice(0, 3);
        const base = apiBase();
        if (!base) return [];
        const settings = await getExpirationSettings();
        const res = await axios.get(`${base}/products`);
        // Filtrar productos que expiran en los próximos días según la configuración
        const expiringProducts = res.data.filter(product => {
            if (!product.expirationDate) return false;
            const expirationDate = new Date(product.expirationDate);
            const today = new Date();
            const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
            return daysUntilExpiration <= settings.expirationAlertMargin && daysUntilExpiration > 0;
        });
        return expiringProducts
            .slice(0, 3)
            .map(item => new ExpirationAlert({
                id: item.id,
                name: item.name,
                expiresIn: Math.ceil((new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))
            }));
    } catch (error) {
        console.error('Error al obtener alertas de expiración:', error);
        throw error;
    }
}

/**
 * Fetches all expiration alerts without limit
 * @returns {Promise<Array>} Array of all expiration alerts
 * @throws {Error} If API request fails
 */
export async function fetchAllExpirationAlerts() {
    try {
        if (isFrontendOnly()) return [...MOCK_EXPIRATION_ALERTS];
        const base = apiBase();
        if (!base) return [];
        const settings = await getExpirationSettings();
        const res = await axios.get(`${base}/products`);
        // Filtrar productos que expiran en los próximos días según la configuración
        const expiringProducts = res.data.filter(product => {
            if (!product.expirationDate) return false;
            const expirationDate = new Date(product.expirationDate);
            const today = new Date();
            const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
            return daysUntilExpiration <= settings.expirationAlertMargin && daysUntilExpiration > 0;
        });
        return expiringProducts.map(item => new ExpirationAlert({
            id: item.id,
            name: item.name,
            expiresIn: Math.ceil((new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))
        }));
    } catch (error) {
        console.error('Error al obtener todas las alertas de expiración:', error);
        throw error;
    }
}
