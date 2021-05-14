<template>
  <v-app>
    <NavDrawer />
    <Grid />
  </v-app>
</template>

<script>
import Grid from "./components/Grid";
import NavDrawer from "./components/NavDrawer";

export default {
  name: "App",

  components: {
    Grid,
    NavDrawer,
  },

  data: () => ({
    //
  }),
};
</script>

<style>
body {
  background-color: #212121;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #212121;
  min-height: 100vh;
}
</style>
