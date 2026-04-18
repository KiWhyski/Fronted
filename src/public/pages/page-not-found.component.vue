<script>
export default {
  name: "page-not-found"
}
</script>

<template>
  <div class="not-found">
    <h2>{{ $t('not-found.title') }}</h2>
    <p>{{ $t('not-found.hint') }}</p>
    <router-link to="/dashboard">{{ $t('not-found.home') }}</router-link>
  </div>
</template>

<style scoped>

</style>