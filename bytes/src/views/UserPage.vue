<template>
  <div>
    <!-- Page header component -->
    <page-header />
    <!-- Main content area with white background -->
    <div class="main-content">
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
  methods: {
    navigateTo(page) {
      this.$router.push({ name: page });
    }
  }
};
</script>

<style scoped>
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white; /* White background */
  padding: 20px;
}

.v-card {
  border-radius: 12px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
}

.v-card-title {
  border-bottom: 1px solid #e0e0e0; /* Subtle border for separation */
  margin-bottom: 20px;
}

.v-card-actions {
  justify-content: space-between; /* Space between buttons */
}

.text-h5 {
  font-weight: 600; /* Slightly bolder text */
}
</style>
