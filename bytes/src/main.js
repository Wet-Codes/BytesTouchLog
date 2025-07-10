import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'vuetify/styles';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import socketPlugin from './services/socket';

/*es */
const vuetify = createVuetify({
    components,
    directives,
  })

createApp(App).use(socketPlugin).use(store).use(router).use(vuetify).mount('#app')
