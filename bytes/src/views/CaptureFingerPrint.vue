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
          Enroll Fingerprint
        </button>
        <button 
          @click="setMode('identify')" 
          :class="['mode-btn', { active: mode === 'identify' }]"
        >
          Identify Fingerprint
        </button>
      </div>

      <!-- Reader Selection -->
      <div v-if="!selectedReader" class="reader-section">
        <select v-model="selectedReaderName" class="reader-select">
          <option v-for="reader in readers" :key="reader" :value="reader">{{ reader }}</option>
        </select>
        <button class="btn" @click="selectReader">Select Reader</button>
      </div>

      <!-- Enrollment Mode -->
      <div v-else-if="mode === 'enroll'">
        <p class="reader-info">Selected Reader: {{ selectedReader }}</p>
        <h2>Fingerprint Enrollment</h2>

        <div v-if="!enrollmentStarted" class="enrollment-section">
          <input
            v-model="enrollName"
            type="text"
            placeholder="Enter name for enrollment"
            class="name-input"
          />
          <button class="btn enroll-btn" @click="startEnrollment">Start Enrollment</button>
        </div>

        <div v-else class="fingerprint-display">
          <p class="scan-progress">
            Scan {{ enrollScanStep + 1 }}/4 for {{ currentEnrollFinger }} finger
          </p>
          <img v-if="fingerprintImage" :src="fingerprintImage" alt="Fingerprint" class="fp-image" />
          <p class="status-message">{{ statusMessage }}</p>
        </div>
      </div>

      <!-- Identification Mode -->
      <div v-else class="identification-section">
        <p class="reader-info">Selected Reader: {{ selectedReader }}</p>
        <h2>Fingerprint Identification</h2>

        <div v-if="!identificationStarted" class="identification-controls">
          <button class="btn identify-btn" @click="startIdentification">Start Identification</button>
        </div>

        <div v-else class="fingerprint-display">
          <p class="scan-progress">Scan 1/1</p>
          <img v-if="fingerprintImage" :src="fingerprintImage" alt="Fingerprint" class="fp-image" />
          <p class="status-message">{{ statusMessage }}</p>

          <div v-if="debugInfo" class="debug-info">
            <h3>Debug Information</h3>
            <pre>{{ debugInfo }}</pre>
          </div>

          <div v-if="identificationResult" class="result-display mt-4 p-4 rounded-xl shadow bg-white max-w-md mx-auto">
           <div v-if="identificationResult.success">
        <h3 class="text-lg font-semibold text-green-600 mb-2">🎉 User Identified</h3>
        <p><strong>Name:</strong> {{ identificationResult.name }}</p>
        <p v-if="identificationResult.userId"><strong>User ID:</strong> {{ identificationResult.userId }}</p>
        <p><strong>Enrolled At:</strong> {{ formatDate(identificationResult.enrolledAt) }}</p>
           </div>
         <div v-else>
        <h3 class="text-lg font-semibold text-red-600 mb-2">❌ Identification Failed</h3>
        <p>{{ identificationResult.error || "No matching fingerprint found." }}</p>
          </div>
        </div>

        </div>
      </div>

      <div v-if="showLiteClientLink" class="reader-communication-error">
        Cannot connect to your fingerprint device. Make sure the device is connected.
        You may need to download and install
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
      };
      this.reader.onCommunicationFailed = () => {
        this.statusMessage = "Communication with reader failed.";
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
      this.statusMessage = "Starting enrollment... Scan 1/4 for index finger";

      try {
        console.log("🚀 Starting acquisition with reader:", this.selectedReader);
        await this.reader.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, this.selectedReader);
        console.log("👂 Listening for Intermediate Samples...");
      } catch (err) {
        this.debugInfo += `\nAcquisition error: ${err.message}`;
        this.statusMessage = `Acquisition failed: ${err.message}`;
        console.error("❌ Acquisition error:", err);
      }
    },

    async handleEnrollmentSample(event) {
      try {
        const raw = JSON.parse(event.samples);
        const base64Sample = raw[0].Data;

        this.fingerprintImage = null; // Intermediate format is not image
        console.log("🧬 Sample data acquired");

        if (this.currentEnrollFinger === 'index') {
          this.indexFingerSamples.push(base64Sample);
          this.enrollScanStep++;
          this.statusMessage = `Scan ${this.enrollScanStep}/4 for index finger`;

          if (this.indexFingerSamples.length === 4) {
            this.currentEnrollFinger = 'middle';
            this.enrollScanStep = 0;
            this.statusMessage = "Now scanning middle finger... Scan 1/4";
          }
        } else if (this.currentEnrollFinger === 'middle') {
          this.middleFingerSamples.push(base64Sample);
          this.enrollScanStep++;
          this.statusMessage = `Scan ${this.enrollScanStep}/4 for middle finger`;

          if (this.middleFingerSamples.length === 4) {
            console.log("✅ Middle finger done. Stopping acquisition...");
            await this.reader.stopAcquisition();
            this.statusMessage = "Sending enrollment data to backend...";
            await this.sendEnrollment();
          }
        }
      } catch (err) {
        this.statusMessage = `❌ Sample error: ${err.message}`;
        console.error("⚠️ Sample error:", err);
      }
    },

    async sendEnrollment() {
      try {
        const response = await AuthService.enrollFingerprint({
          name: this.enrollName,
          enrolled_index_finger_data: this.indexFingerSamples,
          enrolled_middle_finger_data: this.middleFingerSamples
        });

        if (response.data?.message === 'Enrollment successful') {
          this.statusMessage = `✅ ${this.enrollName} enrolled successfully!`;
        } else {
          throw new Error(response.data?.error || "Enrollment failed");
        }
      } catch (err) {
        this.statusMessage = `❌ Enrollment error: ${err.message}`;
      } finally {
        setTimeout(() => this.resetEnrollment(), 3000);
      }
    },

    async startIdentification() {
  this.identificationStarted = true;
  this.autoIdentification = true;
  this.statusMessage = "Starting identification...";
  this.debugInfo = "";
  this.fingerprintImage = null;
  this.identificationResult = null;

  try {
    await this.reader.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, this.selectedReader);
    this.reader.onSamplesAcquired = this.handleIdentificationSample;
  } catch (err) {
    this.statusMessage = `Acquisition error: ${err.message}`;
    console.error("Identification start error:", err);
  }
},

