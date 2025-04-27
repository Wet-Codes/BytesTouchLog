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

      <!-- If reader is selected -->
      <div v-else>
        <p>Selected Reader: {{ selectedReader }}</p>

        <!-- Name input for enrollment -->
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
          <button class="btn" @click="showEnrollInput">
            Enroll Fingerprint
          </button>

          <button class="btn" @click="identifyFingerprint">
            Identify Fingerprint
          </button>
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
    async loadReaders() {
      try {
        const res = await fetch("http://localhost:8000/readers");
        this.readers = await res.json();
      } catch (error) {
        this.statusMessage = "Failed to load readers.";
      }
    },
    async selectReader() {
      if (!this.selectedReaderName) {
        this.statusMessage = "Please select a reader first.";
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/select-reader", {
          method: "POST",
          body: this.selectedReaderName,
        });
        const text = await res.text();
        this.selectedReader = this.selectedReaderName;
        this.statusMessage = text;
      } catch (error) {
        this.statusMessage = "Failed to select reader.";
      }
    },

    showEnrollInput() {
      this.showNameInput = true;
    },

    async submitEnroll() {
      if (!this.enrollName) {
        this.statusMessage = "⚠️ Please enter a name first.";
        return;
      }
      try {
        // Step 1: Set name
        await fetch("http://localhost:8000/set-name", {
          method: "POST",
          body: this.enrollName,
        });

        // Step 2: Set action to enroll
        await fetch("http://localhost:8000/set-action", {
          method: "POST",
          body: "enroll",
        });

        this.statusMessage = "Waiting for fingerprint to enroll...";
        this.showNameInput = false;
        this.enrollName = "";
      } catch (error) {
        this.statusMessage = "Failed to start enrollment.";
      }
    },

    async identifyFingerprint() {
      try {
        await fetch("http://localhost:8000/set-action", {
          method: "POST",
          body: "identify",
        });
        this.statusMessage = "Waiting for fingerprint to identify...";
      } catch (error) {
        this.statusMessage = "Failed to set identify action.";
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

/* Name input styling */
.name-input {
  width: 80%;
  margin: 10px auto;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
</style>
