<template>
  <div>
    <PageHeader />

    <div :style="mainContentStyle">
      <div class="about">
        <div class="content-box">
          <h1 class="page-header">Bytes Touch Log</h1>
          <p class="description">
            This system is a web-based fingerprint biometric application designed as
            an attendance recorder system for events at the Bytes Office.
          </p>

          <div class="feature-container">
            <div class="feature-card" v-for="(feature, index) in features" :key="index">
              <v-icon class="feature-icon">{{ feature.icon }}</v-icon>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.text }}</p>
            </div>
          </div>

          <div class="action-buttons">
            <a href="#" class="btn">
              Learn More
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
            <a href="#" class="btn">
              Get Started
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </div>
        </div>
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
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      features: [
        {
          icon: 'mdi-fingerprint',
          title: 'Biometric Auth',
          text: 'Secure fingerprint-based authentication system'
        },
        {
          icon: 'mdi-chart-areaspline',
          title: 'Real-time Tracking',
          text: 'Instant attendance monitoring and reporting'
        },
        {
          icon: 'mdi-calendar-check',
          title: 'Event Management',
          text: 'Seamless event scheduling integration'
        }
      ]
    };
  },
  computed: {
    mainContentStyle() {
      return {
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${this.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      };
    }
  }
};
</script>

<style scoped>
.about {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content-box {
  background: rgba(0, 0, 0, 0.5);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(40, 155, 184, 0.3);
  border: 1px solid rgba(40, 155, 184, 0.2);
}

.page-header {
  font-size: 2.5rem;
  color: #289bb8;
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(40, 155, 184, 0.5);
}

.description {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem;
}

.feature-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
}

.feature-card {
  background: rgba(40, 155, 184, 0.1);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid rgba(40, 155, 184, 0.2);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  color: #289bb8;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #289bb8;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.btn {
  position: relative;
  display: inline-block;
  padding: 12px 24px;
  color: #289bb8;
  font-size: 16px;
  text-decoration: none;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 15px;
  letter-spacing: 2px;
  border: 1px solid #289bb8;
  border-radius: 5px;
  background: transparent;
}

.btn:hover {
  background: #289bb8;
  color: #fff;
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
  animation: btn-anim1 1.5s linear infinite;
}

.btn span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #289bb8);
  animation: btn-anim2 1.5s linear infinite;
  animation-delay: 0.375s;
}

.btn span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #289bb8);
  animation: btn-anim3 1.5s linear infinite;
  animation-delay: 0.75s;
}

.btn span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #289bb8);
  animation: btn-anim4 1.5s linear infinite;
  animation-delay: 1.125s;
}

@keyframes btn-anim1 {
  0% { left: -100%; }
  50%,100% { left: 100%; }
}

@keyframes btn-anim2 {
  0% { top: -100%; }
  50%,100% { top: 100%; }
}

@keyframes btn-anim3 {
  0% { right: -100%; }
  50%,100% { right: 100%; }
}

@keyframes btn-anim4 {
  0% { bottom: -100%; }
  50%,100% { bottom: 100%; }
}

@media (max-width: 768px) {
  .feature-container {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    font-size: 2rem;
  }
  
  .content-box {
    padding: 2rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>