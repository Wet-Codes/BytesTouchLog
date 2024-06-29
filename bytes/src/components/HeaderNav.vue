<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: navy;">
    <v-toolbar-items>
      <v-btn :to="{ name: 'admin' }" class="toolbar-btn">
        <h3>Admin</h3>
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn :to="{ name: 'about' }" class="toolbar-btn">
        <h3>About</h3>
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-btn class="bytesbutton">
      <v-toolbar-title class="text-h4 font-weight-black">BYTES TOUCH LOG</v-toolbar-title>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {};
</script>

<style scoped>
.toolbar-btn {
  color: white !important;
  font-family: 'Times New Roman', Times, serif;
}

.bytesbutton {
  color: white;
  font-family: 'Times New Roman', Times, serif;
}
</style>
