<template>
  <PageHeader/>   <!-- HeaderNav -->

    <div :style="backgroundStyle" id="bp"> <!-- Login Page Body -->
      <div class="form">
        <form class="login-form"  @submit.prevent="login">
          <h2>Login</h2>
            <div>
              <input type="text" v-model="User" placeholder="Username" required />
              <p v-if="errors.username" class="error">{{ errors.username }}</p>
           </div>
           <div>
             <input type="password" v-model="Pass" placeholder="Password" required/>
             <p v-if="errors.password" class="error">{{ errors.password }}</p>
           </div>



<button class="btn" dark @click="login" rounded="xl" size="x-large" block>
  <span></span>
  <span></span>
  <span></span>
  <span></span>

  <!-- This will NOT break your animation span order -->
  <strong>{{ isLoggingIn ? 'Logging in...' : 'log in' }}</strong>
</button>
          
        </form>
        
      </div>
    </div>

  </template>
  
  <script>
  //import AuthServices from '@/services/AuthServices'; // import auth services from backend
  import PageHeader from '@/components/HeaderNav.vue';

  export default {
    data() {
      return {
        backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      User:'',
      Pass:'',
      errors: {},
      isLoggingIn: false // Add loading state
      };
    },
    watch: {
  User() {
    this.errors.username = null;
  },
  Pass() {
    this.errors.password = null;
  }
},
    methods: {

      async login() {
         // Prevent multiple clicks
      if (this.isLoggingIn) return;
      
      this.isLoggingIn = true;

    this.errors = {};
    try {
      await this.$store.dispatch('login', {
        username: this.User,
        password: this.Pass
      });
      
      const redirectPath = '/home';
        this.$router.push(redirectPath);
      } catch (error) {
        if (error.response?.data?.error) {
          this.handleError(error.response.data.error);
        } else {
          console.error('Login error:', error);
          alert('Login failed. Please try again.');
        }
      } finally {
        this.isLoggingIn = false;
      }
    },


  
  handleError(errorMessage) {
    if (errorMessage.includes('Username')) {
      this.errors.username = errorMessage;
    } else if (errorMessage.includes('password')) {
      this.errors.password = errorMessage;
    } else {
      alert(errorMessage);
    }
  }
        

        // Handle successful login, for example, redirect to another page
        //this.$router.push('/dashboard');
    
        //console.error('Login failed', error);
        // Handle login error, show a message to the user
        //alert('Login failed. Please check your credentials and try again.');
      
    },
  components: {
    PageHeader
  },
    computed:{
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

  .form .error {
  color: red;
  margin: 0 0 10px;
  font-size: 12px;
}

  h2 {
    color: white;
  }
  .form .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }
  .form .message a {
    color: #289bb8;
    text-decoration: none;
  }
  .form .register-form {
    display: none;
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

  .error {
  color: red;
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