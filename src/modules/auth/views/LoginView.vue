<template>
  <v-row no-gutters class="fill-height bg-white">
    <v-col cols="12" md="6" lg="7" class="d-none d-md-flex position-relative bg-grey-lighten-4">
      <v-img
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
        cover
        class="fill-height"
      >
         <div class="d-flex flex-column justify-end fill-height pa-10" style="background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);">
            <div class="text-white">
               <h2 class="text-h3 font-weight-bold mb-2">ElectroStore</h2>
               <p class="text-h6 opacity-90">Khám phá thế giới công nghệ đỉnh cao ngay hôm nay.</p>
            </div>
         </div>
      </v-img>
    </v-col>

    <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-center pa-6 pa-md-16 bg-white">
      <div class="w-100" style="max-width: 450px;">
        <div class="d-md-none mb-8 text-center">
           <v-icon icon="mdi-lightning-bolt-circle" color="primary" size="48"></v-icon>
           <h2 class="text-h5 font-weight-bold text-primary mt-2">ElectroStore</h2>
        </div>

        <div class="mb-8">
           <h1 class="text-h4 font-weight-bold mb-2">Chào mừng trở lại!</h1>
           <p class="text-body-1 text-grey">Vui lòng nhập thông tin để đăng nhập.</p>
        </div>

        <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-6" closable>
           {{ errorMessage }}
        </v-alert>

        <v-form ref="loginFormRef" @submit.prevent="handleLogin">
           <div class="text-subtitle-2 font-weight-bold mb-1">Email</div>
           <v-text-field
             v-model="form.email"
             placeholder="name@example.com"
             variant="outlined"
             density="comfortable"
             color="primary"
             prepend-inner-icon="mdi-email-outline"
             :rules="[rules.required, rules.email]"
             class="mb-2"
           ></v-text-field>

           <div class="d-flex justify-space-between align-center mb-1">
              <div class="text-subtitle-2 font-weight-bold">Mật khẩu</div>
              <router-link to="/forgot-password" class="text-caption font-weight-bold text-primary text-decoration-none">
                 Quên mật khẩu?
              </router-link>
           </div>
           <v-text-field
             v-model="form.password"
             placeholder="Nhập mật khẩu của bạn"
             :type="showPassword ? 'text' : 'password'"
             variant="outlined"
             density="comfortable"
             color="primary"
             prepend-inner-icon="mdi-lock-outline"
             :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
             @click:append-inner="showPassword = !showPassword"
             :rules="[rules.required]"
           ></v-text-field>

           <v-checkbox label="Ghi nhớ đăng nhập" color="primary" density="compact" hide-details class="mb-6"></v-checkbox>

           <v-btn block color="primary" size="large" height="48" type="submit" :loading="isLoading" class="text-body-1 font-weight-bold mb-6 shadow-soft">
             Đăng nhập
           </v-btn>
        </v-form>

        <div class="d-flex align-center mb-6">
           <v-divider></v-divider>
           <span class="px-4 text-caption text-grey text-uppercase">Hoặc</span>
           <v-divider></v-divider>
        </div>

        <GoogleLoginButton class="mb-6" />

        <div class="text-center text-body-2">
           Bạn chưa có tài khoản? 
           <router-link :to="{ name: 'Register' }" class="text-primary font-weight-bold text-decoration-none">Đăng ký ngay</router-link>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../store/auth.store';
import GoogleLoginButton from '../components/GoogleLoginButton.vue';

const authStore = useAuthStore();
const loginFormRef = ref(null);
const form = reactive({ email: '', password: '' });
const isLoading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

const rules = {
  required: v => !!v || 'Bắt buộc',
  email: v => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
};

const handleLogin = async () => {
  const { valid } = await loginFormRef.value.validate();
  if (valid) {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const res = await authStore.login(form);
      if (!res.success) errorMessage.value = res.message;
    } catch (error) {
       errorMessage.value = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    } finally {
      isLoading.value = false;
    }
  }
};
</script>