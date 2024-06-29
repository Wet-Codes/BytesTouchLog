<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: white;">
    <v-toolbar-items>
      <v-btn :to="{ name: 'Account' }">
        <h3>Account</h3>
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn :to="{ name: 'Application Status' }">
        <h3>Application Status</h3>
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn @click="goBack">
        <h3>Back</h3>
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn @click="logout">
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
#v {
  color: rgb(6, 6, 191);
  font-family: 'Times New Roman', Times, serif;
}
</style>
