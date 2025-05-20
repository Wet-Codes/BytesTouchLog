<template>
  <div>
    <page-header />
    <div :style="mainContentStyle">
      <v-container class="button-container">
        <!-- Centered Main Action Buttons -->
        <v-row class="d-flex justify-center align-center">
          <v-col cols="auto" v-for="button in buttons" :key="button.route">
            <div class="button-wrapper">
              <v-btn 
                class="square-button" 
                :color="button.color" 
                @click="navigateTo(button.route)"
                height="280px"
                width="280px"
              >
                <div class="button-content">
                  <v-icon size="84">{{ button.icon }}</v-icon>
                  <div class="button-text">
                    <div v-for="(line, index) in button.text.split(' ')" :key="index">{{ line }}</div>
                  </div>
                </div>
              </v-btn>
              <!-- Border animation elements -->
              <div class="border-animation-container">
                <span class="border-animation top"></span>
                <span class="border-animation right"></span>
                <span class="border-animation bottom"></span>
                <span class="border-animation left"></span>
              </div>
            </div>
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
  data() {
    return {
      buttons: [
        { 
          text: 'Dashboard', 
          route: 'students', 
          color: 'black-transparent', 
          icon: 'mdi-view-dashboard' 
        },
        { 
          text: 'Manage Student', 
          route: 'manage-students', 
          color: 'black-transparent', 
          icon: 'mdi-account-group' 
        },
        { 
          text: 'Manage Event', 
          route: 'manage-events', 
          color: 'black-transparent', 
          icon: 'mdi-calendar-multiple' 
        },
        { 
          text: 'History Log', 
          route: 'history-log', 
          color: 'black-transparent', 
          icon: 'mdi-history' 
        }
      ]
    };
  },
  computed: {
    mainContentStyle() {
      return {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
}

.button-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px;
}

/* Button Wrapper with increased spacing */
.button-wrapper {
  position: relative;
  display: inline-block;
  margin: 0 50px; /* Increased spacing between buttons */
}

/* Square Button Styles */
.square-button {
  border-radius: 12px !important;
  font-weight: 600;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4) !important;
  transition: all 0.3s ease !important;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.5) !important; /* Black transparent background */
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.1) !important;
  display: flex !important;
  flex-direction: column;
  color: white !important;
  position: relative;
  overflow: hidden;
}

.square-button:hover {
  transform: scale(1.05) !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5) !important;
  background: rgba(0, 0, 0, 0.6) !important; /* Slightly darker on hover */
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.button-text {
  margin-top: 20px;
  text-align: center;
  font-size: 24px; /* Increased font size */
  line-height: 1.3;
  font-weight: 500;
}

.button-text div {
  margin: 4px 0;
}

/* Border Animation Container with brighter effect */
.border-animation-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  border-radius: 12px;
  overflow: hidden;
}

.border-animation {
  position: absolute;
}

/* Brighter border animations with increased opacity */
.border-animation.top {
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 1), transparent);
  animation: btn-anim1 3s linear infinite;
}

.border-animation.right {
  top: 0;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 1), transparent);
  animation: btn-anim2 3s linear infinite;
  animation-delay: 0.75s;
}

.border-animation.bottom {
  bottom: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, rgba(255, 255, 255, 1), transparent);
  animation: btn-anim3 3s linear infinite;
  animation-delay: 1.5s;
}

.border-animation.left {
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(0deg, transparent, rgba(255, 255, 255, 1), transparent);
  animation: btn-anim4 3s linear infinite;
  animation-delay: 2.25s;
}

@keyframes btn-anim1 {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes btn-anim2 {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes btn-anim3 {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

@keyframes btn-anim4 {
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
}
</style>