<template>
  <v-container fluid class="py-8 px-6 bg-grey-lighten-5 h-100">
    <div class="d-flex align-center justify-space-between mb-8">
       <div>
          <h1 class="text-h4 font-weight-bold text-secondary">Tổng quan</h1>
          <p class="text-body-2 text-grey">Chào mừng trở lại, Admin! Đây là tình hình kinh doanh hôm nay.</p>
       </div>
       <div class="d-flex gap-2">
          <v-btn variant="outlined" color="grey-darken-2" prepend-icon="mdi-cloud-download" class="bg-white">Xuất báo cáo</v-btn>
          <v-btn color="primary" prepend-icon="mdi-plus" class="shadow-soft">Tạo đơn hàng</v-btn>
       </div>
    </div>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stats-card h-100 pa-4">
           <div class="d-flex justify-space-between align-start mb-4">
              <v-avatar color="blue-lighten-5" rounded="lg" size="48">
                 <v-icon color="primary" icon="mdi-currency-usd"></v-icon>
              </v-avatar>
              <v-chip color="green-lighten-4" text-color="green-darken-2" size="x-small" label class="font-weight-bold">
                 <v-icon start icon="mdi-arrow-up" size="x-small"></v-icon> 12%
              </v-chip>
           </div>
           <div class="text-h5 font-weight-bold mb-1">245.500.000 ₫</div>
           <div class="text-caption text-grey">Doanh thu tháng này</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stats-card h-100 pa-4">
           <div class="d-flex justify-space-between align-start mb-4">
              <v-avatar color="orange-lighten-5" rounded="lg" size="48">
                 <v-icon color="orange-darken-1" icon="mdi-cart-outline"></v-icon>
              </v-avatar>
              <v-chip color="green-lighten-4" text-color="green-darken-2" size="x-small" label class="font-weight-bold">
                 <v-icon start icon="mdi-arrow-up" size="x-small"></v-icon> 5%
              </v-chip>
           </div>
           <div class="text-h5 font-weight-bold mb-1">{{ loading ? '...' : stats.totalOrders }}</div>
           <div class="text-caption text-grey">Tổng đơn hàng</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stats-card h-100 pa-4">
           <div class="d-flex justify-space-between align-start mb-4">
              <v-avatar color="purple-lighten-5" rounded="lg" size="48">
                 <v-icon color="purple" icon="mdi-account-group-outline"></v-icon>
              </v-avatar>
              <v-chip color="red-lighten-4" text-color="red-darken-2" size="x-small" label class="font-weight-bold">
                 <v-icon start icon="mdi-arrow-down" size="x-small"></v-icon> 2%
              </v-chip>
           </div>
           <div class="text-h5 font-weight-bold mb-1">{{ loading ? '...' : stats.totalCustomers }}</div>
           <div class="text-caption text-grey">Khách hàng thành viên</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stats-card h-100 pa-4">
           <div class="d-flex justify-space-between align-start mb-4">
              <v-avatar color="teal-lighten-5" rounded="lg" size="48">
                 <v-icon color="teal" icon="mdi-package-variant-closed"></v-icon>
              </v-avatar>
              <v-chip color="grey-lighten-3" size="x-small" label>Available</v-chip>
           </div>
           <div class="text-h5 font-weight-bold mb-1">{{ loading ? '...' : stats.totalProducts }}</div>
           <div class="text-caption text-grey">Sản phẩm đang bán</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
         <v-card class="border shadow-sm rounded-lg h-100">
            <v-card-title class="d-flex align-center py-4 px-5 border-b">
               <span class="text-subtitle-1 font-weight-bold">Đơn hàng gần đây</span>
               <v-spacer></v-spacer>
               <v-btn variant="text" size="small" color="primary" to="/admin/orders">Xem tất cả</v-btn>
            </v-card-title>
            
            <v-table class="dashboard-table">
               <thead>
                  <tr class="text-grey-darken-1">
                     <th class="font-weight-bold">Mã ĐH</th>
                     <th class="font-weight-bold">Khách hàng</th>
                     <th class="font-weight-bold text-end">Tổng tiền</th>
                     <th class="font-weight-bold text-center">Trạng thái</th>
                     <th class="font-weight-bold text-end">Ngày tạo</th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-grey-lighten-5 transition-all">
                     <td>
                        <router-link :to="{ name: 'AdminOrderDetail', params: { id: order.id } }" class="text-primary font-weight-bold text-decoration-none">
                           #{{ order.id }}
                        </router-link>
                     </td>
                     <td>
                        <div class="d-flex align-center">
                           <v-avatar size="28" color="grey-lighten-3" class="me-2">
                              <span class="text-caption font-weight-bold">{{ order.customerName.charAt(0) }}</span>
                           </v-avatar>
                           <span class="text-body-2">{{ order.customerName }}</span>
                        </div>
                     </td>
                     <td class="text-end font-weight-bold">{{ formatCurrency(order.totalPrice) }}</td>
                     <td class="text-center">
                        <OrderStatusChip :status="order.status" />
                     </td>
                     <td class="text-end text-caption text-grey">{{ formatDate(order.createdAt) }}</td>
                  </tr>
                  <tr v-if="recentOrders.length === 0">
                     <td colspan="5" class="text-center py-8 text-grey">Chưa có đơn hàng nào</td>
                  </tr>
               </tbody>
            </v-table>
         </v-card>
      </v-col>

      <v-col cols="12" lg="4">
         <v-card class="border shadow-sm rounded-lg h-100">
            <v-card-title class="py-4 px-5 border-b text-subtitle-1 font-weight-bold">
               Trạng thái xử lý
            </v-card-title>
            <v-card-text class="pa-5">
               <div class="mb-6">
                  <div class="d-flex justify-space-between mb-2 text-caption font-weight-bold">
                     <span>Chờ xác nhận (Pending)</span>
                     <span>{{ orderStats.pending }} đơn</span>
                  </div>
                  <v-progress-linear model-value="70" color="warning" height="8" rounded></v-progress-linear>
               </div>

               <div class="mb-6">
                  <div class="d-flex justify-space-between mb-2 text-caption font-weight-bold">
                     <span>Đang giao (Shipped)</span>
                     <span>{{ orderStats.shipped }} đơn</span>
                  </div>
                  <v-progress-linear model-value="45" color="info" height="8" rounded></v-progress-linear>
               </div>

               <div class="mb-6">
                  <div class="d-flex justify-space-between mb-2 text-caption font-weight-bold">
                     <span>Hoàn thành (Delivered)</span>
                     <span>{{ orderStats.delivered }} đơn</span>
                  </div>
                  <v-progress-linear model-value="90" color="success" height="8" rounded></v-progress-linear>
               </div>
               
               <div class="mt-8 pa-4 bg-red-lighten-5 rounded border border-red-lighten-4">
                  <div class="d-flex align-center text-red-darken-3 font-weight-bold mb-1">
                     <v-icon icon="mdi-alert-circle-outline" size="small" class="me-2"></v-icon>
                     Cảnh báo tồn kho
                  </div>
                  <div class="text-caption text-grey-darken-2 mb-3">
                     Có 5 sản phẩm sắp hết hàng trong kho.
                  </div>
                  <v-btn block size="small" variant="outlined" color="red" to="/admin/products">Kiểm tra ngay</v-btn>
               </div>
            </v-card-text>
         </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import orderService from '@/modules/orders/services/order.service';
