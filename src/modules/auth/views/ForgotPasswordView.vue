<template>
  <v-card class="elevation-12 rounded-lg pa-6 text-center">
    <h3 class="text-h5 font-weight-bold text-primary mb-2">Quên mật khẩu?</h3>
    <p class="text-body-2 text-grey mb-6">Nhập email để nhận hướng dẫn đặt lại mật khẩu.</p>

    <v-form @submit.prevent="handleSubmit" v-model="valid">
      <v-text-field
        v-model="email"
        label="Email đăng ký"
        variant="outlined"
        prepend-inner-icon="mdi-email"
        :rules="[v => !!v || 'Bắt buộc', v => /.+@.+\..+/.test(v) || 'Email không hợp lệ']"
      ></v-text-field>

      <v-btn block color="primary" size="large" type="submit" :loading="loading" class="mt-4">
        Gửi yêu cầu
      </v-btn>
    </v-form>

    <div class="mt-4">
      <router-link :to="{ name: 'Login' }" class="text-decoration-none text-body-2">Quay lại Đăng nhập</router-link>
    </div>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import authService from '../services/auth.service';
import { useAppStore } from '@/store/app.store'; // Dùng store thông báo mới

const appStore = useAppStore();
const email = ref('');
const loading = ref(false);
const valid = ref(false);

const handleSubmit = async () => {
  if (!valid.value) return;
  loading.value = true;
  try {
    const res = await authService.forgotPassword(email.value);
    // Backend trả về String message
    appStore.notify(res || 'Vui lòng kiểm tra email của bạn.');
  } catch (error) {
    appStore.notifyError(error);
  } finally {
    loading.value = false;
  }
};
</script>