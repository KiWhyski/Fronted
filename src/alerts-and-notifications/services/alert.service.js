import axios from "axios";
import { StockAlert, ExpirationAlert } from "@/alerts-and-notifications/model/alert.entity.js";
import { getExpirationSettings } from './settings.service.js';
import { isFrontendOnly } from '@/shared/config/frontend-only.js';

const API_BASE = "http://localhost:3000";

/**
 * Fetches stock alerts with a limit of 3 items
 * @returns {Promise<Array>} Array of stock alerts
 * @throws {Error} If API request fails
 */
export async function fetchStockAlerts() {
    if (isFrontendOnly()) return [];
    const res = await axios.get(`${API_BASE}/products`);
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
    if (isFrontendOnly()) return [];
    const res = await axios.get(`${API_BASE}/products`);
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
        if (isFrontendOnly()) return [];
        const settings = await getExpirationSettings();
        const res = await axios.get(`${API_BASE}/products`);
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
        if (isFrontendOnly()) return [];
        const settings = await getExpirationSettings();
        const res = await axios.get(`${API_BASE}/products`);
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
