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
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}
.item-name {
  font-weight: 600;
}
.item-critical {
  color: #d90429;
  font-size: 0.95rem;
}
.item-min {
  font-size: 0.95rem;
  color: #555;
}
.item-expiring {
  color: #d98c4a;
  font-weight: bold;
  font-size: 0.95rem;
}
</style>