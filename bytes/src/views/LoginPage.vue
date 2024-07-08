<template>
  <PageHeader/>   <!-- HeaderNav -->

    <div :style="backgroundStyle" id="bp"> <!-- Login Page Body -->
      <div class="form">
        <form class="login-form">
          <h2>Login</h2>
          <input type="text" v-model="U" placeholder="Username" required />
          <input type="password" v-model="P" placeholder="Password" required/>
          
            <button class="btn" dark @click="login" rounded="xl" size="x-large" block>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            log in
          </button>
          <p class="message">Not an Admin? let an admin know in the <a href="/#/admin">Admin Tab</a></p>
        </form>
        <p v-if="message">{{ message }}</p>
      </div>
    </div>

  </template>
  
  <script>
  import AuthServices from '@/services/AuthServices'; // import auth services from backend
  import PageHeader from '@/components/HeaderNav.vue';

  export default {
    data() {
      return {
        backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      U:'',
      P:''
      };
    },
    methods: {


      
    async login() {
     
        try {
          const response = await AuthServices.login({
          U: this.U,
          P: this.P,
          message:''
        });
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)


       // this.message = response.data.message;
       // this.$router.push('/admin');
      } catch (error) {
        this.message = error.response.data.error;
        console.error('Login failed', error);
        alert('Login failed. Please check your credentials and try again.');
      
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