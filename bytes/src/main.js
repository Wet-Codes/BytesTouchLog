import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'vuetify/styles';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/*es */
const vuetify = createVuetify({
    components,
    directives,
  })

// Ensure SDK is loaded globally
window.onload = function () {
  if (!window.Fingerprint) {
    console.error("U.are.U Fingerprint SDK not found!");
  }
};
createApp(App).use(store).use(router).use(vuetify).mount('#app')
