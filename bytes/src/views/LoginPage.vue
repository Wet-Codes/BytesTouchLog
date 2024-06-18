<template> 
<page-header />
<div :style="{ backgroundColor: backgroundcolor }" id="bp">

<v-card elevation="8" class="pa-lg-10 mx-md-auto" width="400">

  <img alt="Temp logo" style="width:250px;height:250px;">
  
  <br>
  <v-text-field class="w-250" label="USERNAME" variant="solo-inverted" v-model="U">
  </v-text-field>
  <v-text-field  type="password" class="w-250" label="PASSWORD" variant="solo-inverted" placeholder="password" v-model="P">
  </v-text-field>
  <v-col>
  <button>
    <v-btn dark @click="login" rounded="xl" size="x-large" block>
      Log in
        </v-btn>
  </button>
  </v-col>

</v-card>

</div>
</template>


<script>
import PageHeader from '@/components/HeaderNav.vue'
//import AuthServices from '@/services/AuthServices';
export default {
  data() {
    
    return {
    backgroundcolor: "navy",
    U:'',
    P:''  
  }
    
},

//methods: {
  //async login () {
    //const response = await AuthServices.login({
      //U: this.U ,
      //P: this.P
    //})
    //console.log(response.data)
  //}

//},
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
  padding-bottom: 100%;
  height: 100vh;
}
</style>
