'use strict'
import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
import TaxCalculator from './Main.vue'
import { createPinia } from 'pinia'
import 'vue-final-modal/style.css'

const taxYear1 = '2025/26'
const taxYear2 = '2026/27'
createApp(TaxCalculator)
  .provide('taxYear1', taxYear1)
  .provide('taxYear2', taxYear2)
  .use(createPinia())
  .use(createVfm())
  .mount('#app')
