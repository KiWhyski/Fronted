<script>
export default {
  name: 'care-guide-detail',
  /**
   * Props definition
   * @property {Object} guide - Care guide object to display details
   */
  props: {
    guide: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  computed: {
    /**
     * Returns the temperature range as a formatted string
     * @returns {string}
     */
    temperatureRange() {
      if (this.guide.minTemp !== undefined && this.guide.maxTemp !== undefined) {
        return `${this.guide.minTemp}°C - ${this.guide.maxTemp}°C`;
      }
      return '-';
    }
  }
}
</script>

<template>
  <!--
    Modal displaying the details of a care guide.
    Shows title, summary, temperature range, storage place, and recommendation.
    Emits 'close' event when overlay or close button is clicked.
  -->
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Care Guide Details</h2>
        <button class="close-btn" @click="$emit('close')">✖</button>
      </div>

      <div v-if="guide" class="care-guide-card">
        <div class="header">
          <div>
            <h3>{{ guide.title }}</h3>
            <p><strong>Summary:</strong> {{ guide.summary }}</p>
          </div>
        </div>

        <ul class="info-list">
          <li><i class="pi pi-thermometer"></i> <strong>Temperature Range:</strong> {{ temperatureRange }}</li>
          <li><i class="pi pi-sun"></i> <strong>Storage Place:</strong> {{ guide.placeStorage }}</li>
          <li><i class="pi pi-comment"></i> <strong>Recommendation:</strong> {{ guide.recommendation }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}
.care-guide-card {
  padding: 1rem 0;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.info-list {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}
.info-list li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.info-list i {
  color: #666;
  font-size: 1.2rem;
}
</style>