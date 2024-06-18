<template> 
<page-header />
<div :style="{ backgroundColor: backgroundcolor }" id="bp">

<v-card elevation="8" class="pa-lg-10 mx-md-auto" width="400">

  
  <h3>Register The User</h3>
  <br>
  <v-text-field class="w-250" label="USERNAME" variant="solo-inverted" v-model='user'>
  </v-text-field>

  <v-text-field  type="password" class="w-250" label="PASSWORD" variant="solo-inverted" placeholder="password" v-model='password'>
  </v-text-field>
  <v-col>

    <br>
    <div class="error" v-html="error"/>
    <br>

  <button>
    <v-btn dark @click="register" rounded="xl" size="x-large" block>
      Register
        </v-btn>
  </button>
  
  </v-col>

</v-card>

</div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue'
import AuthServices from '@/services/AuthServices';
export default {
  data() {
    
    return {
    backgroundcolor: "navy",
    user:'',
    password:'',
    error: null  
  }
    
},

methods: {
  async register () {
   try{
    await AuthServices.register({
      user: this.user,
      password: this.password
    })
   } catch (error) {
    this.error = error.response.data.error
   }
  }

},
name:'app',
components: {
  PageHeader
}

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#bp {
  margin: 0;
  padding: 0;
  padding-top: 5%;
  padding-bottom: 40%;
}
.error{
  color: red;
}
</style>
