'use strict'
import { createApp } from 'vue'
import vueFinalModal from 'vue-final-modal'
import TaxCalculator from './Main.vue'
import store from './store'

createApp(TaxCalculator).use(store).use(vueFinalModal()).mount('#app')
