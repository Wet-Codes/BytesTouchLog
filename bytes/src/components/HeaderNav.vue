<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: navy;">
    <v-toolbar-items>
      <v-btn :to="{ name: 'user' }">
        <h3>Users</h3>
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn :to="{ name: 'admin' }">
        <h3>Admin</h3>
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn :to="{ name: 'about' }">
        <h3>About</h3>
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-btn :to="{ name: 'login' }" class="bytesbutton">
      <v-toolbar-title class="text-h4 font-weight-black">BYTES TOUCH LOG</v-toolbar-title>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {};
</script>

<style scoped>
#v {
  color: azure;
  font-family: 'Times New Roman', Times, serif;
}
</style>
