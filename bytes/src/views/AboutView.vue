<template>
  <div>
    <page-header />
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
  computed: {
    mainContentStyle() {
      return {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)', // Adjusted to accommodate the header height
        background: 'linear-gradient(to bottom, navy, white)',
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
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.about h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.about p {
  font-size: 16px;
  line-height: 1.6;
}

.about ul {
  list-style-type: disc;
  margin-left: 20px;
}

.page-header {
  font-size: 32px;
  color: #1e88e5;
  margin-bottom: 30px;
  text-align: center;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
