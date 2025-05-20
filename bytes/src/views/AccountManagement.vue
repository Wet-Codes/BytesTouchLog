<template>
  <HeaderNav/>   <!-- HeaderNav -->

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
            <select v-model="newUser.role" class="role-select">
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

        <!-- Accounts List -->
        <div class="accounts-list">
          <!-- Add your accounts table/list here -->
        </div>

        <p class="message">Manage existing accounts in the <a href="/admin">Admin Dashboard</a></p>
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
/* Use the same styles as login page */
.role-select {
  width: 100%;
  padding: 10px 0;
  margin-bottom: 30px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  outline: none;
}

.role-select option {
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
}

.create-account {
  margin-bottom: 2rem;
}

.accounts-list {
  margin-top: 2rem;
  color: white;
}

/* Inherit all other styles from login page styles */
</style>