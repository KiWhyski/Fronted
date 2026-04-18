<script>
/**
 * Marcador de compatibilidad: antes mostraba el título de la vista encima del contenido.
 * El sidebar ya indica la sección; no se repite el nombre aquí.
 */
export default {
  name: 'toolbar-content',
  props: {
    pageTitle: {
      type: String,
      default: 'Default Title',
    },
  },
};
</script>

<template>
  <div class="toolbar-content-root" aria-hidden="true" />
</template>

<style scoped>
.toolbar-content-root {
  display: none;
}
</style>