/**
 * @file settings.service.js
 * @description Service responsible for managing alert settings and configurations.
 * This service handles fetching and updating settings for both stock and expiration alerts.
 * 
 * @module SettingsService
 */

import axios from 'axios';
import { isFrontendOnly } from '@/shared/config/frontend-only.js';
import { getBackendBaseUrl } from '@/shared/config/backend-url.js';

const apiUrl = () => getBackendBaseUrl();

const MOCK_SETTINGS_ROW = { id: 1, expirationAlertMargin: 7, stockAlertEnabled: true };

/**
 * Fetches current alert settings from the API
 * @returns {Promise<Object>} Object containing alert settings
 * @throws {Error} If API request fails
 */
export const fetchSettings = async () => {
  try {
    if (isFrontendOnly()) return [MOCK_SETTINGS_ROW];
    const base = apiUrl();
    if (!base) return [MOCK_SETTINGS_ROW];
    const response = await axios.get(`${base}/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

/**
 * Updates alert settings in the API
 * @param {Object} settings - New settings to be saved
 * @returns {Promise<Object>} Updated settings object
 * @throws {Error} If API request fails
 */
export const updateSettings = async (settings) => {
  try {
    if (isFrontendOnly()) return { ...MOCK_SETTINGS_ROW, ...settings };
    const base = apiUrl();
    if (!base) return { ...MOCK_SETTINGS_ROW, ...settings };
    const response = await axios.put(`${base}/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

/**
 * Obtiene la configuración actual de alertas de expiración
 * @returns {Promise<{expirationAlertMargin: number, id: number}>}
 */
export const getExpirationSettings = async () => {
  try {
    if (isFrontendOnly()) return MOCK_SETTINGS_ROW;
    const base = apiUrl();
    if (!base) return MOCK_SETTINGS_ROW;
    const response = await axios.get(`${base}/settings`);
    return response.data[0]; // Asumimos que solo hay un registro de settings
  } catch (error) {
    console.error('Error al obtener configuración de expiración:', error);
    throw error;
  }
};

/**
 * Actualiza la configuración de días de anticipación para alertas de expiración
 * @param {number} days - Número de días de anticipación (1-30)
 * @returns {Promise<{expirationAlertMargin: number, id: number}>}
 */
export const updateExpirationSettings = async (days) => {
  if (days < 1 || days > 30) {
    throw new Error('Los días de anticipación deben estar entre 1 y 30');
  }

  try {
    if (isFrontendOnly()) return { ...MOCK_SETTINGS_ROW, expirationAlertMargin: days };
    const base = apiUrl();
    if (!base) return { ...MOCK_SETTINGS_ROW, expirationAlertMargin: days };
    const response = await axios.patch(`${base}/settings/1`, {
      expirationAlertMargin: days
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar configuración de expiración:', error);
    throw error;
  }
}; 