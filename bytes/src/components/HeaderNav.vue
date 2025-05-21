<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: navy;">
    

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
import store from '@/store'; // Import your Vuex store

export default {
  methods: {
    goToLogin() {
      if (store.getters.isAuthenticated) {
        // Use the userRole getter to determine destination
        const role = store.getters.userRole;
        this.$router.push({ name: role === 'admin' ? 'Home' : 'Home' });
      } else {
        // Fallback for unauthenticated users
        this.$router.push({ name: 'login' });
      }
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
