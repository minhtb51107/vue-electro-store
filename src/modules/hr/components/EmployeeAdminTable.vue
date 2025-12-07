<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Quản lý Nhân sự
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">Thêm nhân viên</v-btn>
    </v-card-title>

    <v-data-table :headers="headers" :items="items" :loading="loading">
      <template v-slot:item.isActive="{ item }">
         <v-switch 
            v-model="item.isActive" 
            color="success" 
            hide-details 
            density="compact"
            @update:modelValue="(val) => toggleStatus(item, val)"
         ></v-switch>
      </template>

      <template v-slot:item.roleNames="{ item }">
          <v-chip v-for="role in item.roleNames" :key="role" size="x-small" class="me-1" color="info">{{ role }}</v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
         <v-icon size="small" @click="openDialog(item)">mdi-pencil</v-icon>
      </template>
    </v-data-table>

    <EmployeeFormDialog v-model="showDialog" :item="editedItem" :loading="submitting" @submit="handleSubmit" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import employeeService from '../services/employee.service';
import EmployeeFormDialog from './EmployeeFormDialog.vue';

const items = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const editedItem = ref(null);
const submitting = ref(false);

const headers = [
  { title: 'Mã NV', key: 'employeeCode' },
  { title: 'Họ tên', key: 'fullname' },
  { title: 'Email', key: 'email' },
  { title: 'Chức vụ', key: 'position' },
  { title: 'Phòng ban', key: 'department' },
  { title: 'Vai trò', key: 'roleNames' },
  { title: 'Trạng thái', key: 'isActive' },
  { title: 'Sửa', key: 'actions', sortable: false, align: 'end' },
];

onMounted(() => loadData());

const loadData = async () => {
  loading.value = true;
  try {
    const res = await employeeService.getAll({ size: 100 });
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
      if (data.id) await employeeService.update(data.id, data);
      else await employeeService.create(data);
      showDialog.value = false;
      loadData();
  } catch (e) { alert(e.message || 'Lỗi'); }
  finally { submitting.value = false; }
};

const toggleStatus = async (item, isActive) => {
    try {
        await employeeService.updateStatus(item.id, isActive);
    } catch (e) { 
        item.isActive = !isActive; // Revert nếu lỗi
        alert(e.message); 
    }
}
</script>