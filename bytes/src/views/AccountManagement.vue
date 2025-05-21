<template>
  <HeaderNav/>
  <div :style="backgroundStyle" id="bp">
    <div class="form">
      <form class="login-form" @submit.prevent="createAccount">
        <h2>Account Management</h2>
        
        <!-- Create Account Form -->
        <div class="create-account">
          <h3>Create New Account</h3>
          <div>
            <input type="text" v-model="newUser.username" placeholder="Username" required />
            <p v-if="errors.username" class="error">{{ errors.username }}</p>
          </div>
          <div>
            <input type="password" v-model="newUser.password" placeholder="Password" required/>
            <p v-if="errors.password" class="error">{{ errors.password }}</p>
          </div>
          <div>
            <select v-model="newUser.role" class="styled-select">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button class="btn" dark @click="createAccount" rounded="xl" size="x-large" block>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Create Account
          </button>
        </div>

        <p class="message">Manage existing accounts in the <a href="/account-list">Account List</a></p>
      </form>
    </div>
  </div>
</template>

<script>
import AuthServices from '@/services/AuthServices';
import HeaderNav from '@/components/HeaderNav.vue';

export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      newUser: {
        username: '',
        password: '',
        role: 'user'
      },
      errors: {}
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.$store.getters.isAuthenticated || 
          vm.$store.getters.currentUser?.username.toLowerCase() !== 'dev') {
        vm.$router.push('/home');
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (!this.$store.getters.isAuthenticated || 
        this.$store.getters.currentUser?.username.toLowerCase() !== 'dev') {
      this.$router.push('/home');
    }
    next();
  },
  methods: {
    async createAccount() {
      this.errors = {};
      try {
        const response = await AuthServices.createAccount(this.newUser);
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        
        this.newUser = { username: '', password: '', role: 'user' };
        alert('Account created successfully!');
      } catch (error) {
        if (error.response?.status === 403) {
          alert('Session expired. Please login again.');
          this.$router.push('/');
        } 
        if (error.response) {
          const errorMessage = error.response.data?.error;
          if (errorMessage.includes('username')) {
            this.errors.username = errorMessage;
          } else if (errorMessage.includes('password')) {
            this.errors.password = errorMessage;
          } else {
            alert(errorMessage);
          }
        }
      }
    }
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
        margin: 0,
        padding: 0,
      };
    }
  }
};
</script>

<style scoped>
/* Preserve all original LoginPage.vue styles */
@import url(https://fonts.googleapis.com/css?family=Poppins:300);

#bp {
  display: flex;
  justify-content: center;
  align-items: center;
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

h2 {
  color: white;
  margin: 0 0 30px;
}

.create-account h3 {
  color: #fff;
  margin: 0 0 30px;
  font-size: 1em;
}

.form input,
.styled-select {
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

.styled-select {
  appearance: none;
  -webkit-appearance: none;
  background: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")
    no-repeat right 0.5rem center/12px 12px;
}

.styled-select option {
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
}

.error {
  color: red;
  margin: -20px 0 10px;
  font-size: 12px;
  text-align: left;
}

.message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}

.message a {
  color: #289bb8;
  text-decoration: none;
}

/* Preserve original button styles */
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
  background: transparent;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background: #289bb8;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #289bb8,
              0 0 25px #289bb8,
              0 0 50px #289bb8,
              0 0 100px #289bb8;
}

.btn span {
  position: absolute;
  display: block;
}

/* Preserve original button animations */
.btn span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #289bb8);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% { left: -100%; }
  50%,100% { left: 100%; }
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
  0% { top: -100%; }
  50%,100% { top: 100%; }
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
  0% { right: -100%; }
  50%,100% { right: 100%; }
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
  0% { bottom: -100%; }
  50%,100% { bottom: 100%; }
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(#30142b, #2772a1);
  height: 100vh;
}
</style>