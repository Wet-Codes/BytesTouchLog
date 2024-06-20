<template>
  <div>
    <page-header />
    <div :style="backgroundStyle" id="bp">
      <v-card elevation="8" class="pa-lg-10 mx-md-auto" width="400">
        <br>
       <v-text-field class="w-100" label="USERNAME" variant="solo-inverted" v-model="U"></v-text-field> 
        <v-text-field type="password" class="w-100" label="PASSWORD" variant="solo-inverted" v-model="P"></v-text-field>
        <v-col>
       <!--<v-btn dark @click="login" rounded="xl" size="x-large" block>--> 
        <v-btn :to="{ name: 'user' }" dark rounded="xl" size="x-large" block>
            Log in
          </v-btn>
        </v-col>
      </v-card>
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
      U: '',
      P: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await AuthServices.login({
          username: this.U,
          password: this.P
        });
        console.log(response.data);

        // Handle successful login, for example, redirect to another page
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Login failed', error);
        // Handle login error, show a message to the user
        alert('Login failed. Please check your credentials and try again.');
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
  },
  name: 'app',
  components: {
    PageHeader
  }
};
</script>

<style scoped>
#bp {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
