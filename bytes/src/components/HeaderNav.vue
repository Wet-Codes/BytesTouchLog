<template>
<div>

    <v-toolbar :elevation="8"
      image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      dark
      prominent
      id="v"
    >
    <v-btn :to="{ name: 'login' }">
      <v-toolbar-title id="v" class="text-h4 font-weight-black">
        BYTES TOUCH LOG
      </v-toolbar-title>
    
    </v-btn>

      <v-toolbar-items>
        <v-btn>
          <h3>Users</h3>
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>
      
      <v-toolbar-items>
        <v-btn :to="{ name: 'about' }">
        
         <h3>ABOUT</h3>
        
        </v-btn>
      </v-toolbar-items>
   
      
  </v-toolbar>

  </div>
</template>



<script>
  
    
</script>



<style>
#v {
    text-align: left;
    color: azure;
    font-family: 'Times New Roman', Times, serif;
}
 </style>
    