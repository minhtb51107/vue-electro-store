<template>
  <v-card class="elevation-12 rounded-lg pa-6 text-center">
    <h3 class="text-h5 font-weight-bold text-primary mb-4">Đặt lại mật khẩu</h3>
    
    <v-form @submit.prevent="handleSubmit" v-model="valid">
      <v-text-field
        v-model="password"
        label="Mật khẩu mới"
        type="password"
        variant="outlined"
        prepend-inner-icon="mdi-lock"
        :rules="[v => v.length >= 8 || 'Tối thiểu 8 ký tự']"
      ></v-text-field>
      
      <v-text-field
        v-model="confirmPassword"
        label="Xác nhận mật khẩu"
        type="password"
        variant="outlined"
        prepend-inner-icon="mdi-lock-check"
        :rules="[v => v === password || 'Mật khẩu không khớp']"
      ></v-text-field>

      <v-btn block color="primary" size="large" type="submit" :loading="loading" class="mt-4">
        Xác nhận
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import authService from '../services/auth.service';
import { useAppStore } from '@/store/app.store';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const valid = ref(false);
const token = route.query.token; // Lấy token từ URL

const handleSubmit = async () => {
  if (!valid.value) return;
  loading.value = true;
  try {
    await authService.resetPassword({ token, newPassword: password.value });
    appStore.notify('Đổi mật khẩu thành công! Vui lòng đăng nhập.');
    router.push({ name: 'Login' });
  } catch (error) {
    appStore.notifyError(error);
  } finally {
    loading.value = false;
  }
};
</script>