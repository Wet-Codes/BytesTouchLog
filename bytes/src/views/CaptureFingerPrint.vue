<template>
  <PageHeader />

  <div :style="backgroundStyle" id="bp">
    <div class="form">
      <form class="login-form">
        <h2>Fingerprint Scanner</h2>
        <input type="text" v-model="name" placeholder="Enter your name" required />

        <!-- Registration Button -->
        <button class="btn" @click="startFingerprintRegistration">
        <button @click="scanFingerprint"><span></span><span></span><span></span><span></span>
          Scan Fingerprint
        </button>
          <span></span><span></span><span></span><span></span>
          Register Fingerprint
        </button>
        <p v-if="registrationProgress">{{ registrationProgress }}</p>

        <!-- Identification Button (Only one scan) -->
        <button class="btn" @click="authorizeFingerprint">
          <span></span><span></span><span></span><span></span>
          Identify Me
        </button>

        <h3>Status: {{ message }}</h3>
        <img v-if="imageSrc" :src="imageSrc" alt="Captured Fingerprint" />
      </form>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue';

export default {
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      sdk: null,
      name: "",
      fingerprintSamples: [],
      registrationProgress: "",
      message: "Waiting for scan...",
    };
  }, computed:{
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
    },
  methods: {
    async initializeSDK() {
      if (!window.Fingerprint) {
        this.message = "Fingerprint SDK not loaded!";
        console.error("Fingerprint SDK is missing.");
        return;
      }
      this.sdk = new window.Fingerprint.WebApi();
    },

    async scanFingerprint() {
      try{
        const res = await fetch("http://localhost:2002/fingerprint/scan", {
          method: "POST"
        });
        const { fmd } = await res.json();
        console.log("Scanned FMD: ", fmd );

      } catch (e) {
        alert("Failed to scan Fingerprint, ");
      }
    },


    async captureFingerprint() {
      return new Promise((resolve, reject) => {
        this.sdk.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, "")
          .then(() => {
            this.sdk.onSamplesAcquired = (s) => {
              const samples = JSON.parse(s.samples);
              resolve(samples[0]); // Capture minutiae data
            };
          })
          .catch(reject);
      });
    },

    async startFingerprintRegistration() {
      if (!this.name) {
        alert("Enter a name first!");
        return;
      }

      this.fingerprintSamples = [];
      this.registrationProgress = "Capturing fingerprint...";

      for (let i = 0; i < 4; i++) {
        this.registrationProgress = `Captured ${i + 1}/4 fingerprints...`;
        const sample = await this.captureFingerprint();
        this.fingerprintSamples.push(sample);
      }

      this.uploadFingerprint();
    },

    async uploadFingerprint() {
      if (this.fingerprintSamples.length !== 4) {
        alert("Capture 4 fingerprints first!");
        return;
      }

      try {
        const response = await fetch("http://localhost:2002/fingerprint/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.name,
            fingerprintMinutiae: this.fingerprintSamples, // Send all 4 samples
          }),
        });

        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload fingerprint!");
      }
    },

    async authorizeFingerprint() {
    if (!this.sdk) {
        await this.initializeSDK();
    }

    this.sdk.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, "")
        .then(() => {
            this.message = "Place your finger on the scanner...";
        })
        .catch(error => {
            this.message = `Error: ${error.message}`;
        });

    // Wait for fingerprint scan
    this.sdk.onSamplesAcquired = async (s) => {
        try {
            const samples = JSON.parse(s.samples);
            this.fingerprintData = samples[0]; // ✅ Extract minutiae data

            console.log("📤 Sending fingerprint data for identification:", this.fingerprintData);

            const response = await fetch("http://localhost:2002/fingerprint/authorize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fingerprintMinutiae: { Data: this.fingerprintData } }),
            });

            const data = await response.json();
            console.log("✅ Server response:", data);
            alert(data.message);
        } catch (error) {
            console.error("❌ Fingerprint authorization failed:", error);
            alert("Fingerprint authorization failed!");
        }
    };
},
  },
  mounted() {
    this.initializeSDK();
  },
  components: {
    PageHeader
  }
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Poppins:300);
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: linear-gradient(#30142b, #2772a1);
}
.login-page {
  width: 400px;
  padding: 8% 0 0;
  margin: auto;
}
.form {
  position: relative;
  z-index: 1;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, .5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
}
.form input {
  width: 100%;
  padding: 10px 0;
  font-size: 13px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}
h2 {
  color: white;
}
.btn {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #289bb8;
  font-size: 16px;
  text-decoration: none;
  overflow: hidden;
  transition: .5s;
  margin-top: 15px;
  letter-spacing: 2px;
  background: none;
  border: none;
  cursor: pointer;
}
.btn:hover {
  background: #289bb8;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #289bb8, 0 0 25px #289bb8, 0 0 50px #289bb8, 0 0 100px #289bb8;
}
.btn span {
  position: absolute;
  display: block;
}
.btn span:nth-child(1) {
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
.btn span:nth-child(2) {
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
.btn span:nth-child(3) {
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
.btn span:nth-child(4) {
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

#bp {
  display: flex;
  justify-content: center;
  align-items: center;
}
body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(#30142b, #2772a1);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>