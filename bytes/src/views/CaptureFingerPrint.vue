<template>
  <PageHeader />
  <div :style="backgroundStyle" id="bp">
    <div class="form">
      <h2>Fingerprint Scanner</h2>

      <!-- Reader Selection -->
      <div v-if="!selectedReader">
        <select v-model="selectedReaderName" class="reader-select">
          <option v-for="reader in readers" :key="reader" :value="reader">{{ reader }}</option>
        </select>
        <button class="btn" @click="selectReader">
          Select Reader
        </button>
      </div>

      <!-- Actions once reader is selected -->
      <div v-else>
        <p class="reader-info">Selected Reader: {{ selectedReader }}</p>

        <div v-if="showNameInput" class="enrollment-section">
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

        <div v-else class="action-buttons">
          <button class="btn enroll-btn" @click="startEnrollment" :disabled="enrollInProgress">
            {{ enrollInProgress ? 'Enrolling...' : 'Enroll Fingerprint (4 scans)' }}
          </button>
          <button class="btn identify-btn" @click="startIdentification">
            Identify
          </button>
          
          <div class="fingerprint-display">
            <img v-if="fingerprintImage" :src="fingerprintImage" 
                 alt="Fingerprint scan" class="fp-image">
            <div class="scan-progress" v-if="enrollInProgress">
              Scan {{ enrollStep }}/4
            </div>
          </div>
        </div>
        <div v-if="showLiteClientLink" class="reader-communication-error">
  Cannot connect to your fingerprint device. Make sure the device is connected.
  If you do not use DigitalPersona Workstation, you may need to download and install
  <a href="https://crossmatch.hid.gl/lite-client">DigitalPersona Lite Client</a>. :cite[1]
</div>
      </div>

      <h3 class="status-message">Status: {{ statusMessage }}</h3>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue';
import AuthService from '@/services/AuthServices';
import { FingerprintReader, SampleFormat } from '@digitalpersona/devices';

export default {
  components: { PageHeader },

  async mounted() {
    await this.loadWebSdk();
    this.reader = new FingerprintReader();
    await this.loadReaders();
  },

  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      readers: [],
      selectedReaderName: "",
      selectedReader: null,
      reader: null,
      statusMessage: "Waiting for reader selection...",
      showNameInput: false,
      enrollName: "",
      enrollStep: 0,
      enrollInProgress: false,
      enrollmentSamples: [],
      currentAction: null,
      fingerprintImage: null,
      showLiteClientLink: false,
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
    async loadWebSdk() {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/bytes/public/modules/WebSdk"; // inside public/modules
        script.onload = resolve;
        script.onerror = () => {
          this.showLiteClientLink = true;
          reject(new Error("WebSdk load failed"));
        };
        document.head.appendChild(script);
      });
    },

    async loadReaders() {
      try {
        this.readers = await FingerprintReader.enumerate();
        this.statusMessage = this.readers.length
          ? "Select a reader from the list"
          : "No fingerprint readers detected";
      } catch (error) {
        this.statusMessage = `Error enumerating readers: ${error.message}`;
      }
    },

    async selectReader() {
      this.selectedReader = this.selectedReaderName;
      this.statusMessage = `Reader "${this.selectedReader}" selected.`;
    },

    async startEnrollment() {
      if (!this.selectedReader) {
        this.statusMessage = "Please select a reader first";
        return;
      }
      this.showNameInput = true;
      this.statusMessage = "Enter a name for enrollment";
    },

    async submitEnroll() {
      if (!this.enrollName) {
        this.statusMessage = "Please enter a name";
        return;
      }
      this.currentAction = 'enroll';
      this.enrollStep = 0;
      this.enrollInProgress = true;
      this.enrollmentSamples = [];
      this.showNameInput = false;
      await this.captureLoop(4);
    },

    async startIdentification() {
      if (!this.selectedReader) {
        this.statusMessage = "Please select a reader first";
        return;
      }
      this.currentAction = 'identify';
      await this.captureLoop(1);
    },

    async captureLoop(count) {
      try {
        for (let i = 0; i < count; i++) {
          this.enrollStep = i + 1;
          this.statusMessage = `Scan ${i + 1}/${count} - Place finger`;

          const result = await this.reader.startAcquisition(
            SampleFormat.Intermediate,
            this.selectedReader
          ).then(() => this.reader.stopAcquisition());

          if (!result) throw new Error("No result captured");

          this.fingerprintImage = `data:image/png;base64,${result.samples[0]}`;

          if (this.currentAction === 'enroll') {
            this.enrollmentSamples.push(result.samples[0]);
          } else {
            await this.identifyUser(result.samples[0]);
          }
        }

        if (this.currentAction === 'enroll') {
          await this.completeEnrollment();
        }
      } catch (error) {
        console.error("Capture error:", error);
        this.statusMessage = `Capture error: ${error.message}`;
        this.enrollInProgress = false;
      }
    },

    async completeEnrollment() {
      try {
        this.statusMessage = "Sending enrollment...";
        const response = await AuthService.enrollFingerprint({
          name: this.enrollName,
          samples: this.enrollmentSamples
        });

        if (response.data.success) {
          this.statusMessage = "✅ Enrollment successful!";
        } else {
          throw new Error(response.data.error || "Enrollment failed");
        }
      } catch (error) {
        this.statusMessage = `⚠️ Enrollment failed: ${error.message}`;
      } finally {
        this.enrollInProgress = false;
        this.enrollName = "";
        this.enrollmentSamples = [];
      }
    },

    async identifyUser(sample) {
      try {
        this.statusMessage = "Identifying fingerprint...";
        const response = await AuthService.identifyFingerprint(sample);

        if (response.data.match) {
          this.statusMessage = `✅ Identified: ${response.data.name}`;
        } else {
          this.statusMessage = "❌ No match found";
        }
      } catch (error) {
        this.statusMessage = `⚠️ Identification failed: ${error.message}`;
      }
    },
  },

  beforeUnmount() {
    if (this.reader) {
      this.reader.off(); // Clean up events
    }
  }
};
</script>


<style scoped>
.form {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
}

.reader-select {
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 70%;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #289bb8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #1e7a8c;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.enroll-btn {
  background-color: #28a745;
}

.enroll-btn:hover {
  background-color: #218838;
}

.identify-btn {
  background-color: #17a2b8;
}

.identify-btn:hover {
  background-color: #138496;
}

.name-input {
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 60%;
}

.reader-info {
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
}

.fingerprint-display {
  margin: 1.5rem auto;
  position: relative;
}

.fp-image {
  width: 300px;
  height: 400px;
  border: 2px solid #289bb8;
  display: block;
  margin: 0 auto;
}

.scan-progress {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
}

.status-message {
  text-align: center;
  margin-top: 1rem;
  min-height: 24px;
}

.enrollment-section, .action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
</style>