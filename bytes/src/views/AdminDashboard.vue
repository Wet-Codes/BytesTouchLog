<template>
  <div>
    <page-header />
    <div :style="mainContentStyle">
      <v-container>
        <!-- Enhanced Note Card (Top Right) -->
        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-card class="note-card" elevation="4" width="320">
              <v-card-title class="note-header">
                <v-icon left color="yellow">mdi-note-text</v-icon>
                <span>Quick Notes</span>
                <v-spacer></v-spacer>
                <v-btn icon small @click="saveNote" color="yellow">
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="note-body">
                <v-textarea
                  v-model="note"
                  rows="3"
                  placeholder="Type your notes here..."
                  class="note-textarea"
                  no-resize
                  hide-details
                  auto-grow
                ></v-textarea>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Main Action Buttons -->
        <v-row class="d-flex flex-column align-center justify-center" style="gap: 20px; margin-top: 100px;">
          <v-btn class="wide-button" color="primary" @click="navigateTo('students')">
            Dashboard
          </v-btn>
          <v-btn class="wide-button" color="secondary" @click="navigateTo('view-reports')">
            Manage Event
          </v-btn>
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
  data() {
    return {
      note: ''
    };
  },
  computed: {
    mainContentStyle() {
      return {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        backgroundImage: `url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px 0',
      };
    }
  },
  methods: {
    navigateTo(page) {
      this.$router.push({ name: page });
    },
    saveNote() {
      alert('Note saved successfully!');
      // Here you would typically save to database
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
}

/* Button Styles */
.wide-button {
  width: 300px;
  height: 70px;
  font-size: 20px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  text-transform: uppercase;
  background: linear-gradient(145deg, rgba(0,0,0,0.2), rgba(255,255,255,0.1));
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.1);
}

.wide-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.wide-button--primary {
  background: linear-gradient(145deg, #1976D2, #2196F3) !important;
}

.wide-button--secondary {
  background: linear-gradient(145deg, #FF5722, #FF9800) !important;
}

/* Enhanced Note Card Styles */
.note-card {
  background: rgba(0, 0, 0, 0.7) !important;
  border-radius: 12px !important;
  border-left: 4px solid #FFD700;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3) !important;
}

.note-header {
  background: rgba(0, 0, 0, 0.4);
  color: #FFD700 !important;
  font-weight: 600;
  border-bottom: 1px solid rgba(255,215,0,0.3);
}

.note-body {
  padding: 16px !important;
}

.note-textarea {
  background: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
  font-size: 15px;
  line-height: 1.6;
  padding: 10px !important;
  border-radius: 6px !important;
}

.note-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4) !important;
}
</style>