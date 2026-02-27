'use strict'
import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
import TaxCalculator from './Main.vue'
import { createPinia } from 'pinia'
import 'vue-final-modal/style.css'

createApp(TaxCalculator).use(createPinia()).use(createVfm()).mount('#app')
