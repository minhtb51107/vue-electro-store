<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      color="white"
      elevation="2"
      width="260"
    >
      <v-list-item class="py-4 px-2" nav>
        <template v-slot:prepend>
           <v-avatar color="primary" size="40" rounded>
              <v-icon icon="mdi-lightning-bolt" color="white"></v-icon>
           </v-avatar>
        </template>
        <v-list-item-title class="text-h6 font-weight-bold text-primary">
           Electro<span class="text-grey-darken-2">Admin</span>
        </v-list-item-title>
        <template v-slot:append>
           <v-btn icon="mdi-chevron-left" variant="text" size="small" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav class="mt-2">
         
         <v-list-item 
            prepend-icon="mdi-view-dashboard-outline" 
            title="Tổng quan" 
            to="/admin/dashboard" 
            active-class="text-primary bg-blue-lighten-5"
         ></v-list-item>

         <v-list-group value="products">
            <template v-slot:activator="{ props }">
               <v-list-item v-bind="props" prepend-icon="mdi-package-variant-closed" title="Sản phẩm"></v-list-item>
            </template>
            <v-list-item title="Danh sách sản phẩm" to="/admin/products" prepend-icon="mdi-circle-small"></v-list-item>
            <v-list-item title="Danh mục" to="/admin/categories" prepend-icon="mdi-circle-small"></v-list-item>
            <v-list-item title="Thương hiệu" to="/admin/brands" prepend-icon="mdi-circle-small"></v-list-item>
         </v-list-group>

         <v-list-item 
            prepend-icon="mdi-clipboard-list-outline" 
            title="Đơn hàng" 
            to="/admin/orders"
            active-class="text-primary bg-blue-lighten-5"
         ></v-list-item>

         <v-list-item 
            prepend-icon="mdi-account-group-outline" 
            title="Khách hàng" 
            to="/admin/customers"
            active-class="text-primary bg-blue-lighten-5"
         ></v-list-item>

         <v-list-item 
            prepend-icon="mdi-ticket-percent-outline" 
            title="Mã giảm giá" 
            to="/admin/vouchers"
            active-class="text-primary bg-blue-lighten-5"
         ></v-list-item>

         <v-list-item 
            prepend-icon="mdi-card-account-details-outline" 
            title="Nhân viên" 
            to="/admin/employees"
            active-class="text-primary bg-blue-lighten-5"
         ></v-list-item>

         <v-list-item 
            prepend-icon="mdi-history" 
            title="Nhật ký hoạt động" 
            to="/admin/logs"
            active-class="text-primary bg-blue-lighten-5"
         ></v-list-item>
      </v-list>

      <template v-slot:append>
         <div class="pa-2">
            <v-btn block color="error" variant="tonal" prepend-icon="mdi-logout" @click="handleLogout">
               <span v-if="!rail">Đăng xuất</span>
            </v-btn>
         </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar color="white" elevation="1" height="64">
       <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none"></v-app-bar-nav-icon>
       
       <div class="ms-4 text-subtitle-1 font-weight-bold text-grey-darken-2">
          {{ currentPageTitle }}
       </div>

       <v-spacer></v-spacer>

       <div class="d-flex align-center me-4 gap-2">
          <v-btn icon>
             <v-badge dot color="error">
                <v-icon icon="mdi-bell-outline"></v-icon>
             </v-badge>
          </v-btn>

          <v-divider vertical class="mx-2 h-50"></v-divider>

          <v-menu location="bottom end">
             <template v-slot:activator="{ props }">
                <div class="d-flex align-center cursor-pointer" v-bind="props">
                   <v-avatar color="primary" size="36" class="me-2">
                      <span class="text-white font-weight-bold">{{ getInitials(authStore.userName) }}</span>
                   </v-avatar>
                   <div class="d-none d-sm-block text-right lh-1">
                      <div class="text-subtitle-2 font-weight-bold">{{ authStore.userName }}</div>
                      <div class="text-caption text-grey">Administrator</div>
                   </div>
                </div>
             </template>
             <v-list width="200">
                <v-list-item prepend-icon="mdi-account" title="Hồ sơ"></v-list-item>
                <v-list-item prepend-icon="mdi-cog" title="Cài đặt"></v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item prepend-icon="mdi-logout" title="Đăng xuất" color="error" @click="handleLogout"></v-list-item>
             </v-list>
          </v-menu>
       </div>
    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
       <div class="pa-6 fill-height">
          <router-view v-slot="{ Component }">
             <transition name="fade" mode="out-in">
                <component :is="Component" />
             </transition>
          </router-view>
       </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store/auth.store';

const drawer = ref(true);
const rail = ref(false); // Chế độ thu nhỏ menu
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter(); // Cần import router để logout

// Mapping title động dựa trên route name
const currentPageTitle = computed(() => {
   const map = {
      'AdminDashboard': 'Tổng quan hệ thống',
      'AdminProductList': 'Quản lý Sản phẩm',
      'AdminBrands': 'Quản lý Thương hiệu',
      'AdminCategories': 'Quản lý Danh mục',
      'AdminOrderList': 'Danh sách Đơn hàng',
      'AdminCustomers': 'Danh sách Khách hàng',
      // ... thêm các route khác
   };
   return map[route.name] || 'Quản trị viên';
});

const getInitials = (name) => name ? name.charAt(0).toUpperCase() : 'A';

const handleLogout = () => {
   authStore.logout();
   // Redirect về login (đã xử lý trong store nhưng gọi thêm cho chắc)
   router.push({ name: 'Login' });
};
</script>

<style scoped>
.gap-2 { gap: 8px; }
.lh-1 { line-height: 1.2; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>