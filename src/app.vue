<script>
export default {
  name: 'App'
}
</script>

<template>
  <v-app>
    <v-main>
      <router-view></router-view>
      <pv-toast/>
    </v-main>
  </v-app>
</template>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
</style>