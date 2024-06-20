<template>
  <div>
    <!-- Page header component -->
    <page-header />
    <!-- Main content area -->
    <div :style="mainContentStyle">
      <v-card elevation="2" class="pa-5 mx-auto" max-width="600">
        <v-card-title>
          <h1 class="text-h5">Admin Dashboard</h1>
        </v-card-title>
        <v-card-text>
          <p>Welcome to the admin dashboard. Here you can manage users, view reports, and perform other administrative tasks.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary">Manage Users</v-btn>
          <v-btn color="secondary">View Reports</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue';

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
        background: 'linear-gradient(to bottom, navy, white)',
        padding: '20px'
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
