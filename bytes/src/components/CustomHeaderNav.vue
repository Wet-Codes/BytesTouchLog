<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: navy;">
    <v-toolbar-items>
      <v-btn :to="{ name: 'Account' }" class="toolbar-btn">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/user.png" alt="Account Icon" class="icon">
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn class="toolbar-btn" @click="logout">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/logout-rounded-left.png" alt="Logout Icon" class="icon">
        <span class="toolbar-text">Logout</span>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    logout() {
      // Perform any logout logic here (e.g., clearing authentication tokens)
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

.icon {
  width: 24px; /* Adjust size as needed */
  height: 24px; /* Adjust size as needed */
}
</style>
