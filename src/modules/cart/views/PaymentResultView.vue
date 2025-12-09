<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="text-center pa-6 rounded-lg shadow-soft" :loading="loading">
          
          <div v-if="loading" class="py-10">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <div class="mt-4 text-body-1 text-grey">Đang xác thực giao dịch...</div>
          </div>

          <div v-else-if="result && result.status === '00'">
            <v-icon color="success" size="80" class="mb-4">mdi-check-circle</v-icon>
            <h2 class="text-h4 font-weight-bold text-success mb-2">Thanh toán thành công!</h2>
            <p class="text-body-1 text-grey mb-6">Cảm ơn bạn đã mua hàng tại Spring Electro Store.</p>
            
            <v-divider class="mb-4"></v-divider>
            
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">Mã đơn hàng:</span>
              <span class="font-weight-bold">#{{ result.orderId }}</span>
            </div>
            <div class="d-flex justify-space-between mb-6">
              <span class="text-grey">Số tiền:</span>
              <span class="font-weight-bold text-primary">{{ formatCurrency(result.amount) }}</span>
            </div>

            <v-btn color="primary" block size="large" :to="{ name: 'OrderDetail', params: { id: result.orderId } }">
              Xem chi tiết đơn hàng
            </v-btn>
            <v-btn variant="text" block class="mt-2" to="/">
              Về trang chủ
            </v-btn>
          </div>

          <div v-else>
            <v-icon color="error" size="80" class="mb-4">mdi-alert-circle</v-icon>
            <h2 class="text-h4 font-weight-bold text-error mb-2">Thanh toán thất bại</h2>
            <p class="text-body-1 text-grey mb-6">
              {{ result?.message || 'Có lỗi xảy ra trong quá trình thanh toán.' }}
            </p>
            
            <v-alert type="warning" variant="tonal" class="mb-6 text-left" v-if="result?.status !== '99'">
               Giao dịch đã bị hủy hoặc lỗi từ ngân hàng. Đơn hàng của bạn đã bị hủy và hoàn kho.
            </v-alert>

            <v-btn color="primary" block size="large" to="/cart">
              Thử thanh toán lại
            </v-btn>
            <v-btn variant="text" block class="mt-2" to="/">
              Về trang chủ
            </v-btn>
          </div>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../store/cart.store';

const route = useRoute();
const cartStore = useCartStore();

const loading = ref(true);
const result = ref(null);

const formatCurrency = (value) => {
    if (!value) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

onMounted(async () => {
  // Lấy toàn bộ query params từ URL (vnp_Amount, vnp_ResponseCode, vnp_SecureHash...)
  const queryParams = route.query;

  // Nếu không có tham số, coi như lỗi
  if (Object.keys(queryParams).length === 0) {
      loading.value = false;
      return;
  }

  // Gọi Store để verify với Backend
  const res = await cartStore.verifyVnPayReturn(queryParams);
  
  if (res.success) {
      result.value = res.data; // Data backend trả về: {status: "00", message: "...", orderId: "15"}
  } else {
      result.value = { status: '99', message: res.message };
  }
  
  loading.value = false;
});
</script>