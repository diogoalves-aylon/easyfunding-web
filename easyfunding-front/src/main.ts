import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import AppIcon from '@/shared/components/AppIcon.vue'
import { applyThemeVars } from '@/shared/utils/applyThemeVars'
import { vMaska } from 'maska/vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
applyThemeVars()


const app = createApp(App)
app.directive('maska', vMaska)

app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);

app.use(PrimeVue, { unstyled: true })
app.use(ConfirmationService);

app.component('AppIcon', AppIcon)
app.mount('#app')
