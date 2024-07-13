<template>
  <div>
    <PageHeader/>

    <div :style="mainContentStyle">
      <div class="about">
        <h1 class="page-header">Bytes Touch Log</h1>
        <p>
          This system is a web-based fingerprint biometric application designed as
          an attendance recorder system for events at the Bytes Office.
        </p>
        <p>
          It utilizes fingerprint biometric technology to accurately record
          attendance, providing a secure and efficient method for managing event
          participation.
        </p>
        <p>
          Key features include:
          <ul>
            <li>Secure login and authentication using fingerprint biometrics.</li>
            <li>Real-time attendance tracking and reporting.</li>
            <li>Integration with event management systems for seamless workflow.</li>
            <li>User-friendly interface for both administrators and participants.</li>
          </ul>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    };
  },
  computed: {
    mainContentStyle() {
      return {
        background: `url(${this.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 64px)', // Adjusted to accommodate the header height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      };
    }
  }
};
</script>

<style scoped>
.about {
  margin: 20px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5); /* Updated background color with transparency */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.about h1 {
  font-size: 32px; /* Increased font size */
  color: #1e88e5; /* Updated color */
  margin-bottom: 30px;
  text-align: center;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.about p {
  font-size: 18px; /* Increased font size */
  line-height: 1.8; /* Adjusted line height */
  color: #fff; /* Changed text color to white */
}

.about ul {
  list-style-type: disc;
  margin-left: 20px;
}

.page-header {
  font-size: 40px; /* Increased font size */
  color: #fff; /* Changed text color to white */
  margin-bottom: 50px; /* Increased margin */
  text-align: center;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
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
