<template>
  <v-container class="fill-height justify-center bg-grey-lighten-5">
    <v-card class="text-center pa-8 rounded-lg" elevation="2" max-width="500" width="100%">
      
      <div v-if="loading" class="py-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="mt-4 text-body-1">Đang xử lý kết quả thanh toán...</div>
      </div>

      <div v-else>
        <v-icon 
          :icon="isSuccess ? 'mdi-check-circle' : 'mdi-alert-circle'" 
          :color="isSuccess ? 'success' : 'error'" 
          size="100"
          class="mb-4"
        ></v-icon>

        <h2 class="text-h5 font-weight-bold mb-2">
          {{ isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại' }}
        </h2>
        
        <p class="text-body-2 text-grey mb-6">{{ message }}</p>
        
        <v-divider class="mb-6"></v-divider>
        
        <div v-if="resultData" class="text-left bg-grey-lighten-4 pa-4 rounded mb-6 text-body-2">
           <div class="d-flex justify-space-between mb-1">
              <span>Mã đơn hàng:</span><span class="font-weight-bold">#{{ resultData.orderId }}</span>
           </div>
           <div class="d-flex justify-space-between mb-1">
              <span>Số tiền:</span><span class="font-weight-bold text-primary">{{ formatCurrency(resultData.amount / 100) }}</span>
           </div>
           <div class="d-flex justify-space-between">
              <span>Thời gian:</span><span>{{ formatDate(resultData.paymentDate) }}</span>
           </div>
        </div>

        <div class="d-flex flex-column gap-2">
           <v-btn color="primary" block to="/order-history" size="large">Xem đơn hàng của tôi</v-btn>
           <v-btn variant="text" block to="/">Về trang chủ</v-btn>
        </div>
      </div>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosClient from '@/api/axiosClient'; // Gọi trực tiếp API public

const route = useRoute();
const loading = ref(true);
const isSuccess = ref(false);
const message = ref('');
const resultData = ref(null);

onMounted(async () => {
  // Lấy toàn bộ query params từ URL (vnp_Amount, vnp_ResponseCode...)
  const params = route.query;

  try {
    // Gọi API Backend để verify checksum và update DB
    const response = await axiosClient.get('/payment/vn-pay-callback', { params });
    
    // Nếu backend trả về 200 OK
    resultData.value = response; // PaymentCallbackResponse
    isSuccess.value = response.status === '00';
    message.value = response.message;
    
  } catch (err) {
    isSuccess.value = false;
    message.value = err.response?.data?.message || 'Có lỗi xảy ra khi xác thực thanh toán.';
  } finally {
    loading.value = false;
  }
});

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
const formatDate = (str) => {
    if(!str) return '';
    // VNPay format: yyyyMMddHHmmss
    const y = str.substr(0,4), m = str.substr(4,2), d = str.substr(6,2);
    const h = str.substr(8,2), mi = str.substr(10,2);
    return `${d}/${m}/${y} ${h}:${mi}`;
}
</script>