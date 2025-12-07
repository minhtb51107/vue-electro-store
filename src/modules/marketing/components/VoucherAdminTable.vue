<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Quản lý Mã giảm giá
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">Tạo Voucher</v-btn>
    </v-card-title>

    <v-data-table :headers="headers" :items="items" :loading="loading">
      <template v-slot:item.discountValue="{ item }">
         <span v-if="item.discountType === 'PERCENTAGE'" class="text-primary font-weight-bold">{{ item.discountValue }}%</span>
         <span v-else class="text-green font-weight-bold">{{ formatCurrency(item.discountValue) }}</span>
      </template>
      
      <template v-slot:item.time="{ item }">
         <div class="text-caption">
            <div>{{ formatDate(item.startDate) }}</div>
            <div>{{ formatDate(item.endDate) }}</div>
         </div>
      </template>

      <template v-slot:item.usage="{ item }">
         {{ item.usedCount }} / {{ item.usageLimit === 0 ? '∞' : item.usageLimit }}
      </template>

      <template v-slot:item.active="{ item }">
         <v-chip :color="item.active ? 'green' : 'grey'" size="small">{{ item.active ? 'Active' : 'Inactive' }}</v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
         <v-icon size="small" class="me-2" @click="openDialog(item)">mdi-pencil</v-icon>
         <v-icon size="small" color="error" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <VoucherFormDialog v-model="showDialog" :item="editedItem" :loading="submitting" @submit="handleSubmit" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import voucherService from '../services/voucher.service';
import VoucherFormDialog from './VoucherFormDialog.vue';

const items = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const editedItem = ref(null);
const submitting = ref(false);

const headers = [
  { title: 'Mã Code', key: 'code' },
  { title: 'Mô tả', key: 'description' },
  { title: 'Giảm giá', key: 'discountValue' },
  { title: 'Thời gian', key: 'time' },
  { title: 'Lượt dùng', key: 'usage' },
  { title: 'Trạng thái', key: 'active' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

onMounted(() => loadData());

const loadData = async () => {
  loading.value = true;
  try {
    const res = await voucherService.getAll({ size: 100 }); // Lấy 100 cái demo
    items.value = res.content;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const openDialog = (item = null) => {
  editedItem.value = item;
  showDialog.value = true;
};

const handleSubmit = async (data) => {
  submitting.value = true;
  try {
      if (data.id) await voucherService.update(data.id, data);
      else await voucherService.create(data);
      showDialog.value = false;
      loadData();
  } catch (e) { alert(e.message || 'Lỗi'); }
  finally { submitting.value = false; }
};

const deleteItem = async (item) => {
    if(confirm('Xóa voucher này?')) {
        await voucherService.delete(item.id);
        loadData();
    }
};

const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '---';
</script>