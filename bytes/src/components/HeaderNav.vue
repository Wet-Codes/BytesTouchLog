<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: navy;">
    <v-toolbar-items>
      <v-btn :to="{ name: 'user' }" class="toolbar-btn">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/user.png" alt="Account Icon" class="icon">
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn :to="{ name: 'about' }" class="toolbar-btn">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/info.png" alt="About Icon" class="icon"> <!-- Updated to About icon -->
        <span class="toolbar-text">About</span>
      </v-btn>
    </v-toolbar-items>

    

    <v-spacer></v-spacer>

    <v-btn class="bytesbutton" @click="goToLogin">
      <v-toolbar-title class="text-h4 font-weight-black">BYTES TOUCH LOG</v-toolbar-title>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    goToLogin() {
      this.$router.push({ name: 'login' });
    }
  }
};
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
.icon {
  width: 24px; /* Adjust size as needed */
  height: 24px; /* Adjust size as needed */
}
</style>
