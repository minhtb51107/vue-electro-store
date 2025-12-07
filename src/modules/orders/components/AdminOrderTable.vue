<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Quản lý Đơn hàng
      <v-spacer></v-spacer>
      <v-select
        v-model="filterStatus"
        :items="statusOptions"
        label="Trạng thái"
        density="compact"
        variant="outlined"
        hide-details
        class="me-4"
        style="max-width: 200px"
        clearable
        @update:modelValue="loadOrders"
      ></v-select>
      
      <v-text-field
        v-model="searchEmail"
        prepend-inner-icon="mdi-magnify"
        label="Email khách hàng"
        density="compact"
        variant="outlined"
        hide-details
        style="max-width: 250px"
        @keydown.enter="loadOrders"
      ></v-text-field>
    </v-card-title>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="orderStore.orders"
      :items-length="orderStore.totalItems"
      :loading="orderStore.isLoading"
      @update:options="handleTableChange"
    >
      <template v-slot:item.id="{ item }">
         <span class="font-weight-bold text-primary cursor-pointer" @click="viewDetail(item)">#{{ item.id }}</span>
      </template>

      <template v-slot:item.totalPrice="{ item }">
         {{ formatCurrency(item.totalPrice) }}
      </template>

      <template v-slot:item.createdAt="{ item }">
         {{ formatDate(item.createdAt) }}
      </template>

      <template v-slot:item.status="{ item }">
         <OrderStatusChip :status="item.status" />
      </template>

      <template v-slot:item.actions="{ item }">
         <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
               <v-btn icon="mdi-dots-vertical" size="small" variant="text" v-bind="props"></v-btn>
            </template>
            <v-list density="compact">
               <v-list-subheader>Cập nhật trạng thái</v-list-subheader>
               <v-list-item 
                  v-for="status in nextStatuses(item.status)" 
                  :key="status.value"
                  @click="updateStatus(item.id, status.value)"
               >
                  {{ status.label }}
               </v-list-item>
               <v-divider class="my-1"></v-divider>
               <v-list-item @click="viewDetail(item)" prepend-icon="mdi-eye">Xem chi tiết</v-list-item>
            </v-list>
         </v-menu>
      </template>
    </v-data-table-server>
    
    </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useOrderStore } from '../store/order.store';
import OrderStatusChip from './OrderStatusChip.vue';
import { useRouter } from 'vue-router';

const orderStore = useOrderStore();
const router = useRouter();
const itemsPerPage = ref(10);
const filterStatus = ref(null);
const searchEmail = ref('');

const headers = [
  { title: 'Mã ĐH', key: 'id' },
  { title: 'Khách hàng', key: 'customerName' },
  { title: 'Tổng tiền', key: 'totalPrice', align: 'end' },
  { title: 'Ngày tạo', key: 'createdAt' },
  { title: 'Trạng thái', key: 'status' },
  { title: 'Tác vụ', key: 'actions', align: 'end', sortable: false },
];

const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// Logic trạng thái kế tiếp hợp lệ (State Machine đơn giản)
const nextStatuses = (current) => {
   const map = {
      'PENDING': [{ value: 'PROCESSING', label: 'Xác nhận đơn' }, { value: 'CANCELLED', label: 'Hủy đơn' }],
      'PROCESSING': [{ value: 'SHIPPED', label: 'Giao hàng' }],
      'SHIPPED': [{ value: 'DELIVERED', label: 'Hoàn tất' }, { value: 'RETURNED', label: 'Trả hàng' }],
      'DELIVERED': [],
      'CANCELLED': []
   };
   return map[current] || [];
};

const loadOrders = () => {
  // Gọi API qua Store
  orderStore.fetchAllOrders({
    page: 0, // Reset về trang 1 khi filter
    size: itemsPerPage.value,
    status: filterStatus.value,
    customerEmail: searchEmail.value
  });
};

const handleTableChange = ({ page, itemsPerPage }) => {
   orderStore.fetchAllOrders({
      page: page - 1,
      size: itemsPerPage,
      status: filterStatus.value,
      customerEmail: searchEmail.value
   });
};

const updateStatus = async (id, newStatus) => {
   if (confirm(`Chuyển trạng thái đơn hàng #${id} sang ${newStatus}?`)) {
      const res = await orderStore.updateOrderStatus(id, newStatus);
      if (!res.success) alert(res.message);
      // Table tự refresh vì store reactive
   }
};

const viewDetail = (item) => {
   // Chuyển sang trang chi tiết admin (Bạn cần tạo AdminOrderDetailView)
   router.push({ name: 'AdminOrderDetail', params: { id: item.id } });
};

const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');
const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
</script>