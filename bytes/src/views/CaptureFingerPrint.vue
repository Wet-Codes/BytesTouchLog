<template>
  <PageHeader />
  <div :style="backgroundStyle" id="bp">
    <div class="form">
      <!-- Mode Selection -->
      <div class="mode-selector">
        <button 
          @click="setMode('enroll')" 
          :class="['mode-btn', { active: mode === 'enroll' }]"
        >
          <i class="fas fa-fingerprint"></i> Enroll Fingerprint
        </button>
        <button 
          @click="setMode('identify')" 
          :class="['mode-btn', { active: mode === 'identify' }]"
        >
          <i class="fas fa-search"></i> Identify Fingerprint
        </button>
      </div>

      <!-- Reader Selection -->
      <div v-if="!selectedReader" class="reader-section">
        <div class="select-wrapper">
          <i class="fas fa-fingerprint select-icon"></i>
          <select v-model="selectedReaderName" class="reader-select">
            <option value="" disabled>Select a reader</option>
            <option v-for="reader in readers" :key="reader" :value="reader">{{ reader }}</option>
          </select>
        </div>
        <button class="btn" @click="selectReader">
          <i class="fas fa-check"></i> Select Reader
        </button>
      </div>

      <!-- Enrollment Mode -->
      <div v-else-if="mode === 'enroll'">
        <p class="reader-info">Selected Reader: {{ selectedReader }}</p>
        <h2><i class="fas fa-user-plus"></i> Fingerprint Enrollment</h2>

        <div v-if="!enrollmentStarted" class="enrollment-section">
          <div class="input-wrapper">
            <i class="fas fa-user input-icon"></i>
            <input
              v-model="enrollName"
              type="text"
              placeholder="Enter name for enrollment"
              class="name-input"
            />
          </div>
          <button class="btn enroll-btn" @click="startEnrollment">
            <i class="fas fa-play"></i> Start Enrollment
          </button>
        </div>

        <div v-else class="fingerprint-display">
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: enrollmentProgress + '%' }"></div>
            <span class="progress-text">{{ Math.round(enrollmentProgress) }}% Complete</span>
          </div>
          
          <p class="scan-progress">
            Scan {{ enrollScanStep + 1 }}/4 for {{ currentEnrollFinger }} finger
          </p>
          
          <div class="fingerprint-animation">
            <div class="fingerprint-icon" :class="{ scanning: isScanning }">
              <i class="fas fa-fingerprint"></i>
            </div>
            <div class="loading-dots" v-if="isScanning">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <p class="status-message">{{ statusMessage }}</p>
        </div>
      </div>

      <!-- Identification Mode -->
      <div v-else class="identification-section">
        <p class="reader-info">Selected Reader: {{ selectedReader }}</p>
        <h2><i class="fas fa-search"></i> Fingerprint Identification</h2>

        <div v-if="!identificationStarted" class="identification-controls">
          <button class="btn identify-btn" @click="startIdentification">
            <i class="fas fa-play"></i> Start Identification
          </button>
        </div>

        <div v-else class="fingerprint-display">
          <p class="scan-progress">Place your finger on the scanner</p>
          
          <div class="fingerprint-animation">
            <div class="fingerprint-icon" :class="{ scanning: isScanning }">
              <i class="fas fa-fingerprint"></i>
            </div>
            <div class="loading-dots" v-if="isScanning">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <p class="status-message">{{ statusMessage }}</p>

          <div v-if="debugInfo" class="debug-info">
            <h3><i class="fas fa-bug"></i> Debug Information</h3>
            <pre>{{ debugInfo }}</pre>
          </div>

          <div v-if="identificationResult" class="result-display">
            <div v-if="identificationResult.success" class="success-result">
              <h3><i class="fas fa-check-circle"></i> User Identified</h3>
              <p><strong>Name:</strong> {{ identificationResult.name }}</p>
              <p v-if="identificationResult.userId"><strong>User ID:</strong> {{ identificationResult.userId }}</p>
              <p><strong>Enrolled At:</strong> {{ formatDate(identificationResult.enrolledAt) }}</p>
            </div>
            <div v-else class="error-result">
              <h3><i class="fas fa-times-circle"></i> Identification Failed</h3>
              <p>{{ identificationResult.error || "No matching fingerprint found." }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showLiteClientLink" class="reader-communication-error">
        <i class="fas fa-exclamation-triangle"></i> Cannot connect to your fingerprint device. 
        Make sure the device is connected. You may need to download and install
        <a href="https://crossmatch.hid.gl/lite-client" target="_blank">DigitalPersona Lite Client</a>.
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue';
import AuthService from '@/services/AuthServices';

export default {
  components: { PageHeader },
  data() {
    return {
      mode: 'enroll',
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      reader: null,
      readers: [],
      selectedReaderName: "",
      selectedReader: null,
      enrollName: "",

      // Enrollment logic
      enrollScanStep: 0,
      currentEnrollFinger: 'index',
      indexFingerSamples: [],
      middleFingerSamples: [],
      enrollmentStarted: false,
      isScanning: false,
      enrollmentProgress: 0,

      // Identification logic
      identificationStarted: false,
      identificationResult: null,

      // UI state
      fingerprintImage: null,
      statusMessage: "Waiting for reader selection...",
      showLiteClientLink: false,
      debugInfo: "",
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
    },
  },
  async mounted() {
    try {
      if (!window.Fingerprint?.WebApi) throw new Error("Fingerprint SDK not available");
      console.log("✅ SDK available");

      this.reader = new window.Fingerprint.WebApi();

      // Bind SDK events
      this.reader.onDeviceConnected = () => {
        this.statusMessage = "Device connected. Ready to scan.";
      };
      this.reader.onDeviceDisconnected = () => {
        this.statusMessage = "Device disconnected.";
        this.isScanning = false;
      };
      this.reader.onCommunicationFailed = () => {
        this.statusMessage = "Communication with reader failed.";
        this.isScanning = false;
      };
      this.reader.onSamplesAcquired = this.handleEnrollmentSample;

      // Load devices
      const devices = await this.reader.enumerateDevices();
      this.readers = devices;
      this.statusMessage = devices.length ? "Select a reader" : "No fingerprint readers found";
      console.log("📡 Available readers:", devices);
    } catch (err) {
      console.error("❌ SDK init error:", err);
      this.statusMessage = `SDK error: ${err.message}`;
      this.showLiteClientLink = true;
    }
  },
  methods: {
    setMode(newMode) {
      this.resetAll();
      this.mode = newMode;
      this.statusMessage = `Mode set to ${newMode === 'enroll' ? 'Enrollment' : 'Identification'}`;
    },

    selectReader() {
      if (!this.selectedReaderName) {
        this.statusMessage = "Please select a reader first";
        return;
      }
      this.selectedReader = this.selectedReaderName;
      this.statusMessage = `Reader "${this.selectedReader}" selected.`;
      console.log("🖐️ Reader selected:", this.selectedReader);
    },

    async startEnrollment() {
      if (!this.enrollName) {
        this.statusMessage = "Please enter a name";
        return;
      }

      this.debugInfo = "Initializing enrollment...";
      this.enrollScanStep = 0;
      this.indexFingerSamples = [];
      this.middleFingerSamples = [];
      this.currentEnrollFinger = 'index';
      this.enrollmentStarted = true;
      this.isScanning = true;
      this.enrollmentProgress = 0;
      this.statusMessage = "Starting enrollment... Place your index finger on the scanner";

      try {
        await this.reader.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, this.selectedReader);
      } catch (err) {
        this.debugInfo += `\nAcquisition error: ${err.message}`;
        this.statusMessage = `Acquisition failed: ${err.message}`;
        this.isScanning = false;
        console.error("❌ Acquisition error:", err);
      }
    },

    async handleEnrollmentSample(event) {
      try {
        const raw = JSON.parse(event.samples);
        const base64Sample = raw[0].Data;

        this.isScanning = false; // Pause scanning animation
        
        // Update progress (12.5% per scan since 8 total scans)
        this.enrollmentProgress = ((this.indexFingerSamples.length + this.middleFingerSamples.length) + 1) * 12.5;

        if (this.currentEnrollFinger === 'index') {
          this.indexFingerSamples.push(base64Sample);
          this.enrollScanStep++;
          this.statusMessage = `Scan ${this.enrollScanStep}/4 for index finger (${Math.round(this.enrollmentProgress)}% complete)`;

          if (this.indexFingerSamples.length === 4) {
            this.currentEnrollFinger = 'middle';
            this.enrollScanStep = 0;
            this.statusMessage = "Now scanning middle finger... Place your middle finger on the scanner";
          }
        } else if (this.currentEnrollFinger === 'middle') {
          this.middleFingerSamples.push(base64Sample);
          this.enrollScanStep++;
          this.statusMessage = `Scan ${this.enrollScanStep}/4 for middle finger (${Math.round(this.enrollmentProgress)}% complete)`;

          if (this.middleFingerSamples.length === 4) {
            await this.reader.stopAcquisition();
            this.statusMessage = "Sending enrollment data to backend...";
            await this.sendEnrollment();
            return;
          }
        }

        // Brief pause before next scan
        await this.delay(800);
        this.isScanning = true;
        
      } catch (err) {
        this.statusMessage = `❌ Sample error: ${err.message}`;
        this.isScanning = false;
        console.error("⚠️ Sample error:", err);
      }
    },

    async sendEnrollment() {
      try {
        this.isScanning = true;
        this.statusMessage = "Processing enrollment data...";
        
        const response = await AuthService.enrollFingerprint({
          name: this.enrollName,
          enrolled_index_finger_data: this.indexFingerSamples,
          enrolled_middle_finger_data: this.middleFingerSamples
        });

        if (response.data?.message === 'Enrollment successful') {
          this.statusMessage = `✅ ${this.enrollName} enrolled successfully!`;
          this.enrollmentProgress = 100;
        } else {
          throw new Error(response.data?.error || "Enrollment failed");
        }
      } catch (err) {
        this.statusMessage = `❌ Enrollment error: ${err.message}`;
      } finally {
        this.isScanning = false;
        setTimeout(() => this.resetEnrollment(), 3000);
      }
    },

    async startIdentification() {
      this.identificationStarted = true;
      this.isScanning = true;
      this.statusMessage = "Starting identification... Place your finger on the scanner";
      this.debugInfo = "";
      this.fingerprintImage = null;
      this.identificationResult = null;

      try {
        await this.reader.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, this.selectedReader);
        this.reader.onSamplesAcquired = this.handleIdentificationSample;
      } catch (err) {
        this.statusMessage = `Acquisition error: ${err.message}`;
        this.isScanning = false;
        console.error("Identification start error:", err);
      }
    },

    async handleIdentificationSample(event) {
      try {
        this.isScanning = false;
        const raw = JSON.parse(event.samples);
        const base64Sample = raw[0].Data;

        await this.reader.stopAcquisition();
        this.statusMessage = "Identifying fingerprint...";

        const response = await AuthService.identifyFingerprint({ fmd: base64Sample });
        
        if (response.data.success) {
          const user = response.data.user;
          this.identificationResult = {
            success: true,
            name: user?.name || "Unknown",
            userId: user?.id || "-",
            enrolledAt: user?.enrolledAt || null
          };
          this.statusMessage = `✅ User identified: ${this.identificationResult.name}`;

          await this.delay(2000);
        } else {
          this.identificationResult = {
            success: false,
            error: response.data.message || "Identification failed"
          };
          this.statusMessage = `❌ ${this.identificationResult.error}`;
          await this.delay(1000);
        }

        // Restart scanning for next identification
        this.identificationResult = null;
        this.isScanning = true;
        await this.reader.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, this.selectedReader);
        this.statusMessage = "Place your finger on the scanner";

      } catch (err) {
        console.error("❌ Identification error:", err);
        this.statusMessage = `Identification error: ${err?.response?.data?.error || err.message}`;
        this.isScanning = false;
      }
    },

    async delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    resetEnrollment() {
      this.enrollScanStep = 0;
      this.indexFingerSamples = [];
      this.middleFingerSamples = [];
      this.enrollName = "";
      this.enrollmentStarted = false;
      this.fingerprintImage = null;
      this.currentEnrollFinger = 'index';
      this.isScanning = false;
      this.enrollmentProgress = 0;
    },

    resetAll() {
      this.resetEnrollment();
      this.identificationStarted = false;
      this.identificationResult = null;
      this.fingerprintImage = null;
      this.statusMessage = "Mode switched. Select reader and start.";
      this.debugInfo = "";
      this.isScanning = false;
    },

    formatDate(date) {
      if (!date) return "Unknown";
      return new Date(date).toLocaleString();
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.form {
  background: rgba(0, 0, 0, 0.6);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  text-align: center;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.select-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

.select-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
}

.reader-select {
  padding: 0.8rem 1rem 0.8rem 40px;
  width: 100%;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  appearance: none;
}

.reader-select option {
  background: #333;
}

.input-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
}

