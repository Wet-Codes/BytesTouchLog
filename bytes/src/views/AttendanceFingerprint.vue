<template>
  <div>
    <PageHeader />
    <div :style="backgroundStyle">
      <div class="fingerprint-container">
        <v-card class="fingerprint-card">
          <v-card-title class="text-center">
            <h2>Biometric Attendance</h2>
          </v-card-title>
          
          <v-card-text class="text-center">
            <div class="fingerprint-sensor">
              <p class="instruction">{{ instructionText }}</p>
              <div class="fingerprint-image-container" @click="startScan">
                <v-icon 
                  x-large
                  class="fingerprint-icon"
                  :class="{ 'scanning': isScanning }"
                >
                  {{ isScanning ? 'mdi-fingerprint-off' : 'mdi-fingerprint' }}
                </v-icon>
                <div class="fingerprint-animation" v-if="isScanning">
                  <div class="scan-line"></div>
                </div>
              </div>
              
              <v-progress-linear
                v-if="isScanning"
                indeterminate
                color="#FFA000"
                height="5"
                class="progress-bar"
              ></v-progress-linear>
              
              <div v-if="scanResult" class="scan-result">
                <v-icon large :color="scanResult.success ? 'green' : 'red'">
                  {{ scanResult.success ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                </v-icon>
                <p>{{ scanResult.message }}</p>
                <v-btn 
                  v-if="!scanResult.success"
                  color="orange" 
                  small
                  @click="startScan"
                  class="retry-btn"
                >
                  Try Again
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/CustomHeader2.vue';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      isScanning: false,
      scanResult: null,
      instructionText: "Place your finger on the sensor to scan"
    };
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      };
    }
  },
  methods: {
    startScan() {
      if (this.isScanning) return;
      
      this.isScanning = true;
      this.scanResult = null;
      this.instructionText = "Scanning in progress...";
      
      // Simulate fingerprint scan process
      setTimeout(() => {
        this.isScanning = false;
        // Randomly determine if scan was successful (80% success rate)
        const isSuccess = Math.random() > 0.2;
        
        this.scanResult = {
          success: isSuccess,
          message: isSuccess 
            ? 'Attendance recorded successfully!' 
            : 'Scan failed. Fingerprint not recognized.'
        };
        
        this.instructionText = isSuccess 
          ? "Scan completed successfully" 
          : "Scan failed. Please try again.";
        
        // Clear result after 3 seconds if successful
        if (isSuccess) {
          setTimeout(() => {
            this.scanResult = null;
            this.instructionText = "Place your finger on the sensor to scan";
          }, 3000);
        }
      }, 2000);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');

.fingerprint-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.fingerprint-card {
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(5px);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  padding: 20px;
}

.fingerprint-sensor {
  padding: 30px;
  margin-top: 20px;
}

.instruction {
  color: #fff;
  font-size: 18px;
  margin-bottom: 30px;
  font-family: 'Poppins', sans-serif;
  min-height: 27px;
}

.fingerprint-image-container {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 180px;
  height: 180px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.fingerprint-image-container:hover {
  background: rgba(255, 255, 255, 0.15);
}

.fingerprint-icon {
  font-size: 80px;
  color: #FFA000;
  z-index: 1;
  transition: all 0.3s ease;
}

.fingerprint-icon.scanning {
  color: #FFC107;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

.fingerprint-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 3px;
  background: rgba(255, 160, 0, 0.7);
  animation: scan 1.5s linear infinite;
  box-shadow: 0 0 10px rgba(255, 160, 0, 0.8);
}

@keyframes scan {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.progress-bar {
  margin-top: 20px;
  border-radius: 5px;
}

.scan-result {
  margin-top: 20px;
  color: white;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
}

.scan-result p {
  margin: 10px 0;
}

.retry-btn {
  margin-top: 10px;
}

h2 {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
}
</style>