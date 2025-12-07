<template>
  <v-card class="elevation-12 rounded-lg pa-8 text-center">
    <div v-if="loading">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <div class="mt-4">Đang kích hoạt tài khoản...</div>
    </div>
    
    <div v-else>
      <v-icon :icon="success ? 'mdi-check-circle' : 'mdi-alert-circle'" 
              :color="success ? 'success' : 'error'" size="80" class="mb-4"></v-icon>
      <h3 class="text-h5 font-weight-bold mb-2">{{ success ? 'Thành công!' : 'Lỗi' }}</h3>
      <p class="text-body-1 text-grey mb-6">{{ message }}</p>
      <v-btn block color="primary" :to="{ name: 'Login' }">Đến trang đăng nhập</v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import authService from '../services/auth.service';

const route = useRoute();
const loading = ref(true);
const success = ref(false);
const message = ref('');

onMounted(async () => {
  const token = route.query.token;
  if (!token) {
    loading.value = false;
    success.value = false;
    message.value = "Token kích hoạt không tồn tại.";
    return;
  }

  try {
    const res = await authService.activateAccount(token);
    success.value = true;
    message.value = res || "Tài khoản đã được kích hoạt.";
  } catch (error) {
    success.value = false;
    message.value = error.response?.data?.message || "Kích hoạt thất bại.";
  } finally {
    loading.value = false;
  }
});
</script>