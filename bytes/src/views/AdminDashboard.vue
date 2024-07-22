<template>
  <div>
    <page-header />
    <div :style="mainContentStyle">
      <v-container>
        <v-row>
          <!-- Main Dashboard Card (Left Side) -->
          <v-col cols="6" class="d-flex align-center">
            <v-card class="form idle" elevation="2">
              <v-card-title>
                <h1 class="text-h5">Admin Dashboard</h1>
              </v-card-title>
              <v-card-text class="white-text">
                <p>Welcome to the admin dashboard. Here you can manage users, view reports, and perform other administrative tasks.</p>
              </v-card-text>
              <v-card-actions>
                <v-btn class="small-button" color="primary" @click="navigateTo('manage-users')">Student Data</v-btn>
                <v-spacer></v-spacer>
                <v-btn class="small-button" color="secondary" @click="navigateTo('view-reports')">Student Fines</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Right Side -->
          <v-col cols="6">
            <v-row>
              <!-- Note Card (Top) -->
              <v-col cols="12" class="d-flex justify-center">
                <v-card class="note-card" elevation="2">
                  <v-card-title>
                    <h3 class="text-h6">Note</h3>
                  </v-card-title>
                  <v-card-text>
                    <v-textarea
                      rows="3"
                      placeholder="Leave a note here..."
                      class="note-textarea"
                    ></v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn class="small-button" color="primary" @click="saveNote">Save Note</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <!-- Data Statistics Card (Below Note) -->
              <v-col cols="12" class="d-flex justify-center">
                <v-card class="form idle" elevation="2">
                  <v-card-title>
                    <h2 class="text-h6">Data Statistics about the Last Attendance</h2>
                  </v-card-title>
                  <v-card-text>
                    <p class="white-text">Here you can find the data statistics related to the last attendance records.</p>
                    <v-divider></v-divider>
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>Attendance Rate:</v-list-item-title>
                          <v-list-item-subtitle>85%</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>Total Events:</v-list-item-title>
                          <v-list-item-subtitle>12</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                  <v-card-actions class="data-statistics-actions">
                    <v-btn class="small-button" color="success" @click="navigateTo('attendance-history')">Attendance History Log</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
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
        backgroundImage: `url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: 0,
        padding: 0,
      };
    }
  },
  methods: {
    navigateTo(page) {
      this.$router.push({ name: page });
    },
    saveNote() {
      // Add logic to save the note
      alert('Note saved!');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');

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

.form {
  position: relative;
  z-index: 1;
  text-align: center;
  width: 100%;
  max-width: 600px;
  padding: 10px;
  background: rgba(0, 0, 0, .5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
}

.note-card {
  width: 100%;
  max-width: 600px;
  padding: 1px;
  background: rgba(0, 0, 0, .6);
  box-shadow: 0 8px 12px rgba(0, 0, 0, .5);
  border-radius: 8px;
}

.note-textarea {
  background: rgba(0, 0, 0, .7);
  color: white;
}

.v-card-title {
  color: white;
}

.v-card-text {
  color: white;
}

.text-h5, .text-h6 {
  font-weight: 600;
}

.small-button {
  padding: 1px 10px; /* Smaller padding */
  font-size: 14px; /* Smaller font size */
}

.v-btn {
  position: relative;
  display: inline-block;
  color: #289bb8;
  text-decoration: none;
  overflow: hidden;
  transition: 0.3s ease;
  letter-spacing: 2px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.v-btn:hover {
  background: #289bb8;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px #289bb8;
  transform: scale(1.05);
}

.v-btn span {
  position: absolute;
  display: block;
}

.v-btn span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #289bb8);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

.v-btn span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #289bb8);
  animation: btn-anim2 1s linear infinite;
  animation-delay: .25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%, 100% {
    top: 100%;
  }
}

.v-btn span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #289bb8);
  animation: btn-anim3 1s linear infinite;
  animation-delay: .5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%, 100% {
    right: 100%;
  }
}

.v-btn span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #289bb8);
  animation: btn-anim4 1s linear infinite;
  animation-delay: .75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%, 100% {
    bottom: 100%;
  }
}
</style>
