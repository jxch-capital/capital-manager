import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import naive from './naive/index'
import './assets/main.css'

createApp(App).use(naive).use(router).use(store).mount('#app')
