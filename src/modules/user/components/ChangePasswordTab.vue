<template>
  <v-card flat max-width="500" class="bg-transparent">
    <v-card-text class="pa-0">
      <v-form ref="form" v-model="valid" @submit.prevent="changePass">
        <div class="mb-4">
           <div class="text-caption font-weight-bold mb-1 ms-1 text-grey-darken-2">Mật khẩu hiện tại</div>
           <v-text-field
             v-model="passwordData.oldPassword"
             type="password"
             variant="outlined"
             density="comfortable"
             color="black"
             bg-color="grey-lighten-5"
             class="rounded-lg"
             :rules="[rules.required]"
             placeholder="••••••••"
           ></v-text-field>
        </div>

        <div class="mb-4">
           <div class="text-caption font-weight-bold mb-1 ms-1 text-grey-darken-2">Mật khẩu mới</div>
           <v-text-field
             v-model="passwordData.newPassword"
             type="password"
             variant="outlined"
             density="comfortable"
             color="black"
             bg-color="grey-lighten-5"
             class="rounded-lg"
             :rules="[rules.required, rules.min]"
             placeholder="Tối thiểu 8 ký tự"
           ></v-text-field>
        </div>

        <div class="mb-8">
           <div class="text-caption font-weight-bold mb-1 ms-1 text-grey-darken-2">Xác nhận mật khẩu mới</div>
           <v-text-field
             v-model="confirmPassword"
             type="password"
             variant="outlined"
             density="comfortable"
             color="black"
             bg-color="grey-lighten-5"
             class="rounded-lg"
             :rules="[rules.required, rules.match]"
             placeholder="Nhập lại mật khẩu mới"
           ></v-text-field>
        </div>

        <v-btn 
           color="black" 
           :loading="loading" 
           type="submit" 
           block 
           height="48" 
           class="text-capitalize font-weight-bold rounded-pill shadow-none"
        >
           Cập nhật mật khẩu
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, reactive } from 'vue';
import userService from '../services/user.service';

const valid = ref(false);
const loading = ref(false);
const form = ref(null);

const passwordData = reactive({ oldPassword: '', newPassword: '' });
const confirmPassword = ref('');

const rules = {
  required: v => !!v || 'Bắt buộc',
  min: v => v.length >= 8 || 'Tối thiểu 8 ký tự',
  match: v => v === passwordData.newPassword || 'Mật khẩu xác nhận không khớp'
};

const changePass = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    loading.value = true;
    try {
      await userService.changePassword(passwordData);
      alert('Đổi mật khẩu thành công!');
      passwordData.oldPassword = '';
      passwordData.newPassword = '';
      confirmPassword.value = '';
      form.value.resetValidation();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      loading.value = false;
    }
  }
};
</script>