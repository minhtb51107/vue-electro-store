<template>
  <v-row no-gutters class="fill-height bg-white">
    <v-col cols="12" md="6" lg="7" class="d-none d-md-flex position-relative bg-grey-lighten-4">
      <v-img
        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
        cover
        class="fill-height"
      >
         <div class="d-flex flex-column justify-end fill-height pa-10" style="background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);">
            <div class="text-white">
               <h2 class="text-h3 font-weight-bold mb-2">Tham gia cùng chúng tôi</h2>
               <p class="text-h6 opacity-90">Tạo tài khoản để nhận ưu đãi thành viên đặc biệt.</p>
            </div>
         </div>
      </v-img>
    </v-col>

    <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-center pa-6 pa-md-16 bg-white">
      <div class="w-100" style="max-width: 450px;">
        
        <div class="d-md-none mb-6 text-center">
           <v-icon icon="mdi-lightning-bolt-circle" color="primary" size="40"></v-icon>
        </div>

        <div class="mb-8">
           <h1 class="text-h4 font-weight-bold mb-2">Tạo tài khoản mới</h1>
           <p class="text-body-1 text-grey">Nhập thông tin chi tiết của bạn bên dưới.</p>
        </div>

        <v-alert v-if="message" :type="success ? 'success' : 'error'" variant="tonal" density="compact" class="mb-6">
           {{ message }}
        </v-alert>

        <v-form ref="form" v-model="valid" @submit.prevent="handleRegister">
          <div class="text-subtitle-2 font-weight-bold mb-1">Họ và tên</div>
          <v-text-field
            v-model="formData.fullname"
            placeholder="Nguyễn Văn A"
            variant="outlined"
            density="comfortable"
            color="primary"
            :rules="[rules.required]"
            class="mb-3"
          ></v-text-field>

          <div class="text-subtitle-2 font-weight-bold mb-1">Số điện thoại</div>
          <v-text-field
            v-model="formData.phoneNumber"
            placeholder="09xxxxxxxx"
            variant="outlined"
            density="comfortable"
            color="primary"
            :rules="[rules.required, rules.phone]"
            class="mb-3"
          ></v-text-field>

          <div class="text-subtitle-2 font-weight-bold mb-1">Email</div>
          <v-text-field
            v-model="formData.email"
            placeholder="name@example.com"
            variant="outlined"
            density="comfortable"
            color="primary"
            :rules="[rules.required, rules.email]"
            class="mb-3"
          ></v-text-field>

          <div class="text-subtitle-2 font-weight-bold mb-1">Mật khẩu</div>
          <v-text-field
            v-model="formData.password"
            placeholder="Tối thiểu 8 ký tự"
            type="password"
            variant="outlined"
            density="comfortable"
            color="primary"
            :rules="[rules.required, rules.min]"
            class="mb-6"
          ></v-text-field>

          <v-btn block color="primary" size="large" height="48" type="submit" :loading="authStore.isLoading" class="text-body-1 font-weight-bold mb-6 shadow-soft">
            Đăng ký tài khoản
          </v-btn>
        </v-form>

        <div class="text-center text-body-2">
           Đã có tài khoản? 
           <router-link :to="{ name: 'Login' }" class="text-primary font-weight-bold text-decoration-none">Đăng nhập</router-link>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../store/auth.store';

const authStore = useAuthStore();
const valid = ref(false);
const form = ref(null);
const message = ref('');
const success = ref(false);

const formData = reactive({ fullname: '', email: '', password: '', phoneNumber: '' });

const rules = {
  required: v => !!v || 'Bắt buộc',
  email: v => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
  phone: v => /^(0|84)(3|5|7|8|9)([0-9]{8})$/.test(v) || 'SĐT không hợp lệ',
  min: v => v.length >= 8 || 'Mật khẩu ít nhất 8 ký tự'
};

const handleRegister = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    const res = await authStore.register(formData);
    message.value = res.message;
    success.value = res.success;
  }
};
</script>