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
/* Global styles: lienzo blanco en toda la app (Vuetify aplica gris por defecto en v-main). */
html,
body,
#app,
.v-application,
.v-application__wrap,
.v-main,
.v-main__wrap {
  background-color: #ffffff !important;
}

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
</style>