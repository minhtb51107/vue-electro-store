<template>
  <v-container class="py-8 bg-grey-lighten-5 min-h-screen" fluid>
    <div class="d-flex align-center justify-space-between mb-8 px-2">
       <h2 class="text-h5 font-weight-bold text-black">Đơn hàng của tôi</h2>
    </div>

    <div v-if="orderStore.isLoading" class="text-center py-16">
      <v-progress-circular indeterminate color="black" size="48"></v-progress-circular>
    </div>

    <div v-else-if="orderStore.orders.length === 0" class="text-center py-24 bg-white rounded-xl shadow-card border-0">
      <v-icon size="64" color="grey-lighten-3" class="mb-4">mdi-package-variant-closed</v-icon>
      <div class="text-h6 text-grey-darken-1 mt-2">Bạn chưa có đơn hàng nào</div>
      <v-btn to="/" color="black" class="mt-6 rounded-pill px-8 font-weight-bold text-capitalize" variant="flat">Mua sắm ngay</v-btn>
    </div>

    <div v-else class="d-flex flex-column gap-5">
      <v-card 
         v-for="order in orderStore.orders" 
         :key="order.id" 
         class="rounded-xl border-0 shadow-card overflow-hidden cursor-pointer hover-scale"
         @click="$router.push({ name: 'OrderDetail', params: { id: order.id } })"
         elevation="0"
      >
        <div class="d-flex justify-space-between align-center px-6 py-4 border-b border-opacity-50">
           <div class="d-flex align-center gap-3">
              <div class="font-weight-bold text-body-2">Đơn hàng #{{ order.id }}</div>
              <span class="text-grey-lighten-1">•</span>
              <div class="text-caption text-grey">{{ formatDate(order.createdAt) }}</div>
           </div>
           <OrderStatusChip :status="order.status" class="font-weight-bold px-3" />
        </div>

        <div class="pa-6">
           <div class="d-flex justify-space-between align-center flex-wrap gap-4">
              <div>
                 <div class="text-body-2 text-grey mb-1">{{ order.totalItems }} sản phẩm</div>
                 <div class="d-flex align-baseline gap-2">
                    <span class="text-caption text-grey">Tổng tiền:</span>
                    <span class="text-h6 font-weight-bold text-black">{{ formatCurrency(order.totalPrice) }}</span>
                 </div>
              </div>
              
              <div class="d-flex align-center gap-3">
                 <v-btn 
                    variant="outlined" 
                    color="grey-darken-1" 
                    class="rounded-pill px-4 text-capitalize border-opacity-50"
                    size="small"
                 >Chi tiết</v-btn>
                 
                 <v-btn 
                   v-if="order.status === 'DELIVERED'" 
                   variant="flat" 
                   color="black" 
                   class="rounded-pill px-4 text-capitalize font-weight-bold"
                   size="small"
                 >Mua lại</v-btn>
              </div>
           </div>
        </div>
      </v-card>

      <div class="d-flex justify-center mt-8">
         <v-pagination
           v-model="page"
           :length="totalPages"
           rounded="circle"
           active-color="black"
           color="grey-lighten-2"
           density="comfortable"
           @update:modelValue="loadOrders"
         ></v-pagination>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useOrderStore } from '../store/order.store';
import OrderStatusChip from '../components/OrderStatusChip.vue';

const orderStore = useOrderStore();
const page = ref(1);
const pageSize = 10;

const totalPages = computed(() => Math.ceil(orderStore.totalItems / pageSize));

onMounted(() => { loadOrders(); });

const loadOrders = () => {
  orderStore.fetchMyOrders({ page: page.value - 1, size: pageSize, sort: 'createdAt,desc' });
};

const formatDate = (dateStr) => new Date(dateStr).toLocaleString('vi-VN');
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
</script>

<style scoped>
.shadow-card {
    box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
}
.gap-3 { gap: 12px; }
.gap-5 { gap: 20px; }
.hover-scale {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-scale:hover {
    transform: scale(1.005);
    box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
}
.min-h-screen { min-height: 85vh; }
</style>