import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify' // Giả sử file plugin vuetify nằm ở đây
import vue3GoogleLogin from 'vue3-google-login' // Import thư viện

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

// Config Google Login
// Thay YOUR_CLIENT_ID bằng Client ID thật lấy từ Google Cloud Console
app.use(vue3GoogleLogin, {
  clientId: '758520677856-j98pg9k2fju9545q0ffffmsnr9b1qtk9.apps.googleusercontent.com' 
})

app.mount('#app')