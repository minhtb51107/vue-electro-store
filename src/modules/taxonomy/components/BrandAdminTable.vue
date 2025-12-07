<template>
  <v-card>
    <v-card-title class="d-flex align-center pe-2">
      Danh sách Thương hiệu
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        Thêm mới
      </v-btn>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="taxonomyStore.brands"
      :loading="taxonomyStore.isLoading"
      class="elevation-1"
    >
      <template v-slot:item.logoUrl="{ item }">
        <v-img :src="item.logoUrl" width="50" height="50" contain v-if="item.logoUrl"></v-img>
        <span v-else class="text-grey text-caption">No Image</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="openDialog(item)">mdi-pencil</v-icon>
        <v-icon size="small" color="error" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <BrandFormDialog
      v-model="showDialog"
      :item="editedItem"
      :loading="isSubmitting"
      @submit="handleSubmit"
    />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTaxonomyStore } from '../store/taxonomy.store';
import BrandFormDialog from './BrandFormDialog.vue';

// 1. Kết nối Store
const taxonomyStore = useTaxonomyStore();

// 2. Cấu hình bảng
const headers = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Logo', key: 'logoUrl', sortable: false },
  { title: 'Tên thương hiệu', key: 'name' },
  { title: 'Slug', key: 'slug' },
  { title: 'Hành động', key: 'actions', sortable: false, align: 'end' },
];

// 3. State quản lý Dialog
const showDialog = ref(false);
const editedItem = ref(null); // Nếu null -> Thêm mới, Ngược lại -> Sửa
const isSubmitting = ref(false);

// 4. Lifecycle: Load dữ liệu khi component được mount
onMounted(() => {
  taxonomyStore.fetchBrands();
});

// 5. Các hàm xử lý sự kiện
const openDialog = (item = null) => {
  editedItem.value = item;
  showDialog.value = true;
};

const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  let result;
  
  // Gọi action tương ứng trong Store
  if (formData.id) {
    result = await taxonomyStore.updateBrand(formData.id, formData);
  } else {
    result = await taxonomyStore.createBrand(formData);
  }

  isSubmitting.value = false;
  
  if (result.success) {
    showDialog.value = false;
    // Có thể thêm thông báo Toast/Snackbar thành công tại đây
  } else {
    alert(result.message); // Xử lý lỗi đơn giản
  }
};

const deleteItem = async (item) => {
  if (confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${item.name}"?`)) {
    const result = await taxonomyStore.deleteBrand(item.id);
    if (!result.success) {
      alert(result.message);
    }
  }
};
</script>