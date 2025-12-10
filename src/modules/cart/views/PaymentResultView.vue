<template>
  <v-container class="fill-height justify-center">
    <v-card class="pa-8 text-center rounded-xl shadow-card" width="500" :loading="loading">
      
      <div v-if="loading" class="py-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="mt-4 text-body-1 text-grey">Đang xác thực giao dịch...</div>
      </div>

      <div v-else-if="success">
        <v-icon icon="mdi-check-circle" color="success" size="80" class="mb-4 animate-bounce"></v-icon>
        <h2 class="text-h5 font-weight-bold text-success mb-2">Thanh toán thành công!</h2>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          Đơn hàng <strong>#{{ orderId }}</strong> của bạn đã được xác nhận.
          <br>Email xác nhận đã được gửi tới bạn.
        </p>
        <div class="d-flex flex-column gap-2">
            <v-btn color="primary" :to="`/order-history/${orderId}`" block size="large">Xem đơn hàng</v-btn>
            <v-btn variant="text" to="/" block>Về trang chủ</v-btn>
        </div>
      </div>

      <div v-else>
        <v-icon icon="mdi-alert-circle" color="error" size="80" class="mb-4"></v-icon>
        <h2 class="text-h5 font-weight-bold text-error mb-2">Thanh toán thất bại</h2>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          {{ errorMessage || 'Có lỗi xảy ra trong quá trình thanh toán.' }}
        </p>
        <v-btn color="primary" to="/checkout" block size="large">Thử lại</v-btn>
        <v-btn variant="text" to="/" block class="mt-2">Về trang chủ</v-btn>
      </div>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosClient from '@/api/axiosClient';

const route = useRoute();
const loading = ref(true);
const success = ref(false);
const errorMessage = ref('');
const orderId = ref(null); // Lấy từ response của VNPay (vnp_TxnRef)

onMounted(async () => {
  // Lấy toàn bộ query params từ URL do VNPay trả về
  const params = route.query;

  // Nếu không có param nào -> Người dùng tự gõ link -> Báo lỗi
  if (Object.keys(params).length === 0) {
      loading.value = false;
      success.value = false;
      errorMessage.value = "Thông tin giao dịch không hợp lệ.";
      return;
  }

  try {
    // [QUAN TRỌNG] Gọi Backend để verify checksum
    const res = await axiosClient.get('/payment/vn-pay-callback', { params });
    
    // Backend trả về PaymentCallbackResponse { status: "00", message: "...", data: {...} }
    if (res.status === '00') {
        success.value = true;
        // vnp_TxnRef thường là mã đơn hàng
        orderId.value = params.vnp_TxnRef; 
    } else {
        success.value = false;
        errorMessage.value = res.message || 'Giao dịch bị từ chối.';
    }
  } catch (error) {
    console.error(error);
    success.value = false;
    errorMessage.value = error.message || 'Lỗi kết nối tới hệ thống.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.shadow-card {
  box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
}
.animate-bounce {
  animation: bounce 1s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>