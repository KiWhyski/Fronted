import axios from 'axios';
import { useAuthenticationStore } from '@/authentication/services/authentication.store.js';

/**
 * Servicio para interactuar con el backend de predicciones
 * Utiliza Teachable Machine para reconocimiento de imágenes
 */
class PredictionsService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    this.endpoints = {
      savePrediction: '/predictions',
      getPredictions: '/predictions',
      deletePrediction: (id) => `/predictions/${id}`,
      getUserPredictions: '/predictions/user',
      getPredictionStats: '/predictions/stats'
    };
  }

  /**
   * Envía una predicción al backend
   * @param {Object} predictionData - Datos de la predicción
   * @param {string} predictionData.label - Etiqueta de la clase detectada
   * @param {number} predictionData.confidence - Confianza de 0 a 1
   * @param {string} predictionData.imageBase64 - Imagen en base64 (opcional)
   * @param {Object} predictionData.metadata - Metadatos adicionales (opcional)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async savePrediction(predictionData) {
    try {
      const authStore = useAuthenticationStore();
      const response = await axios.post(
        `${this.baseURL}${this.endpoints.savePrediction}`,
        {
          label: predictionData.label,
          confidence: predictionData.confidence,
          imageBase64: predictionData.imageBase64 || null,
          metadata: predictionData.metadata || {},
          userId: authStore.user?.id || null,
          timestamp: new Date().toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving prediction:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las predicciones del usuario autenticado
   * @param {Object} options - Opciones de paginación y filtrado
   * @param {number} options.page - Número de página
   * @param {number} options.pageSize - Cantidad de resultados
   * @param {string} options.label - Filtrar por etiqueta (opcional)
   * @returns {Promise<Object>} Lista de predicciones
   */
  async getUserPredictions(options = {}) {
    try {
      const authStore = useAuthenticationStore();
      const params = new URLSearchParams({
        page: options.page || 1,
        pageSize: options.pageSize || 10,
        ...(options.label && { label: options.label })
      });

      const response = await axios.get(
        `${this.baseURL}${this.endpoints.getUserPredictions}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user predictions:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de predicciones del usuario
   * @returns {Promise<Object>} Estadísticas
   */
  async getPredictionStats() {
    try {
      const authStore = useAuthenticationStore();
      const response = await axios.get(
        `${this.baseURL}${this.endpoints.getPredictionStats}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching prediction stats:', error);
      throw error;
    }
  }

  /**
   * Elimina una predicción por ID
   * @param {string} predictionId - ID de la predicción
   * @returns {Promise<void>}
   */
  async deletePrediction(predictionId) {
    try {
      const authStore = useAuthenticationStore();
      await axios.delete(
        `${this.baseURL}${this.endpoints.deletePrediction(predictionId)}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        }
      );
    } catch (error) {
      console.error('Error deleting prediction:', error);
      throw error;
    }
  }

  /**
   * Carga un modelo de Teachable Machine
   * @param {string} modelURL - URL a model.json
   * @param {string} metadataURL - URL a metadata.json
   * @returns {Promise<Object>} Modelo cargado
   */
  async loadTeachableMachineModel(modelURL, metadataURL) {
    try {
      // Cargar TensorFlow desde CDN si no está disponible
      if (!window.tf) {
        await this.loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js');
      }

      // Cargar Teachable Machine desde CDN si no está disponible
      if (!window.tmImage) {
        await this.loadScript('https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js');
      }

      // Esperar a que las librerías estén disponibles
      if (!window.tmImage) {
        throw new Error('Teachable Machine library failed to load');
      }

      const model = await window.tmImage.load(modelURL, metadataURL);
      return model;
    } catch (error) {
      console.error('Error loading Teachable Machine model:', error);
      throw error;
    }
  }

  /**
   * Carga un script externo dinámicamente
   * @param {string} src - URL del script
   * @returns {Promise<void>}
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }
}

export default new PredictionsService();

