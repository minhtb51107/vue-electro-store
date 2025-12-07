<template>
  <v-container class="py-8 bg-grey-lighten-5 min-h-screen" fluid>
    <v-row>
      <v-col cols="12" md="3" lg="2">
        <v-card class="rounded-xl border-0 shadow-card pa-6 text-center mb-4 bg-white">
           <div class="position-relative d-inline-block mb-4">
              <v-avatar size="80" class="elevation-0 border-0 bg-grey-lighten-4">
                 <v-img v-if="authStore.userAvatar" :src="authStore.userAvatar" cover></v-img>
                 <span v-else class="text-h4 font-weight-bold text-black">{{ authStore.userName.charAt(0) }}</span>
              </v-avatar>
              <v-btn 
                icon="mdi-camera" 
                size="x-small" 
                color="white" 
                variant="flat" 
                class="position-absolute bottom-0 right-0 shadow-sm border"
              ></v-btn>
           </div>
           
           <h3 class="text-subtitle-1 font-weight-bold text-black text-truncate">{{ authStore.userName }}</h3>
           <div class="text-caption text-grey">{{ authStore.user?.email }}</div>
        </v-card>

        <v-card class="rounded-xl border-0 shadow-card overflow-hidden bg-white">
          <v-list density="comfortable" nav class="pa-3">
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-2 px-2 text-uppercase ls-1">Tài khoản</div>
            
            <v-list-item 
               value="info" 
               prepend-icon="mdi-account-outline" 
               title="Hồ sơ cá nhân"
               :active="activeTab === 'info'" 
               @click="activeTab = 'info'"
               rounded="lg"
               active-class="bg-black text-white"
               class="mb-1 font-weight-medium"
            ></v-list-item>

            <v-list-item 
               value="address" 
               prepend-icon="mdi-map-marker-outline" 
               title="Sổ địa chỉ"
               :active="activeTab === 'address'" 
               @click="activeTab = 'address'"
               rounded="lg"
               active-class="bg-black text-white"
               class="mb-1 font-weight-medium"
            ></v-list-item>

            <v-list-item 
               value="password" 
               prepend-icon="mdi-lock-outline" 
               title="Đổi mật khẩu"
               :active="activeTab === 'password'" 
               @click="activeTab = 'password'"
               rounded="lg"
               active-class="bg-black text-white"
               class="mb-1 font-weight-medium"
               v-if="authStore.user?.authProvider === 'LOCAL'"
            ></v-list-item>
            
            <v-divider class="my-3 border-opacity-50"></v-divider>
            
            <div class="text-caption font-weight-bold text-grey-darken-1 mb-2 px-2 text-uppercase ls-1">Mua sắm</div>
            <v-list-item 
               prepend-icon="mdi-shopping-outline" 
               title="Đơn mua" 
               to="/order-history" 
               rounded="lg"
               active-class="bg-black text-white"
               class="mb-1 font-weight-medium"
            ></v-list-item>
            
            <v-list-item 
               prepend-icon="mdi-logout" 
               title="Đăng xuất" 
               @click="authStore.logout()"
               rounded="lg"
               class="mt-2 text-red font-weight-medium"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="9" lg="10">
        <div class="bg-white rounded-xl shadow-card pa-8 h-100 border-0 relative">
           <div class="d-flex align-center mb-8 pb-4 border-b border-opacity-50">
              <div>
                 <h2 class="text-h5 font-weight-bold text-black">{{ pageTitle }}</h2>
                 <div class="text-body-2 text-grey mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
              </div>
           </div>

           <v-window v-model="activeTab">
              <v-window-item value="info" transition="fade-transition">
                 <GeneralInfoTab />
              </v-window-item>
              <v-window-item value="password" transition="fade-transition">
                 <ChangePasswordTab />
              </v-window-item>
              <v-window-item value="address" transition="fade-transition">
                 <AddressBookTab />
              </v-window-item>
           </v-window>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import GeneralInfoTab from '../components/GeneralInfoTab.vue';
import ChangePasswordTab from '../components/ChangePasswordTab.vue';
import AddressBookTab from '../components/AddressBookTab.vue';

const authStore = useAuthStore();
const activeTab = ref('info');

const pageTitle = computed(() => {
   switch(activeTab.value) {
      case 'info': return 'Hồ sơ của tôi';
      case 'password': return 'Đổi mật khẩu';
      case 'address': return 'Địa chỉ nhận hàng';
      default: return '';
   }
});
</script>

<style scoped>
.shadow-card {
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05) !important;
}
.ls-1 { letter-spacing: 1px; }
.min-h-screen { min-height: 85vh; }
</style>