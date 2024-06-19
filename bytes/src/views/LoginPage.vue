<template>
  <div>
    <page-header />
    <div :style="backgroundStyle" id="bp">
      <v-spacer>  </v-spacer>
      <v-card elevation="8" class="pa-lg-10 mx-md-auto" width="400">
        <br>
        <v-text-field class="w-250" label="USERNAME" variant="solo-inverted" v-model="U"></v-text-field>
        <v-text-field type="password" class="w-250" label="PASSWORD" variant="solo-inverted" placeholder="password" v-model="P"></v-text-field>
        <v-col>
          <button>
            <v-btn dark @click="login" rounded="xl" size="x-large" block>
              Log in
            </v-btn>
          </button>
        </v-col>
      </v-card>
    </div>
  </div>
</template>

<script>
import AuthServices from '@/services/AuthServices'; //import auth services from back end
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
      const response = await AuthServices.login({
        U: this.U ,
        P: this.P
      })
      console.log(response.data);
    }
  },

  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
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
  margin: 0;
  padding: 0;
  padding-top: 5%;
  padding-bottom: 100%;
}
</style>