import productService from '@/modules/products/services/product.service';
import customerService from '@/modules/admin/services/customer.service'; // Import service khách hàng
import OrderStatusChip from '@/modules/orders/components/OrderStatusChip.vue';

const loading = ref(true);
const recentOrders = ref([]);

// State thống kê
const stats = reactive({
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0
});

// Mockup thống kê trạng thái (Do chưa có API Aggregate)
const orderStats = reactive({
  pending: 12,
  shipped: 34,
  delivered: 150
});

onMounted(async () => {
  loading.value = true;
  try {
     // 1. Lấy 5 đơn hàng mới nhất
     const ordersRes = await orderService.getAllOrders({ page: 0, size: 5, sort: 'createdAt,desc' });
     recentOrders.value = ordersRes.content;
     stats.totalOrders = ordersRes.totalElements; // Lấy tổng số đơn thật

     // 2. Lấy tổng số sản phẩm (Gọi API search với size=1 để lấy totalElements)
     const productsRes = await productService.search({ page: 0, size: 1 });
     stats.totalProducts = productsRes.totalElements;

     // 3. Lấy tổng số khách hàng
     const customersRes = await customerService.getAll({ page: 0, size: 1 });
     stats.totalCustomers = customersRes.totalElements;

  } catch (e) {
     console.error("Lỗi tải Dashboard:", e);
  } finally {
     loading.value = false;
  }
});

const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatDate = (d) => {
    if(!d) return '';
    const date = new Date(d);
    return `${date.getDate()}/${date.getMonth()+1} ${date.getHours()}:${date.getMinutes()}`;
};
</script>

<style scoped>
.stats-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: white;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
}

.dashboard-table th {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.shadow-soft {
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.gap-2 { gap: 8px; }
</style>