async handleIdentificationSample(event) {
  try {
    console.log("📥 Raw event received:", event);

    const raw = JSON.parse(event.samples);
    const base64Sample = raw[0].Data;
    console.log("📤 FMD being sent:", base64Sample.slice(0, 100) + "...");

    await this.reader.stopAcquisition();

    const response = await AuthService.identifyFingerprint({ fmd: base64Sample });
    console.log("✅ Response from backend:", response);

    if (response.data.success) {
      const user = response.data.user;
      this.identificationResult = {
        success: true,
        name: user?.name || "Unknown",
        userId: user?.id || "-",
        enrolledAt: user?.enrolledAt || null
      };
      this.statusMessage = `✅ User identified: ${this.identificationResult.name}`;

      // Pause for 2 seconds before restarting
      await this.delay(2000);
    } else {
      this.identificationResult = {
        success: false,
        message: response.data.message || "Identification failed"
      };
      this.statusMessage = `❌ ${this.identificationResult.message}`;

      // Immediate retry if enabled
      await this.delay(1000); // Optional short pause to avoid overloading
    }

    if (this.autoIdentification) {
      await this.reader.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, this.selectedReader);
    }

  } catch (err) {
    console.error("❌ Identification error:", err);
    console.log("📛 Error response object:", err?.response);
    this.statusMessage = `Identification error: ${err?.response?.data?.error || err.message}`;

    if (this.autoIdentification) {
      await this.delay(1500);
      await this.reader.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, this.selectedReader);
    }
  }
}
,
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
    },

    resetAll() {
      this.resetEnrollment();
      this.identificationStarted = false;
      this.identificationResult = null;
      this.fingerprintImage = null;
      this.statusMessage = "Mode switched. Select reader and start.";
      this.debugInfo = "";
    },

    formatDate(date) {
      if (!date) return "Unknown";
      return new Date(date).toLocaleString();
    }
  }
};
</script>






<style scoped>
.form {
  background: rgba(0, 0, 0, 0.6); /* Transparent black */
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
  color: #2c3e50;
}

.reader-select,
.name-input {
  padding: 0.5rem;
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #fff;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #0077aa;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: 700;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #005f8d;
}

.enroll-btn {
  background-color: #28a745;
}

.enroll-btn:hover {
  background-color: #1e7d36;
}

.reader-info {
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
  font-size: 0.9rem;
  color: #555;
}

.enrollment-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

.fingerprint-display {
  text-align: center;
  margin-top: 10px;
}

.fp-image {
  width: 150px;
  height: 150px;
  border: 2px solid #1976d2;
  border-radius: 12px;
  margin-top: 10px;
}

.scan-progress {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #1976d2;
}

.status-message {
  text-align: center;
  margin-top: 15px;
  font-weight: 600;
  color: #444;
}

.reader-communication-error {
  color: red;
  text-align: center;
  margin-top: 2rem;
  font-size: 0.95rem;
}

.mode-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-direction: row;
}

.mode-btn {
  padding: 10px 20px;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.mode-btn:hover {
  background-color: #d0d0d0;
}

.mode-btn.active {
  background-color: #1976d2;
  color: white;
}

.identification-section {
  text-align: center;
}

.identify-btn {
  background-color: #ff9800;
}

.identify-btn:hover {
  background-color: #e68a00;
}

.result-display {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: left;
  font-size: 1rem;
}

.success-result {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 4px;
}

.success-result p {
  margin: 5px 0;
  line-height: 1.4;
}

.success-result p:first-child {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.success-result p strong {
  color: #2e7d32;
}

.error-result {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
}

.debug-info {
  margin-top: 15px;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  max-height: 120px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.85rem;
  text-align: left;
}

#bp {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .mode-selector {
    flex-direction: column;
    gap: 0.5rem;
  }

  .reader-select,
  .name-input {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .btn {
    width: 100%;
  }
}
</style>
