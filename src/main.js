'use strict'
import { createApp } from 'vue'
import VueFinalModal from 'vue-final-modal'
import Main from './Main.vue'
import store from './store'

createApp(Main).use(store).use(VueFinalModal()).mount('#app')
