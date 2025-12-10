<template>
  <v-app>
    <v-app-bar color="white" :elevation="0" height="80" class="border-b border-opacity-50 position-fixed" style="z-index: 50;">
      <v-container class="d-flex align-center fill-height py-0" style="max-width: 1440px">
        
        <router-link to="/" class="d-flex align-center text-decoration-none me-8">
           <v-icon icon="mdi-lightning-bolt-circle" color="black" size="32"></v-icon>
           <div class="ms-2 d-flex flex-column">
             <span class="text-h6 font-weight-black text-black lh-1" style="letter-spacing: -0.5px;">Electro</span>
             <span class="text-caption font-weight-bold text-grey-darken-1 ls-2" style="font-size: 0.65rem;">STORE</span>
           </div>
        </router-link>

        <div class="d-none d-md-flex align-center gap-6 me-6">
            <v-btn variant="text" to="/products?categorySlug=laptop" class="text-capitalize text-body-2 font-weight-medium text-grey-darken-3" :ripple="false">MacBook</v-btn>
            <v-btn variant="text" to="/products?categorySlug=dien-thoai" class="text-capitalize text-body-2 font-weight-medium text-grey-darken-3" :ripple="false">iPhone</v-btn>
            <v-btn variant="text" to="/products?categorySlug=phu-kien" class="text-capitalize text-body-2 font-weight-medium text-grey-darken-3" :ripple="false">Phụ kiện</v-btn>
        </div>

        <v-text-field
          density="compact"
          variant="solo-filled"
          flat
          placeholder="Tìm kiếm..."
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          class="flex-grow-1 mx-2 search-bar rounded-pill"
          bg-color="grey-lighten-4"
          style="max-width: 400px;"
          @keydown.enter="handleSearch"
        ></v-text-field>

        <v-spacer></v-spacer>

        <div class="d-flex align-center gap-2 ms-4">
          <v-btn icon to="/cart" title="Giỏ hàng" variant="text" color="grey-darken-3">
            <v-badge :content="cartStore.totalItems" color="black" v-if="cartStore.totalItems > 0" offset-x="2" offset-y="2">
              <v-icon size="26">mdi-shopping-outline</v-icon>
            </v-badge>
            <v-icon size="26" v-else>mdi-shopping-outline</v-icon>
          </v-btn>

          <v-menu location="bottom end" :close-on-content-click="false">
             <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" variant="text" color="grey-darken-3">
                   <v-badge dot color="error" offset-x="2" offset-y="2">
                      <v-icon size="26">mdi-bell-outline</v-icon>
                   </v-badge>
                </v-btn>
             </template>
             <v-card width="320" class="rounded-xl shadow-card border-0 mt-2">
                <v-card-title class="text-body-2 font-weight-bold px-4 py-3 border-b">Thông báo</v-card-title>
                <v-list lines="two" density="compact" class="py-0">
                   <v-list-item prepend-icon="mdi-ticket-confirmation-outline" title="Voucher mới" subtitle="Giảm 10% cho đơn hàng tiếp theo"></v-list-item>
                </v-list>
             </v-card>
          </v-menu>

          <div v-if="authStore.isAuthenticated">
             <v-menu location="bottom end" transition="scale-transition">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" variant="text" class="px-0 ms-1" rounded="circle" min-width="40" width="40" height="40">
                    <v-avatar color="black" size="36">
                      <v-img v-if="authStore.userAvatar" :src="authStore.userAvatar"></v-img>
                      <span v-else class="text-white text-caption font-weight-bold">{{ getInitials(authStore.userName) }}</span>
                    </v-avatar>
                  </v-btn>
                </template>
                
                <v-list class="rounded-xl shadow-card border-0 mt-2 py-2" width="200">
                   <div class="px-4 py-2 mb-2 border-b">
                      <div class="text-subtitle-2 font-weight-bold text-truncate">{{ authStore.userName }}</div>
                      <div class="text-caption text-grey">Thành viên</div>
                   </div>
                   <v-list-item to="/profile" prepend-icon="mdi-account-outline" title="Hồ sơ" density="compact"></v-list-item>
                   <v-list-item to="/order-history" prepend-icon="mdi-package-variant-closed" title="Đơn mua" density="compact"></v-list-item>
                   <v-list-item to="/wishlist" prepend-icon="mdi-heart-outline" title="Yêu thích"></v-list-item>
                   <v-divider class="my-2"></v-divider>
                   <v-list-item @click="authStore.logout()" prepend-icon="mdi-logout" title="Đăng xuất" color="error" density="compact"></v-list-item>
                </v-list>
             </v-menu>
          </div>

          <div v-else class="d-flex gap-2 ms-2">
             <v-btn :to="{ name: 'Login' }" variant="text" class="text-capitalize font-weight-bold" color="grey-darken-3">Đăng nhập</v-btn>
             <v-btn :to="{ name: 'Register' }" color="black" class="text-capitalize font-weight-bold rounded-pill px-6" variant="flat">Đăng ký</v-btn>
          </div>
        </div>

      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-5 pt-20">
         <router-view />
    </v-main>

    <v-footer class="bg-white border-t pt-16 pb-8 mt-0">
       <v-container style="max-width: 1440px">
          <v-row>
             <v-col cols="12" md="4" class="mb-8 mb-md-0">
                <div class="d-flex align-center mb-4">
                   <v-icon icon="mdi-lightning-bolt-circle" color="black" class="me-2"></v-icon>
                   <span class="text-h6 font-weight-bold">ElectroSTORE</span>
                </div>
                <p class="text-body-2 text-grey mb-6" style="max-width: 300px; line-height: 1.6;">
                   Trải nghiệm mua sắm công nghệ đỉnh cao với chất lượng dịch vụ tốt nhất.
                </p>
                <div class="d-flex gap-4">
                   <v-btn icon="mdi-facebook" variant="text" color="grey" density="compact"></v-btn>
                   <v-btn icon="mdi-instagram" variant="text" color="grey" density="compact"></v-btn>
                   <v-btn icon="mdi-youtube" variant="text" color="grey" density="compact"></v-btn>
                </div>
             </v-col>
             
             <v-col cols="6" md="2">
                <div class="font-weight-bold mb-4 text-body-2 text-uppercase ls-1">Cửa hàng</div>
                <div class="d-flex flex-column gap-3 text-body-2 text-grey-darken-1">
                   <router-link to="/" class="hover-link">Sản phẩm mới</router-link>
                   <router-link to="/" class="hover-link">Khuyến mãi</router-link>
                   <router-link to="/" class="hover-link">Cửa hàng</router-link>
                </div>
             </v-col>

             <v-col cols="6" md="2">
                <div class="font-weight-bold mb-4 text-body-2 text-uppercase ls-1">Hỗ trợ</div>
                <div class="d-flex flex-column gap-3 text-body-2 text-grey-darken-1">
                   <a href="#" class="hover-link">Trung tâm trợ giúp</a>
                   <a href="#" class="hover-link">Chính sách bảo hành</a>
                   <a href="#" class="hover-link">Tình trạng đơn hàng</a>
                </div>
             </v-col>

             <v-col cols="12" md="4">
                <div class="font-weight-bold mb-4 text-body-2 text-uppercase ls-1">Đăng ký nhận tin</div>
                <v-text-field
                   placeholder="Email của bạn"
                   variant="outlined"
                   density="compact"
                   bg-color="transparent"
                   append-inner-icon="mdi-arrow-right"
                   hide-details
                   rounded="lg"
                ></v-text-field>
             </v-col>
          </v-row>
          
          <v-divider class="my-10 border-opacity-50"></v-divider>
          
          <div class="d-flex flex-column flex-md-row justify-space-between align-center text-caption text-grey">
             <div>© 2025 ElectroStore Inc. All rights reserved.</div>
             <div class="d-flex gap-4 mt-4 mt-md-0">
                <span class="cursor-pointer hover-link">Quyền riêng tư</span>
                <span class="cursor-pointer hover-link">Điều khoản</span>
             </div>
          </div>
       </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useCartStore } from '@/modules/cart/store/cart.store';
import { useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const { connect, disconnect } = useWebSocket();

onMounted(() => {
  if (authStore.isAuthenticated) {
     cartStore.fetchCart();
     connect();
  }
});

watch(() => authStore.isAuthenticated, (isLoggedIn) => {
  if (isLoggedIn) {
    cartStore.fetchCart();
    connect();
  } else {
    disconnect();
    cartStore.items = [];
    cartStore.totalItems = 0;
  }
});

const getInitials = (name) => name ? name.charAt(0).toUpperCase() : 'U';

const handleSearch = (event) => {
    const query = event.target.value;
    if(query) {
        router.push({ name: 'ProductList', query: { q: query } });
    }
};
</script>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }
.lh-1 { line-height: 1.2; }
.ls-1 { letter-spacing: 1px; }
.ls-2 { letter-spacing: 2px; }

/* Shadow card mềm mại */
.shadow-card {
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1) !important;
}

/* Style cho Search Bar */
.search-bar :deep(.v-field) {
    border-radius: 9999px !important; /* Rounded Pill */
    box-shadow: none !important;
}
.search-bar :deep(.v-field__input) {
    padding-top: 8px;
    padding-bottom: 8px;
}

/* Footer Link Hover */
.hover-link {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s;
}
.hover-link:hover {
    color: black;
}
</style>