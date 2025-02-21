import { createApp } from 'vue'
import App from './App.vue'
import { Buffer } from 'buffer'

globalThis.Buffer = Buffer

createApp(App).mount('#app')
