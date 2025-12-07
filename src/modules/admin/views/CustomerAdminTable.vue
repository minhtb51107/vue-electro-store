<template>
  <v-card>
    <v-card-title>Quản lý Khách hàng</v-card-title>
    
    <v-data-table-server
       v-model:items-per-page="itemsPerPage"
       :headers="headers"
       :items="customers"
       :items-length="totalItems"
       :loading="loading"
       @update:options="loadData"
    >
       <template v-slot:item.photo="{ item }">
          <v-avatar size="36">
             <v-img :src="item.photo || 'https://via.placeholder.com/36'" cover></v-img>
          </v-avatar>
       </template>

       <template v-slot:item.status="{ item }">
          <v-chip 
             size="small" 
             :color="item.status === 'ACTIVE' ? 'green' : 'grey'"
          >
             {{ item.status }}
          </v-chip>
       </template>

       <template v-slot:item.actions="{ item }">
          <v-btn 
             v-if="item.status === 'ACTIVE'"
             icon="mdi-lock" 
             size="small" 
             color="error" 
             variant="text"
             title="Khóa tài khoản"
             @click="lockUser(item)"
          ></v-btn>
       </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import customerService from '../services/customer.service';

const customers = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const itemsPerPage = ref(10);

const headers = [
  { title: 'Avatar', key: 'photo', sortable: false },
  { title: 'Họ tên', key: 'fullname' },
  { title: 'Email', key: 'email' },
  { title: 'SĐT', key: 'phoneNumber' },
  { title: 'Trạng thái', key: 'status' },
  { title: 'Tác vụ', key: 'actions', sortable: false, align: 'end' },
];

const loadData = async ({ page = 1, itemsPerPage = 10 } = {}) => {
   loading.value = true;
   try {
      const res = await customerService.getAll({ page: page - 1, size: itemsPerPage });
      customers.value = res.content;
      totalItems.value = res.totalElements;
   } catch (e) { console.error(e); }
   finally { loading.value = false; }
};

const lockUser = async (item) => {
   if (confirm(`Bạn có chắc muốn khóa tài khoản ${item.email}?`)) {
      try {
         await customerService.deleteCustomer(item.id); // Backend dùng delete để Suspend
         alert("Đã khóa tài khoản thành công.");
         loadData(); // Reload
      } catch (e) {
         alert(e.message || "Lỗi");
      }
   }
};
</script>