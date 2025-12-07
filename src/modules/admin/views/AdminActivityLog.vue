<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Nhật Ký Hoạt Động
      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchAction"
        label="Tìm loại hành động (VD: LOGIN)"
        density="compact"
        variant="outlined"
        hide-details
        style="max-width: 250px"
        @keydown.enter="loadData"
      ></v-text-field>
    </v-card-title>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="logs"
      :items-length="totalItems"
      :loading="loading"
      @update:options="loadData"
    >
       <template v-slot:item.action="{ item }">
          <v-chip size="small" :color="getActionColor(item.action)">{{ item.action }}</v-chip>
       </template>

       <template v-slot:item.createdAt="{ item }">
          {{ new Date(item.createdAt).toLocaleString('vi-VN') }}
       </template>

       <template v-slot:item.details="{ item }">
          <div class="text-truncate" style="max-width: 300px" :title="item.details">
             {{ item.details }}
          </div>
       </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import logService from '../services/log.service';

const logs = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const itemsPerPage = ref(20);
const searchAction = ref('');

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Người dùng (Email)', key: 'userEmail' },
  { title: 'Hành động', key: 'action' },
  { title: 'Chi tiết', key: 'details', sortable: false },
  { title: 'Thời gian', key: 'createdAt' },
];

const loadData = async ({ page = 1, itemsPerPage = 20 } = {}) => {
  loading.value = true;
  try {
    const res = await logService.getLogs({
       page: page - 1,
       size: itemsPerPage,
       action: searchAction.value,
       sort: 'createdAt,desc'
    });
    logs.value = res.content;
    totalItems.value = res.totalElements;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const getActionColor = (action) => {
   if (action.includes('LOGIN')) return 'success';
   if (action.includes('DELETE')) return 'error';
   if (action.includes('UPDATE')) return 'warning';
   return 'info';
};
</script>