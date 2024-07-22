<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: navy;">
    <v-toolbar-items>
      <v-btn :to="{ name: 'Account' }" class="toolbar-btn">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/user.png" alt="Account Icon" class="icon">
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn @click="goBack" class="toolbar-btn">
        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.41 16.59L13.83 15L17.83 11L13.83 7L15.41 5.41L19.41 9.41C19.79 9.79 20 10.37 20 11C20 11.63 19.79 12.21 19.41 12.59L15.41 16.59Z" fill="#ffffff"/>
        </svg>
        <span class="toolbar-text">Back</span>
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn @click="logout" class="toolbar-btn">
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
    },
    goBack() {
      // Navigate to the previous page
      this.$router.go(-1);
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
