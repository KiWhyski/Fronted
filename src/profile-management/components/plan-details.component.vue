<script>
export default {
  name: 'plan-details'
}
</script>

<template>
  <section class="plans-container plans--apple">
    <div class="plans">
      <div class="plan-card plan-card--free">
        <h3 class="plan-name">Free</h3>
        <ul>
          <li>Seguimiento del inventario</li>
          <li>Guías de almacenamiento</li>
          <li>Alertas básicas</li>
        </ul>
      </div>

      <div class="plan-card plan-card--premium">
        <h3 class="plan-name">Premium</h3>
        <p class="price">S/. 19.90</p>
        <ul>
          <li>Soporte prioritario</li>
          <li>Alertas personalizadas</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.plans--apple.plans-container {
  --apple-text: #1d1d1f;
  --apple-secondary: rgba(60, 60, 67, 0.6);
  --apple-blue: #007aff;
  --apple-card: #ffffff;
  --apple-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-family: var(--apple-font);
  background-color: transparent;
  padding: 0;
  text-align: center;
  width: 100%;
  max-width: 692px;
  box-sizing: border-box;
}

.plans {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.plan-card {
  flex: 1 1 260px;
  max-width: 320px;
  min-width: 240px;
  border-radius: 12px;
  padding: 1.25rem 1.125rem 1.5rem;
  text-align: left;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.plan-card--free {
  background: var(--apple-card);
  color: var(--apple-text);
}

.plan-card--premium {
  background: linear-gradient(160deg, #1c1c1e 0%, #2c2c2e 100%);
  color: #f5f5f7;
  border-color: rgba(255, 255, 255, 0.1);
}

.plan-name {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.plan-card--free .plan-name {
  color: var(--apple-text);
}

.plan-card--premium .plan-name {
  color: #fff;
}

.price {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  opacity: 0.95;
}

.plan-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-card li {
  font-size: 0.9375rem;
  line-height: 1.45;
  margin-bottom: 0.65rem;
  color: var(--apple-secondary);
  padding-left: 1.125rem;
  position: relative;
}

.plan-card--premium li {
  color: rgba(255, 255, 255, 0.75);
}

.plan-card li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--apple-blue);
}

.plan-card--premium li::before {
  background: rgba(255, 255, 255, 0.65);
}

@media (max-width: 768px) {
  .plans {
    flex-direction: column;
    align-items: stretch;
  }

  .plan-card {
    max-width: none;
  }
}
</style>
