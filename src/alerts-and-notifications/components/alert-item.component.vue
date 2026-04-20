<script>
export default {
  name: "alert-item",
  props: {
    alert: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <div class="alert-item">
    <p class="item-name">{{ alert.name }}</p>
    <p v-if="alert.stock !== undefined" class="item-critical">{{ $t('alerts.actual-stock') }} {{ alert.stock }}</p>
    <p v-if="alert.minStock !== undefined" class="item-min">{{ $t('alerts.min-stock') }} {{ alert.minStock }}</p>
    <p v-if="alert.expiresIn !== undefined" class="item-expiring">{{ $t('alerts.expires-in-days', { days: alert.expiresIn }) }}</p>
  </div>
</template>

<style scoped>
.alert-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 0.65rem;
}
.item-name {
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.01em;
}
.item-critical {
  color: #b91c1c;
  font-size: 0.9375rem;
}
.item-min {
  font-size: 0.9375rem;
  color: #6e6e73;
}
.item-expiring {
  color: #b45309;
  font-weight: 600;
  font-size: 0.9375rem;
}
</style>