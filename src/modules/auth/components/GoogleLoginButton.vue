<template>
  <div class="d-flex justify-center">
    <div id="google-btn"></div>
    <p v-if="error" class="text-red mt-2 text-caption text-center">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// [SỬA 1] Đường dẫn đúng tới Store trong dự án này
import { useAuthStore } from '../store/auth.store';

const authStore = useAuthStore();
const error = ref('');

const handleGoogleLogin = async (response) => {
  const idToken = response.credential;
  try {
    // [SỬA 2] Gọi đúng tên action 'loginWithGoogle' đã khai báo trong auth.store.js
    await authStore.loginWithGoogle(idToken);
  } catch (err) {
    console.error("Lỗi xử lý token Google:", err);
    error.value = 'Đăng nhập Google thất bại. Vui lòng thử lại.';
  }
};

onMounted(() => {
  // Kiểm tra xem thư viện Google đã tải xong chưa
  if (typeof google === 'undefined') {
    error.value = "Chưa tải được thư viện Google. Hãy kiểm tra kết nối mạng.";
    return;
  }

  // Khởi tạo Google Identity Services
  google.accounts.id.initialize({
    // [QUAN TRỌNG] Đảm bảo Client ID này khớp với src/main.js và Backend
    client_id: '758520677856-j98pg9k2fju9545q0ffffmsnr9b1qtk9.apps.googleusercontent.com',
    callback: handleGoogleLogin,
  });

  // Render nút vào thẻ div #google-btn
  google.accounts.id.renderButton(
    document.getElementById('google-btn'),
    { 
        theme: 'outline', 
        size: 'large', 
        width: 350, // Độ rộng nút (px)
        text: 'signin_with', // Hoặc 'signup_with'
        shape: 'rectangular',
        logo_alignment: 'left'
    } 
  );
});
</script>