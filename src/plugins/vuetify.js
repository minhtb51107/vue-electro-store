// src/plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0066CC', // Xanh công nghệ (Tech Blue) - Giống Tiki/Intel
          secondary: '#1E293B', // Xám xanh đậm cho text
          accent: '#F59E0B', // Màu cam cho nút mua hàng/CTA
          background: '#F8FAFC', // Xám rất nhạt cho nền
          surface: '#FFFFFF',
          error: '#EF4444',
          success: '#10B981',
          warning: '#F59E0B',
        },
      },
    },
  },
  defaults: {
    // Cấu hình mặc định cho các component để đỡ phải gõ lại nhiều lần
    VBtn: {
      variant: 'flat',
      style: 'text-transform: none; letter-spacing: 0px; font-weight: 600;',
      rounded: 'lg',
    },
    VCard: {
      elevation: 0, // Style phẳng (Flat) đang là trend
      border: true,
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto',
    },
  },
})