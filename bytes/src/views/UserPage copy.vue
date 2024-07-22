<template>
  <page-header />
  <div :style="backgroundStyle" class="main-content idle">
    <v-card class="form idle">
      <v-toolbar color="primary">
        <v-toolbar-title>User Profile</v-toolbar-title>
      </v-toolbar>

      <div class="d-flex flex-row">
        <!-- Admin Section -->
        <div class="d-flex flex-column section">
          <button class="btn" prepend-icon="mdi-account" @click="tab = 'option-1'">Admin</button>
          <v-card v-show="tab === 'option-1'" class="section-card" flat>
            <v-card-text>
              <p class="mb-0">
                Admins have full access to manage all user accounts within the system. They can add, edit, or delete account details, ensuring data accuracy. Admins are also able to generate, view, and export comprehensive reports for analysis.
              </p>
            </v-card-text>
          </v-card>
        </div>

        <!-- User Section -->
        <div class="d-flex flex-column section">
          <button class="btn" prepend-icon="mdi-lock" @click="tab = 'option-2'">User</button>
          <v-card v-show="tab === 'option-2'" class="section-card" flat>
            <v-card-text>
              <p class="mb-0">
                Users can view and update their personal profiles and account information. They have access to track their account status, activities, and transaction history. Users can request changes or support through the system's integrated help desk.
              </p>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue';

export default {
  data() {
    return {
      tab: 'option-1',
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
    };
  },
  components: {
    PageHeader
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
      };
    }
  }
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Poppins:300);

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(#30142b, #2772a1);
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.btn {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #11acd2;
  font-size: 16px;
  text-decoration: none;
  overflow: hidden;
  transition: .5s;
  margin-top: 15px;
  letter-spacing: 2px;
}
.btn:hover {
  background: #044c5f;
  color: #fff;
  border-radius: 10%;
  box-shadow: 0 0 5px #289bb8, 0 0 25px #289bb8, 0 0 50px #289bb8, 0 0 100px #289bb8;
}

.form {
  width: 100%; /* Full width of its container */
  max-width: 1000px; /* Adjust as needed */
  background: rgba(0, 0, 0, .5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
  box-sizing: border-box;
  z-index: 1;
  padding: 40px;
}

.v-card {
  width: 100%; /* Full width of its container */
  max-width: 1000px; /* Adjust as needed */
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-card {
  padding: 20px;
}

.v-toolbar-title {
  color: white;
}

.text-h5 {
  font-weight: 800;
}

.section {
  flex: 1;
  min-width: 0;
  margin: 0 20px; /* Add margin for spacing */
}
</style>
