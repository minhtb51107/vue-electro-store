<template>
  <v-card flat>
    <v-card-text>
      <v-form ref="form" @submit.prevent="save">
        <v-row>
          <v-col cols="12" md="4" class="text-center">
            <v-avatar size="150" color="grey-lighten-2" class="mb-4 border">
              <v-img v-if="localUser.photoUrl" :src="localUser.photoUrl" cover></v-img>
              <v-icon v-else size="80" color="grey">mdi-account</v-icon>
            </v-avatar>
            <v-text-field
              v-model="localUser.photoUrl"
              label="Avatar URL"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-link"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="8">
            <v-text-field
              v-model="localUser.fullname"
              label="Họ và tên"
              variant="outlined"
              :rules="[v => !!v || 'Bắt buộc']"
            ></v-text-field>

            <v-text-field
              v-model="localUser.email"
              label="Email"
              variant="outlined"
              disabled
              hint="Không thể thay đổi email"
              persistent-hint
              prepend-inner-icon="mdi-email"
            ></v-text-field>

            <v-textarea
              v-model="localUser.bio"
              label="Giới thiệu bản thân"
              variant="outlined"
              rows="3"
              class="mt-4"
            ></v-textarea>

            <v-btn color="primary" class="mt-4" :loading="loading" @click="save">
              Lưu thay đổi
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import userService from '../services/user.service';

const authStore = useAuthStore();
const loading = ref(false);

const localUser = reactive({
  fullname: '',
  email: '',
  photoUrl: '',
  bio: ''
});

onMounted(() => {
  // Copy dữ liệu từ store vào local state
  if (authStore.user) {
    localUser.fullname = authStore.user.fullname;
    localUser.email = authStore.user.email;
    localUser.photoUrl = authStore.user.photoUrl || ''; // Trường photoUrl map từ ProfileResponse
    localUser.bio = authStore.user.bio || '';
  }
});

const save = async () => {
  loading.value = true;
  try {
    // Gọi API update profile
    const res = await userService.updateProfile({
       fullname: localUser.fullname,
       photoUrl: localUser.photoUrl,
       bio: localUser.bio
    });
    
    // Cập nhật lại AuthStore để Header hiển thị avatar/tên mới
    authStore.updateUserState(res); 
    alert('Cập nhật hồ sơ thành công!');
  } catch (err) {
    alert('Lỗi: ' + err.message);
  } finally {
    loading.value = false;
  }
};
</script>