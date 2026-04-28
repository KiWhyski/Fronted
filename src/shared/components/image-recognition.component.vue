<template>
  <div class="image-recognition-container">
    <!-- Header -->
    <div class="recognition-header">
      <h2>{{ $t('Reconocimiento de Imágenes') }}</h2>
      <p class="subtitle">{{ $t('Detecta y clasifica objetos con inteligencia artificial') }}</p>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <!-- Contenido principal -->
    <div class="recognition-content">
      <!-- Sección de cámara -->
      <div class="camera-section">
        <div class="camera-container">
          <div v-if="!modelLoaded" class="loading-spinner">
            <div class="spinner"></div>
            <p>{{ $t('Cargando modelo...') }}</p>
          </div>
          <div
              v-else
              id="webcam-container"
              class="webcam-wrapper"
          ></div>
        </div>

        <!-- Controles -->
        <div class="controls">
          <button
              v-if="!modelLoaded"
              @click="initializeModel"
              :disabled="loading"
              class="btn btn-primary"
          >
            {{ $t('Iniciar Reconocimiento') }}
          </button>
          <button
              v-else
              @click="stopRecognition"
              class="btn btn-secondary"
          >
            {{ $t('Detener') }}
          </button>
          <button
              @click="captureImage"
              :disabled="!modelLoaded || loading"
              class="btn btn-success"
          >
            {{ $t('Capturar y Guardar') }}
          </button>
        </div>
      </div>

      <!-- Sección de resultados -->
      <div class="results-section">
        <!-- Predicciones en tiempo real -->
        <div class="results-card">
          <h3>{{ $t('Predicciones en Tiempo Real') }}</h3>

          <div id="label-container" class="predictions-list">
            <div
                v-for="(prediction, index) in currentPredictions"
                :key="index"
                class="prediction-item"
                :class="{ 'high-confidence': prediction.probability > 0.7 }"
            >
              <span class="label">{{ prediction.className }}</span>
              <div class="confidence-bar">
                <div
                    class="confidence-fill"
                    :style="{ width: (prediction.probability * 100) + '%' }"
                ></div>
              </div>
              <span class="percentage">{{ (prediction.probability * 100).toFixed(1) }}%</span>
            </div>
          </div>

          <!-- Predicción actual -->
          <div v-if="currentBestPrediction" class="current-prediction">
            <h4>{{ $t('Detección Actual') }}</h4>
            <div class="prediction-badge">
              <span class="class-name">{{ currentBestPrediction.className }}</span>
              <span class="confidence-badge">
                {{ (currentBestPrediction.probability * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Historial de predicciones -->
        <div class="history-card">
          <h3>{{ $t('Historial Reciente') }}</h3>
          <div v-if="recentPredictions.length === 0" class="empty-state">
            {{ $t('No hay predicciones registradas aún') }}
          </div>
          <div v-else class="history-list">
            <div
                v-for="prediction in recentPredictions"
                :key="prediction.id"
                class="history-item"
            >
              <span class="label">{{ prediction.label }}</span>
              <span class="confidence">{{ (prediction.confidence * 100).toFixed(1) }}%</span>
              <span class="date">{{ formatDate(prediction.timestamp) }}</span>
              <button
                  @click="removePrediction(prediction.id)"
                  class="btn-delete"
                  :title="$t('Eliminar')"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de configuración del modelo -->
    <div v-if="showModelConfig" class="modal-overlay" @click="showModelConfig = false">
      <div class="modal-content" @click.stop>
        <h3>{{ $t('Configurar Modelo') }}</h3>
        <div class="form-group">
          <label>{{ $t('URL del modelo (model.json)') }}</label>
          <input
              v-model="modelURL"
              type="text"
              placeholder="https://example.com/my_model/model.json"
              class="input"
          />
        </div>
        <div class="form-group">
          <label>{{ $t('URL de metadatos (metadata.json)') }}</label>
          <input
              v-model="metadataURL"
              type="text"
              placeholder="https://example.com/my_model/metadata.json"
              class="input"
          />
        </div>
        <div class="modal-actions">
          <button @click="showModelConfig = false" class="btn btn-secondary">
            {{ $t('Cancelar') }}
          </button>
          <button @click="loadModelWithURLs" class="btn btn-primary">
            {{ $t('Cargar Modelo') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePredictionsStore } from '@/shared/services/predictions.store.js';

const { t } = useI18n();
const predictionsStore = usePredictionsStore();

/* ─── Estado de cámara y modelo ─────────────────────────────────────────── */
const model         = ref(null);
const webcam        = ref(null);
const modelLoaded   = ref(false);
const isRecognizing = ref(false);
const loading       = ref(false);
const error         = ref(null);
const successMessage = ref(null);

/* ─── Configuración del modelo ───────────────────────────────────────────── */
const modelURL        = ref('');
const metadataURL     = ref('');
const showModelConfig = ref(true);

/* ─── Predicciones ───────────────────────────────────────────────────────── */
const currentPredictions = ref([]);

const currentBestPrediction = computed(() => {
  if (!currentPredictions.value.length) return null;
  return currentPredictions.value.reduce((prev, cur) =>
      prev.probability > cur.probability ? prev : cur
  );
});

const recentPredictions = computed(() => predictionsStore.recentPredictions);

/* ─── Constantes de cámara ───────────────────────────────────────────────── */
const WEBCAM_WIDTH  = 400;
const WEBCAM_HEIGHT = 300;
const FLIP          = true;

/* ─── Loop de reconocimiento ─────────────────────────────────────────────── */
let animationFrame = null;

/* ─── Carga dinámica de scripts ──────────────────────────────────────────── */
function loadScript(src) {
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

/* ─── Inicializar modelo ─────────────────────────────────────────────────── */
async function initializeModel() {
  loading.value = true;
  error.value   = null;

  try {
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js');

    if (!modelURL.value || !metadataURL.value) {
      showModelConfig.value = true;
      return;
    }

    await loadModelWithURLs();
  } catch (err) {
    error.value = err.message || 'Error al cargar el modelo';
    console.error('Error initializing model:', err);
  } finally {
    loading.value = false;
  }
}

/* ─── Cargar modelo con URLs ─────────────────────────────────────────────── */
async function loadModelWithURLs() {
  loading.value = true;
  error.value   = null;

  try {
    if (!modelURL.value || !metadataURL.value) {
      throw new Error('Las URLs del modelo son requeridas');
    }

    model.value = await window.tmImage.load(modelURL.value, metadataURL.value);

    const container = document.getElementById('webcam-container');
    if (container) container.innerHTML = '';

    webcam.value = new window.tmImage.Webcam(WEBCAM_WIDTH, WEBCAM_HEIGHT, FLIP);
    await webcam.value.setup();
    await webcam.value.play();

    document.getElementById('webcam-container').appendChild(webcam.value.canvas);

    modelLoaded.value   = true;
    isRecognizing.value = true;
    showModelConfig.value = false;

    startRecognitionLoop();
  } catch (err) {
    modelLoaded.value = false;
    error.value = err.message || 'Error al cargar el modelo';
    console.error('Error loading model:', err);
  } finally {
    loading.value = false;
  }
}

/* ─── Loop de predicción ─────────────────────────────────────────────────── */
function startRecognitionLoop() {
  if (!isRecognizing.value || !modelLoaded.value) return;
  webcam.value.update();
  predict();
  animationFrame = window.requestAnimationFrame(startRecognitionLoop);
}

async function predict() {
  if (!model.value || !webcam.value) return;
  try {
    currentPredictions.value = await model.value.predict(webcam.value.canvas);
  } catch (err) {
    console.error('Error during prediction:', err);
  }
}

/* ─── Capturar imagen ────────────────────────────────────────────────────── */
async function captureImage() {
  if (!webcam.value || !currentBestPrediction.value) {
    error.value = 'No hay predicción para guardar';
    return;
  }

  loading.value = true;
  error.value   = null;

  try {
    const imageBase64 = webcam.value.canvas.toDataURL('image/jpeg', 0.8);

    await predictionsStore.savePrediction({
      label:      currentBestPrediction.value.className,
      confidence: currentBestPrediction.value.probability,
      imageBase64,
      metadata: {
        allPredictions: currentPredictions.value,
        cameraWidth:    WEBCAM_WIDTH,
        cameraHeight:   WEBCAM_HEIGHT
      }
    });

    successMessage.value = `${t('Predicción guardada')}: ${currentBestPrediction.value.className}`;
    setTimeout(() => { successMessage.value = null; }, 3000);
  } catch (err) {
    error.value = err.message || 'Error al guardar la predicción';
    console.error('Error capturing image:', err);
  } finally {
    loading.value = false;
  }
}

/* ─── Detener reconocimiento ─────────────────────────────────────────────── */
function stopRecognition() {
  isRecognizing.value = false;
  if (animationFrame) window.cancelAnimationFrame(animationFrame);
  if (webcam.value)   webcam.value.stop();
  modelLoaded.value = false;
}

/* ─── Eliminar predicción ────────────────────────────────────────────────── */
async function removePrediction(predictionId) {
  try {
    await predictionsStore.deletePrediction(predictionId);
  } catch (err) {
    error.value = 'Error al eliminar la predicción';
  }
}

/* ─── Formatear fecha ────────────────────────────────────────────────────── */
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit'
  });
}

/* ─── Ciclo de vida ──────────────────────────────────────────────────────── */
onMounted(async () => {
  try {
    await predictionsStore.fetchUserPredictions({ pageSize: 5 });
  } catch (err) {
    console.error('Error fetching predictions:', err);
  }
});

onUnmounted(() => {
  stopRecognition();
  if (animationFrame) window.cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
/* ─── Contenedor principal ───────────────────────────────────────────────── */
.image-recognition-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* ─── Header ─────────────────────────────────────────────────────────────── */
.recognition-header {
  margin-bottom: 30px;
  text-align: center;
}

.recognition-header h2 {
  margin: 0 0 10px;
  font-size: 2rem;
  color: #333;
}

.subtitle {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

/* ─── Alertas ────────────────────────────────────────────────────────────── */
.alert {
  padding: 15px 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-weight: 500;
}

.alert-success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert-error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

/* ─── Layout principal ───────────────────────────────────────────────────── */
.recognition-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

@media (max-width: 1024px) {
  .recognition-content {
    grid-template-columns: 1fr;
  }
}

/* ─── Sección de cámara ──────────────────────────────────────────────────── */
.camera-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.camera-container {
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.webcam-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

/* ─── Spinner ────────────────────────────────────────────────────────────── */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 15px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Controles ──────────────────────────────────────────────────────────── */
.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 150px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #7f8c8d;
  transform: translateY(-2px);
}

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #229954;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.btn-delete {
  width: 30px;
  height: 30px;
  padding: 0;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background-color: #c0392b;
  transform: scale(1.1);
}

/* ─── Sección de resultados ──────────────────────────────────────────────── */
.results-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.results-card,
.history-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.results-card h3,
.history-card h3 {
  margin: 0 0 20px;
  font-size: 1.3rem;
  color: #333;
}

/* ─── Predicciones ───────────────────────────────────────────────────────── */
.predictions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.prediction-item {
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border-left: 4px solid #bdc3c7;
  transition: all 0.3s ease;
}

.prediction-item.high-confidence {
  border-left-color: #27ae60;
  background-color: #f0fdf4;
}

.label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.confidence-bar {
  width: 100%;
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #e74c3c, #f39c12, #27ae60);
  transition: width 0.3s ease;
}

.percentage {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.current-prediction {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.current-prediction h4 {
  margin: 0 0 15px;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

.prediction-badge {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.class-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.confidence-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 600;
}

/* ─── Historial ──────────────────────────────────────────────────────────── */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 15px;
  align-items: center;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  transition: all 0.3s ease;
}

.history-item:hover {
  background-color: #f0f0f0;
  transform: translateX(4px);
}

.history-item .label {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.history-item .confidence {
  font-weight: 600;
  color: #27ae60;
  text-align: center;
  min-width: 50px;
}

.history-item .date {
  font-size: 0.85rem;
  color: #999;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-style: italic;
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.modal-content h3 {
  margin: 0 0 20px;
  font-size: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.modal-actions .btn {
  flex: 1;
}

/* ─── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .history-item {
    grid-template-columns: 1fr auto auto;
    gap: 8px;
  }

  .history-item .date {
    grid-column: 1;
    order: 3;
    font-size: 0.75rem;
  }
}
</style>