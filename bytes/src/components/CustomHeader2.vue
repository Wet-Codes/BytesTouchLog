<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: navy;">
    <v-toolbar-items>
      <v-btn :to="{ name: 'Account' }" class="toolbar-btn">
        <h3>Account</h3>
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn :to="{ name: 'Application Status' }" class="toolbar-btn">
        <h3>Application Status</h3>
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn @click="goBack" class="toolbar-btn">
        <h3>Back</h3>
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn @click="logout" class="toolbar-btn">
        <h3>LogOut</h3>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    logout() {
      // Perform any logout logic here (e.g., clearing authentication tokens)
      // Redirect to login page
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
</style>
