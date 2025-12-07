<template>
  <v-card class="rounded-lg border-0 shadow-soft">
    <v-card-title class="d-flex align-center py-4 px-4 border-b">
      <div class="d-flex align-center flex-grow-1">
         <v-icon color="primary" class="me-2">mdi-package-variant-closed</v-icon>
         <span class="font-weight-bold text-h6">Sản phẩm</span>
      </div>
      
      <v-spacer></v-spacer>

      <div class="d-flex gap-2 align-center">
         <v-text-field
           v-model="search"
           density="compact"
           variant="outlined"
           placeholder="Tìm tên, mã SP..."
           prepend-inner-icon="mdi-magnify"
           hide-details
           style="width: 250px"
           bg-color="white"
           @update:modelValue="debouncedSearch"
         ></v-text-field>
         
         <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'AdminProductForm', params: { id: 'new' } }" class="shadow-soft">
           Thêm mới
         </v-btn>
      </div>
    </v-card-title>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="productStore.products"
      :items-length="productStore.totalItems"
      :loading="productStore.isLoading"
      :search="search"
      item-value="id"
      @update:options="loadItems"
      class="custom-admin-table"
    >
      <template v-slot:item.name="{ item }">
         <div class="d-flex align-center py-2">
            <v-avatar rounded="lg" size="48" class="border me-3 bg-grey-lighten-5">
               <v-img :src="item.thumbnailUrl || 'https://via.placeholder.com/48'" cover></v-img>
            </v-avatar>
            <div>
               <div class="font-weight-bold text-body-2 text-truncate" style="max-width: 250px" :title="item.name">
                  {{ item.name }}
               </div>
               <div class="text-caption text-grey">
                  {{ item.categoryName }} • {{ item.brandName }}
               </div>
            </div>
         </div>
      </template>

      <template v-slot:item.price="{ item }">
        <div class="font-weight-bold text-body-2">
          {{ formatCurrency(item.price) }}
        </div>
      </template>

      <template v-slot:item.active="{ item }">
         <v-chip color="green" size="x-small" label variant="tonal" class="font-weight-bold">Active</v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-end">
           <v-btn icon="mdi-pencil-outline" size="small" variant="text" color="blue" @click="editItem(item)" title="Sửa"></v-btn>
           <v-btn icon="mdi-trash-can-outline" size="small" variant="text" color="red" @click="deleteItem(item)" title="Xóa"></v-btn>
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useProductStore } from '../store/product.store';
import { useRouter } from 'vue-router';
import debounce from 'lodash.debounce';

const productStore = useProductStore();
const router = useRouter();

const itemsPerPage = ref(10);
const search = ref('');

// Cấu hình Header bảng
const headers = [
  { title: 'Sản phẩm', key: 'name', align: 'start', width: '40%' },
  { title: 'Giá bán', key: 'price', align: 'end' },
  { title: 'Trạng thái', key: 'active', align: 'center' },
  { title: '', key: 'actions', align: 'end', sortable: false },
];

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  const params = {
    page: page - 1, 
    size: itemsPerPage,
    q: search.value,
    // Thêm sort nếu cần: sort: sortBy[0] ? `${sortBy[0].key},${sortBy[0].order}` : 'createdAt,desc'
  };
  await productStore.fetchProducts(params);
};

const debouncedSearch = debounce(() => {
  // Reset về trang 1 khi search
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
}, 500);

const editItem = (item) => {
  router.push({ name: 'AdminProductForm', params: { id: item.id } });
};

const deleteItem = async (item) => {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm: "${item.name}"?`)) {
    await productStore.deleteProduct(item.id);
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>

<style scoped>
.gap-2 { gap: 8px; }
.shadow-soft { box-shadow: 0 2px 12px rgba(0,0,0,0.04) !important; }

/* Custom Table Styles */
.custom-admin-table :deep(th) {
    font-size: 13px !important;
    font-weight: 600 !important;
    text-transform: uppercase;
    color: #64748b !important;
    background-color: #f8fafc !important; /* Header background */
    height: 48px !important;
}
.custom-admin-table :deep(td) {
    height: 64px !important; /* Row height */
}
</style>