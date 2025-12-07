<template>
  <v-container fluid>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="$router.back()">Quay lại danh sách</v-btn>
    
    <div v-if="loading" class="text-center"><v-progress-circular indeterminate color="primary"></v-progress-circular></div>
    
    <v-row v-else-if="order">
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title class="d-flex justify-space-between">
             <span>Chi tiết đơn hàng #{{ order.id }}</span>
             <OrderStatusChip :status="order.status" />
          </v-card-title>
          
          <v-table>
             <thead>
                <tr>
                   <th>Sản phẩm</th>
                   <th class="text-center">SL</th>
                   <th class="text-end">Đơn giá</th>
                   <th class="text-end">Thành tiền</th>
                </tr>
             </thead>
             <tbody>
                <tr v-for="item in order.items" :key="item.productVariantId">
                   <td class="py-2">
                      <div class="d-flex align-center">
                         <v-img :src="item.thumbnailUrl" width="40" height="40" cover class="rounded me-3"></v-img>
                         <div>
                            <div class="font-weight-medium">{{ item.productName }}</div>
                            <div class="text-caption text-grey">SKU: {{ item.sku }}</div>
                         </div>
                      </div>
                   </td>
                   <td class="text-center">{{ item.quantity }}</td>
                   <td class="text-end">{{ formatCurrency(item.priceAtPurchase) }}</td>
                   <td class="text-end font-weight-bold">{{ formatCurrency(item.lineTotal) }}</td>
                </tr>
             </tbody>
             <tfoot>
                <tr>
                   <td colspan="3" class="text-end font-weight-bold">Tổng tiền hàng:</td>
                   <td class="text-end">{{ formatCurrency(order.totalPrice) }}</td>
                </tr>
                <tr v-if="order.discountAmount">
                   <td colspan="3" class="text-end text-green">Giảm giá (Voucher):</td>
                   <td class="text-end text-green">-{{ formatCurrency(order.discountAmount) }}</td>
                </tr>
                <tr>
                   <td colspan="3" class="text-end text-h6 font-weight-bold">Thực thu:</td>
                   <td class="text-end text-h6 text-primary font-weight-bold">
                      {{ formatCurrency(order.finalPrice || order.totalPrice) }}
                   </td>
                </tr>
             </tfoot>
          </v-table>
        </v-card>
        
        <div class="d-flex gap-2" v-if="order.status !== 'CANCELLED' && order.status !== 'DELIVERED'">
           <v-btn color="primary" @click="updateStatus('PROCESSING')" v-if="order.status === 'PENDING'">Xác nhận đơn</v-btn>
           <v-btn color="info" @click="updateStatus('SHIPPED')" v-if="order.status === 'PROCESSING'">Giao hàng</v-btn>
           <v-btn color="success" @click="updateStatus('DELIVERED')" v-if="order.status === 'SHIPPED'">Đã giao xong</v-btn>
           <v-btn color="error" variant="outlined" @click="updateStatus('CANCELLED')">Hủy đơn hàng</v-btn>
        </div>
      </v-col>
      
      <v-col cols="12" md="4">
         <v-card class="mb-4">
            <v-card-title>Thông tin khách hàng</v-card-title>
            <v-card-text>
               <v-list density="compact">
                  <v-list-item prepend-icon="mdi-account">
                     <v-list-item-title>{{ order.customerName }}</v-list-item-title>
                     <v-list-item-subtitle>Người nhận</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-phone">
                     <v-list-item-title>{{ order.shippingPhone }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-map-marker">
                     <v-list-item-title style="white-space: normal">{{ order.shippingAddress }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-note-text" v-if="order.notes">
                     <v-list-item-title style="white-space: normal">{{ order.notes }}</v-list-item-title>
                     <v-list-item-subtitle>Ghi chú</v-list-item-subtitle>
                  </v-list-item>
               </v-list>
            </v-card-text>
         </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '../store/order.store';
import { useAppStore } from '@/store/app.store'; // Import Store thông báo mới
import OrderStatusChip from '../components/OrderStatusChip.vue';

const route = useRoute();
const orderStore = useOrderStore();
const appStore = useAppStore();

const order = ref(null);
const loading = ref(true);

onMounted(async () => {
  await loadDetail();
});

const loadDetail = async () => {
  loading.value = true;
  await orderStore.fetchOrderDetail(route.params.id, true); // true = isAdmin
  order.value = orderStore.currentOrder;
  loading.value = false;
};

const updateStatus = async (status) => {
  if(confirm(`Cập nhật trạng thái thành ${status}?`)) {
     const res = await orderStore.updateOrderStatus(order.value.id, status);
     if(res.success) {
        appStore.notify(res.message); // Dùng Global Notification
        loadDetail();
     } else {
        appStore.notify(res.message, 'error');
     }
  }
}

const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
</script>