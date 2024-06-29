<template>
  <div>
    <!-- Page header component -->
    <page-header />
    <!-- Main content area with gradient background -->
    <div :style="mainContentStyle">
      <v-card elevation="2" class="pa-5 mx-auto" max-width="600">
        <v-card-title>
          <h1 class="text-h5">Admin Dashboard</h1>
        </v-card-title>
        <v-card-text>
          <p>Welcome to the Admin dashboard. Here you can manage users, view reports, and perform other tasks.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="navigateTo('manage-users')">Student Data</v-btn>
          <v-btn color="secondary" @click="navigateTo('view-reports')">Student Fines</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/CustomHeaderNav.vue';

export default {
  components: {
    PageHeader
  },
  computed: {
    mainContentStyle() {
      return {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, navy, white)', // Define gradient colors here
        padding: '20px'
      };
    }
  },
  methods: {
    navigateTo(page) {
      this.$router.push({ name: page });
    }
  }
};
</script>

<style scoped>
</style>
