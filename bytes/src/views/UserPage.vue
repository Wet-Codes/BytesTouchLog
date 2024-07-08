<template>
  <page-header />
  <div :style="backgroundStyle" class="main-content idle">
    <v-card class="form idle">
      
      <v-toolbar color="primary">
        <v-toolbar-title>User Profile</v-toolbar-title>
      </v-toolbar>

      <div class="d-flex flex-row">
        <v-tabs v-model="tab" color="primary" direction="vertical">
          <button   class="btn" prepend-icon="mdi-account" value="option-1">Admin</button>
          <button  class="btn"  prepend-icon="mdi-lock" value="option-2">User</button>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item value="option-1">
            <v-card flat>
              <v-card-text>
                <p>Sed aliquam ultrices mauris. Donec posuere vulputate arcu. Morbi ac felis. Etiam feugiat lorem non metus. Sed a libero.</p>
                <p>Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non nisl sit amet velit hendrerit rutrum.</p>
                <p class="mb-0">Phasellus dolor. Fusce neque. Fusce fermentum odio nec arcu. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Phasellus blandit leo ut odio.</p>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item value="option-2">
            <v-card flat>
              <v-card-text>
                <p>Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.</p>
                <p>Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.</p>
                <p>Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.</p>
                <p>Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.</p>
                <p class="mb-0">Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.</p>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-card>
  </div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue';

export default {
  data() {
    return {
      tab: 'option-1', 
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
    };
  },
  components: {
    PageHeader
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
@import url(https://fonts.googleapis.com/css?family=Poppins:300);

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(#30142b, #2772a1);
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
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

  .idle span {
    position: absolute;
    display: block;
  }
  .idle span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #289bb8);
    animation: btn-anim1 1s linear infinite;
  }


.form {
  width: 800px;
  background: rgba(0, 0, 0, .5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
  box-sizing: border-box;
  z-index: 1;
  padding: 40px;
}

.v-card {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.v-toolbar-title {
  color: white;
}

.text-h5 {
  font-weight: 600;
}
</style>
