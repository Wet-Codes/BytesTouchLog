<template>
<div>

    <v-toolbar :elevation="8" 
      dark
      prominent
      id="v"
      style="background-color: navy"
    >
    <v-toolbar-items>
        <v-btn :to="{ name: 'Account' }">
          <h3>Account</h3>
        </v-btn>
      </v-toolbar-items> 

      <v-toolbar-items>
        <v-btn :to="{ name: 'Logout' }">
          <h3>LogOut</h3>
        </v-btn>
      </v-toolbar-items> 

      <v-toolbar-items>
        <v-btn :to="{ name: 'about' }">
         <h3>ABOUT</h3>
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

    <v-btn :to="{ name: 'login' }" class="bytesbutton">
      <v-toolbar-title id="v" class="text-h4 font-weight-black">
        BYTES TOUCH LOG
      </v-toolbar-title>
    </v-btn>
      
  </v-toolbar>

  </div>
</template>



<script>

    
</script>



<style>
#v {

    color: white;
    font-family: 'Times New Roman', Times, serif;
}
 </style>
    