.name-input {
  padding: 0.8rem 1rem 0.8rem 40px;
  width: 100%;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.name-input::placeholder {
  color: #aaa;
}

.btn {
  padding: 0.8rem 1.5rem;
  background-color: #0077aa;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.btn:hover {
  background-color: #005f8d;
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.enroll-btn {
  background-color: #28a745;
}

.enroll-btn:hover {
  background-color: #1e7d36;
}

.identify-btn {
  background-color: #ff9800;
}

.identify-btn:hover {
  background-color: #e68a00;
}

.reader-info {
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
  font-size: 1rem;
  color: #ccc;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
}

.enrollment-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.fingerprint-display {
  text-align: center;
  margin-top: 1.5rem;
}

.scan-progress {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #4fc3f7;
}

.status-message {
  text-align: center;
  margin-top: 1.5rem;
  font-weight: 500;
  color: #fff;
  font-size: 1rem;
}

.reader-communication-error {
  color: #ff6b6b;
  text-align: center;
  margin-top: 2rem;
  font-size: 0.95rem;
  padding: 1rem;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mode-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-btn {
  padding: 0.8rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.mode-btn.active {
  background-color: #0077aa;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 119, 170, 0.3);
}

.fingerprint-animation {
  margin: 2rem 0;
  position: relative;
}

.fingerprint-icon {
  font-size: 5rem;
  color: #4fc3f7;
  transition: all 0.3s ease;
}

.fingerprint-icon.scanning {
  color: #28a745;
  animation: pulse 1.5s infinite;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
}

.loading-dots span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4fc3f7;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.progress-container {
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #28a745;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: 600;
  font-size: 0.8rem;
}

.result-display {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: left;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
}

.success-result {
  color: #a5d6a7;
}

.success-result h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  color: #a5d6a7;
}

.success-result p {
  margin: 0.5rem 0;
}

.error-result {
  color: #ffab91;
}

.error-result h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  color: #ffab91;
}

.debug-info {
  margin-top: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  text-align: left;
  border: 1px solid #555;
  color: #fff;
}

.debug-info h3 {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .form {
    padding: 1.5rem;
  }
  
  .mode-selector {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn, .mode-btn {
    width: 100%;
  }
  
  .fingerprint-icon {
    font-size: 4rem;
  }
}
</style>