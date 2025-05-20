<template>
  <PageHeader />

  <div :style="backgroundStyle" id="bp">
    <div class="form">
      <h2>Fingerprint Scanner</h2>

      <!-- Reader Selection -->
      <div v-if="!selectedReader">
        <select v-model="selectedReaderName">
          <option v-for="reader in readers" :key="reader" :value="reader">{{ reader }}</option>
        </select>
        <button class="btn" @click="selectReader">
          Select Reader
        </button>
      </div>

      <!-- Actions once reader is selected -->
      <div v-else>
        <p>Selected Reader: {{ selectedReader }}</p>

        <div v-if="showNameInput">
          <input
            v-model="enrollName"
            type="text"
            placeholder="Enter name for enrollment"
            class="name-input"
          />
          <button class="btn" @click="submitEnroll">
            Submit & Enroll
          </button>
        </div>

        <div v-else>
    <button class="btn" @click="startEnrollment">
      Enroll Fingerprint (4 scans)
    </button>
    <button class="btn" @click="startIdentification">
      Identify
    </button>
    
    <!-- SDK's sample fingerprint display -->
    <div class="fingerprint-display">
      <img v-if="fingerprintImage" :src="fingerprintImage" 
           alt="Fingerprint scan" class="fp-image">
    </div>
  </div>
      </div>

      <h3>Status: {{ statusMessage }}</h3>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue';

export default {
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      readers: [],
      selectedReaderName: "",
      selectedReader: null,
      statusMessage: "Waiting...",
      showNameInput: false,
      enrollName: "",
      enrollStep: 0,
      enrollInProgress: false,
      pollingInterval: null,
      enrollmentSamples: [],
      currentAction: null, // 'enroll' or 'identify'
      fingerprintImage: null
    };
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
      };
    }
  },
  methods: {
    async initializeReader() {
      await window.DigitalPersona.WebSdk.initialize();
      this.readers = await window.DigitalPersona.WebSdk.getReaders();
    },

    async startEnrollment() {
      this.currentAction = 'enroll';
      this.enrollmentSamples = [];
      await this.captureLoop(4); // Your 4-scan requirement
    },

    async startIdentification() {
      this.currentAction = 'identify';
      await this.captureLoop(1);
    },

    async captureLoop(requiredScans) {
      try {
        const reader = await window.DigitalPersona.WebSdk.getReader(this.selectedReader);
        
        for (let i = 0; i < requiredScans; i++) {
          this.statusMessage = `Scan ${i+1}/${requiredScans} - Place finger firmly`;
          
          const result = await reader.capture({
            format: "PNG", // From SDK sample
            quality: 65 // SDK recommended threshold
          });
          
          this.fingerprintImage = `data:image/png;base64,${result.data}`;
          
          if (this.currentAction === 'enroll') {
            this.enrollmentSamples.push(result.data);
          } else {
            await this.identifyUser(result.data);
          }
        }
        
        if (this.currentAction === 'enroll') {
          await this.completeEnrollment();
        }
        
      } catch (error) {
        this.statusMessage = `Capture failed: ${error.message}`;
      }
    },

    // ========== YOUR WORKFLOW ==========
    async completeEnrollment() {
      try {
        // Send 4 samples to backend
        await this.$http.post('/fingerprint/enroll', {
          name: this.enrollName,
          samples: this.enrollmentSamples
        });
        
        this.statusMessage = "✅ Enrollment successful!";
        this.enrollmentSamples = [];
        
      } catch (error) {
        this.statusMessage = "⚠️ Enrollment failed";
      }
    },

    async identifyUser(sample) {
      try {
        const response = await this.$http.post('/fingerprint/identify', { sample });
        
        if (response.data.match) {
          this.statusMessage = `✅ Identified: ${response.data.name}`;
        } else {
          this.statusMessage = "❌ No match found";
        }
        
      } catch (error) {
        this.statusMessage = "⚠️ Identification failed";
      }
    }
  },
  mounted() {
    this.loadReaders();
  },
  components: {
    PageHeader,
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
}

#bp {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  background: rgba(0, 0, 0, .5);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  text-align: center;
}

h2 {
  color: white;
}

.btn {
  position: relative;
  display: inline-block;
  margin: 10px 5px;
  padding: 10px 20px;
  color: #289bb8;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: .5s;
}
.btn:hover {
  background: #289bb8;
  color: white;
  border-radius: 5px;
  box-shadow: 0 0 5px #289bb8, 0 0 25px #289bb8;
}

.name-input {
  width: 80%;
  margin: 10px auto;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.fp-image {
  width: 300px;
  height: 400px;
  border: 2px solid #289bb8;
  margin: 20px auto;
  display: block;
}
</style>
