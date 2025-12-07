<template>
  <v-container class="py-8 bg-grey-lighten-5" fluid>
    <div class="d-flex align-center mb-4">
       <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/order-history" class="ps-0">Quay lại</v-btn>
       <v-spacer></v-spacer>
       <div class="text-caption text-grey">Mã đơn hàng: #{{ route.params.id }}</div>
    </div>

    <div v-if="loading" class="text-center py-16">
       <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <v-row v-else-if="order">
      <v-col cols="12" md="8">
        
        <v-card class="mb-4 rounded-lg border-0 shadow-soft pa-6">
           <div class="mb-6 font-weight-bold text-subtitle-1">Trạng thái đơn hàng</div>
           <div class="d-flex align-center justify-space-between px-4 position-relative">
              <div class="position-absolute bg-grey-lighten-3" style="top: 12px; left: 40px; right: 40px; height: 4px; z-index: 0;"></div>
              
              <div class="d-flex flex-column align-center position-relative" style="z-index: 1;">
                 <v-icon :color="getStepColor(order.status, 'PENDING')" size="24" class="bg-white pa-1 rounded-circle border">mdi-clipboard-text-outline</v-icon>
                 <span class="text-caption mt-2 font-weight-bold">Đã đặt đơn</span>
                 <span class="text-caption text-grey" style="font-size: 10px;">{{ formatDate(order.createdAt) }}</span>
              </div>

              <div class="d-flex flex-column align-center position-relative" style="z-index: 1;">
                 <v-icon :color="getStepColor(order.status, 'PROCESSING')" size="24" class="bg-white pa-1 rounded-circle border">mdi-package-variant</v-icon>
                 <span class="text-caption mt-2 font-weight-bold">Đã xác nhận</span>
              </div>

              <div class="d-flex flex-column align-center position-relative" style="z-index: 1;">
                 <v-icon :color="getStepColor(order.status, 'SHIPPED')" size="24" class="bg-white pa-1 rounded-circle border">mdi-truck-delivery-outline</v-icon>
                 <span class="text-caption mt-2 font-weight-bold">Đang giao</span>
              </div>

              <div class="d-flex flex-column align-center position-relative" style="z-index: 1;">
                 <v-icon :color="getStepColor(order.status, 'DELIVERED')" size="24" class="bg-white pa-1 rounded-circle border">mdi-star-circle-outline</v-icon>
                 <span class="text-caption mt-2 font-weight-bold">Hoàn thành</span>
              </div>
           </div>
           
           <div v-if="order.status === 'CANCELLED'" class="mt-6 text-center">
              <v-alert type="error" variant="tonal" density="compact" border="start">
                 Đơn hàng đã bị hủy.
              </v-alert>
           </div>
        </v-card>

        <v-card class="mb-4 rounded-lg border-0 shadow-soft">
          <v-card-title class="font-weight-bold py-3 px-4 border-b text-body-2 bg-grey-lighten-5">Sản phẩm</v-card-title>
          <div class="pa-0">
             <div v-for="(item, index) in order.items" :key="item.productVariantId">
                <div class="d-flex py-4 px-4">
                   <div class="rounded border bg-grey-lighten-5 flex-shrink-0 me-4" style="width: 80px; height: 80px;">
                      <v-img :src="item.thumbnailUrl" cover height="100%"></v-img>
                   </div>
                   <div class="flex-grow-1">
                      <div class="d-flex justify-space-between align-start">
                         <div class="font-weight-bold text-body-2">{{ item.productName }}</div>
                         <div class="text-body-2">x{{ item.quantity }}</div>
                      </div>
                      <div class="text-caption text-grey mb-1">SKU: {{ item.sku }}</div>
                      <div class="text-end font-weight-bold text-primary mt-2">{{ formatCurrency(item.lineTotal) }}</div>
                   </div>
                </div>
                <v-divider v-if="index < order.items.length - 1"></v-divider>
             </div>
          </div>
        </v-card>
        
        <v-card class="rounded-lg border-0 shadow-soft pa-4">
             <div class="d-flex justify-space-between mb-2 text-body-2">
                <span class="text-grey">Tổng tiền hàng</span>
                <span>{{ formatCurrency(order.totalPrice) }}</span>
             </div>
             <div class="d-flex justify-space-between mb-2 text-body-2" v-if="order.discountAmount">
                <span class="text-grey">Voucher giảm giá</span>
                <span class="text-green">-{{ formatCurrency(order.discountAmount) }}</span>
             </div>
             <div class="d-flex justify-space-between mb-2 text-body-2">
                <span class="text-grey">Phí vận chuyển</span>
                <span>Miễn phí</span>
             </div>
             <v-divider class="my-2"></v-divider>
             <div class="d-flex justify-space-between text-h6 font-weight-bold">
                <span>Thành tiền</span>
                <span class="text-primary">{{ formatCurrency(order.finalPrice || order.totalPrice) }}</span>
             </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
         <v-card class="mb-4 rounded-lg border-0 shadow-soft h-100">
            <v-card-title class="font-weight-bold py-3 px-4 border-b text-body-2 bg-grey-lighten-5">Địa chỉ nhận hàng</v-card-title>
            <v-card-text class="pt-4">
               <div class="font-weight-bold text-subtitle-1 mb-1">{{ order.customerName }}</div>
               <div class="text-grey-darken-2 mb-2 text-body-2">{{ order.shippingPhone }}</div>
               <div class="text-body-2 text-grey-darken-1">{{ order.shippingAddress }}</div>
               
               <div class="mt-4 pt-4 border-top" v-if="order.notes">
                  <div class="text-caption font-weight-bold text-grey">Ghi chú:</div>
                  <div class="text-body-2">{{ order.notes }}</div>
               </div>
            </v-card-text>
            
            <div class="pa-4 pt-0" v-if="order.status === 'PENDING'">
                <v-btn 
                   block 
                   color="error" 
                   variant="outlined" 
                   @click="cancelOrder"
                   class="shadow-soft"
                >Hủy đơn hàng</v-btn>
            </div>
         </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '../store/order.store';

const route = useRoute();
const orderStore = useOrderStore();
const order = ref(null);
const loading = ref(true);

onMounted(async () => {
  await loadDetail();
});

const loadDetail = async () => {
  loading.value = true;
  await orderStore.fetchOrderDetail(route.params.id);
  order.value = orderStore.currentOrder;
  loading.value = false;
};

const cancelOrder = async () => {
  if (confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) {
     const res = await orderStore.cancelMyOrder(order.value.id);
     if(res.success) {
         alert(res.message);
         loadDetail();
     } else {
         alert(res.message);
     }
  }
}

// Logic màu sắc cho Stepper
const getStepColor = (currentStatus, step) => {
    const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(step);
    
    if (currentStatus === 'CANCELLED') return 'grey';
    if (currentIndex >= stepIndex) return 'success'; // Đã qua hoặc đang ở
    return 'grey-lighten-1'; // Chưa tới
};

const formatDate = (d) => new Date(d).toLocaleString('vi-VN');
const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
</script>